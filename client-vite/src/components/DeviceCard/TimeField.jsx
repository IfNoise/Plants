import { useState } from "react";
import PropTypes from "prop-types";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { secToTime } from "./utils";

/**
 * Time field component with dayjs integration
 * @param {Object} props
 * @param {string} props.name - Field label
 * @param {number} props.value - Time value in seconds
 * @param {Function} props.onChange - Change handler
 */
const TimeField = ({ name, value, onChange }) => {
  const [newValue, setNewValue] = useState(secToTime(value));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <TimePicker
        sx={{ m: "2px", p: "2px", borderRadius: "4px" }}
        label={name}
        ampm={false}
        value={newValue}
        onChange={(e) => {
          setNewValue(e);
          onChange(e);
        }}
      />
    </LocalizationProvider>
  );
};

TimeField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TimeField;
