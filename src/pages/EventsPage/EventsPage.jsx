import React, { useEffect, useState } from 'react';

// Tips och trix, tagit av andra system och felsökt med chatgpt
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} from '../../services/eventService';
import mapPinIcon from '../../assets/mappin.png';
import calendarIcon from '../../assets/calendardot.png';
import placeholder from '../../assets/placeholder.png';
import ticketIcon from '../../assets/ticketicon.png';
import './EventsPage.css';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [viewMode] = useState('grid');
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    category: 'Music',
    description: '',
    location: '',
    date: '',
    image: '',
    ticketsLeft: '',
    ticketsSold: 0,
    price: '',
    isDraft: false
  });

  useEffect(() => {
    getEvents()
      .then(data => setEvents(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const openNew = () => {
    setFormData({
      id: null,
      title: '',
      category: 'Music',
      description: '',
      location: '',
      date: '',
      image: '',
      ticketsLeft: '',
      ticketsSold: 0,
      price: '',
      isDraft: false
    });
    setFormOpen(true);
  };

  const openEdit = ev => {
    setFormData({
      ...ev,
      date: new Date(ev.date).toISOString().slice(0, 16),
      ticketsLeft: ev.ticketsLeft.toString(),
      price: ev.price.toString(),
      isDraft: ev.isDraft || false
    });
    setFormOpen(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.title || !formData.date || formData.price === '' || formData.ticketsLeft === '') {
      return alert('Vänligen fyll i alla obligatoriska fält.');
    }

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        date: new Date(formData.date).toISOString(),
        image: formData.image || '',
        price: parseFloat(formData.price),
        ticketsLeft: parseInt(formData.ticketsLeft, 10),
        ticketsSold: formData.id ? formData.ticketsSold : 0,
        isDraft: formData.isDraft
      };

      let saved;
      if (formData.id) {
        saved = await updateEvent(formData.id, { id: formData.id, ...payload });
        setEvents(prev => prev.map(ev => ev.id === saved.id ? saved : ev));
      } else {
        saved = await createEvent(payload);
        setEvents(prev => [saved, ...prev]);
      }

      setFormOpen(false);
    } catch (err) {
      alert(`Kunde inte spara: ${err.message}`);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Är du säker på att ta bort detta event?')) return;
    try {
      await deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert(`Kunde inte ta bort eventet: ${err.message}`);
    }
  };

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p className="events-page__error">Error: {error}</p>;

  return (
    <div className={`events-page events-page--${viewMode}`}>
      <div className="events-page__new">
        <button className="btn-new" onClick={openNew}>+ New Event</button>
      </div>

      {isFormOpen && (
        <div className="modal-backdrop" onClick={() => setFormOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{formData.id ? 'Edit Event' : 'New Event'}</h3>
            <form onSubmit={handleSubmit} className="event-form">
              <label>Title
                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </label>
              <label>Category
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                  <option>Music</option>
                  <option>Sport</option>
                  <option>Fashion</option>
                  <option>Art & Design</option>
                </select>
              </label>
              <label>Date & Time
                <input type="datetime-local" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
              </label>
              <label>Description
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </label>
              <label>Location
                <input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
              </label>
              <label>Price
                <input type="number" min="0" step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
              </label>
              <label>Tickets Left
                <input type="number" min="0" required value={formData.ticketsLeft} onChange={e => setFormData({ ...formData, ticketsLeft: e.target.value })} />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formData.isDraft}
                  onChange={e => setFormData({ ...formData, isDraft: e.target.checked })}
                />
                Save as draft
              </label>
              <div className="form-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setFormOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={`events-list events-list--${viewMode}`}>
        {events.map(ev => (
          <div key={ev.id} className="event-card">
            <div className="event-card__image">
              <img src={placeholder} alt={ev.title} />
            </div>
            <div className="event-card__content">
              <span className="event-card__category">{ev.category}</span>
              <h3 className="event-card__title">{ev.title}</h3>
              <p className="event-card__desc">{ev.description}</p>
            </div>
            <div className="event-card__meta">
              <div className="meta-item">
                <img src={mapPinIcon} alt="Location" className="meta-icon" />
                <span>{ev.location}</span>
              </div>
              <div className="meta-item">
                <img src={calendarIcon} alt="Date" className="meta-icon" />
                <span>
                  {new Date(ev.date).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric'
                  })} – {new Date(ev.date).toLocaleTimeString([], {
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            <div className="event-card__stats">
              <div className="progress-bar">
                <div className="progress-bar__fill" style={{ width: `${ev.ticketsSoldPercent}%` }} />
              </div>
              <span className="stats-label">{ev.ticketsSoldPercent}%</span>
            </div>
            <div className="event-card__actions">
              <div className="tickets-block">
                <img src={ticketIcon} alt="Tickets" className="ticket-icon" />
                <div className="tickets-info">
                  <div className="tickets-left">{ev.ticketsLeft}</div>
                  <div className="tickets-label">Tickets Left</div>
                </div>
              </div>
              <button className="btn-price">${ev.price}</button>
            </div>
            <div className="event-card__footer">
              <button className="btn-edit" onClick={() => openEdit(ev)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(ev.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
