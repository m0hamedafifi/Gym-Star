const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Logger = require("../services/logger");

//----------------------------------------------------------------
// add new logger object to the utils module for logging purposes.
//----------------------------------------------------------------
const logger = new Logger("jwtUtility");

// Setup environment variables from .env file.
dotenv.config();

//------------------------------------------------------------------------------
// generate the access token for a user with specific role and expiration time
//------------------------------------------------------------------------------
exports.generateToken = (id,userName,role)=>{
    return jwt.sign({id:id,userName:userName,role:role}, process.env.JWT_SECRET, {expiresIn: "7d"});
}

//------------------------------------------------------------------------------
// verify the access token for a user with specific role and expiration time
//------------------------------------------------------------------------------
exports.VerifyTokenUser = (token)=>{
    try{
        let user=jwt.verify(token,process.env.JWT_SECRET);
        return user;
        }catch(err){
            // console.log("Invalid token",err.message);
            logger.error(`Invalid token ${token} - ${err.message}`);
            return false;
            }
};