const { Schema, model, Types } = require("mongoose");

const Plant=require('./Plant') 

const schema=new Schema({
  startDate: { type: Date, required: true, default: Date.now },
  address:{
    building: { type: String, required: true },
    room: { type: String, required: true },
  },
  plan:[{
    strain: String,
    number: Number,
    }],
  endPoints:{
    cloning:Number,
    growing:Number,
    blooming:Number,
    flushing:Number,
  },
  rows:[{type: Types.ObjectId, ref: "Plant"}],
  harvestDate: { type: Date },
  })

module.exports =  schema