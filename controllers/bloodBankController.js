// File: backend/controllers/bloodBankController.js
const { default: mongoose } = require('mongoose');
const BloodBank = require('../models/BloodBank');
const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');

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

// In your bloodBankController.js
exports.updateBloodStock = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { stock } = req.body;
    const adminId = req.params.id;

    // Validate input
    if (!stock || !adminId) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1. Update BloodBank stock
    const bloodBank = await BloodBank.findOneAndUpdate(
      { admin: adminId },
      { 
         $set: {
          "stock.A_pos": stock["A+"],
          "stock.A_neg": stock["A-"],
          "stock.B_pos": stock["B+"],
          "stock.B_neg": stock["B-"],
          "stock.AB_pos": stock["AB+"],
          "stock.AB_neg": stock["AB-"],
          "stock.O_pos": stock["O+"],
          "stock.O_neg": stock["O-"],
        },
       },
      { new: true, session }
    );

    console.log(bloodBank)
    if (!bloodBank) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Blood bank not found for this admin" });
    }

    // 2. Update the associated admin user's bloodBankInfo
    const updatedUser = await User.findOneAndUpdate(
      { _id: adminId, role: "bloodbank_admin" },
      {
        $set: {
          "bloodBankInfo.stock.A_pos": stock["A+"],
          "bloodBankInfo.stock.A_neg": stock["A-"],
          "bloodBankInfo.stock.B_pos": stock["B+"],
          "bloodBankInfo.stock.B_neg": stock["B-"],
          "bloodBankInfo.stock.AB_pos": stock["AB+"],
          "bloodBankInfo.stock.AB_neg": stock["AB-"],
          "bloodBankInfo.stock.O_pos": stock["O+"],
          "bloodBankInfo.stock.O_neg": stock["O-"],
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
      bloodBank: {
        id: bloodBank._id,
        stock: bloodBank.stock
      },
      user: {
        id: updatedUser._id,
        bloodBankInfo: updatedUser.bloodBankInfo
      }
    });
  } catch (err) {
    await session.abortTransaction();
    console.error('Error in updateBloodStock:', err);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  } finally {
    session.endSession();
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