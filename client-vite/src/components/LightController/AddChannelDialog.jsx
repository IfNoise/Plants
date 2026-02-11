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
  Slide,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import {
  useAddChannelMutation,
  useGetDevicesQuery,
} from "../../store/lightApi";
import TungstenIcon from "@mui/icons-material/Tungsten";

const Transition = Slide;

/**
 * Диалог добавления нового канала освещения
 */
const AddChannelDialog = () => {
  const { data: devices } = useGetDevicesQuery();
  const [addChannel, { isLoading }] = useAddChannelMutation();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const [newChannel, setNewChannel] = useState({
    name: "",
    device: "",
    port: "",
  });

  const handleOpen = () => {
    setOpen(true);
    setError("");
  };

  const handleClose = () => {
    setOpen(false);
    setNewChannel({ name: "", device: "", port: "" });
    setError("");
  };

  const handleChange = (field) => (event) => {
    setNewChannel({
      ...newChannel,
      [field]: event.target.value,
    });
    setError("");
  };

  const handleAddChannel = async () => {
    if (!newChannel.name || !newChannel.device || newChannel.port === "") {
      setError("Все поля обязательны для заполнения");
      return;
    }

    try {
      await addChannel({
        name: newChannel.name,
        device: newChannel.device,
        port: parseInt(newChannel.port),
      }).unwrap();
      handleClose();
    } catch (err) {
      setError(err?.data?.message || "Ошибка при добавлении канала");
    }
  };

  const selectedDevice = devices?.find((d) => d.name === newChannel.device);

  return (
    <>
      <IconButton onClick={handleOpen} title="Добавить канал">
        <TungstenIcon />
      </IconButton>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Добавить новый канал</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            <TextField
              label="Название канала"
              required
              fullWidth
              value={newChannel.name}
              onChange={handleChange("name")}
              placeholder="Например: Grow Light 1"
            />

            <FormControl fullWidth required>
              <InputLabel>Устройство</InputLabel>
              <Select
                value={newChannel.device}
                onChange={handleChange("device")}
                label="Устройство"
              >
                {devices?.length > 0 ? (
                  devices.map((device) => (
                    <MenuItem key={device.name} value={device.name}>
                      {device.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Нет доступных устройств</MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth required disabled={!newChannel.device}>
              <InputLabel>Порт</InputLabel>
              <Select
                value={newChannel.port}
                onChange={handleChange("port")}
                label="Порт"
              >
                {selectedDevice?.ports?.map((port, idx) => (
                  <MenuItem key={idx} value={idx}>
                    {idx}: {port}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {!devices || devices.length === 0 ? (
              <Alert severity="info">
                Сначала добавьте устройство в менеджере устройств
              </Alert>
            ) : null}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button
            onClick={handleAddChannel}
            variant="contained"
            disabled={
              isLoading ||
              !newChannel.name ||
              !newChannel.device ||
              newChannel.port === ""
            }
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddChannelDialog;
