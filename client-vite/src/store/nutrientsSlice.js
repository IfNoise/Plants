import { createSlice } from "@reduxjs/toolkit";

export const nutrientsSlice = createSlice({
  name: 'nutrients',
  initialState: {
    fertilizerUnits: [],
    fertilizers: [],
    concentrates: [], 
  },
  reducers: {
    addFertilizerUnit: (state, action) => {
      if(state.fertilizerUnits){
      state.fertilizerUnits= [...state.fertilizerUnits, action.payload];}
      else{
        state.fertilizerUnits=[action.payload];
      }
    },
    removeFertilizerUnit: (state, action) => {
      state.fertilizerUnits =state.fertilizerUnits.filter((unit) => unit.name !== action.payload);
    },
    addConcentrateToUnit: (state, action) => {
      if (action.payload?.unit&&action.payload?.concentrate){
        const unit = state.fertilizerUnits.find((unit) => unit.name === action.payload.unit);
        if(unit){
          const index = state.fertilizerUnits.indexOf(unit);
          if(index>-1){
          state.fertilizerUnits[index].concentrates.push(action.payload.concentrate);
          }
        }
        }
    },
    addPumpToUnit: (state, action) => {
      if (action.payload?.unit&&action.payload?.pump){
        const unit = state.fertilizerUnits.find((unit) => unit.name === action.payload.unit);
        if(unit){
          const index = state.fertilizerUnits.indexOf(unit);
          if(index>-1){
          state.fertilizerUnits[index].pumps.push(action.payload.pump);
          }
        }
        }
    },
    editPump: (state, action) => {
      if (action.payload?.unit&&action.payload?.pumpIdx>-1&&action.payload?.flowRate){
        const unit = state.fertilizerUnits.find((unit) => unit.name === action.payload.unit);
        if(unit){
          const index = state.fertilizerUnits.indexOf(unit);
          if(index>-1){
          state.fertilizerUnits[index].pumps[action.payload.pumpIdx].flowRate = action.payload.flowRate;
          }
        }
        }
    },
    removePumpFromUnit: (state, action) => {
      if (action.payload?.unit&&action.payload?.pump){

          const unit = state.fertilizerUnits.find((unit) => unit.name === action.payload.unit);
          const index = state.fertilizerUnits.indexOf(unit);
          if(index>-1){
          state.fertilizerUnits[index].pumps = state.fertilizerUnits[index].pumps.filter((pump) => pump.name !== action.payload.pump);
          }
        }
    },

    editUnitConcentrate: (state, action) => {
      if (action.payload?.unit&&action.payload?.concentrateIdx&&action.payload?.newConcentrate){
        const unit = state.fertilizerUnits.find((unit) => unit.name === action.payload.unit);
        if(unit){
          const index = state.fertilizerUnits.indexOf(unit);
          if(index>-1){
          state.fertilizerUnits[index].concentrates[action.payload.concentrateIdx] = action.payload.newConcentrate;
          }
      }
        }
    
    },
    removeConcentrateFromUnit: (state, action) => {
      if (action.payload?.unit&&action.payload?.concentrate){
          const unit = state.fertilizerUnits.find((unit) => unit.name === action.payload.unit);
          const index = state.fertilizerUnits.indexOf(unit);
          if(index>-1){
          state.fertilizerUnits[index].concentrates = state.fertilizerUnits[index].concentrates.filter((concentrate) => concentrate.name !== action.payload.concentrate);
          }
        }
    },
    addFertilizer: (state, action) => {
      if(state.fertilizers){
      state.fertilizers= [...state.fertilizers, action.payload];}
      else{
        state.fertilizers=[action.payload];
      }
    
    },
    removeFertilazer: (state, action) => {
      state.fertilizers = state.fertilizers.filter((fertilizer) => fertilizer.name !== action.payload);
    },
    addElement: (state, action) => {
      if (action.payload?.name&&action.payload?.element){
        const fertilizer = state.fertilizers.find((fertilizer) => fertilizer.name === action.payload.name);
        if(fertilizer){
          const index = state.fertilizers.indexOf(fertilizer);
          if(index>-1){
            if(state.fertilizers[index].content){
          state.fertilizers[index].content=[...state.fertilizers[index].content, action.payload.element];
          }else{
           state.fertilizers[index].content=[action.payload.element];
          }
        }
        }
      }
    },
    editElement: (state, action) => {
      if (action.payload?.name&&action.payload?.element&&action.payload?.concentration){
        const fertilizer = state.fertilizers.find((fertilizer) => fertilizer.name === action.payload.name);
        if(fertilizer){
          const index = state.fertilizers.indexOf(fertilizer);
          if(index>-1){
          state.fertilizers[index].content.find((element) => element.name === action.payload.element).concentration = action.payload.concentration;
          }
        }
    }
    },
    removeElement: (state, action) => {
      if (action.payload?.name&&action.payload?.element){
          const fertilizer = state.fertilizers.find((fertilizer) => fertilizer.name === action.payload.name);
          const index = state.fertilizers.indexOf(fertilizer);
          if(index>-1){
           state.fertilizers[index].content = state.fertilizers[index].content.filter((element) => element.name !== action.payload.element);
          }
        }
    },


    addConcentrate: (state, action) => {
      state.concentrates.push(action.payload);
    },
    addToConcentrate: (state, action) => {
      if (action.payload?.name&&action.payload?.fertilizer){
        const concentrate = state.concentrates.find((concentrate) => concentrate.name === action.payload.name);
        if(concentrate){
          const index = state.concentrates.indexOf(concentrate);
          if(index>-1){
          state.concentrates[index].content.push(action.payload.fertilizer);
          }
        }
        }
    },
    editConcentrateElement: (state, action) => {
      if (action.payload?.name&&action.payload?.fertilizer&&action.payload?.concentration){
        const concentrate = state.concentrates.find((concentrate) => concentrate.name === action.payload.name);
        if(concentrate){
          const index = state.concentrates.indexOf(concentrate);
          if(index>-1){
          state.concentrates[index].content.find((fertilizer) => fertilizer.name === action.payload.fertilizer).concentration = action.payload.concentration;
          }
        }
        else{
          console.log("concentrate not found");
        }
    }else{
      console.log("wrong payload"); 
    }
    },
    removeConcentrateElement: (state, action) => {
      if (action.payload?.name&&action.payload?.fertilizer){
          const concentrate = state.concentrates.find((concentrate) => concentrate.name === action.payload.name);
          const index = state.concentrates.indexOf(concentrate);
          if(index>-1){
          state.concentrates[index].content = state.concentrates[index].content.filter((fertilizer) => fertilizer.name !== action.payload.fertilizer);
          }
        }
    },
    removeConcentrate: (state, action) => {
      state.concentrates = state.concentrates.filter((concentrate) => concentrate.name !== action.payload);
    },
  

  },
});

export const { 
  addFertilizerUnit,removeFertilizerUnit,addConcentrateToUnit,editUnitConcentrate,removeConcentrateFromUnit,addPumpToUnit,editPump,removePumpFromUnit,
  addFertilizer,removeFertilazer,
  addElement,removeElement,editElement,editConcentrateElement,
  addConcentrate,addToConcentrate,removeConcentrateElement,removeConcentrate,
} = nutrientsSlice.actions;

export default nutrientsSlice.reducer;