const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },

    heroImg: { type: String, required: true },

    galleryImgs: {
      type: [String],
      default: [],
      validate: [
        (arr) => arr.length <= 5,
        "Maximum 5 gallery images allowed",
      ],
    },

    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
