import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
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
import Scanner from "../Scanner/Scanner";

const fieldsActions = {
  bulding: addBuilding,
  room: addRoom,
  row: addRow,
  rack: addRack,
  tray: addTray,
  shelf: addShelf,
};

export const AddressFields = () => {
  const dispatch = useDispatch();
  const newAction = useSelector((state) => state.newAction);
  const [rooms, setRooms] = useState([]);

  const dispatchAddress = (address) => {
    setRooms(buildRooms[address.building]);
    dispatch(addAddress(address));
  };

  const fieldHandler = (e) => {
    const { value, name } = e.target;
    if (typeof value == String) dispatch(fieldsActions[name](value));
    else if (typeof value == Number)
      dispatch(fieldsActions[name](Number.parseInt(value)));
  };
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
      <Scanner output={dispatchAddress} />
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
            value={newAction.address?.row ?? ""}
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
            value={newAction.address?.tray ?? ""}
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
            label="Tray"
            value={newAction.address?.tray ?? ""}
            type="number"
            onChange={handlerTray}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="outlined-number"
            sx={{ m: "2px", width: "98%" }}
            label="Rack"
            value={newAction.address?.rack ?? ""}
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
            value={newAction.address?.shelf ?? ""}
            type="number"
            onChange={handlerShelf}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </>
      )}
    </>
  );
};
