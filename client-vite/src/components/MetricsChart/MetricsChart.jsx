import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  Grid,
  IconButton,
  Collapse,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import RefreshIcon from "@mui/icons-material/Refresh";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import SettingsIcon from "@mui/icons-material/Settings";

const TIME_RANGES = {
  "5m": { label: "5 минут", minutes: 5 },
  "15m": { label: "15 минут", minutes: 15 },
  "30m": { label: "30 минут", minutes: 30 },
  "1h": { label: "1 час", minutes: 60 },
  "3h": { label: "3 часа", minutes: 180 },
  "6h": { label: "6 часов", minutes: 360 },
  "12h": { label: "12 часов", minutes: 720 },
  "24h": { label: "24 часа", minutes: 1440 },
  "7d": { label: "7 дней", minutes: 10080 },
  "30d": { label: "30 дней", minutes: 43200 },
  custom: { label: "Произвольный", minutes: null },
};

const REFRESH_INTERVALS = {
  off: { label: "Выключено", ms: null },
  "5s": { label: "5 секунд", ms: 5000 },
  "10s": { label: "10 секунд", ms: 10000 },
  "30s": { label: "30 секунд", ms: 30000 },
  "1m": { label: "1 минута", ms: 60000 },
  "5m": { label: "5 минут", ms: 300000 },
};

export default function MetricsChart({
  title = "Метрики",
  query = "",
  victoriaMetricsUrl = "/api/v1/query_range",
  defaultTimeRange = "12h",
  height = 100,
  autoRefresh = false,
  refreshInterval = "2m",
  showControls = true,
  yAxisLabel = "",
  xAxisLabel = "Время",
  discrete = false, // Для дискретных значений (0/1)
}) {
  const [metricsQuery, setMetricsQuery] = useState(query);
  const [timeRange, setTimeRange] = useState(defaultTimeRange);
  const [startTime, setStartTime] = useState(
    dayjs().subtract(TIME_RANGES[defaultTimeRange].minutes, "minute"),
  );
  const [endTime, setEndTime] = useState(dayjs());
  const [data, setData] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoScale, setAutoScale] = useState(!discrete); // Для дискретных - фиксированный масштаб
  const [yMin, setYMin] = useState(discrete ? "-0.1" : "");
  const [yMax, setYMax] = useState(discrete ? "1.1" : "");
  const [refreshMode, setRefreshMode] = useState(
    autoRefresh ? refreshInterval : "off",
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Функция для получения данных из Victoria Metrics
  const fetchMetrics = useCallback(async () => {
    if (!metricsQuery.trim()) {
      setError("Введите запрос для получения метрик");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const start =
        timeRange === "custom"
          ? startTime
          : dayjs().subtract(TIME_RANGES[timeRange].minutes, "minute");
      const end = timeRange === "custom" ? endTime : dayjs();

      // Формируем URL с правильным кодированием query
      const params = new URLSearchParams();
      params.append("query", metricsQuery);
      params.append("start", start.unix());
      params.append("end", end.unix());
      params.append("step", calculateStep(start, end));

      const url = `${victoriaMetricsUrl}?${params.toString()}`;
      console.log("[MetricsChart] Fetching:", url);
      console.log("[MetricsChart] Query:", metricsQuery);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          "API не найден. Проверьте URL Victoria Metrics или настройте прокси на backend",
        );
      }

      const result = await response.json();

      if (result.status !== "success") {
        throw new Error(result.error || "Ошибка получения данных");
      }

      processMetricsData(result.data);
    } catch (err) {
      console.error("Ошибка получения метрик:", err);
      setError(err.message || "Не удалось получить данные");
      setData([]);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  }, [metricsQuery, timeRange, startTime, endTime, victoriaMetricsUrl]);

  // Вычисление оптимального шага для запроса
  // Для импульсных данных (полив) используем фиксированный step 30s для всех диапазонов
  const calculateStep = () => {
    return "30s";
  };

  // Форматирование имени серии данных
  const formatSeriesLabel = (metric) => {
    if (!metric || Object.keys(metric).length === 0) {
      return "value";
    }

    const { __name__, ...labels } = metric;

    if (Object.keys(labels).length === 0) {
      return __name__ || "value";
    }

    const labelStr = Object.entries(labels)
      .map(([key, value]) => `${key}="${value}"`)
      .join(", ");

    return __name__ ? `${__name__}{${labelStr}}` : labelStr;
  };

  // Обработка полученных данных
  const processMetricsData = (data) => {
    if (!data.result || data.result.length === 0) {
      setError("Нет данных для отображения");
      setData([]);
      setSeries([]);
      return;
    }

    try {
      const resultType = data.resultType;

      if (resultType === "matrix") {
        // Обработка данных временных рядов
        const timestamps = new Set();

        data.result.forEach((result) => {
          result.values.forEach(([timestamp]) => {
            timestamps.add(timestamp * 1000); // Конвертируем в миллисекунды
          });
        });

        const sortedTimestamps = Array.from(timestamps).sort((a, b) => a - b);

        const seriesData = data.result.map((result, index) => {
          const label = formatSeriesLabel(result.metric);
          const valuesMap = new Map(
            result.values.map(([ts, val]) => [ts * 1000, parseFloat(val)]),
          );

          return {
            id: `series-${index}`,
            label,
            data: sortedTimestamps.map((ts) => valuesMap.get(ts) ?? null),
            showMark: false,
            curve: discrete ? "stepAfter" : "linear", // Ступенчатый график для дискретных значений
          };
        });

        setSeries(seriesData);
        setData(sortedTimestamps);
      }
    } catch (err) {
      console.error("[MetricsChart] Error processing data:", err);
      setError("Ошибка обработки данных");
    }
  };

  // Изменение временного диапазона
  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
    if (newRange !== "custom") {
      setStartTime(dayjs().subtract(TIME_RANGES[newRange].minutes, "minute"));
      setEndTime(dayjs());
    }
  };

  // Автообновление
  useEffect(() => {
    if (refreshMode === "off" || !isRefreshing) {
      return;
    }

    const interval = setInterval(() => {
      fetchMetrics();
    }, REFRESH_INTERVALS[refreshMode].ms);

    return () => clearInterval(interval);
  }, [refreshMode, isRefreshing, fetchMetrics]);

  // Начальная загрузка
  useEffect(() => {
    if (query) {
      fetchMetrics();
    }
  }, []);

  const toggleRefresh = () => {
    setIsRefreshing(!isRefreshing);
    if (!isRefreshing) {
      fetchMetrics();
    }
  };

  // Форматирование оси X в зависимости от диапазона
  const getXAxisFormatter = () => {
    const rangeMinutes = TIME_RANGES[timeRange]?.minutes;
    if (!rangeMinutes) {
      // Для custom диапазона смотрим на разницу
      const diffMinutes = endTime.diff(startTime, "minute");
      if (diffMinutes > 1440)
        return (timestamp) => dayjs(timestamp).format("DD.MM HH:mm");
      if (diffMinutes > 180)
        return (timestamp) => dayjs(timestamp).format("HH:mm");
      return (timestamp) => dayjs(timestamp).format("HH:mm:ss");
    }

    // Для больших диапазонов показываем дату
    if (rangeMinutes >= 1440)
      return (timestamp) => dayjs(timestamp).format("DD.MM HH:mm");
    // Для средних - время
    if (rangeMinutes >= 180)
      return (timestamp) => dayjs(timestamp).format("HH:mm");
    // Для малых - время с секундами
    return (timestamp) => dayjs(timestamp).format("HH:mm:ss");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <Paper sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h6">{title}</Typography>
          {showControls && (
            <IconButton
              onClick={() => setShowSettings(!showSettings)}
              color={showSettings ? "primary" : "default"}
              size="small"
            >
              <SettingsIcon />
            </IconButton>
          )}
        </Box>

        {showControls && (
          <Collapse in={showSettings}>
            <Stack spacing={2} sx={{ mb: 3 }}>
              {/* Запрос */}
              <TextField
                fullWidth
                label="Victoria Metrics Query"
                value={metricsQuery}
                onChange={(e) => setMetricsQuery(e.target.value)}
                placeholder='Например: timer_duration_seconds{job="myapp"}'
                variant="outlined"
                size="small"
                multiline
                rows={2}
              />

              <Grid container spacing={2} alignItems="center">
                {/* Временной диапазон */}
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Период</InputLabel>
                    <Select
                      value={timeRange}
                      label="Период"
                      onChange={(e) => handleTimeRangeChange(e.target.value)}
                    >
                      {Object.entries(TIME_RANGES).map(([key, { label }]) => (
                        <MenuItem key={key} value={key}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Произвольный диапазон */}
                {timeRange === "custom" && (
                  <>
                    <Grid item xs={12} sm={6} md={3}>
                      <DateTimePicker
                        label="Начало"
                        value={startTime}
                        onChange={setStartTime}
                        slotProps={{
                          textField: { size: "small", fullWidth: true },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <DateTimePicker
                        label="Конец"
                        value={endTime}
                        onChange={setEndTime}
                        slotProps={{
                          textField: { size: "small", fullWidth: true },
                        }}
                      />
                    </Grid>
                  </>
                )}

                {/* Автообновление */}
                <Grid item xs={12} sm={6} md={timeRange === "custom" ? 3 : 3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Обновление</InputLabel>
                    <Select
                      value={refreshMode}
                      label="Обновление"
                      onChange={(e) => setRefreshMode(e.target.value)}
                    >
                      {Object.entries(REFRESH_INTERVALS).map(
                        ([key, { label }]) => (
                          <MenuItem key={key} value={key}>
                            {label}
                          </MenuItem>
                        ),
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Кнопки управления */}
                <Grid item xs={12} sm={6} md={timeRange === "custom" ? 12 : 6}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={<RefreshIcon />}
                      onClick={fetchMetrics}
                      disabled={loading}
                      size="small"
                    >
                      Обновить
                    </Button>
                    {refreshMode !== "off" && (
                      <Button
                        variant={isRefreshing ? "outlined" : "contained"}
                        startIcon={
                          isRefreshing ? <StopIcon /> : <PlayArrowIcon />
                        }
                        onClick={toggleRefresh}
                        color={isRefreshing ? "error" : "success"}
                        size="small"
                      >
                        {isRefreshing ? "Остановить" : "Запустить"}
                      </Button>
                    )}
                  </Stack>
                </Grid>
              </Grid>

              {/* Настройки масштаба */}
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoScale}
                      onChange={(e) => setAutoScale(e.target.checked)}
                    />
                  }
                  label="Автоматический масштаб"
                />
                {!autoScale && (
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <TextField
                      label="Мин. Y"
                      type="number"
                      value={yMin}
                      onChange={(e) => setYMin(e.target.value)}
                      size="small"
                      sx={{ width: 120 }}
                    />
                    <TextField
                      label="Макс. Y"
                      type="number"
                      value={yMax}
                      onChange={(e) => setYMax(e.target.value)}
                      size="small"
                      sx={{ width: 120 }}
                    />
                  </Stack>
                )}
              </Box>
            </Stack>
          </Collapse>
        )}

        {/* Ошибки */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* График */}
        <Box sx={{ position: "relative", height }}>
          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {!loading && series.length > 0 && (
            <LineChart
              xAxis={[
                {
                  data: data,
                  scaleType: "time",
                  valueFormatter: getXAxisFormatter(),
                  label: xAxisLabel,
                  tickFontSize: 8,
                },
              ]}
              yAxis={[
                {
                  label: yAxisLabel,
                  ...(autoScale
                    ? {}
                    : {
                        min: yMin ? parseFloat(yMin) : undefined,
                        max: yMax ? parseFloat(yMax) : undefined,
                      }),
                  ...(discrete
                    ? {
                        min: 0,
                        max: 1,
                        tickMinStep: 1, // Шаг между метками минимум 1
                        tickMaxStep: 1, // Только метки 0 и 1
                      }
                    : {}),
                },
              ]}
              series={series}
              height={height}
              margin={{ top: 10, right: 10, bottom: 30, left: 50 }}
              slotProps={{
                legend: { hidden: true },
              }}
            />
          )}

          {!loading && series.length === 0 && !error && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Нет данных для отображения
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}
MetricsChart.propTypes = {
  title: PropTypes.string,
  query: PropTypes.string.isRequired,
  victoriaMetricsUrl: PropTypes.string,
  defaultTimeRange: PropTypes.string,
  height: PropTypes.number,
  autoRefresh: PropTypes.bool,
  refreshInterval: PropTypes.string,
  showControls: PropTypes.bool,
  yAxisLabel: PropTypes.string,
  xAxisLabel: PropTypes.string,
  discrete: PropTypes.bool, // Для дискретных значений (0/1)
};
