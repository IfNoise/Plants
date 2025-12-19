import { useNewAction } from "../../context/NewActionContext";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export const SetGenderFields = () => {
  const { newAction, addGender } = useNewAction();
  const gender = newAction.gender
  const variants = ["Male", "Female","Herm."];
  const handleInput = (e) => {
    const {value}=e.target    
      addGender(value)
  };
  return (
    <Box>
      <FormControl variant="outlined" sx={{ minWidth: 120 }}>
        <InputLabel id="gender-label">Gender</InputLabel>
        <Select
          labelId="gender-label"
          value={gender}
          label="Gender"
          onChange={handleInput}
        >
          {variants.map((text, index) => {
            return (
              <MenuItem key={index} value={text}>
                {text}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};