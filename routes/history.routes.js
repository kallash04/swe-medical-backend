// routes/history.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware    = require('../middleware/authMiddleware');
const historyController = require('../controllers/historyController');

// Protected: view own medical‐record history
router.use(authMiddleware);
router.get('/', historyController.getHistory);

module.exports = router;
