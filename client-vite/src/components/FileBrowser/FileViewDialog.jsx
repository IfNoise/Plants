import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Close as CloseIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';

const FileViewDialog = ({ open, onClose, filename, content }) => {
  const [tabValue, setTabValue] = useState(0);
  const [copied, setCopied] = useState(false);

  // Пытаемся распарсить JSON для красивого отображения
  const tryParseJSON = (str) => {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jsonData = tryParseJSON(content);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{filename}</Typography>
          <Box display="flex" gap={1}>
            <IconButton size="small" onClick={handleCopy} title={copied ? 'Скопировано!' : 'Копировать'}>
              <CopyIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {jsonData ? (
          // Если это JSON, показываем табы
          <Box>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
              <Tab label="Форматированный" />
              <Tab label="Исходный" />
            </Tabs>
            <Box p={2}>
              {tabValue === 0 ? (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.900',
                    overflow: 'auto',
                    maxHeight: '60vh',
                  }}
                >
                  <Typography
                    component="pre"
                    variant="body2"
                    fontFamily="monospace"
                    sx={{ m: 0, whiteSpace: 'pre', overflow: 'auto' }}
                  >
                    {JSON.stringify(jsonData, null, 2)}
                  </Typography>
                </Paper>
              ) : (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.900',
                    overflow: 'auto',
                    maxHeight: '60vh',
                  }}
                >
                  <Typography
                    component="pre"
                    variant="body2"
                    fontFamily="monospace"
                    sx={{ m: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
                  >
                    {content}
                  </Typography>
                </Paper>
              )}
            </Box>
          </Box>
        ) : (
          // Обычный файл
          <Box p={2}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: 'grey.900',
                overflow: 'auto',
                maxHeight: '60vh',
              }}
            >
              <Typography
                component="pre"
                variant="body2"
                fontFamily="monospace"
                sx={{ m: 0, whiteSpace: 'pre', overflow: 'auto' }}
              >
                {content}
              </Typography>
            </Paper>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
          Размер: {new Blob([content]).size} байт
        </Typography>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

FileViewDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  filename: PropTypes.string,
  content: PropTypes.string,
};

export default FileViewDialog;
