import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Tooltip,
  Chip,
  Button,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Upload as UploadIcon,
  Visibility as ViewIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import {
  useListFilesQuery,
  useGetFileMutation,
  useRemoveFileMutation,
} from '../../store/deviceApi';
import { SnackbarContext } from '../../context/SnackbarContext';
import FileUploadDialog from './FileUploadDialog';
import FileViewDialog from './FileViewDialog';

const FileBrowser = ({ deviceId }) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const { setSnack } = useContext(SnackbarContext);

  // Получаем список файлов
  const { data: files, isLoading, error, refetch } = useListFilesQuery(deviceId);

  // Мутации для работы с файлами
  const [getFile, { isLoading: isLoadingFile }] = useGetFileMutation();
  const [removeFile, { isLoading: isRemoving }] = useRemoveFileMutation();

  // Форматирование размера файла
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Скачать файл
  const handleDownload = async (filename) => {
    try {
      const response = await getFile({ deviceId, filename }).unwrap();
      
      if (!response || !response.data) {
        throw new Error('Нет данных в ответе');
      }
      
      // Декодируем base64 данные
      const binaryString = atob(response.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Создаем blob и скачиваем
      const blob = new Blob([bytes]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSnack({ open: true, message: `Файл ${filename} скачан`, severity: 'success' });
    } catch (err) {
      console.error('Error downloading file:', err);
      setSnack({ 
        open: true, 
        message: `Ошибка скачивания файла: ${err.message}`, 
        severity: 'error' 
      });
    }
  };

  // Просмотр файла
  const handleView = async (filename) => {
    try {
      const response = await getFile({ deviceId, filename }).unwrap();
      
      if (!response || !response.data) {
        throw new Error('Нет данных в ответе');
      }
      
      // Декодируем base64 данные
      const content = atob(response.data);
      setFileContent(content);
      setSelectedFile(filename);
      setViewDialogOpen(true);
    } catch (err) {
      console.error('Error viewing file:', err);
      setSnack({ 
        open: true, 
        message: `Ошибка просмотра файла: ${err.message}`, 
        severity: 'error' 
      });
    }
  };

  // Удалить файл
  const handleDelete = async (filename) => {
    if (!window.confirm(`Вы уверены, что хотите удалить файл ${filename}?`)) {
      return;
    }

    try {
      await removeFile({ deviceId, filename }).unwrap();
      setSnack({ open: true, message: `Файл ${filename} удалён`, severity: 'success' });
    } catch (err) {
      console.error('Error deleting file:', err);
      setSnack({ 
        open: true, 
        message: `Ошибка удаления файла: ${err.message}`, 
        severity: 'error' 
      });
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Ошибка загрузки файлов: {error?.data?.message || error?.message || 'Неизвестная ошибка'}
      </Alert>
    );
  }

  // Убеждаемся что files это массив
  const filesList = Array.isArray(files) ? files : [];
  const totalSize = filesList.reduce((sum, file) => sum + (file.size || 0), 0);

  return (
    <Box>
      {/* Заголовок и действия */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h6">Файловая система</Typography>
          <Typography variant="caption" color="text.secondary">
            Всего файлов: {filesList.length} • Размер: {formatFileSize(totalSize)}
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Tooltip title="Обновить">
            <IconButton onClick={refetch} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Загрузить файл
          </Button>
        </Box>
      </Box>

      {/* Таблица файлов */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Имя файла</TableCell>
              <TableCell align="right">Размер</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filesList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Нет файлов
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filesList.map((file) => (
                <TableRow key={file.name} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <FileIcon fontSize="small" color="action" />
                      <Typography variant="body2">{file.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={formatFileSize(file.size)} 
                      size="small" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" justifyContent="flex-end" gap={0.5}>
                      <Tooltip title="Просмотр">
                        <IconButton
                          size="small"
                          onClick={() => handleView(file.name)}
                          disabled={isLoadingFile}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Скачать">
                        <IconButton
                          size="small"
                          onClick={() => handleDownload(file.name)}
                          disabled={isLoadingFile}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Удалить">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(file.name)}
                          disabled={isRemoving}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог загрузки файла */}
      <FileUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        deviceId={deviceId}
      />

      {/* Диалог просмотра файла */}
      <FileViewDialog
        open={viewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false);
          setSelectedFile(null);
          setFileContent('');
        }}
        filename={selectedFile}
        content={fileContent}
      />
    </Box>
  );
};

FileBrowser.propTypes = {
  deviceId: PropTypes.string.isRequired,
};

export default FileBrowser;
