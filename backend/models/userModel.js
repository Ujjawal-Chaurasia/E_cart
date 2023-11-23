const mongoose=require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt= require("jsonwebtoken");
const crypto=require("crypto")
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Enter your name"],
        maxLength:[30,"name cannot exceed length 30"],
        minLength:[3,"name should have more than 3 characters"]
    },
    email:{
        type:String,
        required:[true,"Pleese Enter your email"],
        unique:true,
        validate:[validator.isEmail,"Pleese enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"Pleese Enter password"],
        minLength:[8,"password should have more than 8 characters"],
        select:false,      //select false means when we call document.find() method all user info will be deliverd but passoword will not be delivered
 
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){            //if password is not modified dont hash password again
        next();                   
    }
    this.password= await bcrypt.hash(this.password,10);   //  else hash the password 
})

//JWT token  (this token is generated after register and login)
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}

//compare Password
userSchema.methods.comparePassword= async function(enteredPassword){
        return await   bcrypt.compare(enteredPassword,this.password);
}

//generating passoword reset token
userSchema.methods.getResetPasswordToken=function(){
    //generating token
    const resetToken=crypto.randomBytes(20).toString("hex");

    //hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire=Date.now()+15*60*1000;
    return resetToken; 

}


module.exports= mongoose.model("User",userSchema);