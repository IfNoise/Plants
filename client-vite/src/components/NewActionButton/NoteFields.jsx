import { useDispatch,useSelector } from "react-redux";
import { addNoteType} from "../../store/newActionSlice";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
const types={
  Trouble:{
    color:'error',
    text:'Trouble',
    items:{
      Difficite:{

      },
      Insects:{},

    },

  },
  Note:{
    color:'succes',
    text:'Note',
    items:{}
  },
}
export const NoteFields = () => {
  const dispatch = useDispatch();
  const note=useSelector((state)=>state.newAction.note)
  const handleType = (e) => {
    const {value}=e.target    
      dispatch(addNoteType(value))
  };
  return (
    <Box>
      <FormControl variant="outlined" sx={{ minWidth: 120 }}>
        <InputLabel id="noteType-label">Note Type</InputLabel>
        <Select
          labelId="noteType-label"
          value={note?.type||""}
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
    </Box>
  );
};