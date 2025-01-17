const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  description: String,
  is_online: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: mongoose.Schema.Types.ObjectId, ref: "Status" },
  campus: { type: mongoose.Schema.Types.ObjectId, ref: "Campus", required: true },
  // role: { 
  //   type: mongoose.Schema.Types.ObjectId, 
  //   // enum: ["user", "admin", "moderator"], 
  //   // default: "user" },
  //   required: true
  // },
  profile_pic: { type: String, default: "https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png" },
  created_at: { type: Date, default: Date.now()}
});

// Método para encriptar contraseñas
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema)