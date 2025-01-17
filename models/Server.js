const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
  moderators: [{ type: mongoose.Schema.Types.ObjectId }],
  created_at: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Server", serverSchema);