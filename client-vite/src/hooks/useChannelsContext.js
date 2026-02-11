import { useContext } from "react";
import ChannelsContext from "../context/ChannelsContext";

/**
 * Hook для получения доступа к ChannelsContext
 * @returns {Object} Context value с методами управления WebSocket подключением
 */
const useChannelsContext = () => {
  const context = useContext(ChannelsContext);

  if (!context) {
    throw new Error(
      "useChannelsContext must be used within a ChannelsProvider",
    );
  }

  return context;
};

export default useChannelsContext;
