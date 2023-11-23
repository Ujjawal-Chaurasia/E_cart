import React from 'react'
import {Link} from "react-router-dom";
import {Rating} from "@material-ui/lab"



const ProductCard = ({product}) => {
  const options = {
    size: "small",
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };
  return (
    <Link className="productCard" to={`/product/${product._id}`}>
        <img src={product.images[0].url} alt={product.name} />
        <p>{product.name}</p>

        <div id="productstarrating">
          <div>
           <Rating {...options}/> 
          </div>
           <div style={{"fontSize": "15px"}} className='productCardSpan1'>({product.numOfReviews} reviews)</div>
        </div>
        <span>{`₹${product.price}`}</span>
    </Link>
  )
}

export default ProductCard