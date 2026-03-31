const mongoose = require("mongoose");

const TripadvisorReviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true },
    source: { type: String, default: "TripAdvisor" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TripadvisorReview", TripadvisorReviewSchema);
