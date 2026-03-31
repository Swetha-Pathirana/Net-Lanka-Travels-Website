const AdminNotification = require("../models/AdminNotification");
const DayTourBooking = require("../models/DayTourBooking");
const RoundTourBooking = require("../models/RoundTourBooking");
const EventTourBooking = require("../models/EventTourBooking");
const TourBooking = require("../models/TourBooking");
const { getDateOnly } = require("./date");

// Determine booking type
const getBookingType = (booking) => {
  if (booking.tourType === "day") return "Day";
  if (booking.tourType === "round") return "Round";
  if (booking.eventId) return "Event";
  return "Custom";
};

// Create day-before notification for a single booking
exports.createDayBeforeReminder = async (booking) => {
  try {
    const bookingDate = new Date(getDateOnly(booking.startDate));
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (bookingDate.toDateString() === tomorrow.toDateString()) {
      const exists = await AdminNotification.findOne({
        bookingId: booking._id,
      });
      if (!exists) {
        const type = getBookingType(booking);
        await AdminNotification.create({
          title: "Tour Reminder",
          message: `${type} tour booked by ${booking.name} is scheduled for tomorrow.`,
          bookingId: booking._id,
          bookingType: type,
        });
      }
    }
  } catch (err) {
    console.error("Notification creation error:", err);
  }
};

// Check all bookings for tomorrow
exports.checkBookings = async () => {
  try {
    const dayBookings = await DayTourBooking.find();
    const roundBookings = await RoundTourBooking.find();
    const eventBookings = await EventTourBooking.find();
    const customBookings = await TourBooking.find();

    const allBookings = [
      ...dayBookings,
      ...roundBookings,
      ...eventBookings,
      ...customBookings,
    ];

    for (const b of allBookings) {
      await exports.createDayBeforeReminder(b);
    }

    console.log("Cron: Notifications checked");
  } catch (err) {
    console.error("Cron error:", err);
  }
};
