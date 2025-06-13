// File: backend/controllers/bloodBankController.js
const BloodBank = require('../models/BloodBank');
const BloodRequest = require('../models/BloodRequest');

exports.getAllBloodBanks = async (req, res) => {
    try {
        const bloodBanks = await BloodBank.find();
        res.json(bloodBanks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBloodBankById = async (req, res) => {
    try {
        const bloodBank = await BloodBank.findById(req.params.id);
        if (!bloodBank) return res.status(404).json({ message: 'Blood bank not found' });
        res.json(bloodBank);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBloodStock = async (req, res) => {
    try {
        const { stock } = req.body;
        const bloodBank = await BloodBank.findByIdAndUpdate(
            req.params.id,
            { stock },
            { new: true }
        );
        res.json(bloodBank);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createBloodRequest = async (req, res) => {
    try {
        const { patientName, age, gender, contact, bloodGroup, units, reason, priority, hospitalName } = req.body;
        const request = new BloodRequest({
            patientName,
            age,
            gender,
            contact,
            bloodGroup,
            units,
            reason,
            priority,
            hospitalName,
            bloodBank: req.params.bloodBankId,
            user: req.user.id
        });
        await request.save();
        res.status(201).json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBloodBankRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find({ bloodBank: req.params.bloodBankId })
            .populate('user', 'firstName lastName email');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};