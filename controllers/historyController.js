// controllers/historyController.js
const HistoryService = require('../services/historyService');
const RecordService = require('../services/recordService');
const { sendSuccess } = require('../utils/helpers');

exports.getHistory = async (req, res, next) => {
  try {
    // fetch (or create) the user's medical record
    const record = await RecordService.getByUser(req.user.id);
    const history = await HistoryService.getForRecord(record.id);
    sendSuccess(res, { history });
  } catch (err) {
    next(err);
  }
};
