import { createSlice } from "@reduxjs/toolkit";


export const newActionSlice=createSlice({
  name:'newAction',
  initialState:{},
  reducers:{
    addType: (state,action)=>{
      state.actionType=action.payload
    },
    addAuthor: (state,action)=>{
      state.author=action.payload
    },
    addPotSize: (state,action)=>{
      state.potSize=action.payload
    },
    addBuilding:(state,action)=>{
      state['address']={}
       state.address.building=action.payload
    },
    addRoom:(state,action)=>{
      state.address.room=action.payload
    },
    addRow:(state,action)=>{
      state.address.row=action.payload
    },
    addRack:(state,action)=>{
      state.address.rack=action.payload
    },
    addShelf:(state,action)=>{
      state.address.shelf=action.payload
    },
    addTray:(state,action)=>{
      state.address.tray=action.payload
    },
    addNumber:(state,action)=>{
      state.address.number=action.payload
    },
    addReason:(state,action)=>{
      state.reason=action.payload
    },
    addUserReason:(state,action)=>{
      state.userReason=action.payload
    },
    addClonesNumber:(state,action)=>{
      state.clonesNumber=action.payload
    },
    clear: (state)=>{
   return {}
    },
    addNoteType:(state,action)=>{
      state['note']={}
       state.note.type=action.payload
    },
  }
})


export const {addType,addAuthor,addPotSize,addBuilding,addRoom,addRack,addShelf,addRow,addTray,addClonesNumber,addNumber,addReason,addUserReason,addNoteType,clear}=newActionSlice.actions

export default newActionSlice.reducer