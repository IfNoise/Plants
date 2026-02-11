import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Custom hook для управления WebSocket подключением к серверу каналов освещения
 * @param {Object} options - Опции подключения
 * @param {string} options.url - URL WebSocket сервера
 * @param {Function} options.onChannelUpdate - Колбэк для обновления состояния канала
 * @param {Function} options.onChannelAdded - Колбэк для добавления канала
 * @param {Function} options.onChannelRemoved - Колбэк для удаления канала
 * @param {Function} options.onChannelsState - Колбэк для полного состояния каналов
 * @param {Function} options.onError - Колбэк для обработки ошибок
 * @param {boolean} options.autoReconnect - Автоматическое переподключение
 * @param {number} options.reconnectInterval - Интервал переподключения в мс
 */
const useChannelsWebSocket = ({
  url,
  onChannelUpdate,
  onChannelAdded,
  onChannelRemoved,
  onChannelsState,
  onError,
  autoReconnect = true,
  reconnectInterval = 3000,
}) => {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  // Обработчик входящих сообщений
  const handleMessage = useCallback(
    (event) => {
      try {
        const data = JSON.parse(event.data);
        const timestamp = data.timestamp || new Date().toISOString();

        switch (data.type) {
          case "connected":
            console.log("[ChannelsWS] Connected to server");
            break;

          case "channel_update":
            if (onChannelUpdate) {
              onChannelUpdate({
                channel: data.channel,
                state: data.state,
                timestamp,
              });
            }
            break;

          case "channel_added":
            if (onChannelAdded) {
              onChannelAdded({
                channel: data.channel,
                timestamp,
              });
            }
            break;

          case "channel_removed":
            if (onChannelRemoved) {
              onChannelRemoved({
                channel: data.channel,
                timestamp,
              });
            }
            break;

          case "channels_state":
            if (onChannelsState) {
              onChannelsState({
                channels: data.channels,
                timestamp,
              });
            }
            break;

          case "pong":
            console.log("[ChannelsWS] Pong received");
            break;

          case "error":
            if (onError) {
              onError({
                error: data.error || data.message,
                timestamp,
              });
            }
            break;

          default:
            console.warn("[ChannelsWS] Unknown message type:", data.type);
        }
      } catch (error) {
        console.error("[ChannelsWS] Failed to parse message:", error);
        if (onError) {
          onError({ error: error.message });
        }
      }
    },
    [
      onChannelUpdate,
      onChannelAdded,
      onChannelRemoved,
      onChannelsState,
      onError,
    ],
  );

  // Функция подключения
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("[ChannelsWS] Already connected");
      return;
    }

    console.log("[ChannelsWS] Connecting to:", url);

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log("[ChannelsWS] Connection opened");
        setIsConnected(true);

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = handleMessage;

      ws.onerror = (error) => {
        console.error("[ChannelsWS] WebSocket error:", error);
        setIsConnected(false);
        if (onError) {
          onError({ error: "WebSocket connection error" });
        }
      };

      ws.onclose = () => {
        console.log("[ChannelsWS] Connection closed");
        setIsConnected(false);

        // Автоматическое переподключение
        if (autoReconnect && !reconnectTimeoutRef.current) {
          console.log(`[ChannelsWS] Reconnecting in ${reconnectInterval}ms...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("[ChannelsWS] Failed to create WebSocket:", error);
      if (onError) {
        onError({ error: error.message });
      }
    }
  }, [url, handleMessage, onError, autoReconnect, reconnectInterval]);

  // Функция отключения
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      console.log("[ChannelsWS] Disconnecting...");
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  // Отправка ping
  const sendPing = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "ping" }));
    }
  }, []);

  // Автоматическое подключение при монтировании
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    connect,
    disconnect,
    sendPing,
  };
};

export default useChannelsWebSocket;
