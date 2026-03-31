const mongoose = require("mongoose");

const DayTourDetailSchema = new mongoose.Schema({
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DayTour",
    required: true,
  },

  heroImage: String,
  heroTitle: String,
  heroSubtitle: String,

  aboutParagraphs: [String],

  historyTitle: String,
  historyLeftList: [String],
  historyRightList: [String],

  gallerySlides: [
    {
      image: String,
      title: String,
      desc: String,
    },
  ],

  highlights: [String],
  duration: String,
  includes: [String],
  startLocation: String,
});

module.exports = mongoose.model("DayTourDetail", DayTourDetailSchema);
