const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const Notification = require("../models/Notification");
const SuperAdminNotification = require("../models/SuperAdminNotification");

// GET notifications sent BY super admin
router.get("/notifications", adminAuth, async (req, res) => {
  try {
    const { status, search } = req.query;

    const query = { admin: req.admin._id };

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { message: { $regex: search, $options: "i" } },
        { sections: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const [notifications, superAdminNotifications] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }),
      SuperAdminNotification.find(query).sort({ createdAt: -1 }),
    ]);

    const all = [...notifications, ...superAdminNotifications].sort(
      (a, b) => b.createdAt - a.createdAt
    );

    res.json({ notifications: all });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// mark notification as done
router.patch("/notifications/:id", adminAuth, async (req, res) => {
  try {
    // Try to find notification in Notification model
    let notification = await Notification.findOne({
      _id: req.params.id,
      admin: req.admin._id,
    });

    // If not found, check SuperAdminNotification
    let isSuperAdminNotification = false;
    if (!notification) {
      notification = await SuperAdminNotification.findOne({
        _id: req.params.id,
        admin: req.admin._id,
      });
      isSuperAdminNotification = true;
    }

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Update status
    notification.status = "done";
    await notification.save();

    // If this was a regular Notification, send it to super admin
    if (!isSuperAdminNotification) {
      await SuperAdminNotification.create({
        sections: notification.sections,
        action: notification.action,
        message: notification.message,
        priority: notification.priority,
        admin: req.admin._id,
      });
    }

    res.json({ success: true, notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to mark as done" });
  }
});

// DELETE notification
router.delete("/notifications/:id", adminAuth, async (req, res) => {
  try {
    // Try to delete from Notification model first
    let deleted = await Notification.findOneAndDelete({
      _id: req.params.id,
      admin: req.admin._id,
      status: "done",
    });

    let isSuperAdminNotification = false;

    // If not found, try SuperAdminNotification
    if (!deleted) {
      deleted = await SuperAdminNotification.findOneAndDelete({
        _id: req.params.id,
        admin: req.admin._id,
        status: "done",
      });
      isSuperAdminNotification = true;
    }

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Notification not found or not done" });
    }

    res.json({
      success: true,
      deletedFrom: isSuperAdminNotification
        ? "SuperAdminNotification"
        : "Notification",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete notification" });
  }
});

module.exports = router;
