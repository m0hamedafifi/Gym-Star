const express = require('express');
const router = express.Router();
const scheduleController = require("../controller/schedule.controller");
const authMW  = require('../middleware/authMWToken');

// Create a new schedule
router.post(
    "/schedule/add",
    authMW.authenticateUser, // Verify if the user already exists in the database
    scheduleController.addSchedule
  );

// get a schedule
router.get("/schedule/",
authMW.authenticateUser, // Verify if the user already exists in the database
scheduleController.getScheduleByDay
);



module.exports = router ;