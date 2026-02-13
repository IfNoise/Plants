import { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  LinearProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { usePutFileMutation } from '../../store/deviceApi';
import { SnackbarContext } from '../../context/SnackbarContext';

const CHUNK_SIZE = 1024; // Размер чанка в байтах для отправки

const FileUploadDialog = ({ open, onClose, deviceId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filename, setFilename] = useState('');
  const [append, setAppend] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef();
  const { setSnack } = useContext(SnackbarContext);

  const [putFile] = usePutFileMutation();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilename(file.name);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !filename) {
      setError('Выберите файл и укажите имя');
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setError('');

    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        const totalChunks = Math.ceil(uint8Array.length / CHUNK_SIZE);

        try {
          // Отправляем файл по частям
          for (let i = 0; i < totalChunks; i++) {
            const start = i * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, uint8Array.length);
            const chunk = uint8Array.slice(start, end);

            // Конвертируем в base64
            const base64Chunk = btoa(
              Array.from(chunk)
                .map(byte => String.fromCharCode(byte))
                .join('')
            );

            // Первый чанк перезаписывает файл (если не append), остальные добавляют
            await putFile({
              deviceId,
              filename,
              data: base64Chunk,
              append: i > 0 || append,
            }).unwrap();

            setProgress(Math.round(((i + 1) / totalChunks) * 100));
          }

          // Успешная загрузка
          setSnack({ open: true, message: `Файл ${filename} успешно загружен`, severity: 'success' });
          handleClose();
        } catch (err) {
          const errorMessage = err?.data?.message || err?.message || 'Ошибка при загрузке файла';
          setError(errorMessage);
          setSnack({ open: true, message: errorMessage, severity: 'error' });
        }
      };

      reader.onerror = () => {
        const errorMessage = 'Ошибка чтения файла';
        setError(errorMessage);
        setSnack({ open: true, message: errorMessage, severity: 'error' });
      };

      reader.readAsArrayBuffer(selectedFile);
    } catch (err) {
      const errorMessage = 'Ошибка при обработке файла';
      setError(errorMessage);
      setSnack({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setFilename('');
    setAppend(false);
    setProgress(0);
    setError('');
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Загрузить файл</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} pt={1}>
          {/* Выбор файла */}
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadIcon />}
            fullWidth
            disabled={isUploading}
          >
            {selectedFile ? selectedFile.name : 'Выбрать файл'}
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={handleFileSelect}
            />
          </Button>

          {selectedFile && (
            <Typography variant="caption" color="text.secondary">
              Размер: {(selectedFile.size / 1024).toFixed(2)} KB
            </Typography>
          )}

          {/* Имя файла на устройстве */}
          <TextField
            label="Имя файла на устройстве"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            fullWidth
            disabled={isUploading}
            placeholder="config.json"
          />

          {/* Опция append */}
          <FormControlLabel
            control={
              <Switch
                checked={append}
                onChange={(e) => setAppend(e.target.checked)}
                disabled={isUploading}
              />
            }
            label="Добавить к существующему файлу"
          />

          {/* Прогресс загрузки */}
          {isUploading && (
            <Box>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="caption" color="text.secondary" align="center" mt={1}>
                Загрузка: {progress}%
              </Typography>
            </Box>
          )}

          {/* Ошибка */}
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isUploading}>
          Отмена
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!selectedFile || !filename || isUploading}
        >
          {isUploading ? 'Загрузка...' : 'Загрузить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

FileUploadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  deviceId: PropTypes.string.isRequired,
};

export default FileUploadDialog;
