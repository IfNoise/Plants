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
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  Popover,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  useTheme,
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
import Slide from '@mui/material/Slide';
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

// const AccepptPopover = ({ open, onClose, onAccept }) => {
//   return (
//     <Popover
//       open={open}
//       onClose={onClose}
//       anchorOrigin={{
//         vertical: "bottom",
//         horizontal: "left",
//       }}
//     >
//       <Typography sx={{ p: "3px" }} display="inline">
//         Are you sure?
//       </Typography>
//       <Button size="small" onClick={onAccept}>
//         Ok
//       </Button>
//       <Button size="small" onClick={onClose}>
//         Cancel
//       </Button>
//     </Popover>
//   );
// };
// AccepptPopover.propTypes = {
//   open: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onAccept: PropTypes.func.isRequired,
// };

const Outputs = ({ deviceId, updateInterval }) => {
  const theme = useTheme();
  const { isLoading, isError, data } = useGetStateQuery(deviceId, {
    pollingInterval: updateInterval,
  });

  return (
    <Box
      sx={{
        m: "5px",
        p: "5px",
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
                fontSize: "8px",
                fontFamily: "monospace",
                fontWeight: "bold",
                width: "45px",
                color: "white",
                m: "2px",
                p: "2px",
                height: "26px",
                borderRadius: "5px",
                borderStyle: "solid",
                borderColor: output.state ?  "green" : "gray",
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
    <><FormControl 
    sx={{ ml: "10px",my:0, p: "2px",py:0, borderRadius: "4px" }}
    >
      <FormControlLabel
        control={
          <Checkbox checked={value} size="small" onClick={handleClick} />
        }
        label={name}
      />
      </FormControl>
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
  const [newConfig, setNewConfig] = useState(config);
  const [reboot, setReboot] = useState(false);
  const handleClose = () => {
    setNewConfig(config);
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleSave=()=>{
    onSave({ [name]: newConfig }, reboot);
    handleClose() 
  }
  return (
    <>
      <Card
        sx={{
          m: "3px",
          p: "5px",
        }}
      >
        <Typography variant="body" display="inline">
          {config.name+"  "}
        </Typography>
         <EnableField
          name={""}
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
          Irrigation window: {config.win} s.
        </Typography>
        <Typography variant="caption" display="block">
          Irrigation number: {config.num}
        </Typography>
      </Card>
      <Dialog 
      TransitionComponent={Slide}
      open={open} onClose={handleClose}>
        <DialogTitle>
        
          {config.name}
       
        </DialogTitle>
        <DialogContent>
        <EnableField
          name="Enable"
          value={config.enable}
          onChange={(e) => {
            setNewConfig({ enable: e.target.checked });
          }}
        />
        <TimerMode
          mode={config.mode}
          onChange={(e) => {
            setNewConfig({ mode: parseInt(e.target.value) });
          }}
        />
        <TimeField
          name="Start"
          value={config.start}
          onChange={(e) => {
            setNewConfig({ start: timeToSec(e) });
          }}
        />
        <TimeField
          name="Stop"
          value={config.stop}
          onChange={(e) => {
            setNewConfig({ stop: timeToSec(e) });
          }}
        />

        <TextField
          sx={{ m: "2px" }}
          variant="outlined"
          label="Irrigation window"
          type="number"
          value={config.win}
          onChange={(event) => {
            setNewConfig({ win: parseInt(event.target.value) });
          }}
        />
        <TextField
          sx={{ m: "2px" }}
          variant="outlined"
          label="Irrigation number"
          type="number"
          value={config.num}
          onChange={(event) => {
            setNewConfig({ num: parseInt(event.target.value) });
          }}
        />
        </DialogContent>
        <DialogActions 
        sx={{ m: "2px",alignContent:"center",justifyContent:"center" }}
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
        <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
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
  const [newConfig, setNewConfig] = useState(config);
  const [reboot, setReboot] = useState(false);
  const handleClose = () => {
    setNewConfig(config);
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleSave=()=>{
    onSave({ [name]: newConfig }, reboot);
    handleClose() 
  }
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
      <Dialog open={open} onClose={handleClose} TransitionComponent={Slide} >
        <DialogTitle>
          {config.name}
        </DialogTitle>
        <DialogContent>
        <EnableField
          name="Enable"
          value={config.enable}
          onChange={(e) => {
            setNewConfig({ enable: e.target.checked });
          }}
        />
        <TimerMode
          mode={config.mode}
          onChange={(e) => {
            setNewConfig({ mode: parseInt(e.target.value) });
          }}
        />
        <TimeField
          name="Start"
          value={config.start}
          onChange={(e) => {
            setNewConfig({ start: timeToSec(e) });
          }}
        />
        <TimeField
          name="Stop"
          value={config.stop}
          onChange={(e) => {
            setNewConfig({ stop: timeToSec(e) });
          }}
        />
        </DialogContent>
        <DialogActions sx={{alignContent:"center",justifyContent:"center"}}>
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
        
        <Button onClick={handleClose}>Cancel</Button>
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
          m: "2px",

        }}
      >
        <CardHeader
          avatar={<Status status={status} />}
          title={id}
          subheader={address}
        />
        <CardContent>
          <Outputs deviceId={id} updateInterval={60000} />
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
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
