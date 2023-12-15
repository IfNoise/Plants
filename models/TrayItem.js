const { Schema, model, Types } = require("mongoose");



const trayItem=new Schema({
 plantId:{type:Types.ObjectId,require:true}
})


module.exports = model("TrayItem", trayItem);