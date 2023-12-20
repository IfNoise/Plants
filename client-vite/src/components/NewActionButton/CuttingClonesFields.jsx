import { useDispatch} from "react-redux";
import {

  addClonesNumber,
} from "../../store/newActionSlice";
import {
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
        <TextField
      id="clones-number"
      label="Number"
      type="number"
      onChange={handlerClonesNumber}
      InputLabelProps={{
        shrink: true,
      }}
    />
    <AddressFields/>
    </>
  )
}