const User = require("../model/users.model");
const util = require("../util/utility");
const bcrypt = require("bcryptjs");

// ----------------------------------------------------------------
//                        CRUD Operations
// ----------------------------------------------------------------

// ----------------------------------------------------------------
// Create a new user in the database
// ----------------------------------------------------------------

exports.addNewUser = async (req, res) => {
  try {
    // get the latest id of the user from the users collection and increment it by one to create a unique id for the new user
    let lastIdUser = await User.findOne().sort({ id: "desc" }).exec();
    if (!lastIdUser) lastIdUser = 0;
    else lastIdUser = lastIdUser.id + 1;
    req.body.id = lastIdUser;

    // encrypt password and update request body with encrypted password
    const salt = await bcrypt.genSalt(10);
    var hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    let data = {
      id: req.body.id,
      fname: req.body.fname,
      lname: req.body.lname,
      userName: req.body.userName,
      email: req.body.Email,
      password: req.body.password,
      gender: req.body.gender,
      userDisabled: false,
      verifiedUser: false,
      createdBy: "postman",
      createdOn: util.dateFormat(),
      //role
    };
    // console.log(data);

    // check username and email is already exist or not already
    const userExistOrNot = await User.findOne({
      $or: [{ userName: data.userName }, { email: data.email }],
    });
    if (userExistOrNot) {
      return res
        .status(409)
        .send(
          `Username ${data.userName} or Email ${data.email} already exists.`
        );
    }

    let newUser = new User(data);

    let dataUser = await newUser.save();

    return res.status(201).send({
      status: true,
      message: `user : ${newUser.userName} has been added successfully!`,
      results: dataUser,
    });
  } catch (err) {
    console.log("Error at new  user creation", err.message);
    return res.status(500).send({
      status: false,
      message: "Internal server error...!",
    });
  }
};

// ----------------------------------------------------------------
// Get all users list
// ----------------------------------------------------------------

exports.getAllUsersList = async function (req, res) {
  try {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let skip = req.query.skip ? parseInt(req.query.skip) : 0;

    let sortBy = req.query.sort_by ? req.query.sort_by : "id";
    let sortType = req.query.sort_type ? req.query.sort_type : "desc";

    let searchKeyword = req.query.search ? req.query.search : "";

    let totalRecords = await User.countDocuments();

    let records = await User.find()
      .or([
        { firstName: { $regex: searchKeyword } },
        { lastName: { $regex: searchKeyword } },
      ])
      .sort(sortBy + ":" + sortType)
      .skip(skip)
      .limit(limit);
    return res.status(200).send({
      status: true,
      message: "Successfully fetched the user list",
      totalRecordCount: totalRecords,
      recordPerPage: limit,
      currentPageNo: Math.ceil(skip / limit) + 1,
      totalPages: Math.ceil(totalRecords / limit),
      results: records,
    });
  } catch (err) {
    console.log("Error in getting user list..!", err.message);
    return res.status(500).json({
      status: false,
      message: "Internal server error...!",
    });
  }
};

// ----------------------------------------------------------------
// Get Single User Details By ID
// ----------------------------------------------------------------

exports.getUserDetailsById = async function (req, res) {
  try {
    // Extract user ID from request parameters
    const id = req.params.id;

    // Check if the provided ID is a valid ObjectId
    if (!ObjectId.isValid(id))
      return res
        .status(404)
        .send({ status: false, message: "Please provide a valid user id" });

    // Use findOne to find a user by ID and project only selected fields
    let record = await User.findOne(
      { id: id }, 
      {
        fname: 1,
        lname: 1,
        email: 1,
        userName: 1,
        gender: 1,
        userDisabled: 1,
        role: 1,
      }
    );

    // If no user is found with the provided ID
    if (!record) {
      return res.status(404).send({ status: false, message: "User not found" });
    }

    // If the user is found, send a successful response with user details
    return res.status(200).send({ status: true, results: record });
  } catch (err) {
    // Handle errors that may occur during the process
    console.log("Error In Fetching The User Data", err);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error...!" });
  }
};

//----------------------------------------------------------------
// Function for Updating an existing user's information
//----------------------------------------------------------------

exports.updateUserInfo = async function (req, res) {
  const id = req.params.userId;
  try {
    
    // Check if the request body is empty or null
    if (!req.body) {
      return res.status(400).json({
        status: false,
        message: "Invalid Request Body! Please provide data.",
      });
    }

    // Get the fields to be updated from the request body
    let updateData = {};
    if ("gender" in req.body) updateData.gender = req.body.gender;
    if ("phone" in req.body) updateData.phone = req.body.phone;
    if ("role" in req.body) updateData.role = req.body.role;

    // Find and Update the user document using the userId
    const record = await User.findByIdAndUpdate(id, updateData, { new: true });

    // Remove the fields which are not provided in the request body
    for (const key of Object.keys(updateOps)) {
      if (!updateOps[key]) delete updateOps[key];
    }   return await User.updateOne({_id: id}, {$set: updateOps}, {new:true}).then((user) => {
      if (!user) return res.status(400).send("The user couldn\'t be updated.");
      else return res.status(200).send(user);
    }).catch((err) => {
      console.log(err);
      return res.status(500).send("Error updating user");
    })

    // Send back a success response along with the updated user info
    return res.status(200).json({
      status: true,
      message: "User Information Updated Successfully!",
      data: record,
    });
  } catch (error) {
    console.log("Error While Updating User Info : ", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error..." });
  }
};

//----------------------------------------------------------------
// Function for Getting all users list
//----------------------------------------------------------------
