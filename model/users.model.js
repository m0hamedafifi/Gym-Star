const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, unique: true, required: true, trim: true }, //email
  userName: {
    type: String,
    unique: true,
    required: true,
    lowerCase: true,
    trim: true,
  }, //username
  password: { type: String, required: true }, //password
  gender: { type: String },
  // age:{type:Number},
  // phone_number:{type:String},
  isAdmin: { type: Boolean, required: true, default: false },
  role: [
    {
      type: String,
      lowerCase: true,
      trim: true,
      enum: ["trainer", "trainee"],
      default: ["trainee"],
    },
  ],
  createdOn: { type: String, default: Date.now() },
  createdBy: { type: String },
  updateOn: { type: String },
  updatedBy: { type: String },
  verifiedUser: { type: Boolean },
  userDisabled: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
