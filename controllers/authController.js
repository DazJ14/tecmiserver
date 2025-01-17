const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Campus = require("../models/Campus")

exports.register = async (req, res) => {
  try {
    const { username, email, password, campus } = req.body;
    const findCampus = await Campus.findById(campus)
    console.log(findCampus)
    const newUser = await User.create({ username, email, password, campus });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
