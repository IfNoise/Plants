const { Schema, model, Types } = require("mongoose");


const schema=new Schema({
code: { type: String, required: true },
idx: { type: Number, required: true },

})

module.exports =  schema