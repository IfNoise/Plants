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
  Box,
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
    dispatch(addBuilding("Hangar"));
    setRooms(buildRooms[newAction.address?.building ?? "Hangar"]);
  }, []);

  return (
    <Box>
      <Box
        sx={{
          m: "7px",
          border: "1px solid ",
          borderRadius: "3px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Scanner output={dispatchAddress} />
      </Box>
      <FormControl variant="outlined" sx={{ m: "7px", width: "auto" }}>
        <InputLabel id="building-label">Building</InputLabel>
        <Select
          labelId="building-label"
          value={newAction.address?.building ?? ""}
          name="building"
          label="Building"
          onChange={handlerBuilding}
        >
          {Object.keys(buildRooms).map((obj, index) => (
            <MenuItem key={index} value={obj}>
              {obj}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" sx={{ m: "7px", width: "200px" }}>
        <InputLabel id="room-label">Room</InputLabel>
        <Select
          labelId="room-label"
          name="room"
          value={newAction.address?.room ?? ""}
          label="Room"
          onChange={handlerRoom}
        >
          {rooms?.map((text, index) => (
            <MenuItem key={index} value={text}>
              {text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {newAction.address?.room && newAction.address?.room !== "Laboratory" && (
        <>
          <TextField
            id="outlined-number"
            sx={{ m: "7px", width: "70px" }}
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
            sx={{ m: "7px", width: "70px" }}
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
      {newAction.address?.room === "Laboratory" && (
        <>
          <TextField
            id="outlined-number"
            sx={{ m: "7px", width: "70px" }}
            label="Tray"
            value={newAction.address?.tray ?? ""}
            type="number"
            disabled={newAction.address?.rack}
            onChange={handlerTray}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="outlined-number"
            sx={{ m: "7px", width: "70px" }}
            label="Rack"
            value={newAction.address?.rack ?? ""}
            type="number"
            disabled={newAction.address?.tray}
            onChange={handlerRack}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="outlined-number"
            sx={{ m: "7px", width: "70px" }}
            label="Shelf"
            error={newAction.address?.shelf < 1}
            required={newAction.address?.rack}
            value={newAction.address?.shelf ?? ""}
            type="number"
            onChange={handlerShelf}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </>
      )}
    </Box>
  );
};
