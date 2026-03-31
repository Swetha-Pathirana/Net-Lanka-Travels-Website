const mongoose = require("mongoose");

const RoundTourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  days: { type: String },
  location: { type: String },
  desc: { type: String, required: true },
  img: { type: String, required: true },
}, { timestamps: true }); 

module.exports = mongoose.model("RoundTour", RoundTourSchema);
