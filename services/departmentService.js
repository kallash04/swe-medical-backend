// services/departmentService.js
const Department = require('../models/Department');

class DepartmentService {
  static async list() {
    return Department.getAll();
  }

  static async get(id) {
    return Department.getById(id);
  }

  static async create(data) {
    // data = { name, bedrock_prompt }
    return Department.create(data);
  }

  static async update(id, data) {
    // data = { name, bedrock_prompt }
    return Department.update(id, data);
  }

  static async delete(id) {
    return Department.delete(id);
  }
}

module.exports = DepartmentService;
