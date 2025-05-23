import React, { useEffect, useState } from 'react';
import { getEvents } from '../../services/eventService';
import { getBookings } from '../../services/bookingService';
import { getCalendar } from '../../services/calendarService';
import './DashboardPage.css';

export default function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [agendas, setAgendas] = useState([]);

  useEffect(() => {
    getEvents().then(data => {
      const upcoming = data
        .filter(ev => new Date(ev.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
      setEvents(upcoming);
    }).catch(() => setEvents([]));

    getBookings().then(data => {
      const latest = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
      setBookings(latest);
    }).catch(() => setBookings([]));

    const now = new Date();
    getCalendar(now.getFullYear(), now.getMonth() + 1).then(data => {
      const today = data.filter(item => {
        const d = new Date(item.date);
        return d.toDateString() === now.toDateString();
      });
      setAgendas(today);
    }).catch(() => setAgendas([]));
  }, []);

  return (
    <div className="dashboard">
      <h2 className="dashboard__title">Dashboard Overview</h2>
      <div className="dashboard__grid">

        <section className="dashboard__card">
          <h3>📅 Upcoming Events</h3>
          {events.length === 0 ? <p>No upcoming events.</p> : (
            <ul>
              {events.map(ev => (
                <li key={ev.id}>
                  <strong>{ev.title}</strong><br/>
                  {new Date(ev.date).toLocaleDateString()} – {ev.location}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dashboard__card">
          <h3>🎟️ Recent Bookings</h3>
          {bookings.length === 0 ? <p>No bookings yet.</p> : (
            <ul>
              {bookings.map(b => (
                <li key={b.id}>
                  <strong>{b.userName}</strong> booked {b.seats} seat(s) for Event #{b.eventId}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dashboard__card">
          <h3>🗓️ Today’s Agenda</h3>
          {agendas.length === 0 ? <p>No agenda items today.</p> : (
            <ul>
              {agendas.map(a => (
                <li key={a.id}>
                  <strong>{a.title}</strong><br/>
                  {new Date(a.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {a.category}
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </div>
  );
}
