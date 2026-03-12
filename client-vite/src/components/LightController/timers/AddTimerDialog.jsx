import {
  Button,
  Dialog,
  IconButton,
  Slide,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { useAddTimerMutation } from "../../../store/lightApi";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { dateToMinutes } from "./timerUtils";

const AddTimerDialog = () => {
  const [addTimer] = useAddTimerMutation();
  const [open, setOpen] = useState(false);
  const [newTimer, setNewTimer] = useState({
    name: "",
    steps: 0,
    stepTime: 0,
    sunriseTime: "",
    sunsetTime: "",
    channels: [],
  });

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

  return (
    <>
      <IconButton onClick={() => setOpen(!open)}>
        <PlaylistAddIcon />
      </IconButton>
      <Dialog
        TransitionComponent={Slide}
        open={open}
        onClose={() => setOpen(false)}
      >
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

export default AddTimerDialog;
