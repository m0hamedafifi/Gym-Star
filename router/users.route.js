const express = require('express');
const router = express.Router();

const userController=require('../controller/users.controller');
const validator = require('../middleware/validationUserDataMW');

// ----------------------------------------------------------------
// Defining a POST route for adding a new user
// ----------------------------------------------------------------

router.post(
    "/users/add",
    validator.validRegData,
    userController.addNewUser
  );
  // ----------------------------------------------------------------
  


  module.exports=router