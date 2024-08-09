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
    busid:{
        type: Number,
        required: true
    },
    username:{
        type: String,
        required: true
    },
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
    },
    date: {
        type: Date,
        required: true // Ensure date is required
      },

      payment : { type : Boolean , default: false },
      razorpayOrderId: { // Add this field if storing Razorpay orderId
        type: String // Ensure this matches the format from Razorpay
    }

    
});
const BookingModel = mongoose.model("Bookings", BookingSchema);

const RegistrationModel = mongoose.model('Registrations', RegistrationSchema);


module.exports = 
{
    RegistrationModel,
    BookingModel

}