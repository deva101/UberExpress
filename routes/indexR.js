const DriverController = require('../controllers/driverC');

module.exports = (app) => {

  app.get('/api', DriverController.getDriverResponse );



};
