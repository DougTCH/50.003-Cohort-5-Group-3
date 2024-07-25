import React, {useState, useEffect} from 'react';
import { Link, useNavigate} from 'react-router-dom';
import './header.css';
import bankLogo from './assets/Banklogo.svg'
import bellIcon from './assets/UI_ASSETS/UI_RED_BELL.png'
import bellRingIcon from './assets/UI_ASSETS/UI_RED_BELL_RING.png'


function Header({ onLogout}) {

  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    // Placeholder first
    const fetchNotificationsStatus = () => {
      // Placeholder first
      const unreadNotifications = false;
      setHasUnreadNotifications(unreadNotifications);
    };
    fetchNotificationsStatus();
  }, []);
  

  return (
    <header>
      <div className="Heading">
        <img className="logo" src={bankLogo} alt="Fetch Banking Logo" />
      
        <div className="Header_Buttons">
          <button 
            onClick={() => navigate('/notifications')}
            className="Notification_Button"
            aria-label="Notification"
          >
            <img
              src={hasUnreadNotifications ? bellRingIcon : bellIcon}
              alt="Notification Bell Icon"
              className="Notification_Icon"
            />
          </button>
          <button onClick={() => alert("PROFILE")} className="Profile">Profile</button>
          <button onClick= {onLogout} className="Logout">Logout</button>
        </div>
      </div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/accounts">My Accounts</Link>
        <Link to="/transfer">Transfer</Link>
        <Link to="/pay">Pay</Link>
        <Link to="/cards">Cards</Link>
        <Link to="/apply">Apply</Link>
        <Link to="/loyaltypoints">Loyalty Points<sup>NEW!</sup></Link>
      </nav>
    </header>
  );
}

export default Header;
