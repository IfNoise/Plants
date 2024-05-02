import { useContext, useEffect, useState } from "react";
import { useGetPrintersQuery } from "../store/printApi";
import { PrinterContext } from "../context/PrinterContext";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, MenuItem } from "@mui/material";


export default function PrintDialog() {
  const { printDialog,setPrintDialog} = useContext(PrinterContext);
  const { data ,refetch} = useGetPrintersQuery({refetchOnMountOrArgChange: true, refetchOnFocus: true});
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [printers, setPrinters] = useState([]);
  useEffect(()=>{
    refetch()
  
  },[])

  useEffect(() => {
    if (data) {
      console.log(data)
      setPrinters(data);
    }
  }, [data]);
  
  
  return (
    <Dialog fullScreen open={printDialog.open}>
      <DialogTitle>Select Printer</DialogTitle>
      <DialogContent>
        {printers.length>0 &&<Select
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
      <DialogActions>
        <Button onClick={()=>{
          setPrintDialog({ onChange:()=>{}, open: false });
          }}>Cancel</Button>
        <Button disabled={selectedPrinter===""} onClick={()=>{
          printDialog.onChange(selectedPrinter)
        }}>Print</Button>
      </DialogActions>
    </Dialog>
  );
}
