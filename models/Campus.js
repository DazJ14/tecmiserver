const mongoose = require("mongoose")

const campusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  campus_majors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Major" }]
})

module.exports = mongoose.model("Campus", campusSchema)