import React, {useState, useEffect} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './header.css';
import bankLogo from './assets/FETCH_LOGOS/FETCH_LOGO_HORIZONTAL.svg'
import bellIcon from './assets/UI_ASSETS/UI_RED_BELL.svg'
import bellRingIcon from './assets/UI_ASSETS/UI_RED_BELL_RING.svg'
import profileIcon from './assets/UI_ASSETS/UI_WHITE_PROFILE_BUTTON.svg'
import logoutIcon from './assets/UI_ASSETS/UI_WHITE_LOGOUT_BUTTON.svg'


function Header({ onLogout, role }) {

  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isNotificationsClicked, setIsNotificationsClicked] = useState(false);
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  
  useEffect(() => {
    // Placeholder first
    const fetchNotificationsStatus = () => {
      // Placeholder first
      const unreadNotifications = false;
      setHasUnreadNotifications(unreadNotifications);
    };
    fetchNotificationsStatus();
  }, []);
  
  useEffect(() => {
    // Reset profile and notifications clicked state when location changes
    if (location.pathname !== '/profile' && location.pathname !== '/admin/Dashboard') {
      setIsProfileClicked(false);
    }
    if (location.pathname !== '/notifications') {
      setIsNotificationsClicked(false);
    }
  }, [location]);

  const handleNotificationsClick = () => {
    setIsNotificationsClicked(true);
    navigate('/notifications');
  };

  const handleProfileClick = () => {
    setIsProfileClicked(true);
    navigate(role === 'admin' ? '/admin/Dashboard' : '/profile');
  };

  return (
    <header>
      <div className="Heading">
        <img className="logo" src={bankLogo} alt="Fetch Banking Logo" />
        <div className="Header_Buttons">
          <button
            onClick={handleNotificationsClick}
            className={`Notification_Button ${isNotificationsClicked ? 'clicked' : ''}`}
            aria-label="Notification"
          >
            <img
              src={hasUnreadNotifications ? bellRingIcon : bellIcon}
              alt="Notification Bell Icon"
              className="Notification_Icon"
            />
          </button>
          <button
            onClick={handleProfileClick}
            className={`Profile ${isProfileClicked ? 'clicked' : ''}`}
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
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
            <Link to="/accounts" className={location.pathname === '/accounts' ? 'active' : ''}>My Accounts</Link> 
            <Link to="/transfer" className={location.pathname === '/transfer' ? 'active' : ''}>Transfer</Link> 
            <Link to="/pay" className={location.pathname === '/pay' ? 'active' : ''}>Pay</Link> 
            <Link to="/cards" className={location.pathname === '/cards' ? 'active' : ''}>Cards</Link> 
            <Link to="/apply" className={location.pathname === '/apply' ? 'active' : ''}>Apply</Link> 
            <Link to="/loyaltypoints" className={location.pathname === '/loyaltypoints' ? 'active' : ''}>Loyalty Points<sup>NEW!</sup></Link>
          </>
        ) : (
          <>
            <Link to="/admin/Dashboard" className={location.pathname === '/admin/Dashboard' ? 'active' : ''}>Admin Dashboard</Link> 
            <Link to="/admin/loyaltypoints" className={location.pathname === '/admin/loyaltypoints' ? 'active' : ''}>Loyalty Points<sup>NEW!</sup></Link> 
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
