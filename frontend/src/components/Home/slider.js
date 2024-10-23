import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './slider.css';

const Slider = () => {
  return (
    <div className="latest-updates">
      <h2 className="heading">𝐋𝐚𝐭𝐞𝐬𝐭 𝐔𝐩𝐝𝐚𝐭𝐞𝐬</h2>
      <div className="content">
        <div className="slideshow">
          <Carousel showThumbs={false} infiniteLoop={true} autoPlay={true} showStatus={false}>
            <div>
              <img src="/Slider/chat.jpg" alt="Update 1" />
            </div>
            <div>
              <img src="/Slider/mern.jpg" alt="Update 2" />
            </div>
            <div>
              <img src="/Slider/hubpic.jpg" alt="Update 3" />
            </div>
          </Carousel>
        </div>
        <div className="text-contentt">
          <p>"Explore Khub's vibrant ecosystem where ideas thrive and partnerships flourish. With our image slider, you can immerse yourself in the latest updates on sessions, events, and breaking news. Join us in shaping the future of technology and education as we pave the way for impactful initiatives and meaningful experiences."</p>
        </div>
      </div>
    </div>
  );
};

export default Slider;
