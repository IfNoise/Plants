import { PropTypes } from "prop-types";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import { useContext } from "react";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

import { usePrintPlantsMutation } from "../../store/printApi";

import { useAddToTrayMutation } from "../../store/trayApi";
import { useClearTrayMutation } from "../../store/trayApi";
import { usePrintTrayMutation } from "../../store/printApi";

import { useDispatch } from "react-redux";
import { SnackbarContext } from "../../context/SnackbarContext";
import { useState } from "react";
import { PrinterContext } from "../../context/PrinterContext";
import AddActionDialog from "../AddActionDialog/AddActionDialog";
import { AddPhotoFast } from "../AddPhotoFast";

export default function PlantSpeedDial(props) {
  const { setSnack } = useContext(SnackbarContext);
  const dispatch = useDispatch();
  const [addToTray] = useAddToTrayMutation();
  const [printPlants] = usePrintPlantsMutation();
  const [clearTray] = useClearTrayMutation();
  const [printTray] = usePrintTrayMutation();
  const { setPrintDialog } = useContext(PrinterContext);
  //const [actions,setActions]=useState([])
  const [open, setOpen] = useState(false);
  const [openPhoto, setOpenPhoto] = useState(false);
  const { getPlants } = props;
  const plants = getPlants();

  const handleOpen = () => {
    if (getPlants()?.length < 1) {
      setSnack({
        open: true,
        severity: "error",
        message: "No plants selected",
      });
      return;
    }
    setOpen(true);
  };

  const handleOpenPhoto = () => {
    if (getPlants()?.length < 1) {
      setSnack({
        open: true,
        severity: "error",
        message: "No plants selected",
      });
      return;
    }
    setOpenPhoto(true);
  };

  return (
    <>
      <SpeedDial
        ariaLabel="Plant Action SpeedDial"
        FabProps={{size: "large"}}
        hidden={!props.show && getPlants().length === 0}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {props.addAction && (
          <SpeedDialAction
            key="Add"
            icon={<AddIcon />}
            tooltipTitle="Add new action"
            onClick={handleOpen}
            FabProps={{size: "large"}}
          />
        )}
        {props.addPhotos && (
          <SpeedDialAction
            key="Add photo"
            icon={<AddAPhotoIcon />}
            tooltipTitle="Add photo"
            PopperProps={{
              sx:{
                
              }
            }}

            FabProps={{size: "medium"}}
            onClick={handleOpenPhoto}
          />
        )}
        {props.print && (
          <SpeedDialAction
            key="Print"
            icon={<PrintIcon />}
            tooltipTitle="Print"
            onClick={() => {
              if (getPlants()?.length < 1) {
                setSnack({
                  open: true,
                  severity: "error",
                  message: "No plants selected",
                });
                return;
              }
              const id = getPlants().map((plant) => plant._id);
              setPrintDialog({
                onChange: (printer) => {
                  printPlants({ printer, id });
                },
                open: true,
              });
            }}
          />
        )}
        {props.addToTray && (
          <SpeedDialAction
            key="Add to tray"
            icon={<CreateNewFolderIcon />}
            tooltipTitle="Add to tray"
            onClick={() => {
              if (getPlants()?.length < 1) {
                setSnack({
                  open: true,
                  severity: "error",
                  message: "No plants selected",
                });
                return;
              }
              const id = getPlants().map((plant) => plant._id);
              dispatch(addToTray(id));
            }}
          />
        )}
        {props.printTray && (
          <SpeedDialAction
            key="Print tray items "
            icon={<PrintIcon />}
            tooltipTitle="Print tray items"
            onClick={() => {
              setPrintDialog({
                onChange: (printer) => {
                  dispatch(printTray({ printer }));
                },
                open: true,
              });
            }}
          />
        )}
        {props.clearTray && (
          <SpeedDialAction
            key="Clear tray items  "
            icon={<DeleteIcon />}
            tooltipTitle=" Clear tray"
            onClick={() => {
              dispatch(clearTray());
            }}
          />
        )}
      </SpeedDial>
      {plants?.length > 0 && (
        <>
          {props.addPhotos && (
            <AddPhotoFast
              open={openPhoto}
              onClose={() => setOpenPhoto(false)}
              plants={plants}
            />
          )}
          {props.addAction && (
            <AddActionDialog
              open={open}
              onClose={() => setOpen(false)}
              plants={plants}
            />
          )}
        </>
      )}
    </>
  );
}
PlantSpeedDial.propTypes = {
  getPlants: PropTypes.func,
  show: PropTypes.bool,
  addPhotos: PropTypes.bool,
  addAction: PropTypes.bool,
  print: PropTypes.bool,
  addToTray: PropTypes.bool,
  printTray: PropTypes.bool,
  clearTray: PropTypes.bool,
};
