import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useGetConfigQuery, useSetConfigMutation } from "../../store/deviceApi";

const secToTime = (seconds) => {
  return dayjs()
    .set("hour", Math.floor(seconds / 3600))
    .set("minute", Math.floor((seconds % 3600) / 60))
    .set("second", (seconds % 3600) % 60);
};
const timeToSec = (time) => {
  return time.hour() * 3600 + time.minute() * 60 + time.second();
};
const StringField = ({ name, path, value, onChange }) => {
  const [newValue, setNewValue] = useState(value);
  return (
    <TextField
      variant="outlined"
      label={name}
      fullWidth
      value={newValue}
      onChange={(event) => {
        setNewValue(event.target.value);
        onChange(path, event.target.value);
      }}
    />
  );
};
StringField.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
const NumberField = ({ name, path, value, onChange }) => {
  const [newValue, setNewValue] = useState(value);
  return (
    <TextField
      variant="outlined"
      label={name}
      fullWidth
      type="number"
      value={newValue}
      onChange={(event) => {
        setNewValue(event.target.value);
        onChange(path, parseInt(event.target.value));
      }}
    />
  );
};
NumberField.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

const BooleanField = ({ name, path, value, onChange }) => {
  const [newValue, setNewValue] = useState(value);
  return (
    <FormControlLabel
      label={name}
      control={
        <Checkbox
          title={name}
          checked={newValue}
          onChange={(event) => {
            setNewValue(event.target.checked);
            onChange(path, event.target.checked);
          }}
        />
      }
    />
  );
};
BooleanField.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
const TimeField = ({ name, path, value, change }) => {
  const [newValue, setNewValue] = useState(secToTime(value));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <TimePicker
        label={name}
        ampm={false}
        value={newValue}
        onChange={(date) => {
          setNewValue(date);
          change(path, timeToSec(date));
        }}
      />
    </LocalizationProvider>
  );
};
TimeField.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  change: PropTypes.func.isRequired,
};
const ChapterField = ({ name, path, value, onChange }) => {
  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          {name}
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {Object.keys(value).map((key, i) => {
              const type = typeof value[key];
              const newPath = path ? path + "." + key : key;
              switch (type) {
                case "string": {
                  return (
                    <StringField
                      key={i}
                      name={key}
                      path={newPath}
                      value={value[key]}
                      onChange={onChange}
                    />
                  );
                }
                case "number": {
                  if (key === "start" || key === "stop") {
                    return (
                      <TimeField
                        key={i}
                        name={key}
                        path={newPath}
                        value={value[key]}
                        change={onChange}
                      />
                    );
                  } else
                    return (
                      <NumberField
                        key={i}
                        name={key}
                        path={newPath}
                        value={value[key]}
                        onChange={onChange}
                      />
                    );
                }
                case "boolean": {
                  return (
                    <BooleanField
                      key={i}
                      name={key}
                      path={newPath}
                      value={value[key]}
                      onChange={onChange}
                    />
                  );
                }
                case "object": {
                  return (
                    <ChapterField
                      key={i}
                      name={key}
                      path={newPath}
                      value={value[key]}
                      onChange={onChange}
                    />
                  );
                }
                default:
                  return null;
              }
            })}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
ChapterField.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
const DeviceSettingsList = ({ deviceId,onCancel }) => {
  const [changes, setChanges] = useState({});
  //const [config,setConfig]=useState({});
  const {isSuccess,isLoading,data,refetch}=useGetConfigQuery(deviceId,{refetchOnReconnect:true,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true})
  const[setConfig]=useSetConfigMutation();
  const [newConfig, setNewConfig] = useState({});
  const [reboot,setReboot]=useState(false);
  const handleSave = () => {
    console.log("Save", changes);
    setConfig({deviceId,params:{reboot:reboot||false,params:changes}});
    setChanges({});
    refetch();
    setNewConfig(JSON.parse(JSON.stringify(data)))
  };
  const handleChange = (path, value) => {
    setChanges((prev) => {
      let next ={...prev};
      setKey(next, path, value);
      return next;
    });
    setNewConfig((prev) => {
      let next  = { ...prev}
      setKey(next, path, value);
      return next;
    });
  };
  useEffect(()=>{
    if(isSuccess&&data){
      //setConfig(JSON.parse(JSON.stringify(data)))
      setNewConfig(JSON.parse(JSON.stringify(data)))
    }
  },[isSuccess,data])

  const setKey = function (obj, key, val) {
    var parts = key.split(".");
    for (var i = 0; i < parts.length; i++) {
      if (i >= parts.length - 1) {
        obj[parts[i]] = val;
      } else {
        if (!obj[parts[i]]) obj[parts[i]] = {};
        obj = obj[parts[i]];
      }
    }
  };
  if(isLoading|| Object.keys(data).length <1)return(<CircularProgress/>)
  return (
    <>
      <Box sx={{height:"70%",overflowY:"scroll"}}>

        {isSuccess&&
        <ChapterField
        name="Settings"
        path=""
        value={newConfig}
        onChange={handleChange}
      />}
      </Box>
      <Box sx={{alignContent:"center",position: "fixed",bottom: 0,left: 0}}>
      <Typography sx={{}} variant="caption" component="div">{JSON.stringify(changes)}</Typography>
      
      <Button
        variant="outlined"
        disabled={Object.keys(changes).length === 0}
        onClick={handleSave}
      >
        Save
      </Button>
      <Button
        variant="outlined"
        //disabled={Object.keys(changes).length === 0}
        onClick={() => {
          setNewConfig(JSON.parse(JSON.stringify(data)))
          setChanges({});
        }} >Reset</Button>
      <FormControlLabel
      label="Reboot"
      control={
        <Checkbox
          checked={reboot}
          onChange={(event) => {
            setReboot(event.target.checked);
          }}
        />
      }
    />
      <Button
        variant="outlined"
        onClick={() => {
          onCancel();
        }}
      >
        Ok
      </Button>
    </Box>
    </>
  );
};

DeviceSettingsList.propTypes = {
  deviceId: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
};
export default DeviceSettingsList;
