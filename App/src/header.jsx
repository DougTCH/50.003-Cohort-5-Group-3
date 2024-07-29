import React, {useState, useEffect} from 'react';
import { Link, useNavigate} from 'react-router-dom';
import './header.css';
import bankLogo from './assets/FETCH_LOGOS/FETCH_LOGO_HORIZONTAL.svg'
import bellIcon from './assets/UI_ASSETS/UI_RED_BELL.svg'
import bellRingIcon from './assets/UI_ASSETS/UI_RED_BELL_RING.svg'
import profileIcon from './assets/UI_ASSETS/UI_WHITE_PROFILE_BUTTON.svg'
import logoutIcon from './assets/UI_ASSETS/UI_WHITE_LOGOUT_BUTTON.svg'


function Header({ onLogout, role }) {

  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [email, setEmail] = useState('');
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
          <button
            onClick={() => navigate(role === 'admin' ? '/admin/Dashboard' : '/profile')}
            className="Profile"
            aria-label="Profile"
          >
            <img src={profileIcon} alt="Profile Icon" className="Profile_Icon" />
          </button>
          <button onClick={onLogout} className="Logout">
            <img src={logoutIcon} alt="Logout Icon" className="Logout_Icon" />
          </button>
        </div>
      </div>
      <nav className="nav">
        {role !== 'admin' ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/accounts">My Accounts</Link>
            <Link to="/transfer">Transfer</Link>
            <Link to="/pay">Pay</Link>
            <Link to="/cards">Cards</Link>
            <Link to="/apply">Apply</Link>
            <Link to="/loyaltypoints">Loyalty Points<sup>NEW!</sup></Link>
          </>
        ) : (
          <>
            <Link to="/admin/Dashboard">Admin Dashboard</Link>
            <Link to="/admin/loyaltypoints">Loyalty Points<sup>NEW!</sup></Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
