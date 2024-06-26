//model is imported 
const Product=require("../models/productModel");  
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Apifeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

// create product --Admin
exports.createProduct=catchAsyncErrors(async(req,res,next)=>{

    let images=[];
    if( typeof req.body.images==="string"){
        images.push(req.body.images);
    }else{
        images=req.body.images;

    }
    const imagesLinks=[];

    for(let i=0;i<images.length;i++){
        const result= await cloudinary.v2.uploader.upload(images[i],{
            folder:"products",
            
        })
        imagesLinks.push({
            public_id:result.public_id,
            url:result.secure_url,
        })
    }

    req.body.images=imagesLinks;
    req.body.user=req.user.id;  //done for user   ,while creating the product storing the id of user who created the product
    const product=await Product.create(req.body);
    res.send(201).json({
        success:true,
        product
    })
});

//get all products
exports.getAllProducts=catchAsyncErrors(async(req,res,next)=>{
    // return next(new ErrorHandler("temporary error",500));
    const resultPerPage=8;
    const productsCount = await Product.countDocuments();
    const apiFeature= new Apifeatures(Product.find(),req.query).search().filter();

    let products=await apiFeature.query;
    let filteredProductsCount=products.length;
    apiFeature.pagination(resultPerPage)

     products= await apiFeature.query;
    // const products= await Product.find();  this is passed in apiquery

    res.status(200).json({success:true,products,productsCount,resultPerPage,filteredProductsCount});
})


//get all products (Admin)
exports.getAdminProducts=catchAsyncErrors(async(req,res,next)=>{

    const products=await Product.find()

    res.status(200).json({success:true,products});
})

//get single product details
exports.getProductDetails=catchAsyncErrors(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if(!product){
        // res.status(400).json({
        //     success:false,
        //     message:"Product does not exists in database"
        // })
        return next(new ErrorHandler("Product Not found",404));   //next is a callback function
    }
    res.status(200).json({
        success:true,
        product,
    })
})


//Update Product--admin
exports.updateProduct=catchAsyncErrors(async(req,res,next)=>{
    let product= await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product Not found",500)); 
    }

    //images update
    let images=[];
    if( typeof req.body.images==="string"){
        images.push(req.body.images);
    }else{
        images=req.body.images;

    }

    if(images!==undefined){

    //deleting image from cloudinary
    for(let i=0;i<product.images.length;i++){
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    const imagesLinks=[];

    for(let i=0;i<images.length;i++){
        const result= await cloudinary.v2.uploader.upload(images[i],{
            folder:"products",
            
        })
        imagesLinks.push({
            public_id:result.public_id,
            url:result.secure_url,
        })
    }
    req.body.images=imagesLinks
    }

    product=await Product.findByIdAndUpdate(req.params.id,req.body,
    {
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        product           // return updated product 
    })
    
})


//delete Product
exports.deleteProduct=catchAsyncErrors(async(req,res,next)=>{
    const product= await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product Not found",500)); 
    }

    //deleting image from cloudinary
    for(let i=0;i<product.images.length;i++){
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    await product.remove();
    res.status(200).json({
        success:true,
        message:"product deleted successfully"
    })
    
})

//Create New review or Update the review
exports.createProductReview=catchAsyncErrors(async(req,res,next)=>{

    const {rating,comment,productId}=req.body;
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    }
    const product=await Product.findById(productId);

    const isReviewed= product.reviews.find(
        (rev)=>rev.user.toString()===req.user._id.toString()
    );
    if(isReviewed){
        product.reviews.forEach(rev=>{
         if(rev.user.toString()===req.user._id.toString())
            (rev.rating=rating),(rev.comment=comment);              //i have doubt
    }) 
}
else{
    product.reviews.push(review);
    product.numOfReviews=product.reviews.length;
    }
    let avg=0;
    product.reviews.forEach((rev)=>avg+=rev.rating);
    product.ratings=avg/product.reviews.length;

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
    })

})

//Get all reviews of a product
exports.getProductReviews= catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews,
    })
})

//delete Review
exports.deleteReview=catchAsyncErrors(async(req,res,next)=>{

    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    const reviews=product.reviews.filter((rev)=>rev._id.toString()!==req.query.id.toString())
    
    let avg=0;
    reviews.forEach(rev=>avg+=rev.rating);
    let ratings=0; 
    // handling 0/0 case
    if(reviews.length===0){
        ratings=0;
    }else{
        ratings=avg/reviews.length;
    }
    const numOfReviews=reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,ratings,
        numberOfReviews:numOfReviews,
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success:true,
    })

})
