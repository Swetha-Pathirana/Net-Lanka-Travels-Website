const mongoose = require("mongoose");

const RoundTourDetailSchema = new mongoose.Schema({
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoundTour",
    required: true,
    unique: true,
  },

  heroImage: String,
  heroTitle: String,
  heroSubtitle: String,

  highlights: [String],

  itinerary: [
    {
      day: Number,
      title: String,
      desc: String,
      activities: [String],
    },
  ],

  inclusions: [String],
  exclusions: [String],
  offers: [String],

  tourFacts: {
    duration: String,
    difficulty: String,
    groupSize: String,
  },

  gallerySlides: [
    {
      image: String,
      title: String,
      desc: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("RoundTourDetail", RoundTourDetailSchema);
