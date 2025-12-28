import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import IrrigationTimeline from "./IrrigationTimeline";

/**
 * Irrigation map editor dialog
 * @param {Object} props
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onSave - Save handler
 * @param {Array} props.initialMap - Initial irrigation map
 * @param {string} props.deviceId - Device ID
 * @param {string} props.irrigatorName - Irrigator name
 */
const IrrigationMapDialog = ({
  open,
  onClose,
  onSave,
  initialMap = [],
  deviceId,
  irrigatorName,
}) => {
  const [periods, setPeriods] = useState(initialMap);
  const [newStart, setNewStart] = useState("");
  const [newStop, setNewStop] = useState("");

  // Convert HH:MM to seconds
  const timeToSeconds = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60;
  };

  // Convert seconds to HH:MM
  const secondsToTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const handleAddPeriod = () => {
    if (!newStart || !newStop) {
      return;
    }

    const start = timeToSeconds(newStart);
    const stop = timeToSeconds(newStop);

    if (start >= stop) {
      alert("Время начала должно быть меньше времени окончания");
      return;
    }

    // Check for overlaps
    const hasOverlap = periods.some(
      (period) =>
        (start >= period.start && start < period.stop) ||
        (stop > period.start && stop <= period.stop) ||
        (start <= period.start && stop >= period.stop)
    );

    if (hasOverlap) {
      alert("Периоды не должны пересекаться");
      return;
    }

    const newPeriods = [...periods, { start, stop }].sort((a, b) => a.start - b.start);
    setPeriods(newPeriods);
    setNewStart("");
    setNewStop("");
  };

  const handleDeletePeriod = (index) => {
    setPeriods(periods.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(periods);
    onClose();
  };

  const handleClose = () => {
    setPeriods(initialMap);
    setNewStart("");
    setNewStop("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Карта полива - {irrigatorName}
        <Typography variant="caption" display="block">
          Устройство: {deviceId}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {/* Timeline visualization */}
        <IrrigationTimeline regMap={periods} />

        {/* Add new period */}
        <Box sx={{ my: 2, p: 2, border: "1px solid #ccc", borderRadius: "4px" }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Добавить период полива
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              type="time"
              label="Начало"
              value={newStart}
              onChange={(e) => setNewStart(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
              size="small"
            />
            <TextField
              type="time"
              label="Конец"
              value={newStop}
              onChange={(e) => setNewStop(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
              size="small"
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddPeriod}
              disabled={!newStart || !newStop}
            >
              Добавить
            </Button>
          </Stack>
        </Box>

        {/* Periods list */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Периоды полива ({periods.length})
          </Typography>
          {periods.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Нет настроенных периодов
            </Typography>
          ) : (
            <List dense>
              {periods.map((period, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeletePeriod(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{
                    border: "1px solid #eee",
                    borderRadius: "4px",
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={`${secondsToTime(period.start)} - ${secondsToTime(period.stop)}`}
                    secondary={`Продолжительность: ${Math.floor((period.stop - period.start) / 60)} мин`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained" disabled={periods.length === 0}>
          Сохранить и отправить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

IrrigationMapDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialMap: PropTypes.array,
  deviceId: PropTypes.string.isRequired,
  irrigatorName: PropTypes.string.isRequired,
};

export default IrrigationMapDialog;
