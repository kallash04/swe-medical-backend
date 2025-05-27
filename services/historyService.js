// services/historyService.js
const HistoryLog = require('../models/HistoryLog');

class HistoryService {
  static async getForRecord(recordId) {
    return HistoryLog.findByRecord(recordId);
  }

  static async add(recordId, changedBy, type, details) {
    return HistoryLog.log({
      record_id: recordId,
      changed_by: changedBy,
      change_type: type,
      change_details: details
    });
  }
}

module.exports = HistoryService;
