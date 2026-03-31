const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
});

const journeySchema = new mongoose.Schema({
  fullDescription: [{ description: String }],
  milestones: [milestoneSchema],
  commonImage: { type: String },
});

module.exports = mongoose.model("Journey", journeySchema);
