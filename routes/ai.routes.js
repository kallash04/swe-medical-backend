// routes/ai.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const aiController   = require('../controllers/aiController');

// Protected: classify user issue into a department
router.use(authMiddleware);
router.post('/classify', aiController.classify);

module.exports = router;
