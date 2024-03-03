const express = require("express");
const router = express.Router();
const programsController = require("../controller/programs.controller");
const upload = require("../util/uploadImg");
const authMW = require("../middleware/authMWToken");

router.get("/", (req, res) => {
  return res.status(200).json({ message: "Welcome to the Gym Star" });
});

// Create a new program
router.post(
  "/programs/add",
  upload.any("uploadedImages"),
  programsController.addNewProgram
);

// Get all programs
router.get(
  "/programs",
  authMW.authenticateUser, // Verify if the user already exists in the database
  programsController.getAllPrograms
);

// Get specific program by id
// router.param("id", programsController.loadProgramById);
router.get("/programs/:id", programsController.getOneProgram);

// Update existing program
router.put("/programs/:id", programsController.updateProgram);

// Delete Program
router.delete("/programs/:id", programsController.deleteProgram);
module.exports = router;
