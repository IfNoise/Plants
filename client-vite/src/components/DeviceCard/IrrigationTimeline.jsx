import PropTypes from "prop-types";
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";

/**
 * Irrigation timeline visualization component
 * Shows irrigation periods on a 24-hour timeline
 * @param {Object} props

 * @param {Array} props.regMap - Array of irrigation periods [{start: number, stop: number}]
 * @param {number} [props.lightsOnTimeSeconds] - Время включения света (сек)
 * @param {number} [props.lightsOffTimeSeconds] - Время выключения света (сек)
 */
const IrrigationTimeline = ({ regMap, lightsOnTimeSeconds = 8 * 3600, lightsOffTimeSeconds = 20 * 3600 }) => {
  const SECONDS_IN_DAY = 86400;
  // Parse reg_map if it's a string
  let periods = typeof regMap === "string" ? JSON.parse(regMap) : regMap || [];

  // Логичная сортировка для ночного режима
  if (lightsOnTimeSeconds > lightsOffTimeSeconds) {
    periods = [
      ...periods.filter(p => p.start >= lightsOnTimeSeconds),
      ...periods.filter(p => p.start < lightsOffTimeSeconds)
    ];
  }

  // Convert seconds to percentage of day
  const secToPercent = (seconds) => (seconds / SECONDS_IN_DAY) * 100;

  // Format seconds to HH:MM
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  };

  return (
    <Box sx={{ width: "100%", my: 2 }}>
      <Typography variant="caption" display="block" sx={{ mb: "15px" }}>
        Карта полива (24 часа)
      </Typography>
      
      {/* Timeline container */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "60px",
          backgroundColor: "#eeeeee",
          borderRadius: "4px",
          border: "1px solid #ccc",
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
              backgroundColor: "#999",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: "-18px",
                left: "-8px",
                fontSize: "10px",
                
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
                  background: "rgba(255, 241, 118, 0.35)",
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
                    background: "rgba(255, 241, 118, 0.35)",
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
                    background: "rgba(255, 241, 118, 0.35)",
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
                backgroundColor: "#55a117ff",
                borderRadius: "2px",
                border: "1px solid #376819ff",
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
                {widthPercent > 5 ? `${formatTime(period.start)} - ${formatTime(period.stop)}` : ""}
              </Typography>
            </Box>

          );

        })}

      </Box>


      {/* Period list: 2 columns */}
      {periods.length > 0 && (
        <Accordion defaultExpanded={false} sx={{ mt: 1 }} >
          <AccordionSummary aria-controls="irrigation-periods-content" id="irrigation-periods-header">
            <Typography variant="caption" display="block">
              Показать периоды полива
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2 }}>
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" display="block">
            Периоды полива:
          </Typography>
          <Box sx={{
            columnCount: { xs: 1, sm: 2, md: 3 },
            columnGap: 3,
            maxWidth: "100%",
            width: "100%",
          }}>
            {periods.map((period, index) => {
              let durationSec = period.stop - period.start;
              if (durationSec < 0) {
                durationSec = (SECONDS_IN_DAY - period.start) + period.stop;
              }
              return (
                <Typography
                  key={index}
                  variant="caption"
                  display="block"
                  sx={{ fontSize: "12px", color: "#c6c2c2ff", breakInside: "avoid" }}
                >
                  {index + 1}.💧 {formatTime(period.start)} - {formatTime(period.stop)} (
                  {Math.floor(durationSec / 60)} мин)
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
}


IrrigationTimeline.propTypes = {
  regMap: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  lightsOnTimeSeconds: PropTypes.number,
  lightsOffTimeSeconds: PropTypes.number,
};

export default IrrigationTimeline;
