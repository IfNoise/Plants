import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Container,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import FileBrowser from '../../components/FileBrowser';
import { useGetDevicesQuery } from '../../store/deviceApi';

/**
 * Страница с файловым браузером для устройств
 * Позволяет выбрать устройство и управлять его файлами
 */
const DeviceFilesPage = ({ defaultDeviceId }) => {
  const { data: devices, isLoading, error } = useGetDevicesQuery();
  const [selectedDeviceId, setSelectedDeviceId] = useState(defaultDeviceId || '');

  // Автоматически выбираем первое устройство, если не указано defaultDeviceId
  if (!selectedDeviceId && devices && devices.length > 0) {
    setSelectedDeviceId(devices[0].id);
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">
          Ошибка загрузки устройств: {error?.data?.message || error?.message}
        </Alert>
      </Container>
    );
  }

  if (!devices || devices.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="info">
          Нет доступных устройств
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box mb={3}>
          <Typography variant="h4" gutterBottom>
            Файловый менеджер устройства
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Управление файлами на устройствах Mongoose OS
          </Typography>

          {/* Выбор устройства */}
          <Box mt={3}>
            <FormControl fullWidth>
              <InputLabel id="device-select-label">Устройство</InputLabel>
              <Select
                labelId="device-select-label"
                value={selectedDeviceId}
                label="Устройство"
                onChange={(e) => setSelectedDeviceId(e.target.value)}
              >
                {devices.map((device) => (
                  <MenuItem key={device.id} value={device.id}>
                    {device.id} {device.name ? `(${device.name})` : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Файловый браузер */}
        {selectedDeviceId && (
          <Box mt={3}>
            <FileBrowser deviceId={selectedDeviceId} />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

DeviceFilesPage.propTypes = {
  defaultDeviceId: PropTypes.string,
};

export default DeviceFilesPage;
