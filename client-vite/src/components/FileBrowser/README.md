# FileBrowser Component

Компонент для работы с файловой системой устройств на базе Mongoose OS через RPC.

## Возможности

### API методы (deviceApi.js)

Добавлены следующие эндпоинты для работы с файловой системой:

- **`useListFilesQuery(deviceId)`** - получить список файлов с деталями (имя, размер)
- **`useGetFileMutation()`** - получить содержимое файла
- **`usePutFileMutation()`** - записать файл на устройство
- **`useRemoveFileMutation()`** - удалить файл с устройства

Все методы используют Mongoose OS RPC API:
- `FS.ListExt` - список файлов
- `FS.Get` - чтение файла
- `FS.Put` - запись файла
- `FS.Remove` - удаление файла

### Компоненты

#### FileBrowser

Основной компонент для отображения и управления файлами.

**Props:**
- `deviceId` (string, required) - ID устройства

**Функции:**
- Отображение списка файлов в виде таблицы
- Показ размера файлов
- Обновление списка файлов
- Просмотр содержимого файла
- Скачивание файла
- Удаление файла
- Загрузка нового файла

#### FileUploadDialog

Диалог для загрузки файлов на устройство.

**Props:**
- `open` (bool, required) - состояние открытия диалога
- `onClose` (func, required) - callback для закрытия
- `deviceId` (string, required) - ID устройства

**Функции:**
- Выбор файла с локального устройства
- Задание имени файла на устройстве
- Опция добавления к существующему файлу (append)
- Загрузка файла по частям (chunks)
- Отображение прогресса загрузки

#### FileViewDialog

Диалог для просмотра содержимого файла.

**Props:**
- `open` (bool, required) - состояние открытия диалога
- `onClose` (func, required) - callback для закрытия
- `filename` (string) - имя файла
- `content` (string) - содержимое файла

**Функции:**
- Просмотр содержимого файла
- Автоматическое определение JSON формата
- Табы для форматированного и исходного вида (для JSON)
- Копирование в буфер обмена
- Отображение размера файла

## Использование

### Базовое использование

```jsx
import FileBrowser from './components/FileBrowser';

function MyPage() {
  return (
    <div>
      <h1>Файлы устройства</h1>
      <FileBrowser deviceId="esp32_C3F410" />
    </div>
  );
}
```

### Использование с Material-UI

```jsx
import { Container, Paper, Typography } from '@mui/material';
import FileBrowser from './components/FileBrowser';

function DeviceFilesPage({ deviceId }) {
  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Файловый менеджер
        </Typography>
        <FileBrowser deviceId={deviceId} />
      </Paper>
    </Container>
  );
}
```

## Технические детали

### Формат данных

Файлы передаются в формате base64 для корректной работы с бинарными данными.

### Загрузка файлов

Файлы загружаются по частям (chunks) размером 1024 байта для предотвращения переполнения памяти на устройстве.

### Кэширование

Используется RTK Query с автоматической инвалидацией кэша:
- После загрузки файла
- После удаления файла
- При явном обновлении списка

### Обработка ошибок

Все операции имеют обработку ошибок с отображением пользователю понятных сообщений.

## Требования

- React 18+
- Material-UI 5+
- Redux Toolkit с RTK Query
- prop-types

## API Reference

### Mongoose OS RPC Methods

Документация по RPC методам: https://github.com/mongoose-os-libs/rpc-service-fs

**FS.ListExt**
```json
// Request
{}

// Response
[
  {
    "name": "config.json",
    "size": 332
  },
  ...
]
```

**FS.Get**
```json
// Request
{
  "filename": "config.json",
  "offset": 0,
  "len": 1024
}

// Response
{
  "data": "base64_encoded_content",
  "left": 0
}
```

**FS.Put**
```json
// Request
{
  "filename": "config.json",
  "data": "base64_encoded_content",
  "append": false
}

// Response
{
  "result": true
}
```

**FS.Remove**
```json
// Request
{
  "filename": "config.json"
}

// Response
{
  "result": true
}
```
