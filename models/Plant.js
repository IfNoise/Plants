const { Schema, model, Types } = require("mongoose");
const Action=require('./Action')


//============================================================================================================
const plant = new Schema({
  strain: { type: String, required: true },
  pheno: { type: String, required: true },
  type: { type: String }, //Seed,Clone
  gender:String,
  group: String,
  //================
  state: { type: String, required: true, default: "Cloning" }, //new,Germination,Cloning,Growing,Blooming,Stopped,Harvested,MotherPlant
  //================
  currentAddress: {
    building: String,
    room: String,
    row: Number,
    shelf:Number,
    rack: Number,
    tray: Number,
    number: Number,
  },
  cloneCounter:Number,
  //================
  productYield: {
    top: Number,
    pop: Number,
    trim: Number,
    leafs: Number,
  },
  //================
  actions: [Action],
});

module.exports = model("Plant", plant);
