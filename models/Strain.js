const { Schema, model, Types } = require("mongoose");
const Pheno=require('./Pheno')


const strain=new Schema({
  name: {type:String},
  seedBank:{type:String},
  phenos:[Pheno],
  seedType:String,
  counter:Number,
  lastIdx:Number,
  description:String
})


module.exports = model("Strain", strain);