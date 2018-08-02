const DriverController = require('../controllers/driverC');

module.exports = (app) => {

  // HomePage
    app.get('/', DriverController.homepage );

  // CREATE Driver
    app.post('/api/driver', DriverController.create );

};
