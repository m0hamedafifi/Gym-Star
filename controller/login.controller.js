const User = require('../model/users.model');
const bcrypt = require("bcryptjs");
const jwt = require('../util/jwt.util');
const Logger = require("../services/logger");

//----------------------------------------------------------------
// add new logger object to the controller
//----------------------------------------------------------------
const logger = new Logger("LoginController");


//----------------------------------------------------------------
// Sign in with username and password using JWT token
//----------------------------------------------------------------
exports.signInWithUsernamePassword = async (req, res) => {
    try{
        // Get the user from database by their username
        const user = await User.findOne({userName: req.body.userName});
        if(!user){
            logger.error("Couldn't find user with this username.",req.body.userName);
            return res.status(401).send({
                status:false,
                message: "userName or password is Wrong..!"
            });
        }

        // compare the password 
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            logger.error("User provided a wrong password for his account.");
          return res.status(401).send({
              status: false,
              message: 'userName or password is Wrong..!'
          });
        }
        // generate the token for authentication
        let token = jwt.generateToken(user.userId,user.userName,user.role);
        
        logger.info(`Logged In Successfully ${user.userId} ${user.userName}`);
        // send response to client side
        res.header('x-auth-token', token).status(200).send({
            status: true,
            message:"User Logged In Successfully"
        })
      
    }catch(err){
        console.log("Error at signInWithUsernamePassword", err);
        logger.error(`Error at signInWithUsernamePassword ${err.message}`);
        res.status(500).send({
            status: false,
            message: `Internal Server Error..!`
        })
    }
};


