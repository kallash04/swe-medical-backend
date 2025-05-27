// controllers/availabilityController.js

const AvailabilityService = require('../services/availabilityService');
const { sendSuccess } = require('../utils/helpers');

exports.getWeekly = async (req, res, next) => {
  try {
    const availability = await AvailabilityService.getWeekly(req.user.id);
    sendSuccess(res, { availability });
  } catch (err) {
    next(err);
  }
};

exports.setWeekly = async (req, res, next) => {
  try {
    const blocks = req.body.blocks; // [{ day_of_week, start_time, end_time }, …]
    const availability = await AvailabilityService.setWeekly(req.user.id, blocks);
    sendSuccess(res, { availability });
  } catch (err) {
    next(err);
  }
};

exports.clearDay = async (req, res, next) => {
  try {
    const dayOfWeek = parseInt(req.params.dayOfWeek, 10);
    await AvailabilityService.clearDay(req.user.id, dayOfWeek);
    sendSuccess(res, {});
  } catch (err) {
    next(err);
  }
};
