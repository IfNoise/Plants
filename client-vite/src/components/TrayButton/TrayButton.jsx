import { Badge, IconButton,Alert,CircularProgress, Popover, Stack } from "@mui/material";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import { useClearTrayMutation, useGetTrayQuery ,usePrintTrayMutation} from "../../store/trayApi";
import { TrayItem } from "./TrayItem";

export const TrayButton = () => {
  const [open, setOpen] = useState(false);
  const [ancorEl, setAncorEl] = useState(null);
  const { isLoading, isError, data } = useGetTrayQuery();
  const [clearTray]=useClearTrayMutation()
  const [printTray]=usePrintTrayMutation()
  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };
  const buttonHandler = (event) => {
    setAncorEl(event.currentTarget);
    toggleOpen();
  };
  return (
    <>
      <IconButton
        size="large"
        id="tray_button"
        aria-label="show 4 new mails"
        color="inherit"
        onClick={buttonHandler}
      >
        {data.tray?.length&&<Badge badgeContent={data?.tray.length||'0'} color="error">
          <FolderSpecialIcon />
        </Badge>}
      </IconButton>
      <Popover        
        id="action_popover"
        open={open}
        sx={{ p: "2px", maxWidth: 334 }}
        anchorEl={ancorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {isError && <Alert severity="error">Error</Alert>}
        {isLoading && <CircularProgress />}
        {data?.tray?.map((plant, i) => (
          <TrayItem key={i} plant={plant}/>
        ))||'0'}
        <Stack direction="row" spacing={1}>
        <IconButton onClick={toggleOpen}>
          <CloseIcon />
        </IconButton>
        <IconButton onClick={()=>{

          clearTray()
          setOpen(false)
          }}>
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={printTray}>
          <PrintIcon />
        </IconButton>
        </Stack>
      </Popover>
    </>
  );
};
