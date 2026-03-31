const mongoose = require("mongoose");

const TourReviewSchema = new mongoose.Schema({
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: "DayTour", required: true }, 
  name: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.TourReview || mongoose.model("TourReview", TourReviewSchema);
