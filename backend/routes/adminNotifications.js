const router = require("express").Router();
const AdminNotification = require("../models/AdminNotification");

// GET ALL NOTIFICATIONS
router.get("/", async (req, res) => {
  const notifications = await AdminNotification.find().sort({ createdAt: -1 });
  res.json({ success: true, notifications });
});

// GET UNREAD NOTIFICATIONS
router.get("/unread", async (req, res) => {
  try {
    const notifications = await AdminNotification.find({ isRead: false }).sort({
      createdAt: -1,
    });
    res.json({ success: true, notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// MARK NOTIFICATION AS READ
router.put("/:id/read", async (req, res) => {
  try {
    const notification = await AdminNotification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, error: "Notification not found" });
    }
    res.json({ success: true, notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
