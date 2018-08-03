const mongoose = require('mongoose');
var validate = require('mongoose-validator');

// Email Validation
var emailValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,
        message: 'Enter a valid email'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 40],
        message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

const DriverSchema = new mongoose.Schema({
    name: {type: String},
    email : { type:String, required:true, validate: emailValidator},
    driving: { type: Boolean, default:false}
});

module.exports = mongoose.model('driver',DriverSchema);