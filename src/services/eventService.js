// src/services/eventService.js

const BASE = 'https://localhost:7226/api/events';

// Hämta events
export async function getEvents() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

// Skapa nytt event
export async function createEvent(payload) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

// Uppdatera event
export async function updateEvent(id, payload) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  // PUT returnerar 204 NoContent, så vi kan själv returnera payload med rätt id
  return { ...payload, id };
}

// Ta bort event
export async function deleteEvent(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
