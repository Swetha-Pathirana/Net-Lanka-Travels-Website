const mongoose = require("mongoose");

const DayTourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true }, 
  location: { type: String, required: true },
  desc: { type: String, required: true },
  img: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("DayTour", DayTourSchema);
