// File: backend/controllers/requestController.js
const BedRequest = require("../models/BedRequest");
const BloodRequest = require("../models/BloodRequest");
const Hospital = require("../models/Hospital");
const BloodBank = require("../models/BloodBank")

exports.getUserBedRequests = async (req, res) => {
  try {
    const requests = await BedRequest.find({ user: req.user.id }).populate(
      "hospital",
      "name location contact"
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHospitalBedRequests = async (req, res) => {
  try {
    const hospital = await Hospital.find({ admin: req.user.id });

    if (!hospital) {
      res.status(404).json({ message: "hospital not found" });
    }
    const requests = await BedRequest.find({ hospital});
    console.log(requests)
    res.json(requests);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};

exports.getUserBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({ user: req.user.id }).populate(
      "bloodBank",
      "name location contact"
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHospitalBloodRequests = async (req, res) => {
  try {
    const bloodBank = await BloodBank.find({ admin: req.user.id });

    if (!bloodBank) {
      res.status(404).json({ message: "BloodBank not found" });
    }
    const requests = await BloodRequest.find({ bloodBank});
    console.log(requests)
    res.json(requests);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};

exports.createBedRequest = async (req, res) => {
  try {
    const { patientName, patientAge, patientGender, contactNumber, bedType, priority, medicalCondition } = req.body;
    const { hospitalId } = req.params;
    const userId = req.user._id;

    const newRequest = new BedRequest({
      patientName,
      patientAge,
      patientGender,
      contactNumber,
      bedType,
      priority,
      medicalCondition,
      hospital: hospitalId,
      user: userId,
      status: 'Pending'
    });

    const savedRequest = await newRequest.save();
    res.status(201).json({
      success: true,
      data: savedRequest,
      message: 'Bed request submitted successfully'
    });
  } catch (error) {
    console.error('Error creating bed request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit bed request',
      error: error.message
    });
  }
};

exports.createBloodRequest = async (req, res) => {
  try {
    const {
      patientName,
      patientAge,
      patientGender,
      contactNumber,
      bloodGroup,
      units,
      purpose,
      priority,
      hospitalName
    } = req.body;
    
    const { bloodBankId } = req.params;
    const userId = req.user._id;

    const newRequest = new BloodRequest({
      patientName,
      patientAge,
      patientGender,
      contactNumber,
      bloodGroup,
      units,
      purpose,
      priority,
      hospitalName,
      bloodBank: bloodBankId,
      user: userId,
      status: 'Pending'
    });

    const savedRequest = await newRequest.save();
    
    res.status(201).json({
      success: true,
      data: savedRequest,
      message: 'Blood request submitted successfully'
    });
  } catch (error) {
    console.error('Error creating blood request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit blood request',
      error: error.message
    });
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

exports.getUserRequestHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Fetch requests in parallel
    const [bloodRequests, bedRequests] = await Promise.all([
      BloodRequest.find({ user: userId })
        .populate('bloodBank', 'name location')
        .sort({ createdAt: -1 })
        .lean(),
      BedRequest.find({ user: userId })
        .populate('hospital', 'name location')
        .sort({ timestamp: -1 })
        .lean()
    ]);

    // Transform and combine requests
    const combinedRequests = [
      ...bloodRequests.map(r => ({
        ...r,
        type: 'blood',
        date: r.createdAt,
        location: r.hospitalName || r.bloodBank?.name,
        description: `Blood (${r.bloodGroup}) - ${r.units} units`
      })),
      ...bedRequests.map(r => ({
        ...r,
        type: 'bed',
        date: r.timestamp,
        location: r.hospital?.name,
        description: `${r.bedType} Bed`
      }))
    ].sort((a, b) => b.date - a.date);

    res.status(200).json({
      success: true,
      data: combinedRequests
    });
  } catch (error) {
    console.error('Error fetching request history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch request history'
    });
  }
};

// Get single request details
exports.getRequestDetails = async (req, res) => {
  try {
    const { requestId, type } = req.params;
    const userId = req.user._id;

    let request;
    if (type === 'blood') {
      request = await BloodRequest.findOne({ _id: requestId, user: userId })
        .populate('bloodBank', 'name location contact');
    } else if (type === 'bed') {
      request = await BedRequest.findOne({ _id: requestId, user: userId })
        .populate('hospital', 'name location contact');
    } else {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid request type' 
      });
    }

    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Request not found or unauthorized' 
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...request.toObject(),
        type
      }
    });
  } catch (error) {
    console.error('Error fetching request details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch request details'
    });
  }
};