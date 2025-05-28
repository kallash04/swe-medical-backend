// routes/user.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController  = require('../controllers/userController');

// All user endpoints require a valid JWT
router.use(authMiddleware);

// Get or update own profile
router.get('/profile',    userController.getProfile);
router.patch('/profile',  userController.updateProfile);
router.patch('/profile/password', userController.changeUserPassword);

// List doctors, optionally filtered by ?departmentId=
router.get('/doctors',    userController.listDoctors);

module.exports = router;
