import { useDispatch} from "react-redux";
import {

  addClonesNumber,
} from "../../store/newActionSlice";
import {
  FormControl,
  TextField,
} from "@mui/material";
import { AddressFields } from "./AddressFields";

export const CuttingClonesFields=()=>{
  const dispatch=useDispatch()

  const handlerClonesNumber = (e) => {
    const { value } = e.target;
    dispatch(addClonesNumber(Number.parseInt(value)));
  }
  return (
    <>
    <FormControl variant="outlined" >
      <TextField
      sx={{ m: 1,width:'280px'}}
      id="clones-number"
      label="Number"
      type="number"
      onChange={handlerClonesNumber}
      InputLabelProps={{
        shrink: true,
      }}
    />
    </FormControl>
    <AddressFields/>
    </>
  )
}