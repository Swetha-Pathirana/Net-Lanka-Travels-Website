const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  section: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  superAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "SuperAdmin" },
  type: { type: String, enum: ["request", "completed"], default: "request" },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "done"], default: "pending" },
});

module.exports = mongoose.model("Notification", NotificationSchema);
