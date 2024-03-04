import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetTrayQuery } from "../../store/trayApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useClearTrayMutation } from "../../store/trayApi";
import { usePrintTrayMutation } from "../../store/printApi";


export const TrayButton = () => {
  const navigate = useNavigate();
  const { data } = useGetTrayQuery(
    {},
    { refetchOnMountOrArgChange: true, refetchOnFocus: true }
  );
  const [contextMenu, setContextMenu] = useState(null);
  const [clearTray] = useClearTrayMutation();
  const [printTray] = usePrintTrayMutation();
  const trayPage = () => {
    navigate(`/tray`);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  return (
    <>
      <IconButton
        size="large"
        id="tray_button"
        aria-label="show 4 new mails"
        color="inherit"
        onClick={trayPage}
        onContextMenu={handleContextMenu}
      >
        
          <Badge badgeContent={data?.length??"0"} color="error">
            <FolderSpecialIcon />
          </Badge>
      
      </IconButton>
      {data?.length > 0 && (
        <Menu
          open={contextMenu !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem
            onClick={() => {
              clearTray();
              handleClose();
            }}
          >
            <DeleteIcon />
            Clear
          </MenuItem>
          <MenuItem
            onClick={() => {
              printTray();
              handleClose;
            }}
          >
            <PrintIcon />
            Print
          </MenuItem>
        </Menu>
      )}
    </>
  );
};
