// File: backend/controllers/hospitalController.js
const Hospital = require("../models/Hospital");
const BedRequest = require("../models/BedRequest");
const { default: mongoose } = require("mongoose");
const User = require("../models/User");

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
    const hospital = await Hospital.findOne({
      admin: req.params.adminId,
    }).populate("admin", "firstName lastName email role");

    if (!hospital)
      return res.status(404).json({ message: "Hospital not found" });
    res.json(hospital);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateBedAvailability = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { beds } = req.body;
    const adminId = req.params.id;  // Renamed for clarity

    // Validate input
    if (!beds || !adminId) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1. Update Hospital beds
    const hospital = await Hospital.findOneAndUpdate(
      { admin: adminId },  // Changed to use admin field
      { beds },
      { new: true, session }
    );

    if (!hospital) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Hospital not found for this admin" });
    }
  
    console.log(adminId)
    // 2. Update the associated admin user's hospitalInfo
    const updatedUser = await User.findOneAndUpdate(
      { _id: adminId, role: "hospital_admin" },
      {
        $set: {
          "hospitalInfo.beds.icu": beds.icu,
          "hospitalInfo.beds.general": beds.general,
          "hospitalInfo.beds.emergency": beds.emergency,
          "hospitalInfo.beds.pediatric": beds.pediatric,
        },
      },
      { new: true, session }
    );

    if (!updatedUser) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Admin user not found or not authorized" });
    }

    await session.commitTransaction();
    res.json({
      success: true,
      hospital: {
        id: hospital._id,
        beds: hospital.beds
      },
      user: {
        id: updatedUser._id,
        hospitalInfo: updatedUser.hospitalInfo
      }
    });
  } catch (err) {
    await session.abortTransaction();
    console.error('Error in updateBedAvailability:', err);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  } finally {
    session.endSession();
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
      user: req.user.id,
    });
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHospitalRequests = async (req, res) => {
  try {
    const requests = await BedRequest.find({
      hospital: req.params.hospitalId,
    }).populate("user", "firstName lastName email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
