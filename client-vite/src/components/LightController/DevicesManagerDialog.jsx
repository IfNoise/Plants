import {
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useGetDevicesQuery } from "../../store/lightApi";
import DeviceCard from "./DeviceCard";
import CloseIcon from "@mui/icons-material/Close";

const DevicesManagerDialog = ({ open, onClose }) => {
  const { data: devices, isLoading, isError, error } = useGetDevicesQuery();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Управление устройствами</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {isLoading && (
          <Stack alignItems="center" p={4}>
            <CircularProgress />
          </Stack>
        )}
        
        {isError && (
          <Alert severity="error">
            Ошибка загрузки устройств: {error?.message || "Неизвестная ошибка"}
          </Alert>
        )}
        
        {devices && devices.length === 0 && (
          <Alert severity="info">
            Устройства не найдены. Добавьте новое устройство, нажав на кнопку + в списке каналов.
          </Alert>
        )}
        
        {devices && devices.length > 0 && (
          <Grid container spacing={2}>
            {devices.map((device, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <DeviceCard device={device} />
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

DevicesManagerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DevicesManagerDialog;
