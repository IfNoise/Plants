import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  InputLabel,
  FormControl,
  Button,
  MenuItem,
  FormControlLabel,
  SvgIcon,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import PropTypes from "prop-types";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import CancelIcon from "@mui/icons-material/Cancel";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { SnackbarContext } from "../../context/SnackbarContext";
import { useNewAction } from "../../context/NewActionContext";
import { StopFields } from "./StopFields";
import { NoteFields } from "./NoteFields";
import { CuttingClonesFields } from "./CuttingClonesFields";
import { SetGenderFields } from "./SetGenderFields";
import { PickingFields } from "./PickingFields";
import { AddressFields } from "./AddressFields";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import CheckBox from "@mui/material/Checkbox";
import { RedoFields } from "./RedoFields";
const PickingIcon = ({ width = "48px", height = "48px", color = "red" }) => {
  return (
    <SvgIcon sx={{ color: "white", width, height }} viewBox="0 0 24 24">
      <svg
        width={width}
        height={height}
        viewBox="0 0 48 48"
        version="1.1"
        id="svg5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="layer1">
          <path
            style={{
              fill: color,
              stroke: color,
              strokeWidth: 3,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeMiterlimit: 4,
              strokeDasharray: "none",
              strokeOpacity: 1,
            }}
            d="M 5.2291192,42.722255 3.2565526,23.245197 18.699196,23.219956 17.115306,42.733435 Z"
            id="path1600"
          />
          <path
            style={{
              fill: "none",
              stroke: color,
              strokeWidth: 3,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeMiterlimit: 4,
              strokeDasharray: "none",
              strokeOpacity: 1,
            }}
            d="m 26.913327,42.343204 -3.624089,-25.807942 21.092454,0.0406 -3.281325,25.817295 z"
            id="path1600-3"
          />
          <path
            style={{
              fill: "none",
              stroke: color,
              strokeWidth: 3,
              strokeLinecap: "butt",
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              strokeDasharray: "none",
              strokeOpacity: 1,
            }}
            d="M 9.184941,18.084149 C 10.556713,4.6918471 18.379601,2.5576131 24.923475,3.8453976 28.88262,4.6245272 32.729499,8.345972 33.218914,11.846946"
            id="path1744"
          />
          <path
            style={{
              fill: color,
              fillOpacity: 1,
              stroke: color,
              strokeWidth: 2.97249,
              strokeLinecap: "butt",
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              strokeDasharray: "none",
              strokeOpacity: 1,
            }}
            d="m 31.999552,6.8028442 0.532972,2.2047321 0.68639,2.8393697 -1.327536,-1.078973 -2.746857,-2.2325463 z"
            id="path2034"
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

PickingIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  color: PropTypes.string,
};
const states = {
  Germination: {
    actions: [
      { text: "Note" },
      { text: "Picking" },
      { text: "Relocation" },
      { text: "Stop" },
    ],
  },
  Cloning: {
    actions: [
      { text: "Note" },
      { text: "Picking" },
      { text: "Relocation" },
      { text: "Stop" },
    ],
  },
  Growing: {
    actions: [
      { text: "Note" },
      { text: "Picking" },
      { text: "SetGender" },
      { text: "Relocation" },
      { text: "Blooming" },
      { text: "MakeMother" },
      { text: "Stop" },
    ],
  },
  Blooming: {
    actions: [
      { text: "Note" },
      { text: "Relocation" },
      { text: "Stop" },
      { text: "Harvest" },
    ],
  },
  Stopped: {
    actions: [{ text: "Note" }, { text: "Redo" }],
  },
  Harvested: {
    actions: [{ text: "Note" }],
  },
  MotherPlant: {
    actions: [
      { text: "Note" },
      { text: "Picking" },
      { text: "Relocation" },
      { text: "SetGender" },
      { text: "CuttingClones" },
      { text: "Blooming" },
      { text: "Stop" },
    ],
  },
};
const actionFields = {
  Note: {
    name: "Note",
    icon: <NoteAddIcon fontSize="large" />,
    component: NoteFields,
  },
  Picking: {
    name: "Picking",
    icon: <PickingIcon width="32px" height="32px" color="white" />,
    fields: <PickingFields />,
  },
  Relocation: {
    name: "Relocation",
    icon: <ArrowOutwardIcon fontSize="large" />,
    fields: <AddressFields />,
  },
  SetGender: {
    name: "SetGender",
    icon: <CheckBoxIcon fontSize="large" />,
    fields: <SetGenderFields />,
  },
  Blooming: {
    name: "Blooming",
    icon: <LocalFloristIcon fontSize="large" />,
  },
  Stop: {
    name: "Stop",
    icon: <CancelIcon color="error" fontSize="large" />,
    fields: <StopFields />,
  },
  Harvest: {
    name: "Harvest",
    icon: <ArrowOutwardIcon />,
  },
  MakeMother: {
    name: "MakeMother",
    icon: <ArrowOutwardIcon fontSize="large" />,
  },
  CuttingClones: {
    name: "CuttingClones",
    icon: <ContentCutIcon fontSize="large" />,
    fields: <CuttingClonesFields />,
  },
  Redo: {
    name: "Redo",
    icon: <ArrowOutwardIcon fontSize="large" />,
    fields: <RedoFields />,
  },
};

export default function AddActionDialog({ open, onClose, plants }) {
  const { newAction, clear, addType, addDate, submitAction, isSuccess, isError, error, isUploadingPhotos } = useNewAction();
  const { setSnack } = useContext(SnackbarContext);
  const [date, setDate] = useState(dayjs());
  const [showPicker, setShowPicker] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const isSmall = window.innerWidth < 600;
  const state = plants[0]?.state;

  const actions = states[state].actions;

  useEffect(() => {
    clear();
    setPendingPhotos([]);
    console.log(newAction);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isError) {
      setSnack({ open: true, severity: "error", message: error.data.message });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      setSnack({ open: true, severity: "success", message: "Action is added" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handleChangeDate = (value) => {
    addDate(new Date(value.$d));
    setDate(null);
  };
  const handleActionType = (e) => {
    const { value } = e.target;
    if (newAction) {
      clear();
    }
    addType(value);
  };

  const handleCancel = () => {
    clear();
    setPendingPhotos([]);
    onClose();
  };
  const handleChange = (e) => {
    setShowPicker(e.target.checked);
  };

  const handlePhotosChange = (photos) => {
    console.log('Photos changed:', photos.length);
    setPendingPhotos(photos);
  };

  const newActionFunc = async () => {
    console.log('Submitting action with photos:', pendingPhotos.length);
    if (plants.length < 1) {
      setSnack({
        open: true,
        severity: "error",
        message: "No plants selected",
      });
      return;
    }
    
    try {
      const id = plants.map((plant) => plant._id);
      await submitAction(id, pendingPhotos);
      clear();
      setPendingPhotos([]);
      onClose();
    } catch (err) {
      console.error('Error submitting action:', err);
    }
  };
  return (
    <Dialog
      sx={{ height: "auto", justifyContent: "center" }}
      fullScreen={isSmall}
      fullWidth={true}
      maxWidth="md"
      open={open}
      onClose={handleCancel}
    >
      <DialogTitle>New Action</DialogTitle>
      <DialogContent>
        <FormControl
          variant="outlined"
          sx={{
            mt: "6px",
            width: "120px",
            height: "120px",
            minHeight: "120px",
          }}
        >
          <InputLabel id="action-label">Action Type</InputLabel>
          <Select
            labelId="action-label"
            value={newAction.actionType ?? ""}
            label="Action Type"
            onChange={handleActionType}
            defaultOpen
          >
            {actions.map((obj, index) => {
              return (
                <MenuItem key={index} value={obj.text}>
                  <ListItemIcon>{actionFields[obj.text].icon}</ListItemIcon>
                  <ListItemText primary={obj.text} />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Stack display="inline-block" direction="row" spacing={2} sx={{ p: 1 }}>
          <FormControl variant="outlined">
            <FormControlLabel
              sx={{ display: "inline" }}
              control={
                <CheckBox
                  checked={showPicker}
                  onChange={handleChange}
                  sx={{ m: "6px" }}
                />
              }
              label="Custom Date"
            />
          </FormControl>
          {showPicker && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ mt: "6px" }}
                disabled={!showPicker}
                disableFuture
                closeOnSelect
                size="small"
                value={date || dayjs()}
                label="Start Date"
                onChange={handleChangeDate}
              />
            </LocalizationProvider>
          )}
        </Stack>
        {newAction?.actionType && (() => {
          const field = actionFields[newAction.actionType];
          if (field?.component) {
            const Component = field.component;
            return <Component onPhotosChange={handlePhotosChange} />;
          }
          return field?.fields;
        })()}
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "center", position: "sticky", bottom: 0 }}
      >
        <Button
          onClick={newActionFunc}
          role="submit"
          disabled={!newAction.actionType || isUploadingPhotos}
        >
          {isUploadingPhotos ? "Uploading photos..." : "Ok"}
        </Button>
        <Button onClick={handleCancel} disabled={isUploadingPhotos}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
AddActionDialog.propTypes = {
  open: PropTypes.bool.isRequired, //
  onClose: PropTypes.func.isRequired,
  plants: PropTypes.arrayOf(PropTypes.object).isRequired,
};
AddActionDialog.defaultProps = {
  open: false,
  onClose: () => {},
  plants: [],
};
