// File: backend/controllers/requestController.js
const BedRequest = require('../models/BedRequest');
const BloodRequest = require('../models/BloodRequest');

exports.getUserBedRequests = async (req, res) => {
    try {
        const requests = await BedRequest.find({ user: req.user.id })
            .populate('hospital', 'name location contact');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserBloodRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find({ user: req.user.id })
            .populate('bloodBank', 'name location contact');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBedRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const request = await BedRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBloodRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const request = await BloodRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};