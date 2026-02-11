import { useContext } from "react";
import DeviceStatusContext from "../context/DeviceStatusContext";

/**
 * Hook to access device status context
 * Usage:
 * const { subscribeToDevice, unsubscribeFromDevice, isConnected } = useDeviceStatusContext();
 */
export const useDeviceStatusContext = () => {
  const context = useContext(DeviceStatusContext);
  if (!context) {
    throw new Error(
      "useDeviceStatusContext must be used within DeviceStatusProvider",
    );
  }
  return context;
};

export default useDeviceStatusContext;
