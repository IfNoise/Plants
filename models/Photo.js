const { Schema, model, Types } = require("mongoose");

const schema = new Schema({

  date:{type:Date,required:true, default:Date.now},
  strain: { type: String ,required:true},
  pheno: { type: String ,required:true},
  state: { type: String ,required:true},
  ageOfState:{type:Number},
  plantId:{type:Types.ObjectId,required:true},
  src:{type:String,required:true},
});

module.exports = model("Photo", schema);