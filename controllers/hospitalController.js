// File: backend/controllers/hospitalController.js
const Hospital = require('../models/Hospital');
const BedRequest = require('../models/BedRequest');

exports.getAllHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.json(hospitals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getHospitalById = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
        res.json(hospital);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBedAvailability = async (req, res) => {
    try {
        const { beds } = req.body;
        const hospital = await Hospital.findByIdAndUpdate(
            req.params.id,
            { beds },
            { new: true }
        );
        res.json(hospital);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createBedRequest = async (req, res) => {
    try {
        const { patientName, requestType, priority } = req.body;
        const request = new BedRequest({
            patientName,
            requestType,
            priority,
            hospital: req.params.hospitalId,
            user: req.user.id
        });
        await request.save();
        res.status(201).json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getHospitalRequests = async (req, res) => {
    try {
        const requests = await BedRequest.find({ hospital: req.params.hospitalId })
            .populate('user', 'firstName lastName email');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};