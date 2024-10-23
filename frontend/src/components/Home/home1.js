import React from 'react';
import AboutUs from './abouthub';  
import Support from './support';
import Counts from './counts';  
import './home.css';
import Slides from '../slides/slides';


const Home = () => {
  

  return (
    <div className="home">
     
      <AboutUs />
     <Slides/>
      <Support />
      <Counts/>
    </div>
  );
};

export default Home;
