const BASE = import.meta.env.VITE_API_CALENDAR;


export async function getCalendar(year, month) {
  const res = await fetch(`${BASE_URL}?year=${year}&month=${month}`);
  if (!res.ok) throw new Error(`Calendar fetch failed (${res.status})`);
  return res.json();
}

export async function createCalendarEntry(payload) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Could not create entry (${res.status})`);
  return res.json();
}

export async function deleteCalendarEntry(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Could not delete entry (${res.status})`);
  return;
}
