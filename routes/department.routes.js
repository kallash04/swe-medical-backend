// routes/department.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const deptController = require('../controllers/departmentController');

// All endpoints require authentication
router.use(authMiddleware);

// Anyone authenticated can list or view
router.get('/',            deptController.list);
router.get('/:id',         deptController.get);

// Only admin can create/update/delete
router.post(
  '/',
  roleMiddleware('admin'),
  deptController.create
);
router.put(
  '/:id',
  roleMiddleware('admin'),
  deptController.update
);
router.delete(
  '/:id',
  roleMiddleware('admin'),
  deptController.delete
);

module.exports = router;
