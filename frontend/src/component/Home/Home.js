import React, { Fragment,useEffect   } from 'react'
import {CgMouse} from "react-icons/cg"
import "./Home.css"
import ProductCard from "./ProductCard.js"
import MetaData from "../layout/MetaData";
import {clearErrors, getProduct} from "../../actions/productAction"
import {useSelector,useDispatch} from "react-redux"
import Loading from "../loader/loader"
import { useAlert } from 'react-alert';

const Home = () => {
    const dispatch=useDispatch();
    const alert=useAlert();
    const {loading,error,products}=useSelector((state)=>state.products);

    useEffect(() => {
        if(error) {
            alert.error(error);
            dispatch(clearErrors());
          }
        dispatch(getProduct())
    }, [dispatch,error,alert])  
    
  return (
    <Fragment>
        {loading?(<Loading/>):(<Fragment>
        <MetaData title="Ecommerce"/>
        <div className="banner">
            <h1>Welcome to Ecart</h1>
            <h1>India's Own Ecommerce Website</h1>
            <p>Find Amazing Products Below</p>
            <a href="#container">
                <button>
                   Scroll<CgMouse/>
                </button>
            </a>
        </div>
        <h2 className='homeHeading'>Featured Products</h2>
        <div className="container" id='container'>
            {/* <Product product={product}/> */}
            {products && products.map((product)=>(
                <ProductCard key={product._id} product={product}/>
            ))}

        </div>
    </Fragment>)}
    </Fragment>
  )
}

export default Home