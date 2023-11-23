import React, { Fragment, useEffect, useState } from 'react'
import "./Products.css"
import {useSelector,useDispatch} from "react-redux"
import {clearErrors,getProduct} from "../../actions/productAction"
import Loading from "../loader/loader"
import ProductCard from "../Home/ProductCard"
import Pagination from "react-js-pagination"
import {useAlert} from "react-alert"
import { Typography,Slider } from '@material-ui/core'
import MetaData from '../layout/MetaData'

const categories=[
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
]

const Products = ({match}) => {
    const dispatch=useDispatch();
    const alert=useAlert();
    const [currentPage,setCurrentPage]=useState(1)
    const [price,setPrice]=useState([0,60000]);
    const [category,setCategory]=useState("");
    const [ratings,setRatings]=useState(0);
    const {loading,error,products,productsCount,resultsPerPage,filteredProductsCount} =useSelector((state)=>state.products);

    const keyword = match.params.keyword;

    const setCurrentPageNo=(e)=>{
        setCurrentPage(e)
    }
    const priceHandler=(event,newPrice)=>{
        setPrice(newPrice)
    }
    useEffect(() => {

        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct(keyword,currentPage,price,category,ratings));

    }, [dispatch, keyword, currentPage, price, category, ratings, error, alert])
    let count =filteredProductsCount;
  return (
    <Fragment>
        {loading?<Loading/>:
        (<Fragment>
            <MetaData title="PRODUCTS-ECOMMERCE"/>
            <h2 className="productsHeading">Products</h2>
            <div className="products">
                {products&&products.map((product)=>(
                    <ProductCard key={product._id} product={product}/>
                ))}
            </div>
            <div className="filterBox">
                <Typography>Price</Typography>
                <Slider
                    value={price}
                    onChange={priceHandler}
                    valuelabledisplay="auto"
                    aria-labelledby="range-slider"  
                    min={0}
                    max={70000}
                />
                <Typography>Categories</Typography>
                <ul className='categoryBox'>
                    {categories.map((category)=>(
                        <li
                        className='category-link'
                        key={category}
                        onClick={()=>setCategory(category)}
                        >
                            {category}
                        </li>
                    ))}
                </ul>
                <fieldset>
                    <Typography component="legend">Ratings Above</Typography>
                    <Slider 
                    value={ratings}
                    onChange={(e,newRating)=>{
                        setRatings(newRating);
                    }}
                    valueLabelDisplay="auto"
                    aria-labelledby="continuous-slider"
                    min={0}
                    max={5}
                    />
                </fieldset>   
            </div>

        {resultsPerPage<count&&
        (<div className="Box">
            <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultsPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
            />
        </div>)}
        </Fragment>
        )}
    </Fragment>
  )
}

export default Products