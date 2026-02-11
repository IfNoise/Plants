import { createSlice } from '@reduxjs/toolkit';

/**
 * Redux slice for managing real-time device statuses
 */
const deviceStatusSlice = createSlice({
  name: 'deviceStatus',
  initialState: {
    devices: {}, // { deviceId: { status, state, config, lastUpdate } }
    errors: {}, // { deviceId: { error, timestamp } }
  },
  reducers: {
    updateDeviceState: (state, action) => {
      const { deviceId, stateData, timestamp } = action.payload;
      
      if (!state.devices[deviceId]) {
        state.devices[deviceId] = {};
      }
      
      state.devices[deviceId].state = stateData;
      state.devices[deviceId].lastUpdate = timestamp;
    },
    
    updateDeviceStatus: (state, action) => {
      const { deviceId, status, timestamp } = action.payload;
      
      if (!state.devices[deviceId]) {
        state.devices[deviceId] = {};
      }
      
      state.devices[deviceId].status = status;
      state.devices[deviceId].lastUpdate = timestamp;
    },
    
    updateDeviceConfig: (state, action) => {
      const { deviceId, config, timestamp } = action.payload;
      
      if (!state.devices[deviceId]) {
        state.devices[deviceId] = {};
      }
      
      state.devices[deviceId].config = config;
      state.devices[deviceId].lastUpdate = timestamp;
    },
    
    setDeviceError: (state, action) => {
      const { deviceId, error, timestamp } = action.payload;
      
      state.errors[deviceId] = {
        error,
        timestamp,
      };
    },
    
    clearDeviceError: (state, action) => {
      const { deviceId } = action.payload;
      delete state.errors[deviceId];
    },
    
    clearAllDevices: (state) => {
      state.devices = {};
      state.errors = {};
    },
  },
});

export const {
  updateDeviceState,
  updateDeviceStatus,
  updateDeviceConfig,
  setDeviceError,
  clearDeviceError,
  clearAllDevices,
} = deviceStatusSlice.actions;

// Selectors
export const selectDeviceState = (state, deviceId) => 
  state.deviceStatus.devices[deviceId]?.state;

export const selectDeviceStatus = (state, deviceId) => 
  state.deviceStatus.devices[deviceId]?.status;

export const selectDeviceConfig = (state, deviceId) => 
  state.deviceStatus.devices[deviceId]?.config;

export const selectDeviceLastUpdate = (state, deviceId) => 
  state.deviceStatus.devices[deviceId]?.lastUpdate;

export const selectDeviceError = (state, deviceId) => 
  state.deviceStatus.errors[deviceId];

export const selectAllDeviceStatuses = (state) => 
  state.deviceStatus.devices;

export default deviceStatusSlice.reducer;
