import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import PropTypes from "prop-types";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import EditIcon from "@mui/icons-material/Edit";
import { useRemoveDeviceMutation } from "../../store/lightApi";
import { useState } from "react";
import DeviceEditDialog from "./DeviceEditDialog";


const DeviceCard = ({ device}) => {
  const { name, type, options } = device;
  const [removeDevice] = useRemoveDeviceMutation();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const handleRemoveDevice = () => {
    removeDevice(name);
    setDeleteDialogOpen(false);
  }
  
  const getDeviceType = () => {
    return type || "tcp";
  };
  
  const getDeviceInfo = () => {
    const deviceType = getDeviceType();
    if (deviceType === "rtu") {
      return `RTU: ${options.path} (${options.baudRate} baud, ${options.dataBits}${options.parity?.[0]?.toUpperCase() || 'N'}${options.stopBits})`;
    } else {
      return `TCP: ${options.host}:${options.port}`;
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader
          title={name}
          subheader={getDeviceInfo()}
          action={<Checkbox icon={<LockIcon />} checkedIcon={<LockOpenIcon/>} />}
        />
        <CardContent>
          <div>
            <strong>Тип:</strong> {getDeviceType() === "rtu" ? "Modbus RTU" : "Modbus TCP"}
          </div>
          {getDeviceType() === "rtu" && device.unitId && (
            <div>Unit ID: {device.unitId}</div>
          )}
          {options.timeout && (
            <div>Timeout: {options.timeout}ms</div>
          )}
          {device.portsCount && (
            <div>Портов: {device.portsCount}</div>
          )}
        </CardContent>
        <CardActions>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => setEditDialogOpen(true)}
          >
            Редактировать
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Удалить
          </Button>
        </CardActions>
      </Card>
      
      <DeviceEditDialog
        device={device}
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
      />
      
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить устройство &quot;{name}&quot;? 
            Это действие нельзя отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleRemoveDevice} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
DeviceCard.propTypes = {
  device: PropTypes.object.isRequired,
};



export default DeviceCard;
