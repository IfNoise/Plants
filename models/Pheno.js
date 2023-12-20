const { Schema, model, Types } = require("mongoose");


const schema=new Schema({
idx: { type: Number, required: true },
rating:Number,

},{ _id: false })

module.exports =  schema