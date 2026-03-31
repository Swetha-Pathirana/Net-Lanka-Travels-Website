const mongoose = require("mongoose");

const impactSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  images: [{ type: String }],
});

const communitySchema = new mongoose.Schema({
  description: [{ type: String }],
  impacts: [impactSchema],
});

module.exports = mongoose.model("CommunityImpact", communitySchema);
