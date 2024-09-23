const { Schema, model } = require("mongoose");

const schema = new Schema({
  username: { type: String, required: true, uniq: true },
  password: { type: String, required: true },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
});

module.exports = model("User", schema);
