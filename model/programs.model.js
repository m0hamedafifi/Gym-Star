const mongoose = require("mongoose");

// create schema
const imgSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description:{type:String , default:""},
  originalname: { type: String, default: "" },
  path:{type:String , required: true},
});
const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  images: [imgSchema],
  id: { type: Number, required: true, unique: true },
});
// create model
const Program = mongoose.model("programs", programSchema);
module.exports = Program;
