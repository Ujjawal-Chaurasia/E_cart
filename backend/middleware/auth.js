const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt=require("jsonwebtoken");
const User=require("../models/userModel.js");

exports.isAuthenticatedUser=catchAsyncErrors(async (req,res,next)=>{
    const {token }= req.cookies;
    // console.log(` token value in isauth:${token}`);
    // console.log(req.cookies);
    if(!token){
        return next(new ErrorHandler("Pleese login to access this resource",401))
    }

    const decodedData=jwt.verify(token,process.env.JWT_SECRET);
    req.user= await User.findById(decodedData.id);    // when loginin ,we are saving user data in req

    next();
})



exports.authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){   //accessing role from req.user
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource`,403))
        }
        next();
    }
}