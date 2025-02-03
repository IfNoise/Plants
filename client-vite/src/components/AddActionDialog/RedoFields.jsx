import { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewState } from "../../store/newActionSlice";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const states = ["Cloning", "Growing", "Blooming", "MotherPlant", "Harvested"];

export const RedoFields = () => {
  const dispatch = useDispatch();
  const [newState, setNewState] = useState("");

  const handlerNewState = (e) => {
    const { value } = e.target;
    setNewState(value);
    dispatch(addNewState(value));
  };

  return (
    <>
      <FormControl variant="outlined" required sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="newState-label" readOnly={true}>
          new State
        </InputLabel>
        <Select
          labelId="newState-label"
          value={newState}
          name="newState"
          label="newState"
          onChange={handlerNewState}
        >
          {states.map((text, index) => {
            return (
              <MenuItem key={index} value={text}>
                {text}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </>
  );
};
