import { useDispatch, useSelector } from "react-redux";
import { addNote } from "../../store/newActionSlice";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";

const Difficites = ({onChange}) => {
  const difficites = ["N", "P", "K", "Mg", "Ca", "Fe", "S", "Zn", "Mn"];
  const [value, setValue] = useState("");
  const handleChange = (e) => {
    const { value } = e.target;
    setValue(() => value);
    onChange((prev) => ({ ...prev, variant: "Difficite", item: value }));
  };
  return (
    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
      <InputLabel id="DifficiteType-label">Difficite of</InputLabel>
      <Select
        labelId="DifficiteType-label"
        value={value}
        label="Difficite of"
        onChange={handleChange}
      >
        {difficites.map((item, index) => {
          return (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
const Insects = ({onChange}) => {
  const insects = ["Red Spider", "Trips", "Sciaride"];
  const [value, setValue] = useState("");
  const handleChange = (e) => {
    const { value } = e.target;
    setValue(() => value);
    onChange((prev) => ({ ...prev, variant: "Insects", item: value }));
  };
  return (
    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
      <InputLabel id="InsectType-label">Difficite of</InputLabel>
      <Select
        labelId="InsectType-label"
        value={value}
        label="Insect"
        onChange={handleChange}
      >
        {insects.map((item, index) => {
          return (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export const NoteFields = () => {
  const dispatch = useDispatch();
  //const newNote=useSelector((state)=>state.newAction.note)
  const [note, setNote] = useState({});
  const types = {
    Trouble: {
      color: "error",
      text: "Trouble",
      items: {
        Difficite: <Difficites onChange={setNote} />,
        Insects: <Insects onChange={setNote} />,
      },
    },
    Note: {
      color: "succes",
      text: "Note",
      items: [],
    },
  };

  const handleType = (e) => {
    const { value } = e.target;
    setNote((prev)=>({ ...prev,type: value }));
  };
  const handleVariant = (e) => {
    const { value } = e.target;
    setNote((prev) => ({ ...prev, variant: value }));
  };
  useEffect(() => {
    if (note.item) {
      dispatch(addNote(note));
    }
  }, [note]);
  return (
    <Box>
      <FormControl variant="outlined" sx={{ minWidth: 120 }}>
        <InputLabel id="noteType-label">Note Type</InputLabel>
        <Select
          labelId={"noteType-label"}
          value={note?.type || ""}
          label="Type"
          onChange={handleType}
        >
          {Object.getOwnPropertyNames(types).map((type, index) => {
            return (
              <MenuItem key={index} value={types[type].text}>
                {types[type].text}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {note?.type && (
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel id="variant-label">{note.type}</InputLabel>
          <Select
            labelId={"variant-label"}
            value={note?.variant||""}
            label={note.type}
            onChange={handleVariant}
          >
            {Object.getOwnPropertyNames(types[note.type].items).map(
              (item, index) => {
                return (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                );
              }
            )}
          </Select>
        </FormControl>
      )}

      {note?.variant ? types[note.type].items[note.variant] : null}
    </Box>
  );
};
