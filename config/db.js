// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        
        await mongoose.connect(process.env.MONGO_URI
        //     , {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // }
    );
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1); // Exit with failure
    }
};

module.exports = connectDB;