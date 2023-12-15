const { Schema, model, Types } = require("mongoose");
const Pheno=require('./Pheno')


const strain=new Schema({


  phenos:[Pheno]
})


module.exports = model("Strain", strain);