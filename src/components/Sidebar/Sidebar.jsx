
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

import VentixeLogo     from '../../assets/ventixe-logo.png';
import DashboardIcon   from '../../assets/dashboard.png';
import BookingsIcon    from '../../assets/bookings.png';
import InvoicesIcon    from '../../assets/invoices.png';
import InboxIcon       from '../../assets/inbox.png';
import CalendarIcon    from '../../assets/calendar.png';
import EventsIcon      from '../../assets/events.png';
import FinancialsIcon  from '../../assets/financials.png';
import GalleryIcon     from '../../assets/gallery.png';
import FeedbackIcon    from '../../assets/feedback.png';
import PromoImg        from '../../assets/promo.png';
import SignoutIcon     from '../../assets/signout-icon.png';

// Tips  & Trix videos och felsökt med Chatgpt

const navItems = [
  { name: 'Dashboard',  icon: DashboardIcon,   path: '/dashboard'  },
  { name: 'Events',     icon: EventsIcon,      path: '/events'     },
  { name: 'Bookings',   icon: BookingsIcon,    path: '/bookings'   },
  { name: 'Calendar',   icon: CalendarIcon,    path: '/calendar'   },
  ];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <img src={VentixeLogo} alt="Ventixe logo" className="sidebar__logo" />

      <ul className="nav">
        {navItems.map(item => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav__item${isActive ? ' nav__item--active' : ''}`
              }
            >
              <img src={item.icon} alt={`${item.name} icon`} className="nav__icon" />
              <span className="nav__text">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sidebar__footer">
        <div className="promo">
          <img src={PromoImg} alt="Promo" className="promo__img" />
          <p className="promo__text">
            Experience enhanced features and a smoother interface with the latest version of Ventixe
          </p>
          <button className="promo__btn">Try New Version</button>
        </div>

        <button className="signout">
          <img src={SignoutIcon} alt="Sign Out" className="signout__icon" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
