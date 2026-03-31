const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema(
  {
    subtitle: { type: String, required: true },
    title: { type: String, required: true },
    img: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destination", DestinationSchema);
