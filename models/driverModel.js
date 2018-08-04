const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const PointSchema = new mongoose.Schema({
   type: {type:String, default:'Point'},
    coordinates: {type: [Number], index: '2dsphere'}
});

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
    driving: { type: Boolean, default:false},
    geometry: PointSchema
});

module.exports = mongoose.model('driver',DriverSchema);