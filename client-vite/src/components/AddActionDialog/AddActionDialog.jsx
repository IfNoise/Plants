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
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import { useDispatch, useSelector } from "react-redux";
import { clear, addType, addDate } from "../../store/newActionSlice";
import { SnackbarContext } from "../../context/SnackbarContext";
import { StopFields } from "./StopFields";
import { NoteFields } from "./NoteFields";
import { CuttingClonesFields } from "./CuttingClonesFields";
import { SetGenderFields } from "./SetGenderFields";
import { PickingFields } from "./PickingFields";
import { AddressFields } from "./AddressFields";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { AddPhotoFields } from "./AddPhotoFields";
import { useAddActionMutation } from "../../store/plantsApi";
import CheckBox from "@mui/icons-material/CheckBox";

const states = {
  Germination: {
    actions: [
      { text: "Note" },
      { text: "Picking" },
      { text: "Relocation" },
      { text: "Stop" },
      { text: "AddPhoto" },
    ],
  },
  Cloning: {
    actions: [
      { text: "Note" },
      { text: "Picking" },
      { text: "Relocation" },
      { text: "Stop" },
      { text: "AddPhoto" },
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
      { text: "AddPhoto" },
    ],
  },
  Blooming: {
    actions: [
      { text: "Note" },
      { text: "Relocation" },
      { text: "Stop" },
      { text: "Harvest" },
      { text: "AddPhoto" },
    ],
  },
  Stopped: {
    actions: [{ text: "Note" }, { text: "AddPhoto" }],
  },
  Harvested: {
    actions: [{ text: "Note" }, { text: "AddPhoto" }],
  },
  MotherPlant: {
    actions: [
      { text: "Note" },
      { text: "Picking" },
      { text: "Relocation" },
      { text: "CuttingClones" },
      { text: "Blooming" },
      { text: "Stop" },
      { text: "AddPhoto" },
    ],
  },
};
const actionFields = {
  Note: {
    name: "Note",
    icon: <NoteAddIcon />,
    fields: <NoteFields />,
  },
  Picking: {
    name: "Picking",
    icon: <NoteAddIcon />,
    fields: <PickingFields />,
  },
  Relocation: {
    name: "Relocation",
    icon: <ArrowOutwardIcon />,
    fields: <AddressFields />,
  },
  SetGender: {
    name: "SetGender",
    icon: <CheckBoxIcon />,
    fields: <SetGenderFields />,
  },
  Blooming: {
    name: "Blooming",
    icon: <LocalFloristIcon />,
  },
  Stop: {
    name: "Stop",
    icon: <CancelIcon color="error" />,
    fields: <StopFields />,
  },
  Harvest: {
    name: "Harvest",
    icon: <ArrowOutwardIcon />,
  },
  MakeMother: {
    name: "MakeMother",
    icon: <ArrowOutwardIcon />,
  },
  CuttingClones: {
    name: "CuttingClones",
    icon: <ContentCutIcon />,
    fields: <CuttingClonesFields />,
  },
  AddPhoto: {
    name: "AddPhoto",
    icon: <AddPhotoAlternateIcon />,
    fields: <AddPhotoFields />,
  },
};

export default function AddActionDialog({ open, onClose, plants }) {
  const dispatch = useDispatch();
  const { setSnack } = useContext(SnackbarContext);
  const [date, setDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const newAction = useSelector((state) => state.newAction);
  const isSmall = window.innerWidth < 600;
  const [addAction, { isSuccess, isError, error }] = useAddActionMutation();
  const state = plants[0]?.state;

  const actions = states[state].actions;


  useEffect(() => {
    dispatch(clear());
    console.log(newAction);
  }, []);

  useEffect(() => {
    if (isError) {
      setSnack({ open: true, severity: "error", message: error.data.message });
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      setSnack({ open: true, severity: "success", message: "Action is added" });
    }
  }, [isSuccess]);

  const handleChangeDate = (value) => {
    dispatch(addDate(new Date(value.$d)));
    setDate(new Date(value.$d));
  };
  const handleActionType = (e) => {
    const { value } = e.target;
    if (newAction) {
      dispatch(clear());
    }
    dispatch(addType(value));
  };

  const handleCancel = () => {
    dispatch(clear());
    onClose();
  };

  const newActionFunc = () => {
    if (plants.length < 1) {
      setSnack({
        open: true,
        severity: "error",
        message: "No plants selected",
      });
      return;
    }
    const id = plants.map((plant) => plant._id);

    const body = { id, action: newAction };
    addAction(body);
    dispatch(clear());
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
      <DialogTitle sx={{ mb: "2px" }}>New Action</DialogTitle>
      <DialogContent>
        <FormControl variant="outlined" sx={{ m: "3px", width: "98%" }}>
          <InputLabel id="action-label">Action Type</InputLabel>
          <Select
            labelId="action-label"
            value={newAction.actionType ?? ""}
            label="Action Type"
            onChange={handleActionType}
          >
            {actions.map((obj, index) => {
              return (
                <MenuItem key={index} value={obj.text}>
                  {obj.text}
                  {actionFields[obj.text].icon}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
          <CheckBox
            checked={showPicker}
            onChange={(e) => {setShowPicker(e.target.checked)}}
            color="primary"
            sx={{ m: "2px" }}
          />
          {/* <FormLabel  >Custom date</FormLabel> */}
        {showPicker && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ m: "2px" }}
              disableFuture
              closeOnSelect
              size="small"
              value={date || dayjs()}
              label="Start Date"
              onChange={handleChangeDate}
            />
          </LocalizationProvider>
        )}
        {newAction?.actionType && actionFields[newAction.actionType]?.fields}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={newActionFunc}
          role="submit"
          disabled={!newAction.actionType}
        >
          Ok
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
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
