import { useState, useContext, useEffect} from "react";
import { AddressFields } from "./AddressFields";
import { PickingFields } from "./PickingFields";
import { useDispatch, useSelector } from "react-redux";
import { addType, addAuthor, clear } from "../../store/newActionSlice";
import { useAddActionMutation } from "../../store/plantsApi";
import PropTypes from "prop-types";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Fab,
  Popover,
  Typography,
} from "@mui/material";

import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import CancelIcon from "@mui/icons-material/Cancel";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import AddIcon from "@mui/icons-material/Add";

import { SnackbarContext } from "../../context/SnackbarContext";
import { StopFields } from "./StopFields";
import { NoteFields } from "./NoteFields";
import { CuttingClonesFields } from "./CuttingClonesFields";

const fabStyle = {
  position: "fixed",
  bottom: 16,
  right: 16,
};

export const NewActionButton = (props) => {
  //const theme = useTheme();
  const { setSnack } = useContext(SnackbarContext);
  const id = props.id;
  const state = props.state;
  const dispatch = useDispatch();
  const currentUser = useSelector((state)=>(state.auth.username))
  const newAction = useSelector((state) => state.newAction);
  const [addAction, { isSuccess, isError}] = useAddActionMutation();
  const [open, setOpen] = useState(false);
  const [anchor,setAnchor]=useState(null)
  const states = [
    {
      name: "Germination",
      actions: [
        { text: "Note" },
        { text: "Picking" },
        { text: "Relocation" },
        { text: "Stop" },
      ],
    },
    {
      name: "Cloning",
      actions: [
        { text: "Note" },
        { text: "Picking" },
        { text: "Relocation" },
        { text: "Stop" },
      ],
    },
    {
      name: "Growing",
      actions: [
        { text: "Note" },
        { text: "Picking" },
        { text: "Relocation" },
        { text: "Blooming" },
        { text: "MakeMother" },
        { text: "Stop" },
      ],
    },
    {
      name: "Blooming",
      actions: [
        { text: "Note" },
        { text: "Relocation" },
        { text: "Stop" },
        { text: "Harvest" },
      ],
    },
    {
      name: "Stopped",
      actions: [{ text: "Note" }],
    },
    {
      name: "Harvested",
      actions: [{ text: "Note" }],
    },
    {
      name: "MotherPlant",
      actions: [
        { text: "Note" },
        { text: "Picking" },
        { text: "Relocation" },
        { text: "CuttingClones" },
        { text: "Blooming" },
        { text: "Stop" },
      ],
    },
  ];
  const actionFields = [
    {
      name: "Note",
      icon: <NoteAddIcon />,
      fields: <NoteFields />,
    },
    {
      name: "Picking",
      icon: <NoteAddIcon />,
      fields: <PickingFields />,
    },
    {
      name: "Relocation",
      icon: <ArrowOutwardIcon />,
      fields: <AddressFields />,
    },
    {
      name: "Blooming",
      icon: <LocalFloristIcon />,
    },
    {
      name: "Stop",
      icon: <CancelIcon color="error" />,
      fields: <StopFields />,
    },
    {
      name: "Harvest",
      icon: <ArrowOutwardIcon />,
    },
    {
      name: "MakeMother",
      icon: <ArrowOutwardIcon />,
    },
    {
      name: "CuttingClones",
      icon: <ContentCutIcon />,
      fields: <CuttingClonesFields />,
    },
  ];
const actions = states.find((obj) => obj.name == state).actions;
  useEffect(() => {
    if (newAction) {
      dispatch(clear());
      dispatch(addAuthor(currentUser));
    }
  }, []);
  
  useEffect(() => {
    if (isError) {
      setSnack({ open: true, severity: "error", message: 'error'});
    }
  }, [isError,setSnack]);

  useEffect(() => {
    if (isSuccess) {
      setSnack({ open: true, severity: "success", message: "Action is added" });
    }
  }, [isSuccess,setSnack]);

  const handleActionType = (e) => {
    const { value } = e.target;
    if (newAction) {
      dispatch(clear());
    }
    dispatch(addType(value));
  };
  const handleOpen=(e)=>{
    setAnchor(e.target)
    setOpen(true)
  }
  const handleCancel = () => {
    dispatch(clear());
    setOpen(false);
  };
  const newActionFunc = () => {
    const body = { id, action: newAction };
    addAction(body);
    setOpen(false);
  };

  return (
    <>
      <Fab
        id="action_button"
        onClick={handleOpen}
        sx={fabStyle}
        aria-label="New Action"
        color="primary"
      >
        <AddIcon />
      </Fab>
      <Popover
        id="action_popover"
        open={open}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Typography sx={{ p: 2 }} gutterBottom variant="h5" component="div">
          New Action
        </Typography>
        <Stack sx={{ p: 2, width: 300 }} spacing={2}>
          <FormControl variant="outlined" sx={{ m: 2, minWidth: 200 }}>
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
                    {actionFields.find((res) => res.name === obj.text).icon}
                  </MenuItem>
                );
              })}
            </Select>

            {newAction.actionType &&
              actionFields.find((res) => res.name === newAction.actionType)
                .fields}
          </FormControl>
          <Button onClick={newActionFunc} disabled={!newAction.actionType}>
            Ok
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Stack>
      </Popover>
    </>
  );
};
NewActionButton.propTypes = {
  id: PropTypes.array,
  state: PropTypes.string,
};
