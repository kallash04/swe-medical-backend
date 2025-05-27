// routes/index.js
module.exports = (app) => {
  app.use('/auth',         require('./auth.routes'));
  app.use('/user',         require('./user.routes'));
  app.use('/appointments', require('./appointment.routes'));
  app.use('/history',      require('./history.routes'));
  app.use('/doctor',       require('./doctor.routes'));
  app.use('/api/ai',       require('./ai.routes'));
  app.use('/admin',        require('./admin.routes'));
  app.use('/departments',  require('./department.routes'));
  app.use('/availability', require('./availability.routes'));
};
