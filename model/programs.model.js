const mongoose = require("mongoose");

// create schema
const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  images: [{type:String , required: true}] , 
  id: { type: Number, required: true, unique: true },
});
// create model
const Program = mongoose.model("programs", programSchema);
module.exports = Program;
