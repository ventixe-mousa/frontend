// src/services/calendarService.js

const BASE = import.meta.env.VITE_API_CALENDAR;

// Hämta kalenderposter för en viss månad och år
export async function getCalendar(year, month) {
  const res = await fetch(`${BASE}?year=${year}&month=${month}`);
  if (!res.ok) throw new Error(`Calendar fetch failed (${res.status})`);
  return res.json();
}

// Skapa en ny kalenderpost
export async function createCalendarEntry(payload) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Could not create entry (${res.status})`);
  return res.json();
}

// src/services/eventService.js

export async function getEvents() {
  const res = await fetch(import.meta.env.VITE_API_EVENTS);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}


// Ta bort en kalenderpost
export async function deleteCalendarEntry(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Could not delete entry (${res.status})`);
}
