// middleware/errorHandler.js
const logger = require('../utils/logger');

/**
 * Global error handler—place as the last middleware in app.js
 */
module.exports = (err, req, res, next) => {
  logger.error('Unhandled error: %o', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
};
