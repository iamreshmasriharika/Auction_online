import React from 'react';
import './homepage.css'
import { Link } from 'react-router-dom';


const HomePage = ({ darkMode }) => {
  return (
    <div className={`homepage-container ${darkMode ? 'dark-mode' : ''}`}>
<div className="background">
      <img src="https://tse4.mm.bing.net/th?id=OIP.-n75Q-zaIGdH1XrhzcHKsgHaHa&pid=Api&P=0&h=180" alt="" className="pic" />
      <div className="para">
        <h1 className="head">
          <span>Online Auction!</span>
        </h1>
        <h1 className="head">Make Your Bid</h1>

        <p className="desc">
        Experience the thrill of bidding from the comfort of your own space with our online auction platform. 
        Discover a curated collection of unique items, engage in competitive bidding, and secure your desired treasures.
        </p>
        <p className="d">
        Join us for an exciting journey where every click brings you closer to acquiring exclusive pieces through our seamless online auction experience
        </p>
        <div className="imgpop">
          <img src="k4.jpg" alt="" className="pop" />
          <img src="k3.jfif" alt="" className="pop" />
          <img src="k2.png" alt="" className="pop" />
          <img src="k5.jfif" alt="" className="pop" />
        </div>

        <a href="./bidding" className="nav-btn">
          <strong>Bid Now!!</strong>
        </a>
      </div>
    </div>
    </div>

       );
};

export default HomePage;
