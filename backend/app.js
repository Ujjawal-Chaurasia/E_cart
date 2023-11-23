const express=require("express");
const app=express();
var cors=require('cors')
const cookieParser=require("cookie-parser")
const bodyParser=require("body-parser")
const fileUpload = require("express-fileupload")
const errorMiddleware=require("./middleware/error")

//config
if(process.env.NODE_ENV!=="PRODUCTION"){
    require("dotenv").config({path:"./backend/config/config.env"})

}
//cors
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
//   });
var corsoption={
    origin: ['https://famous-zabaione-78119e.netlify.app','http://localhost:3000'],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    credentials: true,
}
app.use(cors(corsoption));

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

//Route Imports
const product=require("./routes/productRoute");
const user = require("./routes/userRoute");
const order=require("./routes/orderRoute")
const payment=require("./routes/paymentRoute")

app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use("/api/v1",payment);




//MiddleWare for error
app.use(errorMiddleware)

module.exports=app;