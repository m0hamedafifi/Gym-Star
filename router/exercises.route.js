const express = require('express');
const router = express.Router();
const exercisesController = require("../controller/exercises.controller");
const upload = require("../util/uploadImg");

// Create a new exercise
router.post(
    "/exercises/add",
    upload.any("uploadedImages"), // Multer middleware for handling multipart/form-data, parsing the input to json
    exercisesController.createExercise
  );
  
// get all exercises for specific program
router.get(
  "/program/exercises/:programId",
  exercisesController.getAllExercisesByProgramId
);

  module.exports = router