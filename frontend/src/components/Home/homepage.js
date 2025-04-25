"use client";

import Image from 'next/image';
import React, { useState } from 'react';
import './homepage.css' ;
import './mobileview.css';
import About from './about';
import Testimonials from './testimonials';
import CrazyCubes from '../animation/CrazyCubes';
import Mentorship from './mentorship';
import Glimpse from './glimpse';

function Homepage() {
  
  return (
    <>
      <div id="home">
        <div className="hero-content">
          <div className="Upgrade">
            <h2>Upgrade Yourself!</h2>
            <p className="para">
              At TechNeeds, we’re passionate about technology and committed to empowering individuals with knowledge. Our community serves as a vibrant hub for tech enthusiasts, from beginners to experts, offering a comprehensive destination for all things tech.
            </p>
            <div className="home-btn">
              <button type="button" id="Know"><a href="#about">Know more</a></button>
              <button type="button" id="Get"><a href="#Mentorship">Get Started</a></button>
            </div>
          </div>
          <div className="hero-img">
            <CrazyCubes/>
          </div>
        </div>
        <About/>
        <Mentorship/>
        <Glimpse/>
        <Testimonials/>
      </div>
    </>
  );
}

export default Homepage;
