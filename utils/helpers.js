// utils/helpers.js

/**
 * Format a Date (or date-string) to "YYYY-MM-DD HH:mm:ss"
 */
const formatDateTime = (dateInput) => {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const pad = (n) => String(n).padStart(2, '0');
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate())
  ].join('-') + ' ' + [
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())
  ].join(':');
};

/**
 * Send a standardized JSON success response
 */
const sendSuccess = (res, data = {}, status = 200) => {
  res.status(status).json({ data });
};

/**
 * Send a standardized JSON error response
 */
const sendError = (res, error = 'An error occurred', status = 500) => {
  res.status(status).json({ error });
};

/**
 * Generate 30-minute timeslots (or custom duration) between two times.
 * @param {string} startTime - "HH:mm"
 * @param {string} endTime   - "HH:mm"
 * @param {number} slotDuration - minutes per slot (default 30)
 * @returns {string[]} array of ISO timestamp strings
 */
const generateTimeSlots = (dateInput, startTime, endTime, slotDuration = 30) => {
  const baseDate = dateInput instanceof Date ? new Date(dateInput) : new Date(dateInput);
  const [h1, m1] = startTime.split(':').map(Number);
  const [h2, m2] = endTime.split(':').map(Number);
  const slots = [];

  const current = new Date(baseDate);
  current.setHours(h1, m1, 0, 0);

  const end = new Date(baseDate);
  end.setHours(h2, m2, 0, 0);

  while (current.getTime() + slotDuration * 60000 <= end.getTime()) {
    slots.push(current.toISOString());
    current.setTime(current.getTime() + slotDuration * 60000);
  }

  return slots;
};

module.exports = {
  formatDateTime,
  sendSuccess,
  sendError,
  generateTimeSlots,
};
