const DriverController = require('../controllers/driverC');

module.exports = (app) => {

  // HomePage
    app.get('/', DriverController.homepage );

  // CREATE Driver
    app.post('/api/driver', DriverController.create );

    // Edit data
    // requested url: /api/driver/12
    // requested url: /api/driver/daads
    app.put('/api/driver/:id', DriverController.edit );

    // Delete data
    // requested url: /api/driver/12
    // requested url: /api/driver/daads
    app.delete('/api/driver/:id', DriverController.delete );

    // Delete data
    // requested url: /api/driver/12
    // requested url: /api/driver/daads
    app.get('/api/driver/', DriverController.index );


};
