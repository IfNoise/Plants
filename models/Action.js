const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  date:{type:Date,required:true,default:Date.now},
  author:String,
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
  source: Types.ObjectId,
  trouble:{
    type:String,//Difficite,Insects,Virus
    difficite:String,//Nitrogen,
    insect:String,

  },
  note:{
    
  },
  potSize:String,
  reason:String,
  userReason:String,
  discription:String,
  clonesNumber:Number
}, { _id: false });

module.exports =  schema
