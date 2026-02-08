import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CalculateIcon from "@mui/icons-material/Calculate";
import EditIcon from "@mui/icons-material/Edit";
import IrrigationTimeline from "./IrrigationTimeline";
import {
  calculateIrrigationSchedule,
  defaultIrrigationParams,
} from "./irrigationCalculator";

/**
 * Irrigation map editor dialog
 * @param {Object} props
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onSave - Save handler
 * @param {Array} props.initialMap - Initial irrigation map
 * @param {Object} props.initialStrategyParams - Initial strategy parameters
 * @param {string} props.deviceId - Device ID
 * @param {string} props.irrigatorName - Irrigator name
 */
const IrrigationMapDialog = ({
  open,
  onClose,
  onSave,
  initialMap = [],
  initialStrategyParams = null,
  deviceId,
  irrigatorName,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [periods, setPeriods] = useState(initialMap);
  const [params, setParams] = useState(
    initialStrategyParams || defaultIrrigationParams,
  );

  // Update state when dialog opens or props change
  useEffect(() => {
    if (open) {
      console.log("IrrigationMapDialog - Dialog opened, updating state");
      console.log("IrrigationMapDialog - initialMap:", initialMap);
      console.log(
        "IrrigationMapDialog - initialStrategyParams:",
        initialStrategyParams,
      );
      setPeriods(initialMap || []);
      setParams(initialStrategyParams || defaultIrrigationParams);
      setTabValue(0); // Reset to first tab
    }
  }, [open, initialMap, initialStrategyParams]);

  console.log("IrrigationMapDialog - current state:", { periods, params });

  const handleParamChange = (field, value) => {
    setParams((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const handleCalculate = () => {
    try {
      const calculatedPeriods = calculateIrrigationSchedule(params);
      setPeriods(calculatedPeriods);
    } catch (error) {
      console.error("Ошибка расчёта расписания:", error);
      alert("Ошибка при расчёте расписания полива");
    }
  };

  const handleSave = () => {
    onSave({
      start: params.lightsOnTimeSeconds,
      stop: params.lightsOffTimeSeconds,
      periods,
      strategyParams: params,
    });
    onClose();
  };

  const handleClose = () => {
    setPeriods(initialMap);
    setParams(defaultIrrigationParams);
    setTabValue(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Генератор карты полива - {irrigatorName}
        <Typography variant="caption" display="block">
          Устройство: {deviceId}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab icon={<CalculateIcon />} label="Расчёт" />
          <Tab icon={<EditIcon />} label="Ручной ввод" />
        </Tabs>

        {/* Timeline visualization */}
        <IrrigationTimeline
          regMap={periods}
          lightsOnTimeSeconds={params.lightsOnTimeSeconds}
          lightsOffTimeSeconds={params.lightsOffTimeSeconds}
          strategyParams={params}
        />

        {tabValue === 0 && (
          <Box sx={{ mt: 2 }}>
            {/* Время */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  ⏰ Световой режим
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Включение света (часы)"
                      type="number"
                      value={params.lightsOnTimeSeconds / 3600}
                      onChange={(e) =>
                        handleParamChange(
                          "lightsOnTimeSeconds",
                          e.target.value * 3600,
                        )
                      }
                      inputProps={{ step: 0.5, min: 0, max: 24 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Выключение света (часы)"
                      type="number"
                      value={params.lightsOffTimeSeconds / 3600}
                      onChange={(e) =>
                        handleParamChange(
                          "lightsOffTimeSeconds",
                          e.target.value * 3600,
                        )
                      }
                      inputProps={{ step: 0.5, min: 0, max: 24 }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Горшок и оборудование */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  🪴 Горшок и оборудование
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Ёмкость субстрата (л)"
                      type="number"
                      value={params.substrateWaterCapacityLiters}
                      onChange={(e) =>
                        handleParamChange(
                          "substrateWaterCapacityLiters",
                          e.target.value,
                        )
                      }
                      inputProps={{ step: 0.1, min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Расход капельницы (л/ч)"
                      type="number"
                      value={params.dripperFlowRateLph}
                      onChange={(e) =>
                        handleParamChange("dripperFlowRateLph", e.target.value)
                      }
                      inputProps={{ step: 0.1, min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Капельниц на горшок"
                      type="number"
                      value={params.emittersPerPot}
                      onChange={(e) =>
                        handleParamChange("emittersPerPot", e.target.value)
                      }
                      inputProps={{ step: 1, min: 1 }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Потери воды */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  💧 Потери воды
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Потери воды (л/ч)"
                      type="number"
                      value={params.waterLossRateLitersPerHour}
                      onChange={(e) =>
                        handleParamChange(
                          "waterLossRateLitersPerHour",
                          e.target.value,
                        )
                      }
                      inputProps={{ step: 0.01, min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Коэффициент испарения"
                      type="number"
                      value={params.evaporationCoefficient}
                      onChange={(e) =>
                        handleParamChange(
                          "evaporationCoefficient",
                          e.target.value,
                        )
                      }
                      inputProps={{ step: 0.1, min: 0 }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Стратегия */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  📊 Стратегия полива (%)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Начальная просушка (%)"
                      type="number"
                      value={params.initialDrybackPercent}
                      onChange={(e) =>
                        handleParamChange(
                          "initialDrybackPercent",
                          e.target.value,
                        )
                      }
                      inputProps={{ step: 1, min: 0, max: 100 }}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Целевой пик (%)"
                      type="number"
                      value={params.targetPeakPercent}
                      onChange={(e) =>
                        handleParamChange("targetPeakPercent", e.target.value)
                      }
                      inputProps={{ step: 1, min: 0, max: 100 }}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Мин. поддержание (%)"
                      type="number"
                      value={params.maintenanceMinPercent}
                      onChange={(e) =>
                        handleParamChange(
                          "maintenanceMinPercent",
                          e.target.value,
                        )
                      }
                      inputProps={{ step: 1, min: 0, max: 100 }}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Макс. поддержание (%)"
                      type="number"
                      value={params.maintenanceMaxPercent}
                      onChange={(e) =>
                        handleParamChange(
                          "maintenanceMaxPercent",
                          e.target.value,
                        )
                      }
                      inputProps={{ step: 1, min: 0, max: 100 }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Фаза P1 */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  🌱 Фаза P1 - Насыщение (маленькие шоты)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Задержка старта (мин)"
                      type="number"
                      value={params.p1StartDelayMinutes}
                      onChange={(e) =>
                        handleParamChange("p1StartDelayMinutes", e.target.value)
                      }
                      inputProps={{ step: 5, min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Объём шота (%)"
                      type="number"
                      value={params.p1ShotVolumePercent}
                      onChange={(e) =>
                        handleParamChange("p1ShotVolumePercent", e.target.value)
                      }
                      inputProps={{ step: 0.5, min: 0, max: 100 }}
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Интервал (мин)"
                      type="number"
                      value={params.p1ShotIntervalMinutes}
                      onChange={(e) =>
                        handleParamChange(
                          "p1ShotIntervalMinutes",
                          e.target.value,
                        )
                      }
                      inputProps={{ step: 5, min: 1 }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Фаза P2 */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  ☀️ Фаза P2 - Дневная (длинные поливы)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Интервалы рассчитываются автоматически на основе влагоёмкости
                  горшка и потерь воды
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Целевой дренаж (%)"
                      type="number"
                      value={params.p2TargetDrainagePercent}
                      onChange={(e) =>
                        handleParamChange(
                          "p2TargetDrainagePercent",
                          e.target.value,
                        )
                      }
                      inputProps={{ step: 1, min: 0, max: 50 }}
                      helperText="Процент воды, вытекающей из горшка при каждом поливе"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Фаза P3 — Конечный dryback */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  🌑 Фаза P3 — Конечный dryback
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Сухой период перед выкл. света (мин)"
                      type="number"
                      value={params.p3DrybackMinutes}
                      onChange={(e) =>
                        handleParamChange("p3DrybackMinutes", e.target.value)
                      }
                      inputProps={{ step: 5, min: 0, max: 240 }}
                      helperText="Время до выключения света, когда поливы запрещены (dryback)"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<CalculateIcon />}
                onClick={handleCalculate}
                color="primary"
              >
                Рассчитать расписание
              </Button>
            </Box>
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ручной режим пока недоступен. Используйте расчёт для генерации
              расписания.
            </Typography>
          </Box>
        )}

        {/* Результат */}
        {periods.length > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              📋 Результат: {periods.length} событий полива
            </Typography>
            <Typography variant="caption" display="block">
              Общее время полива:{" "}
              {Math.floor(
                periods.reduce((sum, p) => sum + (p.stop - p.start), 0) / 60,
              )}{" "}
              минут
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={periods.length === 0}
        >
          Сохранить на устройство
        </Button>
      </DialogActions>
    </Dialog>
  );
};

IrrigationMapDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialMap: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.number.isRequired,
      stop: PropTypes.number.isRequired,
    }),
  ),
  initialStrategyParams: PropTypes.object,
  deviceId: PropTypes.string.isRequired,
  irrigatorName: PropTypes.string.isRequired,
};

export default IrrigationMapDialog;
