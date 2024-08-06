import React, { useEffect, useState } from 'react';
import ad1 from '../assets/HOMEPAGE_ADS_ASSETS/HOMEPAGE_AD_1.png';
import ad2 from '../assets/HOMEPAGE_ADS_ASSETS/HOMEPAGE_AD_2.png';
import ad3 from '../assets/HOMEPAGE_ADS_ASSETS/HOMEPAGE_AD_3.png';
import ad4 from '../assets/HOMEPAGE_ADS_ASSETS/HOMEPAGE_AD_4.png';
import { getUserData } from '../../utils/userdata';
import './home.css';

const advertsData = [
  {
    name: "HOMEPAGE_AD_1",
    image: ad1,
    header: "Craving a Holiday?",
    body_text: "Forget about the fuss of getting there: we are sure you'll like our one-click vacation packages!\n\nFrom the tropical getaways of Bali to the snowy alps of Switzerland, you're sure to find an adventure that interests you.\n\nLimited slots available! What are you waiting for?",
    cta_button: "Bring Me There!"
  },
  {
    name: "HOMEPAGE_AD_2",
    image: ad2,
    header: "No More Worries.",
    body_text: "Is your current car insurance giving you a headache? Say no to complicated plans and check out our Supreme Coverage Plan!\n\nInsurance that is transparent, cost-effective, and easy to understand: Say bye-bye to all the stress!",
    cta_button: "Register Now"
  },
  {
    name: "HOMEPAGE_AD_3",
    image: ad3,
    header: "Celebrate Christmas with Royal Air!",
    body_text: "Fly like a royal this Christmas! We are delighted to partner with Royal Air to giveaway discount vouchers worth up to $500 to 10 lucky winners!\n\nSimply follow a few easy steps and stand a chance to win; terms and conditions apply. Sign ups close on Nov 15.",
    cta_button: "Sign Up Now"
  },
  {
    name: "HOMEPAGE_AD_4",
    image: ad4,
    header: "Gift for That Special Someone This Season.",
    body_text: "Surprise a special someone this season with our limited edition credit card, jam packed with seasonal promotions and perks!\n\nBy giving someone this card, you can stand a chance to win an all-inclusive travel package! What are you waiting for? Spread the joy!",
    cta_button: "Find Out More!"
  }
];

function Home() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    points: 0,
    user_id: ''
  });
  const [currentAdvert, setCurrentAdvert] = useState(0);

  useEffect(() => {
    try {
      const data = getUserData();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }

    const interval = setInterval(() => {
      setCurrentAdvert((prevAdvert) => (prevAdvert + 1) % advertsData.length);
    }, 5000); // Change advert every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handlePrevClick = () => {
    setCurrentAdvert((prevAdvert) => (prevAdvert - 1 + advertsData.length) % advertsData.length);
  };

  const handleNextClick = () => {
    setCurrentAdvert((prevAdvert) => (prevAdvert + 1) % advertsData.length);
  };

  if (advertsData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="home-container">
        <div className="image-container">
          <img src={advertsData[currentAdvert].image} alt="Home" className="home-image" />
          <div className="black-gradient-overlay"></div>
          <div className="nav-buttons">
            <button className="nav-button" onClick={handlePrevClick}>
              Prev
            </button>
            <button className="nav-button" onClick={handleNextClick}>
              Next
            </button>
          </div>
        </div>
        <div className="text-container">
          <h1>{advertsData[currentAdvert].header}</h1>
          <p>{advertsData[currentAdvert].body_text.split('\n').map((text, index) => (
            <span key={index}>{text}<br /></span>
          ))}</p>
          <button className="cta-button">
            {advertsData[currentAdvert].cta_button}
          </button>
        </div>
      </div>
      <div className="user-info-container">
        <h1 className="user-info-title">Welcome Back to FETCH!</h1>
        <p className="user-info-text">Hello, {userData.firstName} {userData.lastName}.</p>
        <p className="user-info-text">You have {userData.points} points.</p>
        <p className="user-info-text">Membership ID is {userData.user_id}.</p>
        <p className="user-info-text">TC token is {sessionStorage.getItem('tctoken')}</p>
      </div>
    </div>
  );  

}

export default Home;
