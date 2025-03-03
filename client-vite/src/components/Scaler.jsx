import { Box, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export const Scaler = ({ min = 0.5, max = 1.5, step = 0.1, children }) => {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    setScale(1);
  }, []);
  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: "4px",
        p: "5px",
        m: "5px",
        width: "fit-content",
        height: "fit-content",
      }}
    >
      <Box sx={{}}>
        <Slider
          value={scale}
          onChange={(_, value) => setScale(value)}
          step={step}
          min={min}
          max={max}
        />
      </Box>
      <Box
        sx={{
          transformOrigin: "top left", // Устанавливаем точку масштабирования в левый верхний угол
          transform: `scale(${scale})`,
          m: "0",
          p: "0",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
Scaler.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  children: PropTypes.node,
};
