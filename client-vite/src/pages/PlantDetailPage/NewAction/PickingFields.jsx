import { useDispatch,useSelector } from "react-redux";
import { addPotSize } from "../../../store/newActionSlice";
import PropTypes from "prop-types";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export const PickingFields = () => {
  const dispatch = useDispatch();
  const potSize=useSelector((state)=>state.newAction.potSize)
  const pots = ["0,25 L", "1 L", "4 L", "7 L", "Slab"];
  const handleInput = (e) => {
    const {value}=e.target    
      dispatch(addPotSize(value))
  };
  return (
    <Box>
      <FormControl variant="outlined" sx={{ minWidth: 120 }}>
        <InputLabel id="potsize-label">Pot Size</InputLabel>
        <Select
          labelId="potsize-label"
          value={potSize}
          label="Pot Size"
          onChange={handleInput}
        >
          {pots.map((text, index) => {
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
PickingFields.propTypes = {
  output: PropTypes.func,
};