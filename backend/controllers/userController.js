const User= require("../models/userModel.js");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendEmail=require("../utils/sendEmail.js")
const sendToken = require("../utils/jwtToken");
const crypto=require("crypto");
const  cloudinary=require("cloudinary")

//Register a user
exports.registerUser= catchAsyncErrors(async(req,res,next)=>{

    const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale",
    })
    const {name,email,password}=req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    });
    // const token = user.getJWTToken();
    // res.status(201).json({
    //     success :true,
    //     token,
    // })
    sendToken(user,201,res);
});


//login user
exports.loginUser= catchAsyncErrors(async(req,res,next)=>{
    const {email,password}=req.body;
    //check if both email and password is given
    if(!email || !password){
        return new ErrorHandler("Pleese enter email and password",400);
    }
    const user = await User.findOne({email:email}).select("+password");  //we did .select("+password") because we have did select = false for password in userschema
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    const isPasswordMatched =user.comparePassword(password);

    if(!isPasswordMatched){  //if password is not matched
        return next(new ErrorHandler("Invalid email or password",401));
    }
    // else when password is matched
    sendToken(user,200,res);
})

//logout user
exports.logout=catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,      
    });

    res.status(200).json({
        success:true,
        message:"Logged Out now",
    });
});

//forgot passoword
exports.forgotPassword=catchAsyncErrors(async(req,res,next)=>{
    const user= await User.findOne({email:req.body.email});
    if(!user){
       return next(new ErrorHandler("user not found",404));
    }
    //get resetpassword token
    const resetToken=user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});
    
    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    
    const  message=`Your password reset Token is :- \n\n ${resetPasswordUrl} \n if you have not requested this mail pleese ignore`


    try{
        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message:message
        })
        res.status(200).json({
            success:true,
            message:`Email send to ${user.email} successfully    `
        })
    }catch(error){
        user.resetPasswordToken=undefined;   //bcz error had occoured and we saved above the user in database(line 70) so we are changing its value and saving it below
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message,500));
        
    }
});

//Reset Password
exports.resetPassword=  catchAsyncErrors(async(req,res,next)=>{
    //  to check user exists in database ,creating token hash to compare with stored token in database 
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user= await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    })

    if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired",400));
    }

    if( req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler("Password ans confirmpassword doesnt match",400));
    }
    user.password==req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();

    sendToken(user,200,res);

});

//Get UserDetails 
exports.getUserDetails=catchAsyncErrors(async(req,res,next)=>{
    const user= await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user,
    })
})

//update user password
exports.updatePassword=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select("+password");

    const isPasswordMatched =user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){  //if password is not matched
        return next(new ErrorHandler("Old password is incorrect",400));
    }
    if(req.body.newPassword!==req.body.confirmPassword){
        return next(new ErrorHandler("password and confirm password did not match",400));
    }
    user.password=req.body.newPassword;

     await  user.save();

    sendToken(user,200,res);
})

//update user profile
exports.updateProfile=catchAsyncErrors(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,

    }
    //we will add update avatar later
    if(req.body.avatar!==""){
        const user=await User.findById(req.user.id);
        const imageId=user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);
        const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"avatars",
            width:150,
            crop:"scale",
        })

        newUserData.avatar={
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
        }
    }

    const user= await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:true,

    })

    res.status(200).json({
        success:true,
    })
})


//get all users (admin)-- for admin only
exports.getAllUsers=catchAsyncErrors(async(req,res,next)=>{
     const users=await User.find();

     res.status(200).json({
        success:true,
        users,
     })
})

//Get single user detail (admin)-- for admin only
exports.getSingleUser=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exits with id:${req.params.id}`,401));
    }

    res.status(200).json({
       success:true,
       user,
    })
})


//update user Role --Admin
exports.updateUserRole=catchAsyncErrors(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role

    }
     await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:true,

    })

    res.status(200).json({
        success:true,
    })
})

//Delete user --Admin
exports.deleteUser=catchAsyncErrors(async(req,res,next)=>{

    const user= await User.findById(req.params.id)

    if(!user){
       return  next(new ErrorHandler(`User does not exists with id ${req.params.id}`,400))
    }   
    const imageId=user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    await user.remove();

    res.status(200).json({
        success:true,
        message:"User deleted Successfully"
    })
})
