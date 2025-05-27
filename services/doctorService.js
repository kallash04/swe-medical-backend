// services/doctorService.js

const db = require('../config/db');
const RecordService = require('./recordService');
const AppointmentService = require('./appointmentService');
const AvailabilityService = require('./availabilityService');

class DoctorService {
  /**
   * List all patients assigned to this doctor
   */
  static async getAssignedPatients(doctorId) {
    const res = await db.query(
      `SELECT id, name, email, profile_photo_url
       FROM users
       WHERE assigned_doctor_id = $1
         AND role = 'user'
       ORDER BY name`,
      [doctorId]
    );
    return res.rows;
  }

  /**
   * Fetch a single patient's medical record
   */
  static async getPatientRecord(patientId) {
    return RecordService.getByUser(patientId);
  }

  /**
   * Update a patient's medical data (only allowed doctor)
   */
  static async updatePatientRecord(patientId, newData, doctorId) {
    const record = await RecordService.getByUser(patientId);
    return RecordService.update(
      record.id,
      newData,
      doctorId,
      'doctor_update'
    );
  }

  /**
   * Get this doctor's weekly availability blocks
   */
  static async getAvailability(doctorId) {
    return AvailabilityService.getWeekly(doctorId);
  }

  /**
   * Overwrite weekly availability (array of {day_of_week, start_time, end_time})
   */
  static async setAvailability(doctorId, blocks) {
    return AvailabilityService.setWeekly(doctorId, blocks);
  }

  /**
   * Clear availability for a given weekday
   */
  static async clearAvailability(doctorId, dayOfWeek) {
    return AvailabilityService.clearDay(doctorId, dayOfWeek);
  }

  /**
   * Get calendar highlights (dates with appointments) for a month
   */
  static async getCalendar(doctorId, monthStart, monthEnd) {
    return AppointmentService.getCalendar(doctorId, monthStart, monthEnd);
  }

  /**
   * Get all appointments on a specific date
   */
  static async getAppointmentsByDate(doctorId, date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    return AppointmentService.getSlots(doctorId, date)
      .then(slots => {
        // fetch full appt data for those slots
        return AppointmentService.getByDate(
          doctorId,
          start.toISOString(),
          end.toISOString()
        );
      });
  }
}

module.exports = DoctorService;
