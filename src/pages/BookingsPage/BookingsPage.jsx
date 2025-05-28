import React, { useState, useEffect } from 'react'; 
import {
  getBookings,
  deleteBooking,
  createBooking,
  updateBooking
} from '../../services/bookingService';
import './BookingsPage.css';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    userName: '',
    eventId: '',
    date: '',
    ticketCategory: 'Standard',
    price: '',
    seats: ''
  });

  useEffect(() => {
    getBookings()
      .then(data => setBookings(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Är du säker på att du vill ta bort denna bokning?')) return;
    try {
      await deleteBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      alert(`Kunde inte ta bort bokningen: ${err.message}`);
    }
  };

  const openNew = () => {
    setFormData({
      id: null,
      userName: '',
      eventId: '',
      date: '',
      ticketCategory: 'Standard',
      price: '',
      seats: ''
    });
    setModalOpen(true);
  };

  const openEdit = booking => {
    setFormData({
      id: booking.id,
      userName: booking.userName,
      eventId: booking.eventId.toString(),
      date: new Date(booking.createdAt).toISOString().slice(0, 16),
      ticketCategory: 'Standard',
      price: '',
      seats: booking.seats.toString()
    });
    setModalOpen(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      userName: formData.userName,
      eventId: parseInt(formData.eventId),
      seats: parseInt(formData.seats),
      createdAt: new Date(formData.date).toISOString()
    };

    try {
      if (formData.id) {
        const updated = { id: formData.id, ...payload };
        await updateBooking(formData.id, updated);
        setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
      } else {
        const created = await createBooking(payload);
        setBookings(prev => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      alert(`Kunde inte spara: ${err.message}`);
    }
  };

  const filtered = bookings
    .filter(b => b.userName.toLowerCase().includes(search.toLowerCase()))
    .slice((page - 1) * perPage, page * perPage);

  const totalPages = Math.ceil(bookings.length / perPage);
  const amount = parseFloat(formData.price || 0) * parseInt(formData.seats || 0);

  return (
    <div className="bookings-page">
      <div className="bp-header">
        <h2 className="bp-title">Bookings</h2>
        <div className="bp-controls">
          <input
            type="text"
            className="bp-search"
            placeholder="Search name, event, etc"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-new" onClick={openNew}>+ New Booking</button>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{formData.id ? 'Edit Booking' : 'New Booking'}</h3>
            <form onSubmit={handleSubmit} className="event-form">
              <label>User Name
                <input
                  value={formData.userName}
                  onChange={e => setFormData({ ...formData, userName: e.target.value })}
                  required
                />
              </label>
              <label>Event ID
                <input
                  type="number"
                  value={formData.eventId}
                  onChange={e => setFormData({ ...formData, eventId: e.target.value })}
                  required
                />
              </label>
              <label>Date & Time
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </label>
              <label>Ticket Category
                <select
                  value={formData.ticketCategory}
                  onChange={e => setFormData({ ...formData, ticketCategory: e.target.value })}
                >
                  <option>Standard</option>
                  <option>VIP</option>
                  <option>Backstage</option>
                </select>
              </label>
              <label>Price
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </label>
              <label>Seats
                <input
                  type="number"
                  value={formData.seats}
                  onChange={e => setFormData({ ...formData, seats: e.target.value })}
                  required
                />
              </label>
              <label>Amount
                <input value={`$${amount || 0}`} disabled />
              </label>
              <div className="form-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bp-table-card">
        <table className="bp-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Date</th>
              <th>Name</th>
              <th>Event</th>
              <th>Ticket Category</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Amount</th>
              <th>Status</th>
              <th>E-Voucher</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td>INV{b.id.toString().padStart(4, '0')}</td>
                <td>
                  {new Date(b.createdAt).toLocaleDateString('sv-SE')}<br />
                  {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td>{b.userName}</td>
                <td>Event #{b.eventId}</td>
                <td>Standard</td>
                <td>${b.seats * 30}</td>
                <td>{b.seats}</td>
                <td>${b.seats * 30}</td>
                <td className={`bp-status bp-${b.seats > 1 ? 'confirmed' : 'pending'}`}>
                  {b.seats > 1 ? 'Confirmed' : 'Pending'}
                </td>
                <td>—</td>
                <td>
                  <button className="btn-edit" onClick={() => openEdit(b)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(b.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bp-pagination">
          <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>&lt;</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>&gt;</button>
        </div>
      </div>
    </div>
  );
}
