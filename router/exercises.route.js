const express = require('express');
const router = express.Router();
const exercisesController = require("../controller/exercises.controller");

// Create a new exercise
router.post(
    "/exercises/add",
    exercisesController.createExercise
  );



  module.exports = router