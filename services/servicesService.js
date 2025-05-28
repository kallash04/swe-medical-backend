// services/servicesService.js
const Services = require('../models/Services');

class ServicesService {
  static async list() {
    return Services.getAll();
  }

  static async get(id) {
    return Services.getById(id);
  }

  static async create(data) {
    return Services.create(data);
  }

  static async update(id, data) {
    return Services.update(id, data);
  }

  static async delete(id) {
    return Services.delete(id);
  }
}

module.exports = ServicesService;
