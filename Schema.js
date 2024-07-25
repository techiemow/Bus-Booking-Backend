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


const BookingSchema = new schema({
    passengerName: {
        type: Array,
        required: true
    },
    busType: {
        type: String,
        required: true
    },
    departureTime: {
        type: String,
        required: true
    },
    From: {
        type: String,
        required: true
    },
    To: {
        type: String,
        required: true
    },
    numberOfSeats: {
        type: Array,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
});
const BookingModel = mongoose.model("Bookings", BookingSchema);

const RegistrationModel = mongoose.model('Registrations', RegistrationSchema);


module.exports = 
{
    RegistrationModel,
    BookingModel

}