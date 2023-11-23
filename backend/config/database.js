const mongoose=require("mongoose");
const connectDatabase=()=>{
        // console.log(process.env.DB_URL)
     mongoose.connect(process.env.DB_URL,{useUnifiedTopology:true,useNewUrlParser: true,useCreateIndex:true}).then((data)=>{
        console.log(`Mongodb connected with server ${data.connection.host}`)
    }).catch((err)=>{
        console.log("mongodb connection error")
        console.log(err);
    })
}

module.exports=connectDatabase