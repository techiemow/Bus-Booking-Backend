const mongoose = require("mongoose")

const myprocess  = require("dotenv").config();
const mongodb= myprocess.parsed.MongoDb;

const connectdb = async() => {
    await mongoose.connect(mongodb);
    console.log("connect db", mongoose.connection.readyState);
    if(mongoose.connection.readyState === 1){
        console.log("db connected");
    } else {
        console.log("db not connected");

    }
}


module.exports = connectdb