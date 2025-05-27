// services/userService.js
const db = require('../config/db');
const User = require('../models/User');

class UserService {
  static async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
  }

  static async updateProfile(userId, fields) {
    // Only allow editing general info (e.g. name, profile_photo_url)
    const allowed = ['name', 'profile_photo_url'];
    const update = {};
    for (const key of allowed) {
      if (fields[key] !== undefined) update[key] = fields[key];
    }
    return User.update(userId, update);
  }

  static async listDoctors(userId, departmentId = null) {
    // 1) fetch the user to get their assigned doctor
    const me = await User.findById(userId);
    const assignedId = me.assigned_doctor_id;

    // 2) fetch all doctors (optionally filtered)
    const params = [];
    let sql = `SELECT * FROM users WHERE role='doctor'`;
    if (departmentId) {
      sql += ` AND department_id=$1`;
      params.push(departmentId);
    }
    sql += ` ORDER BY name`;
    const { rows } = await db.query(sql, params);

    // 3) reorder so assigned doctor is first
    if (assignedId) {
      const idx = rows.findIndex(d => d.id === assignedId);
      if (idx > -1) {
        const [assigned] = rows.splice(idx, 1);
        rows.unshift(assigned);
      }
    }
    return rows;
  }

  static async assignDoctor(userId, doctorId) {
    // ensure both exist and are correct roles
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      throw new Error('Invalid doctor');
    }
    return User.assignDoctor(userId, doctorId);
  }

  static async listUnassigned() {
    return User.getUnassigned();
  }
}

module.exports = UserService;
