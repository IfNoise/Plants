import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Dialog,
  FormControlLabel,
  IconButton,
  Popover,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction";
import ErrorIcon from "@mui/icons-material/Error";
import SettingsIcon from "@mui/icons-material/Settings";
import DeviceSettingsList from "./DeviceSettingsList/DeviceSettingsList";
import { useGetStateQuery, useSetConfigMutation } from "../store/deviceApi";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
const secToTime = (seconds) => {
  return dayjs()
    .set("hour", Math.floor(seconds / 3600))
    .set("minute", Math.floor((seconds % 3600) / 60))
    .set("second", (seconds % 3600) % 60);
};
const timeToSec = (time) => {
  return time.hour() * 3600 + time.minute() * 60 + time.second();
};
const modes = ["Off", "Manual", "Auto"];
const Status = ({ status }) => {
  switch (status) {
    case "connected":
      return <OnlinePredictionIcon color="success" />;
    case "disconnected":
      return <OnlinePredictionIcon color="gray" />;
    case "error":
      return <ErrorIcon color="red" />;
    default:
      return <OnlinePredictionIcon color="gray" />;
  }
};
Status.propTypes = {
  status: PropTypes.string.isRequired,
};
const Outputs = ({ deviceId, updateInterval }) => {
  const { isLoading, isError, data } = useGetStateQuery(deviceId, {
    pollingInterval: updateInterval,
  });

  return (
    <Box
      sx={{
        m: "5px",
        p: "5px",
        backgroundColor: "GrayText",
        borderStyle: "solid",
        borderWidth: "1px",
        borderRadius: "4px",
        width: "100%",
      }}
    >
      <Typography variant="h6">Outputs</Typography>
      {isLoading && <CircularProgress />}
      {isError && <Alert severity="error">{isError.message}</Alert>}
      <Stack direction="row" useFlexGap flexWrap="wrap">
        {data &&
          data?.result?.outputs.map((output, i) => (
            <Box
              key={i}
              sx={{
                display: "inline",
                fontSize: "7px",
                fontFamily: "monospace",
                fontWeight: "bold",
                width: "40px",
                color: "white",
                m: "2px",
                p: "2px",
                height: "24px",
                borderRadius: "5px",
                borderStyle: "solid",
                borderColor: output.state ? "green" : "red",
                borderWidth: "1px",
              }}
            >
              {output.name}
            </Box>
          ))}
      </Stack>
    </Box>
  );
};
Outputs.propTypes = {
  deviceId: PropTypes.string.isRequired,
  updateInterval: PropTypes.number.isRequired,
};
const TimerMode = ({ mode, onChange }) => {
  const radioProps = {
    size: "small",
  };
  return (
    <Box
      sx={{
        m: "5px",
        p: "5px",
        borderStyle: "solid",
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
      </RadioGroup>
    </Box>
  );
};
TimerMode.propTypes = {
  mode: PropTypes.number.isRequired,
  onChange: PropTypes.func,
};
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
          onChange;
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
const EnableField = ({ name, value, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox checked={value} size="small" onClick={handleClick} />
        }
        label={name}
      />
      <Popover
        sx={{  p:"5px" , borderRadius: "4px",height:"200px"}}
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
        <Button size="small" onClick={onChange}>Ok</Button>
        <Button size="small" onClick={handleClose}>Cancel</Button>
      </Popover>
    </>
  );
};

EnableField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

const IrrigatorCard = ({ name, config, onSave }) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <>
      <Card
        sx={{
          m: "3px",
          p: "5px",
          backgroundColor: "gray",
          borderStyle: "solid",
          borderWidth: "1px",
          width: "190px",
        }}
      >
        <Typography variant="body" display="inline">
          {config.name+"  "}
        </Typography>
         <EnableField
          name=""
          value={config.enable}
          onChange={(e) => {
            onSave({ [name]: { enable: e.target.checked } }, false);
          }}
        />
        <IconButton onClick={handleOpen} size="small">
          <SettingsIcon />
        </IconButton>
        <Typography variant="caption" display="block">
          Mode: {modes[config.mode]}
        </Typography>
        <Typography variant="caption" display="block">
          Start: {secToTime(config.start).format("HH:mm")}Stop:{" "}
          {secToTime(config.stop).format("HH:mm")}
        </Typography>
        <Typography variant="caption" display="block">
          Irrigation window: {config.win}
        </Typography>
        <Typography variant="caption" display="block">
          Irrigation number: {config.num}
        </Typography>
      </Card>
      <Dialog fullScreen open={open} onClose={handleClose}>
        <Typography variant="h6" display="inline">
          {config.name}
        </Typography>
        <EnableField
          name=""
          value={config.enable}
          onChange={(e) => {
            onSave({ [name]: { enable: e.target.checked } }, false);
          }}
        />
        <TimerMode
          mode={config.mode}
          onChange={(e) => {
            onSave({ [name]: { mode: parseInt(e.target.value) } }, false);
          }}
        />
        <TimeField
          name="Start"
          value={config.start}
          onChange={(e) => {
            onSave({ [name]: { start: timeToSec(e) } }, true);
          }}
        />
        <TimeField
          name="Stop"
          value={config.stop}
          onChange={(e) => {
            onSave({ [name]: { stop: timeToSec(e) } }, true);
          }}
        />

        <TextField
          sx={{ m: "2px" }}
          variant="outlined"
          label="Irrigation window"
          fullWidth
          type="number"
          value={config.win}
          onChange={(event) => {
            onSave({ [name]: { win: parseInt(event.target.value) } }, true);
          }}
        />
        <TextField
          sx={{ m: "2px" }}
          variant="outlined"
          label="Irrigation number"
          fullWidth
          type="number"
          value={config.num}
          onChange={(event) => {
            onSave({ [name]: { num: parseInt(event.target.value) } }, true);
          }}
        />
        <Button onClick={handleClose}>Close</Button>
      </Dialog>
    </>
  );
};
IrrigatorCard.propTypes = {
  name: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

const LightTimerCard = ({ name, config, onSave }) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <>
      <Card
        sx={{
          m: "3px",
          p: "5px",
          backgroundColor: "gray",
          borderStyle: "solid",
          borderWidth: "1px",
        }}
      >
        <Typography variant="body" display="inline">
          {config.name}
        </Typography>
        <Checkbox
          checked={config.enable}
          size="small"
          onChange={(e) => {
            onSave({ [name]: { enable: e.target.checked } }, false);
          }}
        />

        <IconButton onClick={handleOpen} size="small">
          <SettingsIcon />
        </IconButton>
        <Typography variant="caption" display="block">
          Mode: {modes[config.mode]}
        </Typography>
        <Typography variant="caption" display="block">
          Start: {secToTime(config.start).format("HH:mm")}Stop:{" "}
          {secToTime(config.stop).format("HH:mm")}
        </Typography>
      </Card>
      <Dialog fullScreen open={open} onClose={handleClose}>
        <Typography variant="body" display="inline">
          {config.name}
        </Typography>
        <Checkbox
          checked={config.enable}
          onChange={(e) => {
            onSave({ [name]: { enable: e.target.checked } }, false);
          }}
        />
        <TimerMode
          mode={config.mode}
          onChange={(e) => {
            onSave({ [name]: { mode: parseInt(e.target.value) } }, false);
          }}
        />
        <TimeField
          name="Start"
          value={config.start}
          onChange={(e) => {
            onSave({ [name]: { start: timeToSec(e) } }, true);
          }}
        />
        <TimeField
          name="Stop"
          value={config.stop}
          onChange={(e) => {
            onSave({ [name]: { stop: timeToSec(e) } }, true);
          }}
        />
        <Button onClick={handleClose}>Close</Button>
      </Dialog>
    </>
  );
};
LightTimerCard.propTypes = {
  name: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

const DeviceCard = ({ device }) => {
  const [open, setOpen] = useState(false);
  const { id, address, status } = device;
  const [setConfig] = useSetConfigMutation();
  const config = { ...device.config };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Card
        sx={{
          m: "5px",
          width: "430px",
          borderStyle: "solid",
          borderWidth: "1px",
          borderRadius: "4px",

        }}
      >
        <CardHeader
          avatar={<Status status={status} />}
          title={id}
          subheader={address}
        />
        <CardContent>
          <Outputs deviceId={id} updateInterval={10000} />
          <Stack direction="row" useFlexGap flexWrap="wrap">
          {Object.keys(config)
            .filter((key) => key.startsWith("irr") && config[key].enable)
            .map((key, i) => (
              <IrrigatorCard
                key={i}
                name={key}
                config={config[key]}
                onSave={(changes, reboot) =>
                  setConfig({
                    deviceId: id,
                    params: { reboot, params: changes },
                  })
                }
              />
            ))}
          {Object.keys(config)
            .filter((key) => key.startsWith("light") && config[key].enable)
            .map((key, i) => (
              <LightTimerCard
                key={i}
                name={key}
                config={config[key]}
                onSave={(changes, reboot) =>
                  setConfig({
                    deviceId: id,
                    params: { reboot, params: changes },
                  })
                }
              />
            ))}
            </Stack>
        </CardContent>
        <CardActions>
          <Button onClick={handleOpen}>Settings</Button>
        </CardActions>
      </Card>
      <Dialog fullScreen open={open} onClose={handleClose}>
        {config && <DeviceSettingsList deviceId={id} onCancel={handleClose} />}
      </Dialog>
    </>
  );
};

DeviceCard.propTypes = {
  device: PropTypes.object.isRequired,
};

export default DeviceCard;
