// File: backend/controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Hospital = require("../models/Hospital");
const BloodBank = require("../models/BloodBank");

exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      hospitalInfo,
      bloodBankInfo,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "Email already registered",
        code: "EMAIL_EXISTS",
      });
    }

    let user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    if (role === "hospital_admin") {
      user.hospitalInfo = hospitalInfo;
      const hospital = new Hospital({
        ...hospitalInfo,
        admin: user._id,
      });
      await hospital.save();
    } else if (role === "bloodbank_admin") {
      user.bloodBankInfo = bloodBankInfo;
      const bloodBank = new BloodBank({
        ...bloodBankInfo,
        admin: user._id,
      });
      await bloodBank.save();
    }

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.verify = async (req, res) => {
  try {
    // The token is already verified by the auth middleware
    const user = await User.findById(req.user.id)
      .select('-password') // Exclude password field
      .lean(); // Convert to plain JavaScript object

    console.log(user)

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "User not found",
        code: "USER_NOT_FOUND"
      });
    }

    // If user is a hospital admin, populate hospital info
    // if (user.role === 'hospital_admin' && user.hospitalInfo) {
    //   const hospital = await Hospital.findOne({ name: user.hospitalInfo.name , location:user.hospitalInfo.location , contact : user.hospitalInfo.contact}).lean();
    //   user.hospitalInfo = hospital;
    // }

    // If user is a blood bank admin, populate blood bank info
    // if (user.role === 'bloodbank_admin' && user.bloodBankInfo) {
    //   const bloodBank = await BloodBank.findById(user.bloodBankInfo).lean();
    //   user.bloodBankInfo = bloodBank;
    // }

    res.json({ 
      success: true,
      user 
    });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      code: "INTERNAL_ERROR"
    });
  }
};