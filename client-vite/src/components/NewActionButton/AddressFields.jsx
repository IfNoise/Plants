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

const buildRooms = [
  {
    text: "Hangar 1",
    rooms: ["Main room", "Laboratory"],
  },
  {
    text: "Hangar 2",
    rooms: ["Main room", "Small Room"],
  },
  {
    text: "Outdoor",
    rooms: ["Backyard"],
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
    <>  <FormControl variant="outlined" component='div' sx={{ m: 1, width: '280px'}}>
        <InputLabel id="building-label">Building</InputLabel>
        <Select
          labelId="building-label"
          value={id}
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
        </FormControl>
        <FormControl variant="outlined" component='div' sx={{ m:1,width: '280px'}}>
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
        </FormControl>
      {newAction.address?.room != "Laboratory" && (
        < >

            <TextField
              id="outlined-number"
              sx={{ m: 1,width: '200px'}}
              label="Row"
              type="number"
              onChange={handlerRow}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              id="outlined-number"
              sx={{ m: 1,width: '200px'}}
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
        <div>

            <TextField
              id="outlined-number"
              sx={{ m: 1,width: '150px'}}
              label="Rack"
              type="number"
              onChange={handlerRack}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="outlined-number"
              sx={{ mx: 1,width: '150px'}}
              label="Shelf"
              type="number"
              onChange={handlerShelf}
              InputLabelProps={{
                shrink: true,
              }}
            />

        </div>
      )}
      <div>
        <TextField
          id="outlined-number"
          sx={{ m: 1,width: '120px'}}
          label="Number"
          type="number"
          onChange={handlerNumber}
          InputLabelProps={{
            shrink: true,
          }}
        />
</div>
    </>
  );
};
