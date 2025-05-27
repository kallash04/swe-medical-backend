// middleware/validateRequest.js
const Joi = require('joi');

/**
 * Wrap a Joi schema to validate req.body.
 * Strips unknown fields and collects all errors.
 *
 * Usage: router.post('/', validateRequest(schema), controller.create)
 */
module.exports = (schema) => (req, res, next) => {
  const options = { abortEarly: false, allowUnknown: true, stripUnknown: true };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    const messages = error.details.map(d => d.message);
    return res.status(400).json({ error: messages });
  }
  req.body = value;
  next();
};
