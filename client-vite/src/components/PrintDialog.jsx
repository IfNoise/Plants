import { useContext, useEffect, useState } from "react";
import { useGetPrintersQuery } from "../store/printApi";
import { PrinterContext } from "../context/PrinterContext";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, MenuItem } from "@mui/material";


export default function PrintDialog() {
  const { printDialog,setPrintDialog} = useContext(PrinterContext);
  const [open, setOpen] = useState(printDialog.open);
  const { data } = useGetPrintersQuery();
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [printers, setPrinters] = useState([]);
  
  useEffect(() => {
    if (data) {
      setPrinters(data);
    }
  }, [data]);
  
  
  return (
    <Dialog open={open}>
      <DialogTitle>Select Printer</DialogTitle>
      <DialogContent>
        <Select
          value={selectedPrinter}
          onChange={(e) => setSelectedPrinter(e.target.value)}
        >
          {printers.map((printer) => (
            <MenuItem key={printer.name} value={printer.name}>
              {printer.name}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>{
          setOpen(false)
          setPrintDialog({ onChange:()=>{}, open: false });
          }}>Cancel</Button>
        <Button disabled={selectedPrinter!==""} onClick={()=>{
          printDialog.onChange(selectedPrinter)
        }}>Print</Button>
      </DialogActions>
    </Dialog>
  );
}

