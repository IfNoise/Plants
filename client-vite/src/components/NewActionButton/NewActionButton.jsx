import { useState, useContext, useEffect} from "react";
import { AddressFields } from "./AddressFields";
import { PickingFields } from "./PickingFields";
import { useMediaQuery, useTheme } from '@mui/material';
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
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { SnackbarContext } from "../../context/SnackbarContext";
import { StopFields } from "./StopFields";
import { NoteFields } from "./NoteFields";
import { CuttingClonesFields } from "./CuttingClonesFields";
import { SetGenderFields } from "./SetGenderFields";

const fabStyle = {
  position: "fixed",
  bottom: 16,
  right: 16,
};

export const NewActionButton = (props) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { setSnack } = useContext(SnackbarContext);
  const getPlants=props.getPlants
  

  const dispatch = useDispatch();
  const currentUser = useSelector((state)=>(state.auth.username))
  const newAction = useSelector((state) => state.newAction);
  const [addAction, { isSuccess, isError}] = useAddActionMutation();
  const [actions,setActions]=useState([])
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
        { text: "SetGender" },
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
      name: "SetGender",
      icon: <CheckBoxIcon />,
      fields: <SetGenderFields />,
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
  // const popoverStyle = isSmallScreen ? {
  //   maxWidth: '100%',
  //   maxHeight: '100%',
  //   top: '50%',
  //   left: '50%',
  //   transform: 'translate(-50%, -50%)',
  //   overflow: 'auto',
  // } : {};
  
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
    const plants=getPlants()
    const state=plants[0].state
    setActions(states.find((obj) => obj.name == state).actions)
    console.log(state);
    setOpen(true)
  }
  const handleCancel = () => {
    dispatch(clear());
    setOpen(false);
  };
  const newActionFunc = () => {
    const plants=getPlants()
    console.log(plants);
    const id =plants.map((plant)=>(plant._id))
    console.log(id);
    const body = { id, action: newAction };
    addAction(body);
    dispatch(clear())
    setOpen(false);
  };

  return (
    <>
      <Fab
        {...props} 
        id="action_button"
        onClick={handleOpen}
        sx={fabStyle}
        aria-label="New Action"
        color="primary"
      >
        <AddIcon />
      </Fab>
      <Popover
        sx={{ml:3}}
        
        id="action_popover"
        open={open}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Typography sx={{ m:1 }} gutterBottom variant="h5" component="div">
          New Action
        </Typography>
        <FormControl variant="outlined" sx={{ mx: 1,width:'280px'}}>
          
            <InputLabel id="action-label">Action Type</InputLabel>
            <Select
              labelId="action-label"
              value={newAction.actionType ?? ""}
              label="Action Type"
              onChange={handleActionType}
            >
              {actions?.map((obj, index) => {
                return (
                  <MenuItem key={index} value={obj.text}>
                    {obj.text}
                    {actionFields.find((res) => res.name === obj.text).icon}
                  </MenuItem>
                );
              })}
            </Select>
            </FormControl>
            {newAction.actionType &&
              actionFields.find((res) => res.name === newAction.actionType)
                .fields}
          <Stack sx={{m:1, width: 280 }} spacing={3}>
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
  getPlants: PropTypes.func
};
