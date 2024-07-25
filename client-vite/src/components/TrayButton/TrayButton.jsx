import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetTrayQuery } from "../../store/trayApi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useClearTrayMutation } from "../../store/trayApi";
import { usePrintTrayMutation } from "../../store/printApi";
import { useContext } from "react";
import { PrinterContext } from "../../context/PrinterContext";

export const TrayButton = () => {
  const { setPrintDialog } = useContext(PrinterContext);
  const navigate = useNavigate();
  const { data, refetch } = useGetTrayQuery({
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
  const [number, setNumber] = useState(0);
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
  useEffect(() => {
    setNumber(data?.length || 0);
  }, [data]);
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
        {data?.length > 0 && (
          <Badge badgeContent={number.toString()} color="error">
            <FolderSpecialIcon />
          </Badge>
        )}
        {data?.length === 0 && (
          <Badge badgeContent={0} color="error">
            <FolderSpecialIcon />
          </Badge>
        )}
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
              refetch();
              handleClose();
            }}
          >
            <DeleteIcon />
            Clear
          </MenuItem>
          <MenuItem
            onClick={() => {
              setPrintDialog({
                onChange: (printer) => {
                  printTray({ printer });
                },
                open: true,
              });
              handleClose();
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
