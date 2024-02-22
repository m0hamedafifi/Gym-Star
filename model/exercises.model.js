const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  // this is the _id field by default in Mongoose, but we want to use our own custom ID

  exerciseId: {
    type: Number,
    required: true,
    unique: true,
  },
  // Program id for the program that created this exercise (not necessarily the one it belongs to)
  programId: {
    type: Number,
    required: true,
  },
  // Title of the workout (i.e., "Squats")
  title: {
    type: String,
    upperCase: true,
    lowerCase: true,
    default: "Exercise",
    required: true,
  },
  // Description of what the workout entails (i.e., "Lift your feet off the ground and lower your body until your thighs are parallel to the ground
  description: {
    type: String,
    default: "No description added to the workout ",
  },
  //Object of what the workout animations
  animationDataPath: [
    {
      type: String,
      required: true,
    },
  ],
  // images
  imagePath: {
    type: String,
    required: true,
  },
  duration: { type: String, required: false },
  createdOn: { type: Date, required: false, default: new Date() },
  createdBy: { type: String, required: true },
});
// create Model

const Exercise = mongoose.model("exercises", exerciseSchema);

module.exports = Exercise;
