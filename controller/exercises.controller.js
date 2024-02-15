const Exercise = require("../model/exercises.model");
const Program = require("../model/programs.model");
const util = require('../util/utility');

//----------------------------------------------------------------
//                        CRUD Operations
//----------------------------------------------------------------

// create a new instance of an exercise and save it to the database

exports.createExercise = async (req, res) => {
  try {
    console.log("body.......",req.body);
    console.log("files......",req.files);
    // save req body at new obj instance of Exercise model
    let newExercise = {
        programId: req.body.programId,
        title: req.body.title,
        description: req.body.description,
        animationDataPath: req.body.animationData,
        imagePath: req.file ? req.file.path : null,
        tags: req.body.tags ? req.body.tags.split(",") : [],
        duration: req.body.duration,
        createdBy: 1,
        createdOn: util.dateFormat(),
    };
    // Create a new exercise based on data from req.body
    let exercise = new Exercise(newExercise);

    // Save the exercise to the database and save it to the variable 'exercise'
    let exerciseData = await exercise.save();

    // Send back the exercise as a response with status code 201
    res.status(201).send({
      status: true,
      message: "Exercise created successfully",
      data: exerciseData,
    });
  } catch (err) {
    // If there is an error, send it back with a status code 500
    console.log(`Error in creating exercise : ${err.message}`);
    res.status(500).send({
      status: false,
      message: "Internal Server Error! Can not create the exercise.",
    });
  }
};

// retrieve all exercises depend on the current program selected in the database

exports.getAllExercisesByProgramId = async (req, res) => {
    const programId = req.params.id;
  try {
    let program = await Program.findOne({ id: programId },{_id:0,__v:0,id:0});
    // Find all exercises in the database and save them to the variable 'exercises'
    let exercises = await Exercise.find({programId: program._id}, { _id: 0, __v: 0 }).sort('-createdAt');
    if (!program || !exercises) throw new Error("Resource not found!");

    // Send back the exercises as a response with a status code 200
    res.status(200).send(exercises);
  } catch (err) {
    // If there is an error, send it back with a status code 500
    console.log(err);
    res.status(500).send("Error getting exercises");
  }
};
