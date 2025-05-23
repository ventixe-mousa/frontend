// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar/Sidebar';
import Header  from './components/Header/Header';
import Footer  from './components/Footer/Footer';


import DashboardPage from './pages/DashboardPage/DashboardPage';
import EventsPage    from './pages/EventsPage/EventsPage';
import BookingsPage  from './pages/BookingsPage/BookingsPage';
import CalendarPage  from './pages/CalendarPage/CalendarPage';
import './theme.css';

// import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 overflow-auto bg-gray-50 p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/events"    element={<EventsPage />} />
              <Route path="/bookings"  element={<BookingsPage />} />
              <Route path="/calendar"  element={<CalendarPage />} />
            </Routes>
           
          </main>

          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}
