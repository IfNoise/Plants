import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Hook for connecting to device status WebSocket server
 * @param {Object} options - Configuration options
 * @param {string} options.url - WebSocket server URL
 * @param {string} options.deviceId - Optional device ID to subscribe to
 * @param {Function} options.onStateChange - Callback for state changes
 * @param {Function} options.onStatusChange - Callback for status changes
 * @param {Function} options.onConfigChange - Callback for config changes
 * @param {Function} options.onError - Callback for errors
 * @param {boolean} options.autoReconnect - Enable auto-reconnection (default: true)
 * @param {number} options.reconnectInterval - Reconnection interval in ms (default: 3000)
 * @returns {Object} WebSocket connection state and methods
 */
export const useDeviceStatusWebSocket = ({
  url = "ws://localhost:8081",
  deviceId = null,
  onStateChange = null,
  onStatusChange = null,
  onConfigChange = null,
  onError = null,
  autoReconnect = true,
  reconnectInterval = 3000,
} = {}) => {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const shouldReconnectRef = useRef(true);

  // Store callbacks in refs to avoid recreating connect function
  const onStateChangeRef = useRef(onStateChange);
  const onStatusChangeRef = useRef(onStatusChange);
  const onConfigChangeRef = useRef(onConfigChange);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onStateChangeRef.current = onStateChange;
    onStatusChangeRef.current = onStatusChange;
    onConfigChangeRef.current = onConfigChange;
    onErrorRef.current = onError;
  }, [onStateChange, onStatusChange, onConfigChange, onError]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const ws = new WebSocket(url);

    ws.onopen = () => {
      setIsConnected(true);

      // Subscribe to specific device if provided
      if (deviceId) {
        ws.send(
          JSON.stringify({
            type: "subscribe",
            deviceId,
          }),
        );
      }
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        // Handle subscription confirmation
        if (message.type === "subscribed") {
          return;
        }

        // Handle pong response
        if (message.type === "pong") {
          return;
        }

        // Handle device updates
        if (message.type === "device_update") {
          const { deviceId: updatedDeviceId, data, timestamp } = message;

          switch (data.eventType) {
            case "state_changed":
              if (onStateChangeRef.current) {
                onStateChangeRef.current({
                  deviceId: updatedDeviceId,
                  data: data.state,
                  timestamp,
                });
              }
              break;

            case "status_changed":
              if (onStatusChangeRef.current) {
                onStatusChangeRef.current({
                  deviceId: updatedDeviceId,
                  data: data.status,
                  timestamp,
                });
              }
              break;

            case "config_changed":
              if (onConfigChangeRef.current) {
                onConfigChangeRef.current({
                  deviceId: updatedDeviceId,
                  data: data.config,
                  timestamp,
                });
              }
              break;

            case "error":
              if (onErrorRef.current) {
                onErrorRef.current({
                  deviceId: updatedDeviceId,
                  error: data.error,
                  timestamp,
                });
              }
              console.error(
                `[DeviceStatus WS] Device error from ${updatedDeviceId}:`,
                data.error,
              );
              break;

            default:
              console.warn(
                `[DeviceStatus WS] Unknown event type: ${data.eventType}`,
              );
          }
        }
      } catch (error) {
        console.error("[DeviceStatus WS] Error parsing message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("[DeviceStatus WS] WebSocket error:", error);
      if (onErrorRef.current) {
        onErrorRef.current({
          deviceId: null,
          error: "WebSocket connection error",
          timestamp: new Date().toISOString(),
        });
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      wsRef.current = null;

      // Auto-reconnect if enabled
      if (autoReconnect && shouldReconnectRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, reconnectInterval);
      }
    };

    wsRef.current = ws;
  }, [url, deviceId, autoReconnect, reconnectInterval]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  const subscribe = useCallback((newDeviceId) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "subscribe",
          deviceId: newDeviceId,
        }),
      );
    }
  }, []);

  const unsubscribe = useCallback((deviceIdToUnsubscribe) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "unsubscribe",
          deviceId: deviceIdToUnsubscribe,
        }),
      );
    }
  }, []);

  const ping = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "ping" }));
    }
  }, []);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    shouldReconnectRef.current = true;
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Set up ping interval to keep connection alive
  useEffect(() => {
    const pingInterval = setInterval(() => {
      ping();
    }, 30000); // Ping every 30 seconds

    return () => clearInterval(pingInterval);
  }, [ping]);

  return {
    isConnected,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    ping,
  };
};

export default useDeviceStatusWebSocket;
