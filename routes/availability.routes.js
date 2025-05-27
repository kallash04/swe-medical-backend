// routes/availability.routes.js

const express = require('express');
const router = express.Router();
const authMiddleware      = require('../middleware/authMiddleware');
const roleMiddleware      = require('../middleware/roleMiddleware');
const availabilityController = require('../controllers/availabilityController');

// All availability endpoints require an authenticated doctor
router.use(authMiddleware, roleMiddleware('user'));

// GET   /doctor/availability          → list all weekly blocks
// POST  /doctor/availability          → replace all blocks with req.body.blocks
// DELETE/doctor/availability/:dayOfWeek → clear blocks for that weekday
router.get(   '/',            availabilityController.getWeekly);
router.post(  '/',            availabilityController.setWeekly);
router.delete('/:dayOfWeek',  availabilityController.clearDay);

module.exports = router;
