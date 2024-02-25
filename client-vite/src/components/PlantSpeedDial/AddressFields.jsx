import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBuilding,
  addRoom,
  addRow,
  addRack,
  addTray,
  addNumber,
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



export const AddressFields = () => {
  const dispatch = useDispatch();
  const newAction = useSelector((state) => state.newAction);
  const [rooms, setRooms] = useState([]);
  
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

  const handlerNumber = (e) => {
    const { value } = e.target;
    dispatch(addNumber(Number.parseInt(value)));
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
      <TextField
        id="outlined-number"
        sx={{ m: "2px", width: "98%" }}
        label="Number"
        type="number"
        onChange={handlerNumber}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </>
  );
};
