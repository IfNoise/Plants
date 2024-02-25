import { createSlice } from "@reduxjs/toolkit";


export const filterSlice=createSlice({
  name:'filter',
  initialState:{},
  reducers:{
    addState: (state,action)=>{
      state.state=action.payload
    },
    addStrain: (state,action)=>{
      state.strain=action.payload
    },
    addPheno: (state,action)=>{
      state.pheno=action.payload
    },
    addAddress:(state,action)=>{
       Object.keys(action.payload).forEach(key=>{
      
       state['currentAddress.'+key] = action.payload[key]
       })
    },
    addGender:(state,action)=>{
      state.gender=action.payload
    },
    addStartDate:(state,action)=>{
      state.startDate=action.payload
    },
    clearFilter: ()=>{
   return {}
    },
  }
})


export const {addState,addStrain,addPheno,addAddress,addStartDate,addGender, clearFilter}=filterSlice.actions

export default filterSlice.reducer