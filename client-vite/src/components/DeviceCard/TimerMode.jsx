import { Box, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import PropTypes from "prop-types";

const radioProps = {
  size: "small",
};

/**
 * Timer mode selector component
 * @param {Object} props
 * @param {number} props.mode - Current mode (0=Off, 1=Manual, 2=Auto, 3=Map)
 * @param {Function} props.onChange - Mode change handler
 * @param {boolean} props.showMapMode - Show Map mode option
 */
const TimerMode = ({ mode, onChange, showMapMode = false }) => {
  return (
    <Box
      sx={{
        m: "5px",
        p: "5px",
        borderWidth: "1px",
        borderRadius: "4px",
      }}
    >
      <RadioGroup
        row
        aria-label="mode"
        name="mode"
        value={mode}
        onChange={onChange}
      >
        <FormControlLabel
          value={2}
          control={<Radio {...radioProps} />}
          label="Auto"
        />
        <FormControlLabel
          value={1}
          control={<Radio {...radioProps} />}
          label="Manual"
        />
        <FormControlLabel
          value={0}
          control={<Radio {...radioProps} />}
          label="Off"
        />
        {showMapMode && (
          <FormControlLabel
            value={3}
            control={<Radio {...radioProps} />}
            label="Map"
          />
        )}
      </RadioGroup>
    </Box>
  );
};

TimerMode.propTypes = {
  mode: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  showMapMode: PropTypes.bool,
};

export default TimerMode;
