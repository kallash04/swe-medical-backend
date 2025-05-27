// routes/doctor.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware   = require('../middleware/authMiddleware');
const roleMiddleware   = require('../middleware/roleMiddleware');
const doctorController = require('../controllers/doctorController');

// All doctor endpoints require JWT + doctor role
router.use(authMiddleware, roleMiddleware('doctor'));

// Patients assigned to me
router.get('/patients',                   doctorController.getPatients);

// View & update an individual patient’s record
router.get('/patients/:patientId/record', doctorController.getPatientRecord);
router.put('/patients/:patientId/record', doctorController.updatePatientRecord);

// Manage my weekly availability
router.get('/availability',               doctorController.getAvailability);
router.post('/availability',              doctorController.setAvailability);
router.delete('/availability/:dayOfWeek', doctorController.clearAvailability);

// My appointment calendar & daily list
// ?monthStart=&monthEnd=
router.get('/calendar',                   doctorController.getCalendar);
// ?date=YYYY-MM-DD
router.get('/appointments',               doctorController.getAppointmentsByDate);

module.exports = router;
