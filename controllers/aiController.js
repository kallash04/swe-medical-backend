// controllers/aiController.js
const AIService = require('../services/aiService');
const { sendSuccess } = require('../utils/helpers');

exports.classify = async (req, res, next) => {
  try {
    const { text } = req.body;
    const departmentId = await AIService.classifyIssue(text);
    sendSuccess(res, { departmentId });
  } catch (err) {
    next(err);
  }
};
