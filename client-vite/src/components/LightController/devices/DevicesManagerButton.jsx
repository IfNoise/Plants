import { IconButton } from "@mui/material";
import { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import DevicesManagerDialog from "./DevicesManagerDialog";

const DevicesManagerButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setOpen(true)} title="Управление устройствами">
        <SettingsIcon />
      </IconButton>
      <DevicesManagerDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default DevicesManagerButton;
