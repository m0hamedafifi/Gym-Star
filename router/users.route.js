const express = require("express");
const router = express.Router();

const userController = require("../controller/users.controller");
const LoginController = require("../controller/login.controller");
const validator = require("../middleware/validationUserDataMW");

// ----------------------------------------------------------------
// Defining a POST route for adding a new user
// ----------------------------------------------------------------

router.post("/users/add", validator.validRegData, userController.addNewUser);
// ----------------------------------------------------------------
// Login at web site with (email or username) and password
// ----------------------------------------------------------------
router.post("/users/login", LoginController.signInWithUsernamePassword);

/// ----------------------------------------------------------------
// get all users   
// ----------------------------------------------------------------
router.get("/users", userController.getAllUsersList);

module.exports = router;
