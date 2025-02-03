import { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewState } from "../../store/newActionSlice";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const states = ["Cloning", "Growing", "Blooming", "MotherPlant", "Harvested"];

export const RedoFields = () => {
  const dispatch = useDispatch();
  const [newState, setNewState] = useState("Growing");

  const handlerNewState = (e) => {
    const { value } = e.target;
    setNewState(value);
    dispatch(addNewState(value));
  };

  return (
    <>
      <FormControl variant="outlined" required sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="reason-label" readOnly={true}>
          Reason
        </InputLabel>
        <Select
          labelId="reason-label"
          value={newState}
          name="reason"
          label="Reason"
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
