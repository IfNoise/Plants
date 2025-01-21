const { Schema, model, Types } = require("mongoose");

const MapSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  map: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

module.exports = model("Map", MapSchema);
