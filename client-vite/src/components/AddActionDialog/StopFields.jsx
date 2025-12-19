import { useState } from "react";
import { useNewAction } from "../../context/NewActionContext";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

const reasons = [
  " ",
  "Hermofrodite",
  "Seeds",
  "Root infectioin",
  "Mildew",
  "Mutation",
  "Virus",
  "Pests",
  "Other",
];

export const StopFields = () => {
  const { addReason } = useNewAction();
  const [reason, setReason] = useState(" ");
  const [userReason, setUserReason] = useState(" ");

  const handlerReason = (e) => {
    const { value } = e.target;
    setReason(value);
    addReason(value);
  };
  const handlerUserReason = (e) => {
    const { value } = e.target;
    setUserReason(value);
    addReason(value);
  };

  return (
    <>
      <FormControl variant="outlined" required sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="reason-label" readOnly={true}>
          Reason
        </InputLabel>
        <Select
          labelId="reason-label"
          value={reason}
          name="reason"
          label="Reason"
          onChange={handlerReason}
        >
          {reasons.map((text, index) => {
            return (
              <MenuItem key={index} value={text}>
                {text}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {reason == "Other" && (
        <FormControl variant="outlined" required sx={{ m: 1, minWidth: 120 }}>
          <TextField
            id="outlined-number"
            label="User variant"
            type="text"
            value={userReason}
            onChange={handlerUserReason}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
      )}
    </>
  );
};
