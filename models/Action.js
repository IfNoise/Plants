const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  date:{type:Date,required:true},
  type: { type: String ,required:true},//Start,Note,Picking,Relocation,Blooming,Stop,Harvest
  oldAddress:{
    building: String,
    room: String,
    row: Number,
    shelf:Number,
    rack: Number,
    tray: Number,
    number: Number,
  },
  newAddress:{
    building: String,
    room: String,
    row: Number,
    shelf:Number,
    rack: Number,
    tray: Number,
    number: Number,
  },
  source: Types.ObjectId,
  trouble:{
    type:String,//Difficite,Insects,Virus
    difficite:String,//Nitrogen,
    insect:String,

  },
  note:{
    
  },
  photos:[String],
  potSize:String,
  reason:String,
  userReason:String,
  discription:String,
  clonesNumber:Number,
  group:String,
}, { _id: false });

module.exports =  schema
