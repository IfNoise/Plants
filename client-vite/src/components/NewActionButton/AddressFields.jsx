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
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

const buildRooms = [
  {
    text: "Hangar 1",
    rooms: ["Main room", "Laboratory"],
  },
  {
    text: "Hangar 2",
    rooms: ["Main room", "Small Room"],
  },
];

export const AddressFields = () => {
  const dispatch = useDispatch();
  const newAction = useSelector((state) => state.newAction);
  const [id, setId] = useState(0);

  const handlerBuilding = (e) => {
    const { value } = e.target;
    setId(value);
    dispatch(addBuilding(buildRooms[value].text));
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
    dispatch(addBuilding(buildRooms[id].text));
  }, []);
  return (
    <>
        <InputLabel id="building-label">Building</InputLabel>
        <Select
          labelId="building-label"
          value={id}
          sx={{m:1}}
          name="building"
          label="Building"
          onChange={handlerBuilding}
          InputLabelProps={{
            shrink: true,
          }}
        >
          {buildRooms.map((obj, index) => {
            return (
              <MenuItem key={index} value={index}>
                {obj.text}
              </MenuItem>
            );
          })}
        </Select>

        <InputLabel id="room-label">Room</InputLabel>
        <Select
          labelId="room-label"
          name="room"
          value={newAction.address?.room  ?? ''}
          label="Room"
          onChange={handlerRoom}
          InputLabelProps={{
            shrink: true,
          }}
        >
          {buildRooms[id].rooms.map((text, index) => {
            return (
              <MenuItem key={index} value={text}>
                {text}
              </MenuItem>
            );
          })}
        </Select>
      {newAction.address?.room != "Laboratory" && (
        <>

            <TextField
              id="outlined-number"
              label="Row"
              type="number"
              onChange={handlerRow}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              id="outlined-number"
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
              label="Rack"
              type="number"
              onChange={handlerRack}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="outlined-number"
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
