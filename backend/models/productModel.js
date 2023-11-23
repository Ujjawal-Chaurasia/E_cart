const mongoose=require("mongoose");
const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product name"],
        trim:true,
    },
    description:{
        type:String,
        required:[true,"Enter Product Description"]
    },
    price:{
        type:Number,
        required:[true,"Enter Price"],
        maxLenght:[8,"Price Cannnot exceed 8 characters"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Pleese Enter Product Category"],
    },
    Stock:{
        type:Number,
        required:[true,"pleese Enter product Stock"],
        maxLenght:[4 ,"Stock Cannot exceed 4 char"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {   
            user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true,
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true,
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    }
    ,
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model("Product",productSchema);  //this "Product" string will be the collection name inside mongodb 
