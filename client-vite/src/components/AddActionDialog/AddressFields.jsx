import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBuilding,
  addRoom,
  addRow,
  addRack,
  addTray,
  addShelf,
} from "../../store/newActionSlice";
import {
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControl,
} from "@mui/material";

import { buildRooms } from "../../config/config";
import AddressScanner from "../AddressScanner/AddressScanner";

const fieldsActions={
  bulding:addBuilding,
  room:addRoom,
  row:addRow,
  rack:addRack,
  tray:addTray,
  shelf:addShelf
}


export const AddressFields = () => {
  const dispatch = useDispatch();
  const newAction = useSelector((state) => state.newAction);
  const [rooms, setRooms] = useState([]);
  
  const setAddress = (address) => {
    Object.keys(address).forEach((key) => {
      if (key === "building") {
        dispatch(addBuilding(address[key]));
        setRooms(buildRooms[address[key]]);
      }else if (key === "room") {
        dispatch(addRoom(address[key]));
      }else if (key === "row") {
        dispatch(addRow(address[key]));
      }
      else if (key === "rack") {
        dispatch(addRack(address[key]));
      }
      else if (key === "tray") {
        dispatch(addTray(address[key]));
      }
      else  if (key === "shelf") {
        dispatch(addShelf(address[key]));
      }
  })}
  const fieldHandler=(e)=>{
    const { value, name } = e.target;
    if(typeof(value)==String)dispatch(fieldsActions[name](value))
      else if(typeof(value)==Number)dispatch(fieldsActions[name](Number.parseInt(value)))
  }
  const handlerBuilding = (e) => {
    const { value } = e.target;
    dispatch(addBuilding(value));
    setRooms(buildRooms[value]);
  };

  const handlerRoom = (e) => {
    const { value } = e.target;
    dispatch(addRoom(value));
  };

  const handlerRow = (e) => {
    const { value } = e.target;
    dispatch(addRow(Number.parseInt(value)));
  };

  const handlerRack = (e) => {
    const { value } = e.target;
    dispatch(addRack(Number.parseInt(value)));
  };

  const handlerTray = (e) => {
    const { value } = e.target;
    dispatch(addTray(Number.parseInt(value)));
  };


  const handlerShelf = (e) => {
    const { value } = e.target;
    dispatch(addShelf(Number.parseInt(value)));
  };

  useEffect(() => {
    dispatch(addBuilding("Hangar1"));
    setRooms(buildRooms[newAction.address?.building ?? "Hangar1"]);
  }, []);

  return (
    <>
      <AddressScanner setOutput={setAddress} /> 
      <FormControl variant="outlined" sx={{ m: "2px", width: "98%" }}>
        <InputLabel id="building-label">Building</InputLabel>
        <Select
          labelId="building-label"
          value={newAction.address?.building ?? ""}
          name="building"
          label="Building"
          onChange={handlerBuilding}
          InputLabelProps={{
            shrink: true,
          }}
        >
          {Object.keys(buildRooms).map((obj, index) => {
            return (
              <MenuItem key={index} value={obj}>
                {obj}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl variant="outlined" sx={{ m: "2px", width: "98%" }}>
        <InputLabel id="room-label">Room</InputLabel>
        <Select
          labelId="room-label"
          name="room"
          value={newAction.address?.room ?? ""}
          label="Room"
          onChange={handlerRoom}
          InputLabelProps={{
            shrink: true,
          }}
        >
          {rooms.map((text, index) => {
            return (
              <MenuItem key={index} value={text}>
                {text}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {newAction.address?.room != "Laboratory" && (
        <>
          <TextField
            id="outlined-number"
            sx={{ m: "2px", width: "98%" }}
            label="Row"
            type="number"
            onChange={handlerRow}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            id="outlined-number"
            sx={{ m: "2px", width: "98%" }}
            label="Tray"
            type="number"
            onChange={handlerTray}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </>
      )}
      {newAction.address?.room == "Laboratory" && (
        <>
          <TextField
            id="outlined-number"
            sx={{ m: "2px", width: "98%" }}
            label="Rack"
            type="number"
            onChange={handlerRack}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="outlined-number"
            sx={{ mx: "2px", width: "98%" }}
            label="Shelf"
            type="number"
            onChange={handlerShelf}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </>
      )}
    </>
  )
}
