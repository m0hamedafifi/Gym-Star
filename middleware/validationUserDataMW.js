const validator = require("../util/validations");

// Exporting the validRegData middleware function which will validate the registration data
exports.validRegData = async (req, res, next) => {
  try {
    const { fname, lname, userName, email, password } = req.body;

    // Checking if any of the required fields are missing
    if (!fname || !lname || !userName || !email || !password) {
      return res
        .status(400)
        .send({ status: false, message: "Please fill all fields" });
    }
    // valid length of fname and lname
    if (fname.length < 2 || lname.length < 2) {
      return res
        .status(406)
        .send({
          status: false,
          message: "First name and last name should be at least 3 characters",
        });
    }

    //checking the length and validation of user name
    if (userName.length < 5) {
      return res.status(400).send({
        status: false,
        message: "Username should be at least 5 characters",
      });
    }
    // check for special character in username

    if (!validator.isValidUserName(userName)) {
      return res.status(400).send({
        status: false,
        message:
          "Username should only contains letters ,numbers and underscores.",
      });
    }

    // email validation
    if (!validator.isValidEmail(email)) {
      return res.status(400).send({
        status: false,
        message: "You have entered an invalid email address!",
      });
    }

    let validPassword = validator.isValidPassword(password);
    // checking password strength
    if (validPassword.length > 0) {
      let errList = validPassword.map((item) => ({
        detail: item.message,
      }));
      return res.status(400).send({
        status: false,
        message: "Your Password must be strong",
        results: errList,
      });
    }
    
    // If all validations pass, moving on to the next middleware function
    next();
  } catch (err) {
    console.log("Error In User Signup Validation", err);
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
    });
  }
};
