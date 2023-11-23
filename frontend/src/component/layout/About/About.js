import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import InstagramIcon from "@material-ui/icons/Instagram";
const About = () => {
  const visitInstagram = () => {
    window.location = "https://instagram.com/uc_ujjawal";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dttmypxlk/image/upload/v1696861923/avatars/cwlmili8c0vc5wypgajb.jpg"
              alt="Founder"
            />
            
            <Typography>Ujjawal Chaurasia</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span> This is an Ecommerce website, where you can get all products available
l            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Visit Owner</Typography>
            <a
              href="https://www.linkedin.com/in/ujjawal-chaurasia-5b44b719b/"
              target="blank"
            >
              <LinkedInIcon className="linkedInSvgIcon" />
            </a>

            <a href="https://instagram.com/uc_ujjawal" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;