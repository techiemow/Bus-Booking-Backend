const mongoose = require('mongoose');
require('dotenv').config();

const connectdb = async () => {
    const mongodbUri = process.env.MONGO_URI;

    if (!mongodbUri) {
        console.error("MongoDB URI is not defined in the environment variables");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongodbUri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

module.exports = connectdb;
