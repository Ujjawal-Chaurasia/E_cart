import React from 'react'
import playStore from "../../../images/playstore.png"
import appStore from "../../../images/Appstore.png"
import "./Footer.css"

const Footer = () => {
  return (
    <footer id='footer'>
        <div className="leftFooter">
            <h4>DOWNLOAD OUR APP</h4>
            <p>Download App for IOS and Android mobile phone</p>
            <img src={playStore} alt="playstore" />
            <img src={appStore} alt="appstore" />


        </div>

        <div className="midFooter">
            <h1>Ecommerce</h1>
            <p>High Quality is our first priority</p>
            <p>Copyright 2022 &copy; UcUjjwal </p>

        </div>

        <div className="rightFooter">
            <h4>Follow Us</h4>
            <a href="http://instagram.com">Instagram</a>
            <a href="http://facebook.com">Facebook</a>
            <a href="youtube.com">Youtube</a>
        </div>

    </footer>
  )
}

export default Footer