const mongoose = require("mongoose");

const AboutSchema = new mongoose.Schema(
  {
    subtitle: { type: String, default: "ABOUT NETLANKA TOURS" },

    heading: { type: String, required: true },

    smallDescription: { type: String, default: "" },

    description: { type: String, required: true },

    fullDescription: [{ description: String }],

    features: [
      {
        title: String,
        description: String,
        image: String,
      },
    ],

    teamMembers: [
      {
        name: String,
        role: String,
        image: String,
      },
    ],

    gallery: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", AboutSchema);
