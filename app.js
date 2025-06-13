// File: backend/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const bloodBankRoutes = require('./routes/bloodBankRoutes');
const requestRoutes = require('./routes/requestRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
// app.use(cors({
//   origin: [
//     'https://swasthya-setu-nu.vercel.app',
//     'http://localhost:3000' // For local development
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));

// In your backend
app.options('*', cors()); // Enable preflight for all routes


app.use(express.json());
app.use(morgan('dev'));

app.use(function (req, res, next) {

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/blood-banks', bloodBankRoutes);
app.use('/api/requests', requestRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error' });
});

module.exports = app;