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
    const userExistOrNot = await User.findOne({ $or: [{ userName: data.userName }, { email: data.email }] });
    if (userExistOrNot) {
      return res.status(409).send(`Username ${data.userName} or Email ${data.email} already exists.`);
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
   try{
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let skip = req.query.skip ? parseInt(req.query.skip) : 0;

    let sortBy = req.query.sort_by ? req.query.sort_by : "_id";
    let sortType = req.query.sort_type ? req.query.sort_type : "desc";

    let searchKeyword = req.query.search ? req.query.search : "";

    let totalRecords = await User.countDocuments();

    let records = await User.find()
      .or([{ firstName: { $regex: searchKeyword } }, { lastName: { $regex: searchKeyword } }])
      .sort(sortBy + ":" + sortType)
      .skip(skip)
      .limit(limit)
    ;
    
    return res.status(200).send({
        status:true,
        message: 'Successfully fetched the user list',
        totalRecordCount: totalRecords,
        recordPerPage: limit,
        currentPageNo: Math.ceil(skip / limit)+1 ,
        totalPages: Math.ceil(totalRecords/limit),
        data:records
    })
}catch(e){
    console.log("Error in getting user list..!");
    return res.status(500).json({
        status:false,
        message: 'Internal server error!'
    });
}};

//