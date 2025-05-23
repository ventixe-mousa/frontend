// Tips  & Trix video och felsökt med chatgpt

import React, { useEffect, useState } from 'react';
import {
  getCalendar,
  createCalendarEntry,
  deleteCalendarEntry
} from '../../services/calendarService.js';
import './CalendarPage.css';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const CATEGORIES = [
  { key: 'Setup & Rehearsal', colorClass: 'cp-dot--setup' },
  { key: 'Meeting',          colorClass: 'cp-dot--meeting' },
  { key: 'Event',            colorClass: 'cp-dot--event' },
  { key: 'Task Deadlines',   colorClass: 'cp-dot--deadline' }
];

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [showNewModal, setShowNewModal]       = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: CATEGORIES[0].key,
    date: '',
    description: ''
  });
  const [filter, setFilter] = useState({
    categories: CATEGORIES.map(c=>c.key),
    from: '',
    to: ''
  });

  const load = () => {
    setLoading(true);
    getCalendar(year, month + 1)
      .then(setEvents)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, [year, month]);

  const openNew = () => setShowNewModal(true);
  const closeNew = () => {
    setShowNewModal(false);
    setNewEvent({ title:'', category:CATEGORIES[0].key, date:'', description:'' });
  };
  const handleNewChange = e => {
    const { name, value } = e.target;
    setNewEvent(ne => ({ ...ne, [name]: value }));
  };
  const handleSaveNew = async () => {
    try {
      await createCalendarEntry({
        title: newEvent.title,
        category: newEvent.category,
        date: newEvent.date,
        description: newEvent.description
      });
      closeNew();
      load();
    } catch (err) {
      alert('Kunde inte spara agendan: ' + err.message);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Är du säker på att du vill ta bort denna agenda?')) return;
    try {
      await deleteCalendarEntry(id);
      setEvents(ev => ev.filter(x => x.id !== id));
    } catch (err) {
      alert('Kunde inte ta bort: ' + err.message);
    }
  };

  const toggleFilter = () => setShowFilterPanel(p => !p);
  const handleCategoryToggle = cat => {
    setFilter(f => {
      const cats = f.categories.includes(cat)
        ? f.categories.filter(x => x !== cat)
        : [...f.categories, cat];
      return { ...f, categories: cats };
    });
  };
  const handleFilterDateChange = e => {
    const { name, value } = e.target;
    setFilter(f => ({ ...f, [name]: value }));
  };
  const applyFilter = () => {
    const byCat = events.filter(ev => filter.categories.includes(ev.category));
    const byDate = byCat.filter(ev => {
      const d = new Date(ev.date);
      const from = filter.from ? new Date(filter.from) : null;
      const to   = filter.to   ? new Date(filter.to)   : null;
      return (!from || d >= from) && (!to || d <= to);
    });
    setEvents(byDate);
    setShowFilterPanel(false);
  };

  const goToToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  if (loading) return <p className="cp-loading">Laddar kalender…</p>;
  if (error)   return <p className="cp-error">Fel: {error}</p>;

  const byDay = events.reduce((acc, ev) => {
    const d = new Date(ev.date).getDate();
    if (!acc[d]) acc[d] = [];
    acc[d].push(ev);
    return acc;
  }, {});

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="calendar-page">

      <section className="cp-summary-wrapper">
        <div className="cp-summary">
          {CATEGORIES.map((c,i) => (
            <div key={i} className="cp-card">
              <div className="cp-card__text">
                <div className="cp-card__label">{c.key}</div>
                <div className="cp-card__count">
                  {events.filter(ev => ev.category === c.key).length}
                </div>
                <div className="cp-card__sub">Agenda</div>
              </div>
              <span className={`cp-dot ${c.colorClass}`} />
            </div>
          ))}
        </div>
      </section>

      <section className="cp-toolbar-wrapper">
        <div className="cp-toolbar">

          <div className="cp-month-picker">
            <select
              className="cp-month-select"
              value={month}
              onChange={e => setMonth(+e.target.value)}
            >
              {MONTHS.map((m,i) =>
                <option key={i} value={i}>{m} {year}</option>
              )}
            </select>
          </div>

          <ul className="cp-legend">
            {CATEGORIES.map((c,i) =>
              <li key={i}><span className={`cp-dot ${c.colorClass}`} />{c.key}</li>
            )}
          </ul>

          <div className="cp-actions">
            <button className="cp-btn cp-btn--filter" onClick={toggleFilter}>
              Filter
            </button>
            <button className="cp-btn cp-btn--month-action" onClick={goToToday}>
              Month
            </button>
            <button className="cp-btn cp-btn--new" onClick={openNew}>
              + New Agenda
            </button>
          </div>
        </div>
      </section>

      {showFilterPanel && (
        <div className="cp-filter-panel">
          <h3>Filter agendas</h3>
          <div className="filter-section">
            <strong>Category:</strong>
            {CATEGORIES.map(c => (
              <label key={c.key}>
                <input
                  type="checkbox"
                  checked={filter.categories.includes(c.key)}
                  onChange={() => handleCategoryToggle(c.key)}
                />
                {c.key}
              </label>
            ))}
          </div>
          <div className="filter-section">
            <strong>Date from:</strong>
            <input type="date" name="from" value={filter.from} onChange={handleFilterDateChange} />
          </div>
          <div className="filter-section">
            <strong>Date to:</strong>
            <input type="date" name="to"   value={filter.to}   onChange={handleFilterDateChange} />
          </div>
          <button className="cp-btn" onClick={applyFilter}>Apply</button>
        </div>
      )}

      {showNewModal && (
        <div className="cp-modal-overlay">
          <div className="cp-modal">
            <h3>New Agenda</h3>
            <label>
              Title
              <input name="title" value={newEvent.title} onChange={handleNewChange} />
            </label>
            <label>
              Category
              <select name="category" value={newEvent.category} onChange={handleNewChange}>
                {CATEGORIES.map(c => <option key={c.key}>{c.key}</option>)}
              </select>
            </label>
            <label>
              Date & Time
              <input type="datetime-local" name="date" value={newEvent.date} onChange={handleNewChange} />
            </label>
            <label>
              Description
              <textarea name="description" value={newEvent.description} onChange={handleNewChange} />
            </label>
            <div className="modal-actions">
              <button className="cp-btn" onClick={handleSaveNew}>Save</button>
              <button className="cp-btn" onClick={closeNew}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <section className="cp-grid-wrapper">
        <div className="calendar-grid">
          {calendarDays.map(d => (
            <div key={d} className="calendar-cell">
              <div className="cell-header">{d}</div>
              <ul className="cell-events">
                {(byDay[d] || []).map(ev => (
                  <li key={ev.id} className="cell-event">
                    <span className="event-title">{ev.title}</span>
                    <span className="event-cat">{ev.category}</span>
                    <button
                      className="cell-delete-btn"
                      onClick={() => handleDelete(ev.id)}
                      title="Ta bort"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
