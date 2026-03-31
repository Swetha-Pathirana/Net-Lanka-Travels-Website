const mongoose = require("mongoose");

const AllowedSectionSchema = new mongoose.Schema({
  section: { type: String, required: true },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.AllowedSection || mongoose.model("AllowedSection", AllowedSectionSchema);
