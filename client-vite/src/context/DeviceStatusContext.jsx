import { createContext, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import useDeviceStatusWebSocket from "../hooks/useDeviceStatusWebSocket";
import {
  updateDeviceState,
  updateDeviceStatus,
  updateDeviceConfig,
  setDeviceError,
} from "../store/deviceStatusSlice";

const DeviceStatusContext = createContext(null);

/**
 * Provider for device status WebSocket connection
 * Manages WebSocket connection and updates Redux store with real-time device data
 */
export const DeviceStatusProvider = ({
  children,
  wsUrl = "wss://ddweed.org/api/v2/devices/status",
}) => {
  const dispatch = useDispatch();
  const subscribedDevices = useRef(new Set());

  // WebSocket callbacks
  const handleStateChange = useCallback(({ deviceId, data, timestamp }) => {
    dispatch(updateDeviceState({ deviceId, stateData: data, timestamp }));
  }, [dispatch]);

  const handleStatusChange = useCallback(({ deviceId, data, timestamp }) => {
    dispatch(updateDeviceStatus({ deviceId, status: data, timestamp }));
  }, [dispatch]);

  const handleConfigChange = useCallback(({ deviceId, data, timestamp }) => {
    dispatch(updateDeviceConfig({ deviceId, config: data, timestamp }));
  }, [dispatch]);

  const handleError = useCallback((eventData) => {
    // Handle both WebSocket error events and device error messages
    if (eventData && eventData.deviceId) {
      // Device-specific error message from server
      const { deviceId, error, timestamp } = eventData;
      dispatch(setDeviceError({ deviceId, error, timestamp }));
      console.error(`Device ${deviceId} error:`, error);
    } else {
      // Generic WebSocket error event
      console.error("[DeviceStatus] WebSocket error:", eventData);
    }
  }, [dispatch]);

  // Initialize WebSocket hook
  const { subscribe, unsubscribe, isConnected } = useDeviceStatusWebSocket({
    url: wsUrl,
    onStateChange: handleStateChange,
    onStatusChange: handleStatusChange,
    onConfigChange: handleConfigChange,
    onError: handleError,
    autoReconnect: true,
    reconnectInterval: 3000,
  });

  // Context API for components
  const subscribeToDevice = (deviceId) => {
    if (!subscribedDevices.current.has(deviceId)) {
      subscribe(deviceId);
      subscribedDevices.current.add(deviceId);
    }
  };

  const unsubscribeFromDevice = (deviceId) => {
    if (subscribedDevices.current.has(deviceId)) {
      unsubscribe(deviceId);
      subscribedDevices.current.delete(deviceId);
    }
  };

  const contextValue = {
    subscribeToDevice,
    unsubscribeFromDevice,
    isConnected,
  };

  return (
    <DeviceStatusContext.Provider value={contextValue}>
      {children}
    </DeviceStatusContext.Provider>
  );
};

DeviceStatusProvider.propTypes = {
  children: PropTypes.node.isRequired,
  wsUrl: PropTypes.string,
};

export default DeviceStatusContext;
