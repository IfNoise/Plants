import { useState, useContext,useEffect } from "react";
import { AddressFields } from "./AddressFields";
import { PickingFields } from "./PickingFields";
import { useDispatch,useSelector } from "react-redux";
import { addType,addAuthor,clear } from "../../../store/newActionSlice";
import { useAddActionMutation } from "../../../store/plantsApi"
import PropTypes from "prop-types";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";

import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import CancelIcon from "@mui/icons-material/Cancel";
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { SnackbarContext } from "../../../context/SnackbarContext";
import { StopFields } from "./StopFields";
import { NoteFields } from "./NoteFields";
import { CuttingClonesFields } from "./CuttingClonesFields";
import { selectCurrentUser } from "../../../store/authSlice";

export const NewAction = (props) => {
  //const theme = useTheme();
  const { setSnack } = useContext(SnackbarContext);
  const id = props.id;
  const state = props.state;
  const handleOk = props.handleOk;
  const [actions, setActions] = useState([]);
  const dispatch = useDispatch();
  const currentUser= selectCurrentUser(state)
  const newAction=useSelector((state)=>state.newAction)
  const [addAction,{isSuccess,isError,result}]=useAddActionMutation()
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
        { text: "CuttingClones"},
        { text: "Blooming" },
        { text: "Stop" },
      ],
    },
  ];
  const actionFields = [
    {
      name: "Note",
      icon: <NoteAddIcon />,
      fields: <NoteFields/>,
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
      fields:<StopFields />
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
      icon: <ContentCutIcon/>,
      fields:<CuttingClonesFields/>
    }
  ];
  useEffect(() => {
    const actualActions = states.find((obj) => obj.name == state).actions;
    setActions(actualActions);
    if(newAction)
    {
      dispatch(clear());
      dispatch(addAuthor(currentUser))
    }
  }, []);
 useEffect(()=>{
  setSnack({ open: true, severity: "error", message: result});
 },[isError])
 useEffect(()=>{
  setSnack({ open: true, severity: "success", message: "Action is added" });
 },[isSuccess])


  const handleActionType = (e) => {
    const { value } = e.target;
    if(newAction)
    {dispatch(clear())}
    dispatch(addType(value))
    
  };
  const handleCancel=()=>{
    dispatch(clear())
    handleOk()
  }
  const newActionFunc = () => {
      const body={id,action:newAction}
      addAction(body)
      handleOk()
  }

  return (
    <Stack sx={{ p: 2, width: 300 }} spacing={2}>
      <FormControl variant="outlined" sx={{m:2, minWidth: 200 }}>
        <InputLabel id="action-label">Action Type</InputLabel>
        <Select
          labelId="action-label"
          value={newAction.actionType ??''}
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
        actionFields.find((res) => res.name === newAction.actionType).fields
      
      }
      </FormControl>
      <Button onClick={newActionFunc} disabled={!newAction.actionType}>
        Ok
      </Button>
      <Button onClick={handleCancel}>Cancel</Button>
    </Stack>
  );
};
NewAction.propTypes = {
  id: PropTypes.array,
  state: PropTypes.string,
  handleOk: PropTypes.func,
};
