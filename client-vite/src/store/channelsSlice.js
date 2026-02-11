import { createSlice } from "@reduxjs/toolkit";

/**
 * Redux slice для управления состоянием каналов освещения в реальном времени
 * Синхронизируется с WebSocket подключением
 */
const channelsSlice = createSlice({
  name: "channels",
  initialState: {
    channels: {}, // { channelName: { name, level, currentPercentage, maxLevel, minLevel, manual, device, port } }
    lastUpdate: null,
    errors: {},
  },
  reducers: {
    /**
     * Обновить состояние канала
     */
    updateChannelState: (state, action) => {
      const { channel, state: channelState, timestamp } = action.payload;
      state.channels[channel] = {
        ...state.channels[channel],
        ...channelState,
      };
      state.lastUpdate = timestamp || new Date().toISOString();
    },

    /**
     * Добавить новый канал
     */
    addChannel: (state, action) => {
      const { channel, timestamp } = action.payload;
      state.channels[channel.name] = channel;
      state.lastUpdate = timestamp || new Date().toISOString();
    },

    /**
     * Удалить канал
     */
    removeChannel: (state, action) => {
      const { channel, timestamp } = action.payload;
      delete state.channels[channel];
      state.lastUpdate = timestamp || new Date().toISOString();
    },

    /**
     * Установить полное состояние всех каналов
     */
    setChannelsState: (state, action) => {
      const { channels, timestamp } = action.payload;
      const channelsObj = {};
      channels.forEach((ch) => {
        channelsObj[ch.name] = ch;
      });
      state.channels = channelsObj;
      state.lastUpdate = timestamp || new Date().toISOString();
    },

    /**
     * Установить ошибку для канала
     */
    setChannelError: (state, action) => {
      const { channel, error, timestamp } = action.payload;
      state.errors[channel] = {
        error,
        timestamp: timestamp || new Date().toISOString(),
      };
    },

    /**
     * Очистить ошибку канала
     */
    clearChannelError: (state, action) => {
      const { channel } = action.payload;
      delete state.errors[channel];
    },

    /**
     * Очистить все данные
     */
    clearChannels: (state) => {
      state.channels = {};
      state.errors = {};
      state.lastUpdate = null;
    },
  },
});

export const {
  updateChannelState,
  addChannel,
  removeChannel,
  setChannelsState,
  setChannelError,
  clearChannelError,
  clearChannels,
} = channelsSlice.actions;

// Селекторы
export const selectAllChannels = (state) => state.channels.channels;
export const selectChannel = (state, channelName) =>
  state.channels.channels[channelName];
export const selectChannelError = (state, channelName) =>
  state.channels.errors[channelName];
export const selectLastUpdate = (state) => state.channels.lastUpdate;

export default channelsSlice.reducer;
