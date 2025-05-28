// models/Department.js
const db = require("../config/db");

class Department {
  static table = "departments";

  static async getAll() {
    const res = await db.query(`SELECT * FROM ${this.table} ORDER BY name`);
    return res.rows;
  }

  static async getById(id) {
    const res = await db.query(`SELECT * FROM ${this.table} WHERE id = $1`, [
      id,
    ]);
    return res.rows[0];
  }

  static async getByName(name) {
    const res = await db.query(`SELECT * FROM ${this.table} WHERE name = $1`, [
      name,
    ]);
    return res.rows[0];
  }

  static async create({ name, bedrock_prompt }) {
    const res = await db.query(
      `INSERT INTO ${this.table}(name, bedrock_prompt)
       VALUES($1,$2) RETURNING *`,
      [name, bedrock_prompt]
    );
    return res.rows[0];
  }

  static async update(id, { name, bedrock_prompt }) {
    const res = await db.query(
      `UPDATE ${this.table}
       SET name=$1, bedrock_prompt=$2, updated_at=NOW()
       WHERE id=$3 RETURNING *`,
      [name, bedrock_prompt, id]
    );
    return res.rows[0];
  }

  static async delete(id) {
    await db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
    return true;
  }
}

module.exports = Department;
