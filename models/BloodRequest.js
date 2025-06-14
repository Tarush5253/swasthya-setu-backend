// File: backend/models/BloodRequest.js
const mongoose = require('mongoose');

const BloodRequestSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    patientAge: { type: Number, required: true },
    patientGender: { type: String, required: true },
    contactNumber: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    units: { type: Number, required: true },
    purpose: { type: String, required: true },
    priority: { type: String, required: true },
    hospitalName: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
    bloodBank: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodBank' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('BloodRequest', BloodRequestSchema);