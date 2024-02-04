const mongoose = require("mongoose");

// create schema

const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  //   images:{type:String},
  images: { type: String },
  id: { type: Number, required: true, unique: true },
});
const Program = mongoose.model("programs", programSchema);
// create model
module.exports = Program;
