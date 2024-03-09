import { createSlice } from "@reduxjs/toolkit";


export const filterSlice=createSlice({
  name:'filter',
  initialState:{},
  reducers:{
    addState: (state,action)=>{
      if(action.payload===null) {
        delete state.state
      }else
      state.state=action.payload
    },
    addStrain: (state,action)=>{
      if(action.payload===null) {
        delete state.strain
      }else
      state.strain=action.payload
    },
    addPheno: (state,action)=>{
      if(action.payload===null) {
        delete state.pheno
      }else 
      state.pheno=action.payload
    },
    addAddress:(state,action)=>{
      if(action.payload===null) {
        delete state.currentAddress
      }else
       Object.keys(action.payload).forEach(key=>{
      
       state['currentAddress.'+key] = action.payload[key]
       })
    },
    addGender:(state,action)=>{
      state.gender=action.payload
    },
    addPotSize:(state,action)=>{
      state.potSize=action.payload
    },
    addStartDate:(state,action)=>{
      if(action.payload===null) {
        delete state.startDate
        return state
      }else
      state.startDate=action.payload
    },
    clearFilter: ()=>{
   return {}
    },
  }
})


export const {addState,addStrain,addPheno,addAddress,addStartDate,addPotSize,addGender, clearFilter}=filterSlice.actions

export default filterSlice.reducer