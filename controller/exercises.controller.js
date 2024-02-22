const Exercise = require("../model/exercises.model");
const Program = require("../model/programs.model");
const util = require("../util/utility");
const cloudinary = require("cloudinary").v2;
//----------------------------------------------------------------
//                        CRUD Operations
//----------------------------------------------------------------

// create a new instance of an exercise and save it to the database

exports.createExercise = async (req, res) => {
  try {
    // get the latest id from the server's database and increment it by one for our new object
    let lastId = await Exercise.findOne().sort({ exerciseId: "desc" }).exec();
    if (!lastId) lastId = 1;
    else lastId = lastId.exerciseId + 1;
    req.body.exerciseId = lastId;

    if (req.files !== undefined || req.files.length > 0) {
      const uploadPromises = req.files.map(async (item) => {
        // Use Cloudinary to upload images to their servers
        let uploadedImage = await uploadImage(item.path);
        return uploadedImage;
      });

      // Wait for all promises to resolve before proceeding
      const uploadedImages = await Promise.all(uploadPromises);
      let indexToRemove = -1;
      uploadedImages.forEach((element) => {
        // console.log("element: " + element);
        const afterLastDot = element.match(/[^.]+$/)[0];
        // console.log(` afterLastDot: ${afterLastDot}`);
        if (afterLastDot !== "gif") {
          req.body.imagePath = element;
          indexToRemove = uploadedImages.indexOf(element);
        }
      });

      uploadedImages.splice(indexToRemove, 1);
      // Add the array of uploaded image public IDs to req.body.imgUrls
      req.body.animationData = uploadedImages; //.map((image) => ({ path: image }));
    } else {
      console.log("No files uploaded");
      return res.status(487).send({
        status: false,
        message: "Please upload an Image and Gif Files.",
      });
    }
    console.log("body.......", req.body);
    // console.log("files......", req.files);
    // save req body at new obj instance of Exercise model
    let newExercise = {
      exerciseId: req.body.exerciseId,
      programId: req.body.programId,
      title: req.body.title,
      description: req.body.description,
      animationDataPath: req.body.animationData,
      imagePath: req.body.imagePath,
      duration: req.body.duration,
      createdBy: "fifty",
      // createdOn: util.dateFormat(),
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
  const programId = req.params.programId;
  try {
    let program = await Program.findOne(
      { id: programId },
      { _id: 0, __v: 0, id: 0 }
    );
    // Find all exercises in the database and save them to the variable 'exercises'
    let exercises = await Exercise.find(
      { programId: programId },
      { _id: 0, __v: 0, programId: 0 }
    ).sort("createdOn");
    if (!program || !exercises) throw new Error("Resource not found!");

    // Send back the exercises as a response with a status code 200
    res.status(200).send({
      status: true,
      message: "Successfully retrieved exercises by program Id.",
      results: { program: program, exercises: exercises },
    });
  } catch (err) {
    // If there is an error, send it back with a status code 500
    console.log(err);
    res.status(500).send("Error getting exercises");
  }
};

// upload a new image to cloud
const uploadImage = async (imagePath) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    folder: "/ImagesGymStar/exercises",
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    return result.public_id + "." + result.format;
  } catch (error) {
    console.error(error);
  }
};
