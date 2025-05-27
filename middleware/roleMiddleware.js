// middleware/roleMiddleware.js
/**
 * Usage: app.use('/admin', authMiddleware, roleMiddleware('admin'))
 */
module.exports = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
  }
  next();
};
