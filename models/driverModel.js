const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    email : { type:String, required:true},
    driving: { type: Boolean, default:false}
});

module.exports = mongoose.model('driver',DriverSchema);