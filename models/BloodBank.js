
const mongoose = require('mongoose');

const BloodBankSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    stock: {
        A_pos: Number,
        A_neg: Number,
        B_pos: Number,
        B_neg: Number,
        AB_pos: Number,
        AB_neg: Number,
        O_pos: Number,
        O_neg: Number,
    },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('BloodBank', BloodBankSchema);