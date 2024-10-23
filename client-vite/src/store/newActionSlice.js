import { createSlice } from "@reduxjs/toolkit";

export const newActionSlice = createSlice({
  name: "newAction",
  initialState: {},
  reducers: {
    addDate: (state, action) => {
      state.date = action.payload;
    },
    addPhotos: (state, action) => {
      if (!state.photos) state.photos = [...action.payload];
      else if (state.photos.length === 0) state.photos = [...action.payload];
      else if (state.photos.length > 0)
        state.photos = [...state.photos, ...action.payload];
    },
    addType: (state, action) => {
      state.actionType = action.payload;
    },
    addAuthor: (state, action) => {
      state.author = action.payload;
    },
    addPotSize: (state, action) => {
      state.potSize = action.payload;
    },
    addAddress: (state, action) => {
      state.address = action.payload;
    },
    addBuilding: (state, action) => {
      state["address"] = {};
      state.address.building = action.payload;
    },
    addRoom: (state, action) => {
      state.address.room = action.payload;
    },
    addRow: (state, action) => {
      state.address.row = action.payload;
    },
    addRack: (state, action) => {
      state.address.rack = action.payload;
    },
    addShelf: (state, action) => {
      state.address.shelf = action.payload;
    },
    addTray: (state, action) => {
      state.address.tray = action.payload;
    },
    addNumber: (state, action) => {
      state.address.number = action.payload;
    },
    addReason: (state, action) => {
      state.reason = action.payload;
    },
    addUserReason: (state, action) => {
      state.userReason = action.payload;
    },
    addGender: (state, action) => {
      state.gender = action.payload;
    },
    addClonesNumber: (state, action) => {
      state.clonesNumber = action.payload;
    },
    clear: () => {
      return {};
    },
    addNote: (state, action) => {
      state["note"] = action.payload;
    },
  },
});

export const {
  addDate,
  addType,
  addAuthor,
  addPotSize,
  addAddress,
  addBuilding,
  addRoom,
  addRack,
  addShelf,
  addRow,
  addTray,
  addClonesNumber,
  addNumber,
  addReason,
  addUserReason,
  addPhotos,
  addNote,
  addGender,
  clear,
} = newActionSlice.actions;

export default newActionSlice.reducer;
