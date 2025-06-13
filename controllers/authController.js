// File: backend/controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
