import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  Checkbox,
  CircularProgress,
  Dialog,
  FormControl,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Slide,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  useAddTimerMutation,
  useGetLightChannelsQuery,
  useGetTimersQuery,
  useRemoveTimerMutation,
  useSetMaxLevelMutation,
  useSetStepsMutation,
  useSetStepTimeMutation,
  useSetSunriseTimeMutation,
  useSetSunsetTimeMutation,
  useStartTimerMutation,
  useStopTimerMutation,
  useSubscribeMutation,
  useUnsubscribeMutation,
} from "../../store/lightApi";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import PropTypes from "prop-types";
import ChannelsList from "./ChannelsList";
import SettingsIcon from "@mui/icons-material/Settings";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import StyledSwitch from "../StyledSwitch";

const MAX_LEVEL = 10000;

const includes = (arr1, arr2) => {
  return arr2.every((item) => arr1.includes(item));
};
const minutesToDate = (minutes) => {
  const date = new Date();
  date.setHours(Math.floor(minutes / 60));
  date.setMinutes(minutes % 60);
  return date;
};
const dateToMinutes = (date) => {
  return date.getHours() * 60 + date.getMinutes();
};

const AddTimerDialog = () => {
  const [addTimer] = useAddTimerMutation();
  const [newTimer, setNewTimer] = useState({
    name: "",
    steps: 0,
    stepTime: 0,
    sunriseTime: "",
    sunsetTime: "",
    channels: [],
  });
  const [open, setOpen] = useState(false);
  const handleAddTimer = () => {
    addTimer({
      name: newTimer.name,
      steps: newTimer.steps,
      stepTime: newTimer.stepTime,
      sunriseTime: dateToMinutes(newTimer.sunriseTime),
      sunsetTime: dateToMinutes(newTimer.sunsetTime),
      channels: newTimer.channels,
    });
    setNewTimer({
      name: "",
      steps: 0,
      stepTime: 0,
      sunriseTime: 0,
      sunsetTime: 0,
      channels: [],
    });
    setOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <IconButton onClick={() => setOpen(!open)}>
        <PlaylistAddIcon />
      </IconButton>
      <Dialog TransitionComponent={Slide} open={open} onClose={handleClose}>
        <Stack direction="column" spacing={1} margin={1}>
          <TextField
            label="Name"
            variant="outlined"
            sx={{ width: "400px" }}
            value={newTimer.name}
            onChange={(e) => setNewTimer({ ...newTimer, name: e.target.value })}
          />
          <TextField
            label="Steps"
            variant="outlined"
            type="number"
            value={newTimer.steps}
            onChange={(e) =>
              setNewTimer({ ...newTimer, steps: parseInt(e.target.value) })
            }
          />
          <TextField
            label="Step Time"
            variant="outlined"
            type="number"
            value={newTimer.stepTime}
            onChange={(e) =>
              setNewTimer({ ...newTimer, stepTime: parseInt(e.target.value) })
            }
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <TimePicker
              label="Sunrise Time"
              ampm={false}
              value={dayjs(newTimer.sunriseTime)}
              onChange={(date) =>
                setNewTimer({ ...newTimer, sunriseTime: date.toDate() })
              }
              renderInput={(params) => <TextField {...params} />}
            />
            <TimePicker
              label="Sunset Time"
              ampm={false}
              value={dayjs(newTimer.sunsetTime)}
              onChange={(date) =>
                setNewTimer({ ...newTimer, sunsetTime: date.toDate() })
              }
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <pre
            style={{ overflow: "auto", maxHeight: "200px", fontSize: "10px" }}
          >
            {JSON.stringify(newTimer, null, 2)}
          </pre>
          <Button variant="contained" color="primary" onClick={handleAddTimer}>
            Add
          </Button>
        </Stack>
      </Dialog>
    </>
  );
};

const TimerSettings = ({ timer }) => {
  const { name, steps, stepTime, sunriseTime, sunsetTime } = timer;
  const [setSteps] = useSetStepsMutation();
  const [setStepTime] = useSetStepTimeMutation();
  const [setSunriseTime] = useSetSunriseTimeMutation();
  const [setSunsetTime] = useSetSunsetTimeMutation();
  const [haveModifications, setHaveModifications] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [settings, setSettings] = useState({});
  const [removeTimer] = useRemoveTimerMutation();

  const handleSetSteps = (e) => {
    setSettings({ ...settings, steps: parseInt(e.target.value) });
  };
  const handleSetStepTime = (e) => {
    setSettings({ ...settings, stepTime: parseInt(e.target.value) });
  };
  const handleSetSunriseTime = (date) => {
    setSettings({ ...settings, sunriseTime: date.toDate() });
  };
  const handleSetSunsetTime = (date) => {
    setSettings({ ...settings, sunsetTime: date.toDate() });
  };
  const handlerSave = () => {
    if (settings.steps !== steps) {
      setSteps({ name, steps: settings.steps });
    }
    if (settings.stepTime !== stepTime) {
      setStepTime({ name, stepTime: settings.stepTime });
    }
    if (settings.sunriseTime !== sunriseTime) {
      setSunriseTime({ name, time: dateToMinutes(settings.sunriseTime) });
    }
    if (settings.sunsetTime !== sunsetTime) {
      setSunsetTime({ name, time: dateToMinutes(settings.sunsetTime) });
    }
    setOpenDialog(false);
  };
  const handleRemoveTimer = () => {
    removeTimer(name);
  };
  useEffect(() => {
    setSettings({
      steps,
      stepTime,
      sunriseTime: minutesToDate(sunriseTime),
      sunsetTime: minutesToDate(sunsetTime),
    });
  }, []);
  useEffect(() => {
    if (
      settings.steps !== steps ||
      settings.stepTime !== stepTime ||
      settings.sunriseTime !== sunriseTime ||
      settings.sunsetTime !== sunsetTime
    ) {
      setHaveModifications(true);
    } else {
      setHaveModifications(false);
    }
  }, [settings, steps, stepTime, sunriseTime, sunsetTime]);
  return (
    <>
      <IconButton variant="contained" onClick={() => setOpenDialog(true)}>
        <SettingsIcon />{" "}
      </IconButton>
      <Dialog
        TransitionComponent={Slide}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <Stack direction="column" spacing={1} margin={1}>
          <TextField
            label="Steps"
            variant="outlined"
            type="number"
            value={settings.steps}
            onChange={handleSetSteps}
          />
          <TextField
            label="Step Time"
            variant="outlined"
            type="number"
            value={settings.stepTime}
            onChange={handleSetStepTime}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <TimePicker
              label="Sunrise Time"
              ampm={false}
              value={dayjs(settings.sunriseTime)}
              onChange={handleSetSunriseTime}
              renderInput={(params) => <TextField {...params} />}
            />
            <TimePicker
              label="Sunset Time"
              ampm={false}
              value={dayjs(settings.sunsetTime)}
              onChange={handleSetSunsetTime}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <pre
            style={{ overflow: "auto", maxHeight: "200px", fontSize: "10px" }}
          >
            {JSON.stringify(settings, null, 2)}
          </pre>
          <Button
            variant="contained"
            color="primary"
            disabled={!haveModifications}
            onClick={handlerSave}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDialog(false)}
          >
            Close
          </Button>
          <Button
            sx={{ border: "2px solid red" }}
            size="small"
            variant="contained"
            color="error"
            onClick={handleRemoveTimer}
          >
            Delete channel
          </Button>
        </Stack>
      </Dialog>
    </>
  );
};
TimerSettings.propTypes = {
  timer: PropTypes.object.isRequired,
};

const SubscribeChannelDialog = ({ timer }) => {
  const { data: availbleChannels } = useGetLightChannelsQuery();
  const [channelsList, setChannelsList] = useState([...timer.channels]);
  const [unsubscribeList, setUnsubscribeList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [haveModifications, setHaveModifications] = useState(false);
  const [subscribe] = useSubscribeMutation();
  const [unsubscribe] = useUnsubscribeMutation();
  const handlerSubcribe = () => {
    if (channelsList.length > 0 && !includes(timer.channels, channelsList)) {
      subscribe({
        name: timer.name,
        channels: channelsList.filter(
          (ch) => timer.channels.indexOf(ch) === -1
        ),
      });
    }
    if (unsubscribeList.length > 0) {
      unsubscribe({ name: timer.name, channels: [...unsubscribeList] });
    }
    setChannelsList([...timer.channels]);
    setUnsubscribeList([]);
    setOpenDialog(false);
  };
  useEffect(() => {
    if (!includes(timer.channels, channelsList) || unsubscribeList.length > 0) {
      setHaveModifications(true);
    } else {
      setHaveModifications(false);
    }
  }, [channelsList, unsubscribeList]);
  return (
    <>
      <IconButton variant="contained" onClick={() => setOpenDialog(true)}>
        <PlaylistAddIcon />
      </IconButton>
      <Dialog
        TransitionComponent={Slide}
        open={openDialog}
        onClose={() => setChannelsList([])}
      >
        <Stack direction="column" spacing={1} margin={1}>
          <List>
            {availbleChannels?.length > 0 &&
              availbleChannels.map((channel, idx) => (
                <ListItem key={idx} variant="contained" color="primary">
                  {channel.name}
                  <Checkbox
                    checked={channelsList.includes(channel.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (
                          channelsList.includes(channel.name) &&
                          timer?.channels.includes(channel.name)
                        ) {
                          return;
                        }
                        if (!timer?.channels.includes(channel.name)) {
                          setChannelsList([...channelsList, channel.name]);
                        }
                        if (unsubscribeList.includes(channel.name)) {
                          setUnsubscribeList(
                            unsubscribeList.filter(
                              (item) => item !== channel.name
                            )
                          );
                        }
                      } else {
                        setChannelsList(
                          channelsList.filter((item) => item !== channel.name)
                        );
                        if (timer?.channels.includes(channel.name)) {
                          setUnsubscribeList([
                            ...unsubscribeList,
                            channel.name,
                          ]);
                        }
                      }
                    }}
                  />
                </ListItem>
              ))}
          </List>
          <pre
            style={{ overflow: "auto", maxHeight: "200px", fontSize: "10px" }}
          >
            {JSON.stringify(channelsList, null, 2)}
          </pre>
          <pre
            style={{ overflow: "auto", maxHeight: "200px", fontSize: "10px" }}
          >
            {JSON.stringify(unsubscribeList, null, 2)}
          </pre>
          <Button
            disabled={!haveModifications}
            variant="contained"
            color="primary"
            onClick={handlerSubcribe}
          >
            Subscribe
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDialog(false)}
          >
            Close
          </Button>
        </Stack>
      </Dialog>
    </>
  );
};

SubscribeChannelDialog.propTypes = {
  timer: PropTypes.object.isRequired,
};

const TimerCard = ({ timer }) => {
  const { name, steps, stepTime, sunriseTime, sunsetTime, state, channels } =
    timer;
  const [starTimer] = useStartTimerMutation();
  const [stopTimer] = useStopTimerMutation();
  const [setMaxLevel] = useSetMaxLevelMutation();
  const { data: lightChannels } = useGetLightChannelsQuery();
  const [masterLevel, setMasterLevel] = useState(50);
  const [oldMasterLevel, setOldMasterLevel] = useState(50);
  const [faderMode, setFaderMode] = useState("fadeLevel");

  useEffect(() => {
    if (channels.length > 0) {
      channels.forEach((channel) => {
        const channelData = lightChannels?.find(
          (item) => item.name === channel
        );
        let level = 0;
        if (channelData === undefined) {
          return;
        }
        if (faderMode === "maxLevel") {
          level = Math.floor((MAX_LEVEL * masterLevel) / 100);
          console.log(masterLevel, level);
          setMaxLevel({ name: channel, maxLevel: level });
        } else if (faderMode === "fadeLevel") {
          if (oldMasterLevel > masterLevel) {
            level =
              channelData.maxLevel -
              (MAX_LEVEL * (oldMasterLevel - masterLevel)) / 100;
          } else if (oldMasterLevel < masterLevel) {
            level =
              channelData.maxLevel +
              (MAX_LEVEL * (masterLevel - oldMasterLevel)) / 100;
          } else {
            level = channelData.maxLevel;
          }
        }
        if (level > MAX_LEVEL) {
          level = MAX_LEVEL;
        }
        if (level < 0) {
          level = 0;
        }
        console.log(level);
        setOldMasterLevel(masterLevel);
        setMaxLevel({ name: channel, maxLevel: Math.floor(level) });
      });
    }
  }, [masterLevel, faderMode, channels, setMaxLevel]);

  return (
    <Card
      sx={{
        m: "2px",
        p: "10px",
        width: "100%",
      }}
    >
      {name && (
        <Typography variant="h6" component="span">
          Timer:{name || ""}
        </Typography>
      )}
      <StyledSwitch
        sx={{ float: "right", margin: "5px" }}
        checked={state === "started"}
        onChange={(e) => {
          if (e.target.checked) {
            starTimer({ name });
          }
          if (!e.target.checked) {
            stopTimer({ name });
          }
        }}
      />
      {steps && (
        <Typography variant="caption" component={"div"}>
          Steps:{steps || ""}
        </Typography>
      )}
      {stepTime && (
        <Typography variant="caption" component={"div"}>
          stepTime{stepTime || ""}
        </Typography>
      )}
      {sunriseTime && (
        <Typography variant="caption" component={"div"}>
          Sunrise
          {dayjs(minutesToDate(sunriseTime)).format("HH:mm").toString() || ""}
        </Typography>
      )}
      {(sunsetTime !== "" || sunriseTime !== undefined) && (
        <Typography variant="caption" component={"div"}>
          Sunset
          {dayjs(minutesToDate(sunsetTime)).format("HH:mm").toString() || ""}
        </Typography>
      )}
      <Slider
        sx={{ width: "60%", color: "green", ml: "10px", height: "10px" }}
        value={masterLevel}
        valueLabelDisplay="on"
        step={5}
        marks
        min={faderMode === "maxLevel" ? 0 : 0}
        max={faderMode === "maxLevel" ? 100 : 100}
        onChange={(e, value) => setMasterLevel(value)}
      />
      <FormControl component={"fieldset"} sx={{ ml: "15px" }}>
        <RadioGroup
          row
          value={faderMode}
          onChange={(e) => setFaderMode(e.target.value)}
        >
          <FormControlLabel
            value={"maxLevel"}
            control={<Radio size="small" margin="2px" />}
            label="MaxLevel"
          />
          <FormControlLabel
            value={"fadeLevel"}
            control={<Radio size="small" />}
            label="FadeLevel"
          />
        </RadioGroup>
      </FormControl>
      {channels?.length > 0 && <ChannelsList channelNames={channels} />}

      <CardActions>
        <SubscribeChannelDialog timer={timer} />
        <TimerSettings timer={timer} />
      </CardActions>
    </Card>
  );
};
TimerCard.propTypes = {
  timer: PropTypes.object.isRequired,
};

export default function TimerList() {
  const { data: timers, isLoading, isError, error } = useGetTimersQuery();
  return (
    <Box>
      {isLoading && <CircularProgress />}
      {isError && <Alert severity="error">{error.message}</Alert>}
      {timers?.length > 0 &&
        timers.map((timer, idx) => <TimerCard key={idx} timer={timer} />)}
      <AddTimerDialog />
    </Box>
  );
}
