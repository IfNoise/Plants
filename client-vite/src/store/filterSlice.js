import { createSlice } from "@reduxjs/toolkit";

export const filterSlice = createSlice({
  name: "filter",
  initialState: {},
  reducers: {
    addState: (state, action) => {
      if (action.payload === null) {
        delete state.state;
      } else state.state = action.payload;
    },
    addStrain: (state, action) => {
      if (action.payload === null) {
        delete state.strain;
      } else state.strain = action.payload;
    },
    addPheno: (state, action) => {
      if (action.payload === null) {
        delete state.pheno;
      } else state.pheno = action.payload;
    },
    addAddress: (state, action) => {
      const keys = [
        "building",
        "room",
        "row",
        "tray",
        "rack",
        "shelf",
        "number",
      ];
      keys.forEach((key) => {
        if (
          Object.keys(state).includes("currentAddress." + key) &&
          !Object.keys(action.payload).includes(key)
        ) {
          delete state["currentAddress." + key];
        }else if(Object.keys(action.payload).includes(key)) {
          state["currentAddress." + key] = action.payload[key];
        }
      });
    },
    addGender: (state, action) => {
      if (action.payload === null) {
        delete state.gender;
      } else
      state.gender = action.payload;
    },
    addPotSize: (state, action) => {
      if (action.payload === null) {
        delete state.potSize;
      } else
      state.potSize = action.payload;
    },
    addStartDate: (state, action) => {
      if (action.payload === null) {
        delete state.startDate;
      } else state.startDate = action.payload;
    },
    clearFilter: () => {
      return {};
    },
  },
});

export const {
  addState,
  addStrain,
  addPheno,
  addAddress,
  addStartDate,
  addPotSize,
  addGender,
  clearFilter,
} = filterSlice.actions;

export default filterSlice.reducer;
