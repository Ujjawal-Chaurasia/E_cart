const app=require("./app");
const  cloudinary=require("cloudinary")
const connectDatabase=require("./config/database")

// Handling Uncaugt Exception 
process.on("uncaughtException",err=>{
    console.log(`Error:${err.message}`);
    console.log("sutting down the server due to uncaughtException error");
    process.exit(1);

})

//config
if(process.env.NODE_ENV!=="PRODUCTION"){
    require("dotenv").config({path:"config/config.env"})
}

// connecting to database call this after setting config 
connectDatabase();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

const server= app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`)
})

//Unhandled promise rejections (means those promised which are not handled/catched eg. mongo spelling mistake )
process.on ("unhandledRejection",err=>{
    console.log(`Erroe:${err.message}`);
    console.log("sutting down the server due to unhandled promise rejection");
    server.close(()=>{
        process.exit(1);
    });
})