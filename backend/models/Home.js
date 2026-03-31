const mongoose = require("mongoose");

const HomeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    info: {
      title: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      description: { type: String, default: "" },
      video: { type: String, default: "" },
    },
    stats: [
      {
        icon: { type: String, default: "" },
        title: { type: String, default: "" },
        count: { type: Number, default: 0 },
      },
    ],
    topActivities: [
      {
        icon: { type: String, default: "" },
        title: { type: String, default: "" },
      },
    ],
    whyChooseUs: [
      {
        icon: { type: String, default: "" },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Home", HomeSchema);
