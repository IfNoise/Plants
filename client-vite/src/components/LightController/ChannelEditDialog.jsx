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
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  useGetDevicesQuery,
  useUpdateChannelMutation,
} from "../../store/lightApi";

const MAX_LEVEL = 10000;

/**
 * Диалог редактирования параметров канала освещения
 * @param {Object} props - свойства компонента
 * @param {boolean} props.open - состояние открытия диалога
 * @param {Function} props.onClose - обработчик закрытия диалога
 * @param {Object} props.channel - данные редактируемого канала
 */
const ChannelEditDialog = ({ open, onClose, channel }) => {
  const { data: devices } = useGetDevicesQuery();
  const [updateChannel, { isLoading }] = useUpdateChannelMutation();

  const [formData, setFormData] = useState({
    device: "",
    port: 0,
    maxLevel: 100,
    minLevel: 0,
  });

  useEffect(() => {
    if (channel) {
      setFormData({
        device: channel.device || "",
        port: channel.port || 0,
        maxLevel: Math.floor((channel.maxLevel / MAX_LEVEL) * 100) || 100,
        minLevel: Math.floor((channel.minLevel / MAX_LEVEL) * 100) || 0,
      });
    }
  }, [channel]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSave = async () => {
    if (!channel?.name) return;

    const updateData = {
      ...(formData.device && { device: formData.device }),
      ...(formData.port !== undefined && { port: parseInt(formData.port) }),
      maxLevel: Math.floor((MAX_LEVEL * formData.maxLevel) / 100),
      minLevel: Math.floor((MAX_LEVEL * formData.minLevel) / 100),
    };

    try {
      await updateChannel({
        name: channel.name,
        channel: updateData,
      }).unwrap();
      onClose();
    } catch (error) {
      console.error("Ошибка обновления канала:", error);
    }
  };

  const selectedDevice = devices?.find((d) => d.name === formData.device);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Редактирование канала: {channel?.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Устройство</InputLabel>
            <Select
              value={formData.device}
              onChange={handleChange("device")}
              label="Устройство"
            >
              {devices?.map((device) => (
                <MenuItem key={device.name} value={device.name}>
                  {device.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Порт</InputLabel>
            <Select
              value={formData.port}
              onChange={handleChange("port")}
              label="Порт"
              disabled={!formData.device}
            >
              {selectedDevice?.ports?.map((port, idx) => (
                <MenuItem key={idx} value={idx}>
                  {idx}: {port}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Максимальный уровень (%)"
            type="number"
            fullWidth
            value={formData.maxLevel}
            onChange={handleChange("maxLevel")}
            inputProps={{ min: 0, max: 100 }}
            helperText="Максимальная яркость канала (0-100%)"
          />

          <TextField
            label="Минимальный уровень (%)"
            type="number"
            fullWidth
            value={formData.minLevel}
            onChange={handleChange("minLevel")}
            inputProps={{ min: 0, max: 100 }}
            helperText="Минимальный уровень при включении (для нечувствительных светильников)"
          />

          <Typography variant="caption" color="text.secondary">
            * Изменения применяются немедленно после сохранения
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Отмена
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isLoading || !formData.device}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ChannelEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  channel: PropTypes.shape({
    name: PropTypes.string.isRequired,
    device: PropTypes.string,
    port: PropTypes.number,
    maxLevel: PropTypes.number,
    minLevel: PropTypes.number,
  }),
};

export default ChannelEditDialog;
