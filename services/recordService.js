// services/recordService.js
const MedicalRecord = require('../models/MedicalRecord');
const HistoryLog = require('../models/HistoryLog');

class RecordService {
  static async getByUser(userId) {
    let rec = await MedicalRecord.findByUserId(userId);
    if (!rec) {
      rec = await MedicalRecord.create({
        user_id: userId,
        data: {},
        last_edited_by: null
      });
    }
    return rec;
  }

  static async update(recordId, newData, editorId, changeType) {
    const updated = await MedicalRecord.update(recordId, newData, editorId);
    await HistoryLog.log({
      record_id: recordId,
      changed_by: editorId,
      change_type: changeType,
      change_details: newData
    });
    return updated;
  }
}

module.exports = RecordService;
