import { useMemo } from "react";
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

  // Мемоизация обработанных периодов
  const periods = useMemo(() => {
    let parsedPeriods =
      typeof regMap === "string" ? JSON.parse(regMap) : regMap || [];

    // Логичная сортировка для ночного режима
    if (lightsOnTimeSeconds > lightsOffTimeSeconds) {
      return [
        ...parsedPeriods.filter((p) => p.start >= lightsOnTimeSeconds),
        ...parsedPeriods.filter((p) => p.start < lightsOffTimeSeconds),
      ];
    }

    return parsedPeriods;
  }, [regMap, lightsOnTimeSeconds, lightsOffTimeSeconds]);

  // Convert seconds to percentage of day
  const secToPercent = (seconds) => (seconds / SECONDS_IN_DAY) * 100;

  // Format seconds to HH:MM
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
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
        {[0, 6, 12, 18, 24].map((hour) => (
          <Box
            key={hour}
            sx={{
              position: "absolute",
              left: `${(hour / 24) * 100}%`,
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
              {hour}:00
            </Typography>
          </Box>
        ))}
        {/* Light period highlight */}
        {(() => {
          const on = lightsOnTimeSeconds;
          const off = lightsOffTimeSeconds;
          if (on === off) return null; // no light period
          if (on < off) {
            // Обычный световой день
            return (
              <Box
                sx={{
                  position: "absolute",
                  left: `${secToPercent(on)}%`,
                  width: `${secToPercent(off - on)}%`,
                  top: 0,
                  bottom: 0,
                  background: "rgba(245, 222, 12, 0.45)",
                  zIndex: 0,
                  borderRadius: "4px 0 0 4px",
                  pointerEvents: "none",
                }}
                title={`Световой день: ${formatTime(on)} - ${formatTime(off)}`}
              />
            );
          } else {
            // Свет через полночь: две полосы
            return (
              <>
                <Box
                  sx={{
                    position: "absolute",
                    left: `${secToPercent(on)}%`,
                    width: `${secToPercent(SECONDS_IN_DAY - on)}%`,
                    top: 0,
                    bottom: 0,
                    background: "rgba(245, 222, 12, 0.45)",
                    zIndex: 0,
                    borderRadius: "4px 0 0 4px",
                    pointerEvents: "none",
                  }}
                  title={`Световой день: ${formatTime(on)} - 24:00`}
                />
                <Box
                  sx={{
                    position: "absolute",
                    left: `0%`,
                    width: `${secToPercent(off)}%`,
                    top: 0,
                    bottom: 0,
                    background: "rgba(245, 222, 12, 0.45)",
                    zIndex: 0,
                    borderRadius: "0 4px 4px 0",
                    pointerEvents: "none",
                  }}
                  title={`Световой день: 00:00 - ${formatTime(off)}`}
                />
              </>
            );
          }
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
              title={`${formatTime(period.start)} - ${formatTime(period.stop)}`}
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
                  ? `${formatTime(period.start)} - ${formatTime(period.stop)}`
                  : ""}
              </Typography>
            </Box>
          );
        })}
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        {periods.length > 0 && (
          <>
            <Typography
              variant="caption"
              sx={{ color: "#4fc3f7", fontWeight: "bold" }}
            >
              ⏱️ {totalIrrigationMinutes} мин {totalIrrigationSecondsRemainder}{" "}
              сек
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
                      {index + 1}.💧{formatTime(period.start)}-
                      {formatTime(period.stop)}({durationText})
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
