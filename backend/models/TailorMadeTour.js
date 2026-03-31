const mongoose = require("mongoose");

const TailorMadeTourSchema = new mongoose.Schema({
  description: { type: String, required: true },
  phone: { type: String, default: "" },
  whatsapp: { type: String, default: "" },
  howItWorks: [
    {
      description: String,
      image: String,
    },
  ],
  fullDescription: [
    {
      description: String,
    },
  ],
  gallery: [String],
});

module.exports = mongoose.model("TailorMadeTour", TailorMadeTourSchema);
