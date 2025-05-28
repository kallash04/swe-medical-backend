// models/User.js
const db = require("../config/db");

class User {
  static table = "users";

  static async findById(id) {
    const res = await db.query(`SELECT * FROM ${this.table} WHERE id = $1`, [
      id,
    ]);
    return res.rows[0];
  }

  static async delete(id) {
    const res = await db.query(
      `DELETE FROM ${this.table}
     WHERE id = $1
     RETURNING *`,
      [id]
    );
    return res.rows[0];
  }

  static async findByEmail(email) {
    const res = await db.query(`SELECT * FROM ${this.table} WHERE email = $1`, [
      email,
    ]);
    return res.rows[0];
  }

  static async getAll() {
    const res = await db.query(`SELECT * FROM ${this.table} ORDER BY name`);
    return res.rows;
  }

  static async getUnassigned() {
    const res = await db.query(
      `SELECT * FROM ${this.table}
       WHERE role='user' AND assigned_doctor_id IS NULL
       ORDER BY name`
    );
    return res.rows;
  }

  static async create({
    email,
    password_hash,
    name,
    role,
    profile_photo_url,
    department_id,
  }) {
    const res = await db.query(
      `INSERT INTO ${this.table}
       (email, password_hash, name, role, profile_photo_url, department_id)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [email, password_hash, name, role, profile_photo_url, department_id]
    );
    return res.rows[0];
  }

  static async update(id, fields = {}) {
    const sets = [];
    const vals = [];
    let idx = 1;
    for (const [key, val] of Object.entries(fields)) {
      sets.push(`${key}=$${idx}`);
      vals.push(val);
      idx++;
    }
    if (sets.length === 0) return this.findById(id);
    vals.push(id);
    const res = await db.query(
      `UPDATE ${this.table}
       SET ${sets.join(", ")}, updated_at=NOW()
       WHERE id=$${idx}
       RETURNING *`,
      vals
    );
    return res.rows[0];
  }

  static async assignDoctor(userId, doctorId) {
    const res = await db.query(
      `UPDATE ${this.table}
       SET assigned_doctor_id=$1, updated_at=NOW()
       WHERE id=$2 RETURNING *`,
      [doctorId, userId]
    );
    return res.rows[0];
  }

  static async changePassword(id, newPasswordHash) {
    const res = await db.query(
      `UPDATE ${this.table}
       SET password_hash = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [newPasswordHash, id]
    );
    return res.rows[0];
  }
}

module.exports = User;
