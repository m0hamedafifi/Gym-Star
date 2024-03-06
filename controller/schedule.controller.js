const Schedule = require("../model/schedule.model");
const Program = require("../model/programs.model");

// ----------------------------------------------------------------
// add schedule for programs
// ----------------------------------------------------------------

exports.addSchedule = async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .send({ status: false, message: "No schedule found." });
    }

    let lastId = await Schedule.findOne().sort({ scheduleId: "desc" }).exec();
    if (!lastId) lastId = 1;
    else lastId = lastId.scheduleId + 1;
    req.body.scheduleId = lastId;

    let programData = await Program.findOne({ id: req.body.programId });
    if (!programData) {
      return res.Program.status(404).json({
        status: false,
        message: "No program found.",
      });
    }

    let objSchedule = {
      scheduleId: req.body.scheduleId,
      programId: req.body.programId,
      programName: programData.name,
      dayOfWeek: req.body.day,
      timeSession: req.body.timeSession,
      coach : req.body.coach,
    };

    if (
      !objSchedule.dayOfWeek ||
      !objSchedule.timeSession ||
      !objSchedule.programId ||
      !objSchedule.coach
    ) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide complete details." });
    }

    // check the day is not add for specific program schedule
    let countDay = await Schedule.countDocuments({
      dayOfWeek: objSchedule.dayOfWeek,
      programId: objSchedule.programId,
    });
    if (countDay > 0) {
      return res.status(409).send({
        status: false,
        message: `The ${objSchedule.dayOfWeek} has already been added to the program: ${objSchedule.programId}- ${objSchedule.programName} `,
      });
    }
    let newSchedule = new Schedule(objSchedule);
    let data = await newSchedule.save();

    return res.status(201).send({
      status: true,
      message: `The ${objSchedule.dayOfWeek} has added  to the program.`,
      results: data,
    });
  } catch (err) {
    console.log(`Error at addSchedule : ${err.message}`);
    return res
      .status(500)
      .send({ status: false, message: `Server error occurred!` });
  }
};

// ----------------------------------------------------------------
// get the schedule for the given date
// ----------------------------------------------------------------

exports.getScheduleByDay = async (req, res) => {
  try {
    console.log(`Getting schedule for ${req.body}`);
    if (!req.body.day) {
      return res.status(400).json({
        status: false,
        message: "Please provide a valid Day!",
      });
    }

    let data = await Schedule.findOne(
      { dayOfWeek: req.body.day },
      { _id: 0, __v: 0, id: 0, programId: 0 }
    );

    if (!data)
      return res
        .status(404)
        .send({ status: false, message: `Schedule not found.` });

    return res.status(200).send({ status: true, results: data });
  } catch (err) {
    console.log("Error in getting the schedule by day", err.message);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

// ----------------------------------------------------------------
// update the schedule for the given date
// ----------------------------------------------------------------

exports.updateScheduleByDate = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        status: false,
        message: "Invalid Request Body! Please provide data.",
      });
    }
    if (!req.body.programId) {
      return res.status(400).json({
        status: false,
        message: "Program ID is required!",
      });
    }

    let updateOps = req.body;
    const schedule = await Schedule.findOneAndUpdate(
      { dayOfWeek: req.params.day, programId: req.body.programId },
      { $set: updateOps },
      { new: true }
    );
    // check if there is no record of that particular day in the database
    if (!schedule) {
      return res.status(404).send({
        status: false,
        message: `No schedule available for ${req.params.day}`,
      });
    }

    return res.status(200).json({
      status: true,
      message: `Schedule updated successfully on ${req.params.day}`,
      data: schedule,
    });
  } catch (err) {
    console.log(`Failed to update schedule : ${err}`);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error!",
    });
  }
};
