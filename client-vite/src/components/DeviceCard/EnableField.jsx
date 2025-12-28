import { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Popover,
  Typography,
} from "@mui/material";

/**
 * Enable field with confirmation popover
 * @param {Object} props
 * @param {string} props.name - Field label
 * @param {boolean} props.value - Current value
 * @param {Function} props.onChange - Change handler
 */
const EnableField = ({ name, value, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [checked, setChecked] = useState(value);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOk = () => {
    setChecked(!checked);
    setAnchorEl(null);
    onChange(!checked);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <FormControl sx={{ ml: "10px", my: 0, p: "2px", py: 0, borderRadius: "4px" }}>
        <FormControlLabel
          control={<Checkbox checked={checked} size="small" onClick={handleClick} />}
          label={name}
        />
      </FormControl>
      <Popover
        sx={{ p: "5px", borderRadius: "4px", height: "200px" }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: "3px" }} display="inline">
          Are you sure?
        </Typography>
        <Button size="small" onClick={handleOk}>
          Ok
        </Button>
        <Button size="small" onClick={handleClose}>
          Cancel
        </Button>
      </Popover>
    </>
  );
};

EnableField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default EnableField;
