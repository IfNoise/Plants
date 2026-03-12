import {
  Button,
  Dialog,
  IconButton,
  Slide,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import {
  useRemoveTimerMutation,
  useSetStepsMutation,
  useSetStepTimeMutation,
  useSetSunriseTimeMutation,
  useSetSunsetTimeMutation,
} from "../../../store/lightApi";
import SettingsIcon from "@mui/icons-material/Settings";
import { minutesToDate, dateToMinutes } from "./timerUtils";

const TimerSettingsDialog = ({ timer }) => {
  const { name, steps, stepTime, sunriseTime, sunsetTime } = timer;
  const [setSteps] = useSetStepsMutation();
  const [setStepTime] = useSetStepTimeMutation();
  const [setSunriseTime] = useSetSunriseTimeMutation();
  const [setSunsetTime] = useSetSunsetTimeMutation();
  const [removeTimer] = useRemoveTimerMutation();
  const [haveModifications, setHaveModifications] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [settings, setSettings] = useState({});

  const handleSetSteps = (e) =>
    setSettings({ ...settings, steps: parseInt(e.target.value) });

  const handleSetStepTime = (e) =>
    setSettings({ ...settings, stepTime: parseInt(e.target.value) });

  const handleSetSunriseTime = (date) =>
    setSettings({ ...settings, sunriseTime: date.toDate() });

  const handleSetSunsetTime = (date) =>
    setSettings({ ...settings, sunsetTime: date.toDate() });

  const handlerSave = () => {
    if (settings.steps !== steps) setSteps({ name, steps: settings.steps });
    if (settings.stepTime !== stepTime)
      setStepTime({ name, stepTime: settings.stepTime });
    if (settings.sunriseTime !== sunriseTime)
      setSunriseTime({ name, time: dateToMinutes(settings.sunriseTime) });
    if (settings.sunsetTime !== sunsetTime)
      setSunsetTime({ name, time: dateToMinutes(settings.sunsetTime) });
    setOpenDialog(false);
  };

  useEffect(() => {
    setSettings({
      steps,
      stepTime,
      sunriseTime: minutesToDate(sunriseTime),
      sunsetTime: minutesToDate(sunsetTime),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setHaveModifications(
      settings.steps !== steps ||
        settings.stepTime !== stepTime ||
        settings.sunriseTime !== sunriseTime ||
        settings.sunsetTime !== sunsetTime,
    );
  }, [settings, steps, stepTime, sunriseTime, sunsetTime]);

  return (
    <>
      <IconButton variant="contained" onClick={() => setOpenDialog(true)}>
        <SettingsIcon />
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
            onClick={() => removeTimer(name)}
          >
            Delete channel
          </Button>
        </Stack>
      </Dialog>
    </>
  );
};

TimerSettingsDialog.propTypes = {
  timer: PropTypes.object.isRequired,
};

export default TimerSettingsDialog;
