// File: backend/models/Hospital.js
const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    beds: {
        icu: { available: Number, occupied: Number },
        general: { available: Number, occupied: Number },
        emergency: { available: Number, occupied: Number },
        pediatric: { available: Number, occupied: Number }
    },
    facilities: [String],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Hospital', HospitalSchema);