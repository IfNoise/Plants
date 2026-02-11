# WebSocket Integration for Device Status

## Обзор
Реализована полная интеграция WebSocket для получения статусов устройств в реальном времени. Система автоматически получает обновления от сервера без необходимости постоянного polling.

## Архитектура

### 1. Redux Store
**Файл:** `client-vite/src/store/deviceStatusSlice.js`

Новый slice для хранения статусов устройств в реальном времени:
- `devices` - объект с данными устройств (state, status, config, lastUpdate)
- `errors` - объект с ошибками устройств

**Actions:**
- `updateDeviceState` - обновление состояния устройства (outputs)
- `updateDeviceStatus` - обновление статуса устройства (connected/disconnected)
- `updateDeviceConfig` - обновление конфигурации устройства
- `setDeviceError` - установка ошибки устройства
- `clearDeviceError` - очистка ошибки устройства
- `clearAllDevices` - очистка всех данных

**Selectors:**
- `selectDeviceState(state, deviceId)` - получить state устройства
- `selectDeviceStatus(state, deviceId)` - получить status устройства
- `selectDeviceConfig(state, deviceId)` - получить config устройства
- `selectDeviceLastUpdate(state, deviceId)` - получить время последнего обновления
- `selectDeviceError(state, deviceId)` - получить ошибку устройства
- `selectAllDeviceStatuses(state)` - получить все статусы

### 2. WebSocket Hook
**Файл:** `client-vite/src/hooks/useDeviceStatusWebSocket.js`

Custom hook для управления WebSocket подключением:

**Параметры:**
- `url` - адрес WebSocket сервера (default: ws://localhost:8081)
- `deviceId` - ID устройства для подписки (опционально)
- `onStateChange` - callback для события state_changed
- `onStatusChange` - callback для события status_changed
- `onConfigChange` - callback для события config_changed
- `onError` - callback для события error
- `autoReconnect` - автоматическое переподключение (default: true)
- `reconnectInterval` - интервал переподключения в мс (default: 3000)

**Возвращаемые методы:**
- `subscribe(deviceId)` - подписаться на устройство
- `unsubscribe(deviceId)` - отписаться от устройства
- `isConnected` - статус подключения
- `disconnect()` - отключиться

**Функции:**
- Автоматическое переподключение при обрыве связи
- Ping/pong каждые 30 секунд для поддержания соединения
- Обработка событий: device_update, state_changed, status_changed, config_changed, error
- Чистое отключение при unmount компонента

### 3. Context Provider
**Файл:** `client-vite/src/context/DeviceStatusContext.jsx`

Provider для управления WebSocket подключением на уровне приложения:

**Props:**
- `children` - дочерние компоненты
- `wsUrl` - URL WebSocket сервера (default: ws://localhost:8081)

**Функциональность:**
- Единое WebSocket подключение для всего приложения
- Управление подписками на устройства
- Автоматическое обновление Redux store при получении данных
- Отслеживание подписанных устройств

### 4. Context Hook
**Файл:** `client-vite/src/hooks/useDeviceStatusContext.js`

Hook для доступа к context:

**Возвращаемые методы:**
- `subscribeToDevice(deviceId)` - подписаться на устройство
- `unsubscribeFromDevice(deviceId)` - отписаться от устройства
- `isConnected` - статус WebSocket подключения

## Интегрированные компоненты

### 1. DeviceCard
**Файл:** `client-vite/src/components/DeviceCard/DeviceCard.jsx`

**Изменения:**
- Подписка на устройство при монтировании
- Использование real-time данных из Redux store
- Fallback на исходные данные если WebSocket недоступен
- Автоматическая отписка при unmount

**Использование:**
```jsx
// Подписка на устройство
useEffect(() => {
  subscribeToDevice(id);
  return () => {
    unsubscribeFromDevice(id);
  };
}, [id]);

// Получение real-time данных
const currentConfig = realtimeConfig || config;
const currentStatus = realtimeStatus || status;
```

### 2. Status Component
**Файл:** `client-vite/src/components/DeviceCard/Status.jsx`

**Изменения:**
- Отображение статуса WebSocket подключения
- Badge с индикатором подключения
- Tooltip с описанием статуса
- Иконка CloudOff при отсутствии WebSocket подключения

**Статусы:**
- `connected` - устройство подключено (зеленая иконка)
- `disconnected` - устройство отключено (серая иконка)
- `error` - ошибка устройства (красная иконка)
- WebSocket disconnected - красный badge с CloudOff иконкой

### 3. Outputs Component
**Файл:** `client-vite/src/components/DeviceCard/Outputs.jsx`

**Изменения:**
- Использование real-time state из WebSocket
- Fallback на polling если WebSocket недоступен
- Мгновенное обновление состояния выходов

**Логика:**
```jsx
// Real-time данные приоритетнее polling
const currentState = realtimeState || data?.result;
const outputs = currentState?.outputs || [];
```

## Интеграция в приложение

### main.jsx
**Файл:** `client-vite/src/main.jsx`

Приложение обернуто в DeviceStatusProvider:
```jsx
<Provider store={store}>
  <DeviceStatusProvider>
    <App />
  </DeviceStatusProvider>
</Provider>
```

### store.js
**Файл:** `client-vite/src/store/store.js`

Добавлен deviceStatus reducer в store:
```javascript
deviceStatus: deviceStatusReducer,
```

## Поток данных

1. **Подключение:**
   - DeviceStatusProvider создает WebSocket подключение при монтировании
   - Автоматический ping каждые 30 секунд

2. **Подписка:**
   - Компонент вызывает `subscribeToDevice(deviceId)`
   - Отправляется сообщение `{ type: 'subscribe', deviceId }`

3. **Получение обновлений:**
   - Сервер отправляет `device_update` события
   - WebSocket hook вызывает соответствующий callback
   - Callback обновляет Redux store через dispatch
   - Компоненты автоматически ре-рендерятся с новыми данными

4. **Отписка:**
   - При unmount компонент вызывает `unsubscribeFromDevice(deviceId)`
   - Отправляется сообщение `{ type: 'unsubscribe', deviceId }`

## Преимущества

1. **Real-time обновления** - мгновенное получение изменений без polling
2. **Эффективность** - одно WebSocket соединение для всех устройств
3. **Автоматическое переподключение** - надежная работа при сетевых проблемах
4. **Graceful degradation** - fallback на polling если WebSocket недоступен
5. **Централизованное управление** - все данные в Redux store
6. **Минимальный рефакторинг** - компоненты работают с теми же данными

## Конфигурация WebSocket сервера

По умолчанию используется `ws://localhost:8081`. Для изменения:

```jsx
<DeviceStatusProvider wsUrl="ws://your-server:port">
  <App />
</DeviceStatusProvider>
```

## Протокол WebSocket

### Клиент -> Сервер:
```json
// Подписка
{ "type": "subscribe", "deviceId": "device123" }

// Отписка
{ "type": "unsubscribe", "deviceId": "device123" }

// Ping
{ "type": "ping" }
```

### Сервер -> Клиент:
```json
// Обновление состояния
{
  "type": "device_update",
  "event": "state_changed",
  "deviceId": "device123",
  "data": { "outputs": [...] },
  "timestamp": "2024-01-01T12:00:00Z"
}

// Обновление статуса
{
  "type": "device_update",
  "event": "status_changed",
  "deviceId": "device123",
  "data": "connected",
  "timestamp": "2024-01-01T12:00:00Z"
}

// Обновление конфигурации
{
  "type": "device_update",
  "event": "config_changed",
  "deviceId": "device123",
  "data": { "irr1": {...}, "light1": {...} },
  "timestamp": "2024-01-01T12:00:00Z"
}

// Ошибка
{
  "type": "device_update",
  "event": "error",
  "deviceId": "device123",
  "data": "Error message",
  "timestamp": "2024-01-01T12:00:00Z"
}

// Pong
{ "type": "pong" }
```

## Тестирование

1. Убедитесь что WebSocket сервер запущен на `ws://localhost:8081`
2. Откройте страницу с устройствами
3. Проверьте что иконки статусов отображаются корректно
4. Изменить состояние устройства на сервере
5. Проверьте что UI обновился автоматически
6. Остановите WebSocket сервер
7. Проверьте что появился badge "WebSocket disconnected"
8. Перезапустите сервер
9. Проверьте что подключение восстановилось автоматически

## Дальнейшее развитие

- [ ] Добавить индикатор "reconnecting..." в Status
- [ ] Логирование WebSocket событий в DevTools
- [ ] Метрики задержки обновлений
- [ ] Буферизация событий при отсутствии подключения
- [ ] Сжатие WebSocket сообщений (если поддерживается сервером)
