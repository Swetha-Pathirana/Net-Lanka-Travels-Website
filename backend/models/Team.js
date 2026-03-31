const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
});

const TeamSchema = new mongoose.Schema({
  teamImage: { type: String },
  fullDescription: [{ description: String }],
  members: [teamMemberSchema],
});

module.exports = mongoose.model("Team", TeamSchema);
