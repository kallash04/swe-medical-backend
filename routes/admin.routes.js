// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middleware/authMiddleware');
const roleMiddleware  = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

// Admin‐only routes
router.use(authMiddleware, roleMiddleware('admin'));

// Manage users
router.get('/users',     adminController.listUsers);
router.post('/users',    adminController.createUser);
router.patch('/users/:userId', adminController.changeUserPassword);
router.delete('/users/:userId', adminController.deleteUser);

// Manage doctors
router.get('/doctors',   adminController.listDoctors);
router.post('/doctors',  adminController.createDoctor);

// View & assign unassigned users
router.get('/unassigned',         adminController.listUnassigned);
router.patch('/assign',           adminController.assignDoctor);

module.exports = router;
