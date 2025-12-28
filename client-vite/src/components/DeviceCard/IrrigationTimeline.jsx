import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

/**
 * Irrigation timeline visualization component
 * Shows irrigation periods on a 24-hour timeline
 * @param {Object} props
 * @param {Array} props.regMap - Array of irrigation periods [{start: number, stop: number}]
 */
const IrrigationTimeline = ({ regMap }) => {
  const SECONDS_IN_DAY = 86400;
  
  // Parse reg_map if it's a string
  const periods = typeof regMap === "string" ? JSON.parse(regMap) : regMap || [];

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
      <Typography variant="caption" display="block" sx={{ mb: 1 }}>
        Карта полива (24 часа)
      </Typography>
      
      {/* Timeline container */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "40px",
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
                top: "4px",
                bottom: "4px",
                backgroundColor: "#76ff03",
                borderRadius: "2px",
                border: "1px solid #64dd17",
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

      {/* Period list */}
      {periods.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" display="block">
            Периоды полива:
          </Typography>
          {periods.map((period, index) => (
            <Typography
              key={index}
              variant="caption"
              display="block"
              sx={{ fontSize: "10px", color: "#666" }}
            >
              {index + 1}. {formatTime(period.start)} - {formatTime(period.stop)} (
              {Math.floor((period.stop - period.start) / 60)} мин)
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

IrrigationTimeline.propTypes = {
  regMap: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

export default IrrigationTimeline;
