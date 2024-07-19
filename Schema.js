const mongoose = require('mongoose');

const schema = mongoose.Schema

const RegistrationSchema = new schema({
    username: {
        type: String,
        required: true
    },
    emailaddress: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
   
})

const RegistrationModel = mongoose.model('Registrations', RegistrationSchema);

module.exports = 
{
    RegistrationModel
}