import { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";

/**
 * Irrigation timeline visualization component
 * Shows irrigation periods on a 24-hour timeline
 * @param {Object} props

 * @param {Array} props.regMap - Array of irrigation periods [{start: number, stop: number}]
 * @param {number} [props.lightsOnTimeSeconds] - Время включения света (сек)
 * @param {number} [props.lightsOffTimeSeconds] - Время выключения света (сек)
 * @param {Object} [props.strategyParams] - Параметры стратегии полива для расчета объема воды
 */
const IrrigationTimeline = ({
  regMap,
  lightsOnTimeSeconds = 8 * 3600,
  lightsOffTimeSeconds = 20 * 3600,
  strategyParams = null,
}) => {
  const SECONDS_IN_DAY = 86400;

  // Вычисляем смещение для центрирования светового периода
  const timelineOffset = useMemo(() => {
    // Длительность светового дня
    let lightDuration;
    if (lightsOnTimeSeconds < lightsOffTimeSeconds) {
      // Обычный режим
      lightDuration = lightsOffTimeSeconds - lightsOnTimeSeconds;
    } else {
      // Ночной режим (через полночь)
      lightDuration =
        SECONDS_IN_DAY - lightsOnTimeSeconds + lightsOffTimeSeconds;
    }

    // Середина светового дня (в секундах от полуночи)
    let lightMiddle;
    if (lightsOnTimeSeconds < lightsOffTimeSeconds) {
      lightMiddle = lightsOnTimeSeconds + lightDuration / 2;
    } else {
      lightMiddle = (lightsOnTimeSeconds + lightDuration / 2) % SECONDS_IN_DAY;
    }

    // Смещение: центр экрана (12:00) должен совпадать с серединой светового дня
    const centerOfTimeline = SECONDS_IN_DAY / 2; // 12:00
    return lightMiddle - centerOfTimeline;
  }, [lightsOnTimeSeconds, lightsOffTimeSeconds]);

  // Функция для применения смещения к времени
  const applyOffset = useCallback(
    (seconds) => {
      let shifted = seconds - timelineOffset;
      // Нормализация в диапазон 0-86400
      while (shifted < 0) shifted += SECONDS_IN_DAY;
      while (shifted >= SECONDS_IN_DAY) shifted -= SECONDS_IN_DAY;
      return shifted;
    },
    [timelineOffset],
  );

  // Мемоизация обработанных периодов с применением смещения
  const periods = useMemo(() => {
    let parsedPeriods =
      typeof regMap === "string" ? JSON.parse(regMap) : regMap || [];

    // Применяем смещение к каждому периоду
    return parsedPeriods
      .map((p) => ({
        start: applyOffset(p.start),
        stop: applyOffset(p.stop),
        originalStart: p.start,
        originalStop: p.stop,
      }))
      .sort((a, b) => a.start - b.start);
  }, [regMap, applyOffset]);

  // Convert seconds to percentage of day
  const secToPercent = (seconds) => (seconds / SECONDS_IN_DAY) * 100;

  // Format seconds to HH:MM
  const formatTime = (seconds) => {
    const normalized =
      ((seconds % SECONDS_IN_DAY) + SECONDS_IN_DAY) % SECONDS_IN_DAY;
    const hours = Math.floor(normalized / 3600);
    const minutes = Math.floor((normalized % 3600) / 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  // Мемоизация расчета общего времени полива
  const totalIrrigationSeconds = useMemo(() => {
    return periods.reduce((sum, period) => {
      let duration = period.stop - period.start;
      if (duration < 0) {
        duration = SECONDS_IN_DAY - period.start + period.stop;
      }
      return sum + duration;
    }, 0);
  }, [periods]);

  const totalIrrigationMinutes = Math.floor(totalIrrigationSeconds / 60);
  const totalIrrigationSecondsRemainder = totalIrrigationSeconds % 60;

  // Мемоизация расчета объема воды
  const totalWaterLiters = useMemo(() => {
    if (
      strategyParams &&
      strategyParams.dripperFlowRateLph &&
      strategyParams.emittersPerPot
    ) {
      const flowRatePerPotLph =
        strategyParams.dripperFlowRateLph * strategyParams.emittersPerPot;
      const totalIrrigationHours = totalIrrigationSeconds / 3600;
      return (flowRatePerPotLph * totalIrrigationHours).toFixed(2);
    }
    return null;
  }, [strategyParams, totalIrrigationSeconds]);

  // Вычисляем часовые метки с учетом смещения
  const hourMarkers = useMemo(() => {
    // Левый край таймлайна (позиция 0) соответствует времени,
    // которое после применения applyOffset даст 0
    // applyOffset(realTime) = 0 => realTime = timelineOffset
    let timeAtLeftEdge = timelineOffset;
    // Нормализуем в диапазон 0-86400
    while (timeAtLeftEdge < 0) timeAtLeftEdge += SECONDS_IN_DAY;
    while (timeAtLeftEdge >= SECONDS_IN_DAY) timeAtLeftEdge -= SECONDS_IN_DAY;

    return [0, 6, 12, 18, 24].map((relativeHour) => {
      // Время в секундах на этой позиции таймлайна
      const timeInSeconds = timeAtLeftEdge + relativeHour * 3600;
      // Нормализуем до 0-86400 и конвертируем в часы
      const normalizedSeconds = timeInSeconds % SECONDS_IN_DAY;
      const hours = Math.floor(normalizedSeconds / 3600);

      return {
        position: relativeHour,
        label: hours,
      };
    });
  }, [timelineOffset]);

  return (
    <Box sx={{ width: "100%", my: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          mt: 1,
          p: 1,
        }}
      >
        <Typography variant="caption" display="block">
          Карта полива (24 часа)
        </Typography>
      </Box>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "60px",
          backgroundColor: "#464957",
          borderRadius: "4px",
          border: "1px solid #3a3f4f",
        }}
      >
        {/* Hour markers */}
        {hourMarkers.map((marker) => (
          <Box
            key={marker.position}
            sx={{
              position: "absolute",
              left: `${(marker.position / 24) * 100}%`,
              top: 0,
              bottom: 0,
              width: "1px",
              backgroundColor: "#555",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: "-18px",
                left: "-8px",
                fontSize: "10px",
                color: "#e6e3e3",
              }}
            >
              {marker.label}:00
            </Typography>
          </Box>
        ))}
        {/* Light period highlight */}
        {(() => {
          const on = applyOffset(lightsOnTimeSeconds);

          if (lightsOnTimeSeconds === lightsOffTimeSeconds) return null;

          // Вычисляем длительность светового дня
          let lightDuration;
          if (lightsOnTimeSeconds < lightsOffTimeSeconds) {
            lightDuration = lightsOffTimeSeconds - lightsOnTimeSeconds;
          } else {
            lightDuration =
              SECONDS_IN_DAY - lightsOnTimeSeconds + lightsOffTimeSeconds;
          }

          // Рисуем одну непрерывную полосу
          const lightWidth = secToPercent(lightDuration);
          const lightLeft = secToPercent(on);

          return (
            <Box
              sx={{
                position: "absolute",
                left: `${lightLeft}%`,
                width: `${lightWidth}%`,
                top: 0,
                bottom: 0,
                background: "rgba(245, 222, 12, 0.45)",
                zIndex: 0,
                borderRadius: "4px",
                pointerEvents: "none",
              }}
              title={`Световой день: ${formatTime(lightsOnTimeSeconds)} - ${formatTime(lightsOffTimeSeconds)}`}
            />
          );
        })()}
        {/* Irrigation periods */}
        {periods.map((period, index) => {
          const leftPercent = secToPercent(period.start);
          const widthPercent = secToPercent(period.stop - period.start);

          return (
            <Box
              key={index}
              sx={{
                position: "absolute",
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
                top: "6px",
                bottom: "6px",
                backgroundColor: "#6fcdf9",
                borderRadius: "2px",
                border: "1px solid #059def",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
              title={`${formatTime(period.originalStart)} - ${formatTime(period.originalStop)}`}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: "9px",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                {widthPercent > 5
                  ? `${formatTime(period.originalStart)} - ${formatTime(period.originalStop)}`
                  : ""}
              </Typography>
            </Box>
          );
        })}
      </Box>
      <Box sx={{ display: "flex", gap: 2, m: 1, alignItems: "center" }}>
        {periods.length > 0 && (
          <>
            <Typography
              variant="caption"
              sx={{ color: "#4fc3f7", fontWeight: "bold" }}
            >
              Total:⏱️ {totalIrrigationMinutes} мин{" "}
              {totalIrrigationSecondsRemainder} сек
            </Typography>
            {totalWaterLiters && (
              <Typography
                variant="caption"
                sx={{ color: "#4fc3f7", fontWeight: "bold" }}
              >
                💧 {totalWaterLiters} л
              </Typography>
            )}
          </>
        )}
      </Box>
      {/* Period list: 2 columns */}
      {periods.length > 0 && (
        <Accordion defaultExpanded={false}>
          <AccordionSummary
            aria-controls="irrigation-periods-content"
            id="irrigation-periods-header"
          >
            <Typography variant="caption" display="block">
              Показать периоды полива
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Box
                sx={{
                  columnCount: { xs: 1, sm: 2, md: 2 },
                  columnGap: 2,
                  maxWidth: "100%",
                  width: "100%",
                }}
              >
                {periods.map((period, index) => {
                  let durationSec = period.stop - period.start;
                  if (durationSec < 0) {
                    durationSec = SECONDS_IN_DAY - period.start + period.stop;
                  }
                  const minutes = Math.floor(durationSec / 60);
                  const seconds = durationSec % 60;

                  // Форматирование длительности
                  let durationText;
                  if (minutes === 0) {
                    durationText = `${seconds} сек`;
                  } else if (seconds === 0) {
                    durationText = `${minutes} мин`;
                  } else {
                    durationText = `${minutes} мин ${seconds} сек`;
                  }

                  return (
                    <Typography
                      key={index}
                      variant="caption"
                      display="block"
                      sx={{
                        fontSize: "11px",
                        color: "#7abede",
                        breakInside: "avoid",
                      }}
                    >
                      {index + 1}.💧{formatTime(period.originalStart)}-
                      {formatTime(period.originalStop)}({durationText})
                    </Typography>
                  );
                })}
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

IrrigationTimeline.propTypes = {
  regMap: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  lightsOnTimeSeconds: PropTypes.number,
  lightsOffTimeSeconds: PropTypes.number,
  strategyParams: PropTypes.object,
};

export default IrrigationTimeline;
