const express = require('express');
const router = express.Router();
const exercisesController = require("../controller/exercises.controller");
const upload = require("../util/uploadImg");
const authMW  = require('../middleware/authMWToken');


// Create a new exercise
router.post(
    "/exercises/add",
    authMW.authenticateUser, // Verify if the user already exists in the database
    upload.any("uploadedImages"), // Multer middleware for handling multipart/form-data, parsing the input to json
    exercisesController.createExercise
  );
  
// get all exercises for specific program
router.get(
  "/program/exercises/:programId",
  authMW.authenticateUser, // Verify if the user already exists in the database
  exercisesController.getAllExercisesByProgramId
);

router.get (
  "/home",
  authMW.authenticateUserHomePage, // Verify if the user
)
  module.exports = router