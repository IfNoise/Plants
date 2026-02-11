import { createContext, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import useChannelsWebSocket from "../hooks/useChannelsWebSocket";
import {
  updateChannelState,
  addChannel,
  removeChannel,
  setChannelsState,
  setChannelError,
} from "../store/channelsSlice";

const ChannelsContext = createContext(null);

/**
 * Provider для WebSocket подключения к каналам освещения
 * Управляет WebSocket соединением и обновляет Redux store данными в реальном времени
 */
export const ChannelsProvider = ({
  children,
  wsUrl = "ws://ddweed.org/light/channels",
}) => {
  const dispatch = useDispatch();

  // WebSocket callbacks
  const handleChannelUpdate = useCallback(
    ({ channel, state, timestamp }) => {
      dispatch(updateChannelState({ channel, state, timestamp }));
    },
    [dispatch],
  );

  const handleChannelAdded = useCallback(
    ({ channel, timestamp }) => {
      dispatch(addChannel({ channel, timestamp }));
    },
    [dispatch],
  );

  const handleChannelRemoved = useCallback(
    ({ channel, timestamp }) => {
      dispatch(removeChannel({ channel, timestamp }));
    },
    [dispatch],
  );

  const handleChannelsState = useCallback(
    ({ channels, timestamp }) => {
      dispatch(setChannelsState({ channels, timestamp }));
    },
    [dispatch],
  );

  const handleError = useCallback(
    (eventData) => {
      if (eventData && eventData.channel) {
        // Ошибка конкретного канала
        const { channel, error, timestamp } = eventData;
        dispatch(setChannelError({ channel, error, timestamp }));
        console.error(`[ChannelsProvider] Channel ${channel} error:`, error);
      } else {
        // Общая ошибка WebSocket
        console.error("[ChannelsProvider] WebSocket error:", eventData);
      }
    },
    [dispatch],
  );

  // Инициализация WebSocket hook
  const { isConnected } = useChannelsWebSocket({
    url: wsUrl,
    onChannelUpdate: handleChannelUpdate,
    onChannelAdded: handleChannelAdded,
    onChannelRemoved: handleChannelRemoved,
    onChannelsState: handleChannelsState,
    onError: handleError,
    autoReconnect: true,
    reconnectInterval: 3000,
  });

  const contextValue = {
    isConnected,
  };

  return (
    <ChannelsContext.Provider value={contextValue}>
      {children}
    </ChannelsContext.Provider>
  );
};

ChannelsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  wsUrl: PropTypes.string,
};

export default ChannelsContext;
