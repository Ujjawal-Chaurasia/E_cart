import './App.css';
import {BrowserRouter as Router,Route,Switch} from "react-router-dom"
import Header from "./component/layout/Header/Header.js"
import React, { useState,useEffect } from "react"
import WebFont from "webfontloader"
import Footer from "./component/layout/Footer/Footer.js"
import Home from "./component/Home/Home.js"
import ProductDetails from "./component/Product/ProductDetails.js"
import Products from "./component/Product/Products.js"
import Search from "./component/Product/Search.js"
import LoginSignUp from './component/User/LoginSignUp';
import store from "./store"
import { loadUser } from './actions/userAction';
import UserOption from "./component/layout/Header/UserOption.js"
import { useSelector } from 'react-redux';
import Profile from "./component/User/Profile.js"
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from "./component/User/UpdateProfile.js"
import UpdatePassword from "./component/User/UpdatePassword.js"
import ForgotPassword from "./component/User/ForgotPassword.js"
import ResetPassword  from "./component/User/ResetPassword.js"
import Cart from "./component/Cart/Cart.js"
import Shipping from "./component/Cart/Shipping.js"
import ConfirmOrder from "./component/Cart/ConfirmOrder.js"
import axios from 'axios'
import Payment from "./component/Cart/Payment.js"
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js"
import OrderSuccess from "./component/Cart/OrderSuccess.js"
import MyOrders from "./component/Order/MyOrders.js"
import OrderDetails from "./component/Order/OrderDetails.js"
import  Dashboard from "./component/Admin/Dashboard.js"
import  ProductList from "./component/Admin/ProductList"
import NewProduct from "./component/Admin/NewProduct"
import UpdateProduct from "./component/Admin/UpdateProduct.js"
import OrderList from "./component/Admin/OrderList.js"
import ProcessOrder from "./component/Admin/ProcessOrder.js"
import UsersList from "./component/Admin/UsersList.js"
import UpdateUser from "./component/Admin/UpdateUser.js"
import ProductReviews from "./component/Admin/ProductReviews.js"
import NotFound from "./component/NotFound/NotFound.js"
import About from "./component/layout/About/About.js"
import Contact from "./component/layout/Contact/Contact.js"
function App() {

  const {isAuthenticated,user}=useSelector(state=>state.user)

  const [stripeApiKey,setStripeApiKey]=useState("");

  const getStripeApiKey=async()=>{
    const {data}= await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey)
  }

  useEffect(()=>{
    WebFont.load({
      google:{
        families:["Roboto","Droid Sans","Chilanka"]
      }
    })
    store.dispatch(loadUser());
    getStripeApiKey();
    },[])

    // removing right click ability
  window.addEventListener("contextmenu",(e)=>e.preventDefault())
  return (
    <Router>
      <Header/> 
      {isAuthenticated && <UserOption user={user}/>}
      {stripeApiKey&&(
        <Elements stripe={loadStripe(stripeApiKey)}>
        <ProtectedRoute exact path="/process/payment" component={Payment}/>
        </Elements>
      )}
      <Switch>

      <Route exact path="/" component={Home} />
      <Route exact path="/product/:id" component={ProductDetails}/>
      <Route exact path="/products" component={Products}/>{/*products route in home page product icon*/}
    
      <Route path="/products/:keyword" component={Products}/> {/* search route when keyword is given from search */}
      <Route exact path="/search" component={Search}/>   {/*path parameter is case insensitive */}
      <ProtectedRoute exact path="/account" component={Profile}/>
      <Route exact path="/about" component={About}/>
      <Route exact path="/contact" component={Contact}/>


      <ProtectedRoute exact path="/me/update" component={UpdateProfile}/>
      <ProtectedRoute exact path="/password/update" component={UpdatePassword}/>
      <Route exact path="/password/forgot" component={ForgotPassword}/>
      <Route exact path="/password/reset/:token" component={ResetPassword}/>

      <Route  exact path="/login" component={LoginSignUp}/>

      <Route  exact path="/cart" component={Cart}/>

      <ProtectedRoute exact path="/shipping" component={Shipping}/>


      <ProtectedRoute exact path="/success" component={OrderSuccess}/>
      <ProtectedRoute exact path="/orders" component={MyOrders}/>

      <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder}/>
      <ProtectedRoute exact path="/order/:id" component={OrderDetails}/>

      <ProtectedRoute  isAdmin={true} exact path="/admin/dashboard" component={Dashboard}/>

      <ProtectedRoute  isAdmin={true} exact path="/admin/products" component={ProductList}/>
      <ProtectedRoute  isAdmin={true} exact path="/admin/product" component={NewProduct}/>

      <ProtectedRoute  isAdmin={true} exact path="/admin/product/:id" component={UpdateProduct}/>

      <ProtectedRoute  isAdmin={true} exact path="/admin/orders" component={OrderList}/>
      <ProtectedRoute  isAdmin={true} exact path="/admin/order/:id" component={ProcessOrder}/>
      <ProtectedRoute  isAdmin={true} exact path="/admin/users" component={UsersList}/>
      <ProtectedRoute  isAdmin={true} exact path="/admin/user/:id" component={UpdateUser}/>
      <ProtectedRoute  isAdmin={true} exact path="/admin/reviews" component={ProductReviews}/>
      <Route  component={window.location.pathname==="/process/payment"?null:NotFound}/>
    </Switch>
        {/* switch is used ,it will render only one  route at a time */}

      <Footer/>
    </Router>
  );
}

export default App;
