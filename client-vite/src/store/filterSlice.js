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
        } else if (Object.keys(action.payload).includes(key)) {
          state["currentAddress." + key] = action.payload[key];
        }
      });
    },
    addGender: (state, action) => {
      if (action.payload === null) {
        delete state.gender;
      } else state.gender = action.payload;
    },
    addPotSize: (state, action) => {
      if (action.payload === null) {
        delete state.potSize;
      } else state.potSize = action.payload;
    },
    addAfterDate: (state, action) => {
      if (action.payload === null) {
        if(!state.startDate?.["$gte"]) return;
        else{
        delete state.startDate["$gte"];
        if(!state.startDate?.["$lte"])delete state.startDate;
      }
      } else state.startDate = { ...state.startDate, ["$gte"]: action.payload };
    },
    addBeforeDate: (state, action) => {
      if (action.payload === null){ 
        if(!state.startDate?.["$lte"]) return;
        else {
          delete state.startDate["$lte"]
          if(!state.startDate?.["$gte"])delete state.startDate
        }
      }else state.startDate = { ...state.startDate, ["$lte"]: action.payload };
    },
    addGroup: (state, action) => {
      if (action.payload === null) {
        delete state.group;
      } else return { group: action.payload };
    },
    setFilter: (state, action) => {
      return action.payload;
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
  addAfterDate,
  addBeforeDate,
  addPotSize,
  addGender,
  addGroup,
  setFilter,
  clearFilter,
} = filterSlice.actions;

export default filterSlice.reducer;
