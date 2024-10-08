import { useContext, useEffect, useState } from "react";
import { useGetPrintersQuery } from "../store/printApi";
import { PrinterContext } from "../context/PrinterContext";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, MenuItem, CircularProgress, Alert } from "@mui/material";


export default function PrintDialog() {
  const { printDialog,setPrintDialog} = useContext(PrinterContext);
  const { data ,isError,isLoading} = useGetPrintersQuery({refetchOnMountOrArgChange: true, refetchOnFocus: true});
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [printers, setPrinters] = useState([]);

  useEffect(() => {
    if (data) {
      setPrinters(data);
    }
  }, [data]);
  
  
  return (
    <Dialog 
    sx={{textAlign:"center"}}
    open={printDialog.open}>
      <DialogTitle>Select Printer</DialogTitle>
      <DialogContent>
        {isLoading && <CircularProgress/>}
        {isError && <Alert severity="error">Error fetching printers</Alert>}
        {printers.length>0 &&
        <Select
          sx={{ width: "200px" }}
          value={selectedPrinter}
          onChange={(e) => setSelectedPrinter(e.target.value)}
        >
          {printers.map((printer,i) => (
            <MenuItem key={i} value={printer}>
              {printer}
            </MenuItem>
          ))}
        </Select>}
      </DialogContent>
      <DialogActions sx={{alignContent:"center"}}>
        <Button onClick={()=>{
          setPrintDialog({ onChange:()=>{}, open: false });
          }}>Cancel</Button>
        <Button disabled={selectedPrinter===""} onClick={()=>{
          printDialog.onChange(selectedPrinter)
          setPrintDialog({ onChange:()=>{}, open: false });
        }}>Print</Button>
      </DialogActions>
    </Dialog>
  );
}

