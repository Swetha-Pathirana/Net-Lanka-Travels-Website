const mongoose = require("mongoose");

const SubExperienceSchema = new mongoose.Schema({
  location: String,
  place: String,
  image: String,
  desc: String,
});

const ExperienceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    heroImg: { type: String },
    mainImg: { type: String },
    description: { type: String },
    mainDesc: { type: String },
    subDesc: { type: String },
    subExperiences: [SubExperienceSchema],
    gallery: [String],
    tips: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", ExperienceSchema);
