import { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import EnableField from "./EnableField";
import TimerMode from "./TimerMode";
import TimeField from "./TimeField";
import { secToTime, timeToSec } from "./utils";
import TimeRangeDial from "./TimeRangeDial";

/**
 * Light timer card component
 * @param {Object} props
 * @param {string} props.name - Timer name
 * @param {Object} props.config - Timer configuration
 * @param {Function} props.onSave - Save handler
 */
const LightTimerCard = ({ name, config, onSave }) => {
  const [open, setOpen] = useState(false);
  const [newConfig, setNewConfig] = useState(config);
  const [reboot, setReboot] = useState(false);

  const handleClose = () => {
    setNewConfig(config);
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSave = () => {
    if (JSON.stringify(config) !== JSON.stringify(newConfig)) {
      onSave({ [name]: newConfig }, reboot);
    }
    handleClose();
  };

  return (
    <>
      <Card
        sx={{
          m: "3px",
          p: "5px",
        }}
      >
        <Typography variant="body" display="inline">
          {config.name}
        </Typography>
        <EnableField
          name={""}
          value={config.enable}
          onChange={(e) => {
            onSave({ [name]: { enable: e } }, false);
          }}
        />
        <TimerMode
          mode={config.mode}
          interactive={false}
          showIcons={true}
          activeColor="#00ff00"
        />
        <IconButton onClick={handleOpen} size="small">
          <SettingsIcon />
        </IconButton>
        <TimeRangeDial startSeconds={config.start} stopSeconds={config.stop} />
        <Typography variant="caption" display="block">
          Start: {secToTime(config.start).format("HH:mm")} Stop:{" "}
          {secToTime(config.stop).format("HH:mm")}
        </Typography>
      </Card>
      <Dialog open={open} onClose={handleClose} TransitionComponent={Slide}>
        <DialogTitle>{config.name}</DialogTitle>
        <DialogContent>
          <EnableField
            name="Enable"
            value={newConfig.enable}
            onChange={(e) => {
              setNewConfig({ ...newConfig, enable: e });
            }}
          />
          <TimerMode
            mode={newConfig.mode}
            onChange={(e) => {
              setNewConfig({ ...newConfig, mode: parseInt(e.target.value) });
            }}
          />
          <TimeField
            name="Start"
            value={newConfig.start}
            onChange={(e) => {
              setNewConfig({ ...newConfig, start: timeToSec(e) });
            }}
          />
          <TimeField
            name="Stop"
            value={newConfig.stop}
            onChange={(e) => {
              setNewConfig({ ...newConfig, stop: timeToSec(e) });
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{ alignContent: "center", justifyContent: "center" }}
        >
          <Button onClick={handleSave}>Save</Button>
          <Checkbox
            checked={reboot}
            size="small"
            onChange={(e) => {
              setReboot(e.target.checked);
            }}
          />
          <Typography variant="caption" display="block">
            Reboot
          </Typography>

          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

LightTimerCard.propTypes = {
  name: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default LightTimerCard;
