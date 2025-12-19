import { useNewAction } from "../../context/NewActionContext";
import {
  FormControl,
  TextField,
} from "@mui/material";
import { AddressFields } from "./AddressFields";

export const CuttingClonesFields=()=>{
  const { addClonesNumber } = useNewAction()

  const handlerClonesNumber = (e) => {
    const { value } = e.target;
    addClonesNumber(Number.parseInt(value));
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