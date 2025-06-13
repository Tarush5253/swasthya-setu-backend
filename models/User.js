// File: backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'hospital_admin', 'bloodbank_admin'], required: true },
    hospitalInfo: {
        name: String,
        location: String,
        contact: String,
        beds: {
            icu: { available: Number, occupied: Number },
            general: { available: Number, occupied: Number },
            emergency: { available: Number, occupied: Number },
            pediatric: { available: Number, occupied: Number }
        }
    },
    bloodBankInfo: {
        name: String,
        location: String,
        contact: String,
        stock: {
            A_pos: Number,
            A_neg: Number,
            B_pos: Number,
            B_neg: Number,
            AB_pos: Number,
            AB_neg: Number,
            O_pos: Number,
            O_neg: Number,
        }
    }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', UserSchema);