import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useUpdateDeviceMutation } from "../../store/lightApi";

const DeviceEditDialog = ({ device, open, onClose }) => {
  const [updateDevice] = useUpdateDeviceMutation();
  const [deviceData, setDeviceData] = useState({
    type: device?.type || "tcp",
    address: device?.options?.host || "",
    port: device?.options?.port || "502",
    path: device?.options?.path || "",
    baudRate: device?.options?.baudRate || "9600",
    dataBits: device?.options?.dataBits || "8",
    stopBits: device?.options?.stopBits || "1",
    parity: device?.options?.parity || "none",
    unitId: device?.unitId || "1",
    timeout: device?.options?.timeout || "1000",
    portsCount: device?.portsCount || "8",
  });

  useEffect(() => {
    if (device) {
      setDeviceData({
        type: device.type || "tcp",
        address: device.options?.host || "",
        port: device.options?.port || "502",
        path: device.options?.path || "",
        baudRate: device.options?.baudRate?.toString() || "9600",
        dataBits: device.options?.dataBits?.toString() || "8",
        stopBits: device.options?.stopBits?.toString() || "1",
        parity: device.options?.parity || "none",
        unitId: device.unitId?.toString() || "1",
        timeout: device.options?.timeout?.toString() || "1000",
        portsCount: device.portsCount?.toString() || "8",
      });
    }
  }, [device]);

  const handleSave = () => {
    const deviceType = device.type || "tcp";
    const updateData = {
      timeout: parseInt(deviceData.timeout),
      portsCount: parseInt(deviceData.portsCount),
    };

    if (deviceType === "tcp") {
      updateData.host = deviceData.address;
      updateData.port = deviceData.port;
    } else {
      updateData.path = deviceData.path;
      updateData.baudRate = parseInt(deviceData.baudRate);
      updateData.dataBits = parseInt(deviceData.dataBits);
      updateData.stopBits = parseInt(deviceData.stopBits);
      updateData.parity = deviceData.parity;
      updateData.unitId = parseInt(deviceData.unitId);
    }

    updateDevice({ name: device.name, device: updateData });
    onClose();
  };

  if (!device) return null;

  const deviceType = device.type || "tcp";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Редактировать устройство: {device.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {/* Отладочная информация */}
          <details style={{ fontSize: '12px', color: '#666' }}>
            <summary>Данные устройства (для отладки)</summary>
            <pre>{JSON.stringify(device, null, 2)}</pre>
          </details>
          
          <TextField
            label="Тип устройства"
            value={deviceType === "tcp" ? "Modbus TCP" : "Modbus RTU"}
            disabled
            fullWidth
          />

          {deviceType === "tcp" ? (
            <>
              <TextField
                label="IP адрес"
                required
                fullWidth
                value={deviceData.address}
                onChange={(e) =>
                  setDeviceData({ ...deviceData, address: e.target.value })
                }
                placeholder="192.168.1.100"
              />
              <TextField
                label="Порт"
                required
                fullWidth
                value={deviceData.port}
                onChange={(e) =>
                  setDeviceData({ ...deviceData, port: e.target.value })
                }
              />
            </>
          ) : (
            <>
              <TextField
                label="Путь к порту"
                required
                fullWidth
                value={deviceData.path}
                onChange={(e) =>
                  setDeviceData({ ...deviceData, path: e.target.value })
                }
                placeholder="/dev/ttyUSB0"
              />
              <Stack direction="row" spacing={1}>
                <TextField
                  label="Скорость (Baud Rate)"
                  fullWidth
                  value={deviceData.baudRate}
                  onChange={(e) =>
                    setDeviceData({ ...deviceData, baudRate: e.target.value })
                  }
                />
                <TextField
                  label="Биты данных"
                  fullWidth
                  value={deviceData.dataBits}
                  onChange={(e) =>
                    setDeviceData({ ...deviceData, dataBits: e.target.value })
                  }
                />
              </Stack>
              <Stack direction="row" spacing={1}>
                <TextField
                  label="Стоп-биты"
                  fullWidth
                  value={deviceData.stopBits}
                  onChange={(e) =>
                    setDeviceData({ ...deviceData, stopBits: e.target.value })
                  }
                />
                <Select
                  fullWidth
                  value={deviceData.parity}
                  onChange={(e) =>
                    setDeviceData({ ...deviceData, parity: e.target.value })
                  }
                >
                  <MenuItem value="none">Без четности</MenuItem>
                  <MenuItem value="even">Четность</MenuItem>
                  <MenuItem value="odd">Нечетность</MenuItem>
                </Select>
              </Stack>
              <TextField
                label="Unit ID"
                fullWidth
                value={deviceData.unitId}
                onChange={(e) =>
                  setDeviceData({ ...deviceData, unitId: e.target.value })
                }
              />
            </>
          )}

          <TextField
            label="Таймаут (мс)"
            fullWidth
            value={deviceData.timeout}
            onChange={(e) =>
              setDeviceData({ ...deviceData, timeout: e.target.value })
            }
          />
          
          <TextField
            label="Количество портов"
            fullWidth
            type="number"
            value={deviceData.portsCount}
            onChange={(e) =>
              setDeviceData({ ...deviceData, portsCount: e.target.value })
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeviceEditDialog.propTypes = {
  device: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeviceEditDialog;
