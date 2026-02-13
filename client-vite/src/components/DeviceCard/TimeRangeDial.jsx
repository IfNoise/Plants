import PropTypes from "prop-types";
import { Box } from "@mui/material";

/*
  TimeRangeDial
  - startSeconds, stopSeconds: seconds from 00:00 (0 - 86399)
  - renders a circular 24-hour dial with start/stop arcs and hour ticks
  - shows start/stop labels and total duration
*/

function normalizeSeconds(sec) {
  // keep value inside 0..86400
  const v = Number(sec) || 0;
  return ((v % 86400) + 86400) % 86400;
}

export default function TimeRangeDial({
  startSeconds,
  stopSeconds,
  size = 84,
  stroke = 8,
  color = "#d4c42f",
}) {
  const start = normalizeSeconds(startSeconds);
  const stop = normalizeSeconds(stopSeconds);

  // duration in seconds (clockwise from start to stop)
  const deltaSeconds = stop >= start ? stop - start : 86400 - (start - stop);
  const dayHours = +(deltaSeconds / 3600).toFixed(2);
  const nightHours = +(24 - dayHours).toFixed(2);

  // SVG geometry
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - stroke) / 2;

  const angleFromSeconds = (s) => (s / 86400) * 360 - 90; // 0 at top
  const startAngle = angleFromSeconds(start);
  const stopAngle = angleFromSeconds(stop);

  const polarToCartesian = (centerX, centerY, radius, angleDeg) => {
    const a = (angleDeg * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(a),
      y: centerY + radius * Math.sin(a),
    };
  };

  const startPt = polarToCartesian(cx, cy, r, startAngle);
  const endPt = polarToCartesian(cx, cy, r, stopAngle);
  const largeArcFlag = deltaSeconds > 43200 ? 1 : 0; // >12h
  const sweepFlag = 1; // clockwise

  // simple sector path (move to center -> start -> arc -> center)
  const sectorPath = `M ${cx} ${cy} L ${startPt.x.toFixed(2)} ${startPt.y.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${endPt.x.toFixed(2)} ${endPt.y.toFixed(2)} Z`;

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      flexDirection="column"
      sx={{ userSelect: "none" }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* background circle (night) */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="#0f172420"
          stroke="#fcc72a"
          strokeWidth={1}
        />

        {/* active sector (day) */}
        <path d={sectorPath} fill={color} fillOpacity={0.95} stroke="none" />

        {/* thin ring outline */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#e5b739"
          strokeWidth={1}
        />

        {/* center text: hours */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fontSize={size * 0.18}
          fontWeight={700}
          fill="#0f1724"
        >
          {Math.round(dayHours)}h
        </text>

        {/* ratio line */}
        <text
          x={cx}
          y={cy + 16}
          textAnchor="middle"
          fontSize={size * 0.08}
          fill="#ffffff"
        >
          Day {dayHours.toFixed(0)}h · Night {nightHours.toFixed(0)}h
        </text>
      </svg>
    </Box>
  );
}

TimeRangeDial.propTypes = {
  startSeconds: PropTypes.number.isRequired,
  stopSeconds: PropTypes.number.isRequired,
  size: PropTypes.number,
  stroke: PropTypes.number,
  color: PropTypes.string,
};
