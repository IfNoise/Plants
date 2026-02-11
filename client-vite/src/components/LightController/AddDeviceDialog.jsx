import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useAddDeviceMutation } from "../../store/lightApi";
import AddIcon from "@mui/icons-material/Add";

/**
 * Диалог добавления нового устройства
 */
const AddDeviceDialog = () => {
  const [addDevice, { isLoading }] = useAddDeviceMutation();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const [newDevice, setNewDevice] = useState({
    name: "",
    type: "tcp",
    address: "",
    port: "502",
    path: "",
    baudRate: "9600",
    dataBits: "8",
    stopBits: "1",
    parity: "none",
    unitId: "1",
    timeout: "1000",
    portsCount: "8",
  });

  const handleOpen = () => {
    setOpen(true);
    setError("");
  };

  const handleClose = () => {
    setOpen(false);
    setNewDevice({
      name: "",
      type: "tcp",
      address: "",
      port: "502",
      path: "",
      baudRate: "9600",
      dataBits: "8",
      stopBits: "1",
      parity: "none",
      unitId: "1",
      timeout: "1000",
      portsCount: "8",
    });
    setError("");
  };

  const handleChange = (field) => (event) => {
    setNewDevice({
      ...newDevice,
      [field]: event.target.value,
    });
    setError("");
  };

  const handleAddDevice = async () => {
    if (!newDevice.name) {
      setError("Название устройства обязательно");
      return;
    }

    if (newDevice.type === "tcp" && !newDevice.address) {
      setError("IP адрес обязателен для TCP устройства");
      return;
    }

    if (newDevice.type === "rtu" && !newDevice.path) {
      setError("Путь к порту обязателен для RTU устройства");
      return;
    }

    try {
      const deviceData = {
        name: newDevice.name,
        type: newDevice.type,
        unitId: parseInt(newDevice.unitId),
        timeout: parseInt(newDevice.timeout),
        portsCount: parseInt(newDevice.portsCount),
      };

      if (newDevice.type === "tcp") {
        deviceData.host = newDevice.address;
        deviceData.port = parseInt(newDevice.port);
      } else {
        deviceData.path = newDevice.path;
        deviceData.baudRate = parseInt(newDevice.baudRate);
        deviceData.dataBits = parseInt(newDevice.dataBits);
        deviceData.stopBits = parseInt(newDevice.stopBits);
        deviceData.parity = newDevice.parity;
      }

      await addDevice(deviceData).unwrap();
      handleClose();
    } catch (err) {
      setError(err?.data?.message || "Ошибка при добавлении устройства");
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        title="Добавить устройство"
        color="primary"
      >
        <AddIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить новое устройство</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            <TextField
              label="Название устройства"
              required
              fullWidth
              value={newDevice.name}
              onChange={handleChange("name")}
              placeholder="Например: Light Controller 1"
              helperText="Уникальное имя для идентификации устройства"
            />

            <FormControl fullWidth required>
              <InputLabel>Тип подключения</InputLabel>
              <Select
                value={newDevice.type}
                onChange={handleChange("type")}
                label="Тип подключения"
              >
                <MenuItem value="tcp">Modbus TCP</MenuItem>
                <MenuItem value="rtu">Modbus RTU</MenuItem>
              </Select>
            </FormControl>

            {newDevice.type === "tcp" ? (
              <>
                <TextField
                  label="IP адрес"
                  required
                  fullWidth
                  value={newDevice.address}
                  onChange={handleChange("address")}
                  placeholder="192.168.1.100"
                  helperText="IP адрес устройства в сети"
                />
                <TextField
                  label="Порт"
                  required
                  fullWidth
                  type="number"
                  value={newDevice.port}
                  onChange={handleChange("port")}
                  helperText="Обычно 502 для Modbus TCP"
                />
              </>
            ) : (
              <>
                <TextField
                  label="Путь к порту"
                  required
                  fullWidth
                  value={newDevice.path}
                  onChange={handleChange("path")}
                  placeholder="/dev/ttyUSB0"
                  helperText="Последовательный порт устройства"
                />
                <Stack direction="row" spacing={1}>
                  <TextField
                    label="Скорость"
                    fullWidth
                    type="number"
                    value={newDevice.baudRate}
                    onChange={handleChange("baudRate")}
                  />
                  <TextField
                    label="Биты данных"
                    fullWidth
                    type="number"
                    value={newDevice.dataBits}
                    onChange={handleChange("dataBits")}
                  />
                </Stack>
                <Stack direction="row" spacing={1}>
                  <TextField
                    label="Стоп-биты"
                    fullWidth
                    type="number"
                    value={newDevice.stopBits}
                    onChange={handleChange("stopBits")}
                  />
                  <FormControl fullWidth>
                    <InputLabel>Четность</InputLabel>
                    <Select
                      value={newDevice.parity}
                      onChange={handleChange("parity")}
                      label="Четность"
                    >
                      <MenuItem value="none">Нет</MenuItem>
                      <MenuItem value="even">Четная</MenuItem>
                      <MenuItem value="odd">Нечетная</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </>
            )}

            <Stack direction="row" spacing={1}>
              <TextField
                label="Unit ID"
                fullWidth
                type="number"
                value={newDevice.unitId}
                onChange={handleChange("unitId")}
                helperText="Modbus unit ID"
              />
              <TextField
                label="Таймаут (мс)"
                fullWidth
                type="number"
                value={newDevice.timeout}
                onChange={handleChange("timeout")}
              />
            </Stack>

            <TextField
              label="Количество портов"
              fullWidth
              type="number"
              value={newDevice.portsCount}
              onChange={handleChange("portsCount")}
              helperText="Количество выходных портов устройства"
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button
            onClick={handleAddDevice}
            variant="contained"
            disabled={isLoading || !newDevice.name}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddDeviceDialog;
