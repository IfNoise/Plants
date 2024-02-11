import { PropTypes } from "prop-types";
import {
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  FormControl,
  InputLabel,
  Select,
  Button,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useContext } from "react";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import CancelIcon from "@mui/icons-material/Cancel";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { usePrintPlantsMutation } from "../../store/printApi";
import { useAddActionMutation } from "../../store/plantsApi";

import { useAddToTrayMutation } from "../../store/trayApi";
import { useClearTrayMutation } from "../../store/trayApi";
import { usePrintTrayMutation } from "../../store/printApi"

import { useDispatch, useSelector } from "react-redux";
import { SnackbarContext } from "../../context/SnackbarContext";
import { StopFields } from "./StopFields";
import { NoteFields } from "./NoteFields";
import { CuttingClonesFields } from "./CuttingClonesFields";
import { SetGenderFields } from "./SetGenderFields";
import { PickingFields } from "./PickingFields";
import { AddressFields } from "./AddressFields";
import { useState,useEffect } from "react";
import { addType, addAuthor, clear } from "../../store/newActionSlice";

const states = {
  Germination :{
    actions: [
      { text: "Note" },
      { text: "Picking" },
      { text: "Relocation" },
      { text: "Stop" },
    ],
  },
  Cloning:{
    actions: [
      { text: "Note" },
      { text: "Picking" },
      { text: "Relocation" },
      { text: "Stop" },
    ],
  },
  Growing:{
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
  Blooming:{
    actions: [
      { text: "Note" },
      { text: "Relocation" },
      { text: "Stop" },
      { text: "Harvest" },
    ],
  },
  Stopped:{
    actions: [{ text: "Note" }],
  },
  Harvested:{
    actions: [{ text: "Note" }],
  },
  MotherPlant:{
    actions: [
      { text: "Note" },
      { text: "Picking" },
      { text: "Relocation" },
      { text: "CuttingClones" },
      { text: "Blooming" },
      { text: "Stop" },
    ],
  },
};
const actionFields = {
  Note:{
    name: "Note",
    icon: <NoteAddIcon />,
    fields: <NoteFields />,
  },
  Picking:{
    name: "Picking",
    icon: <NoteAddIcon />,
    fields: <PickingFields />,
  },
  Relocation:{
    name: "Relocation",
    icon: <ArrowOutwardIcon />,
    fields: <AddressFields />,
  },
  SetGender:{
    name: "SetGender",
    icon: <CheckBoxIcon />,
    fields: <SetGenderFields />,
  },
  Blooming:{
    name: "Blooming",
    icon: <LocalFloristIcon />,
  },
  Stop:{
    name: "Stop",
    icon: <CancelIcon color="error" />,
    fields: <StopFields />,
  },
  Harvest:{
    name: "Harvest",
    icon: <ArrowOutwardIcon />,
  },
  MakeMother:{
    name: "MakeMother",
    icon: <ArrowOutwardIcon />,
  },
  CuttingClones:{
    name: "CuttingClones",
    icon: <ContentCutIcon />,
    fields: <CuttingClonesFields />,
  },
};

export default function PlantSpeedDial(props) {
  const { setSnack } = useContext(SnackbarContext);
  const dispatch = useDispatch();
  const currentUser = useSelector((state)=>(state.auth.username))
  const newAction = useSelector((state) => state.newAction);
  const [addAction, { isSuccess, isError}] = useAddActionMutation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [addToTray] = useAddToTrayMutation();
  const [printPlants] = usePrintPlantsMutation();
  const [clearTray]=useClearTrayMutation()
  const [printTray]=usePrintTrayMutation()

  //const [actions,setActions]=useState([])
  const [open, setOpen] = useState(false);
  const plants=props?.plants||[]
  const getPlants=props?.getPlants||(()=>plants)
  console.log(plants);
  const state=getPlants[0]?.state||'Cloning'
  console.log(state);
  const actions=states[state].actions

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
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      setSnack({ open: true, severity: "success", message: "Action is added" });
    }
  }, [isSuccess]);


  const handleActionType = (e) => {
    const { value } = e.target;
    if (newAction) {
      dispatch(clear());
    }
    dispatch(addType(value));
  };
  const handleOpen=()=>{
    if(plants.length<1){
      setSnack({ open: true, severity: "error", message: "No plants selected" });
      return
    }
    setOpen(true)
  }

  const handleCancel = () => {
    dispatch(clear());
    setOpen(false);
  };

  const newActionFunc = () => {
    const body = { plants, action: newAction };
    addAction(body);
    dispatch(clear())
    setOpen(false);
  };
  return (
    <>
      <SpeedDial
        ariaLabel="Plant Action SpeedDial"
        hidden={(!props.show)&& getPlants().length === 0}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {props.addAction && (
          <SpeedDialAction
            key="Add"
            icon={<AddIcon />}
            tooltipTitle="Add new action"
            onClick={handleOpen}
          />
        )}
        {props.print && (
          <SpeedDialAction
            key="Print"
            icon={<PrintIcon />}
            tooltipTitle="Print"
            onClick={() => {
              const plants = props.getPlants();
              if(plants.length<1){
                setSnack({ open: true, severity: "error", message: "No plants selected" });
                return
              }
              printPlants({plants});
            }}
          />
        )}
        {props.addToTray && (
          <SpeedDialAction
            key="Add to tray"
            icon={<CreateNewFolderIcon />}
            tooltipTitle="Add to tray"
            onClick={() => {
            const plants = getPlants()
              if(plants.length<1){
                setSnack({ open: true, severity: "error", message: "No plants selected" });
                return
              }
              addToTray(plants);
            }}
          />
        )}
        {props.printTray && (
          <SpeedDialAction
            key="Print tray items "
            icon={<PrintIcon />}
            tooltipTitle="Print tray items"
            onClick={() => {
              printTray();  
            }}
          />
        )}
        {props.clearTray && (
          <SpeedDialAction
            key="Clear tray items  "
            icon={<DeleteIcon />}
            tooltipTitle=" Clear tray"
            onClick={() => {
              clearTray();  
            }}
          />
        )}
      </SpeedDial>
      <Dialog
        sx={{ width:{md:"30%"},justifyContent:'center'}}
        id="action_popover"
        fullScreen={isSmall} 
        fullWidth={true}
        maxWidth="md"
        open={open}
        onClose={handleCancel}
      >
        <DialogTitle sx={{mb:"2px"}}>New Action</DialogTitle>
        <DialogContent>
          <FormControl variant="outlined" sx={{m:'3px', width: "98%" }}>
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
          {newAction.actionType && actionFields[newAction.actionType].fields}
        </DialogContent>
        <DialogActions sx={{justifyContent:'center'}}>
          <Button onClick={newActionFunc} disabled={!newAction.actionType}>
            Ok
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
PlantSpeedDial.propTypes = {
  getPlants: PropTypes.func,
  plants: PropTypes.array,
  show: PropTypes.bool,
  addAction: PropTypes.bool,
  print: PropTypes.bool,
  addToTray: PropTypes.bool,
  printTray: PropTypes.bool,
  clearTray: PropTypes.bool,
};
