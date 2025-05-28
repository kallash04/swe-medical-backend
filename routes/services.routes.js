// routes/services.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const servicesController = require('../controllers/servicesController');

// Public: view all services
router.get('/', servicesController.list);
router.get('/:id', servicesController.get);

// Admin-only: create, update, delete
router.post('/', authMiddleware, roleMiddleware('admin'), servicesController.create);
router.put('/:id', authMiddleware, roleMiddleware('admin'), servicesController.update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), servicesController.delete);

module.exports = router;
