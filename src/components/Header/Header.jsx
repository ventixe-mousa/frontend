import React from 'react';
import { useLocation } from 'react-router-dom';
import './Header.css';

import SearchIcon from '../../assets/search-logo.png';
import BellIcon   from '../../assets/belllogo.png';
import CogIcon    from '../../assets/settingslogo.png';
import Avatar     from '../../assets/avatar.png';

// Tips  & Trix videos och felsökt med Chatgpt

const routeToName = {
  '/dashboard': 'Dashboard',
  '/events':    'Events',
  '/bookings':  'Bookings',
  '/calendar':  'Calendar',
};

export default function Header() {
  const location = useLocation();

  const pageName = location.pathname === '/' 
    ? 'Dashboard'
    : location.pathname.slice(1).charAt(0).toUpperCase() 
      + location.pathname.slice(2);


  const showWelcome = pageName === 'Dashboard';

  return (
    <header className="header">
      <div className="header__title">
        <p className="header__breadcrumb">
          Dashboard{pageName !== 'Dashboard' && (
            <> <span className="header__breadcrumb--sep">/</span> <span className="header__breadcrumb--secondary">{pageName}</span></>
          )}
        </p>

        <h1 className="header__heading">{pageName}</h1>

        {showWelcome && (
          <p className="header__subheading">
            Hello Mousa El-Mir, welcome back!
          </p>
        )}
      </div>

      <div className="header__search">
        <img src={SearchIcon} alt="Search" className="header__search-icon" />
        <input
          type="text"
          placeholder="Search anything"
          className="header__search-input"
        />
      </div>

      <div className="header__actions">
        <img src={BellIcon} alt="Notifications" className="header__icon" />
        <img src={CogIcon}  alt="Settings"      className="header__icon" />

        <div className="header__user">
          {showWelcome && ( 
            <div>
              <span className="header__username">Mousa El-Mir</span>
              <span className="header__usertype">Admin</span>
            </div>
          )}
          <img src={Avatar} alt="Profile" className="header__avatar" />
        </div>
      </div>
    </header>
  );
}