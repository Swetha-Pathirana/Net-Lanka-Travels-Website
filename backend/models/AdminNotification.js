const mongoose = require("mongoose");

const AdminNotificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, required: true },
    bookingType: { type: String, default: "Custom" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminNotification", AdminNotificationSchema);
