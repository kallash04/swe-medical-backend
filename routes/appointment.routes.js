// routes/appointment.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware        = require('../middleware/authMiddleware');
const appointmentController = require('../controllers/appointmentController');

// Protected routes for booking
router.use(authMiddleware);

// Calendar of available days:  ?doctorId=&monthStart=&monthEnd=
router.get('/calendar', appointmentController.getCalendar);

// Available 30-min slots: ?doctorId=&date=YYYY-MM-DD
router.get('/slots',    appointmentController.getSlots);

// Book a slot
router.post('/',         appointmentController.book);

// (Optional) Cancel or complete an appointment
router.post('/:appointmentId/cancel',   appointmentController.cancel);
router.post('/:appointmentId/complete', appointmentController.complete);
router.get('/services/:appointmentId', appointmentController.getServices);

module.exports = router;
