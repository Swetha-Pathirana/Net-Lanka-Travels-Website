const DayTourBooking = require("../models/DayTourBooking");
const RoundTourBooking = require("../models/RoundTourBooking");
const EventTourBooking = require("../models/EventTourBooking");
const TourBooking = require("../models/TourBooking");
const { createDayBeforeReminder } = require("../utils/notification");

exports.checkBookings = async () => {
  try {
    const day = await DayTourBooking.find();
    const round = await RoundTourBooking.find();
    const event = await EventTourBooking.find();
    const custom = await TourBooking.find();

    for (const b of day) await createDayBeforeReminder(b, "Day");
    for (const b of round) await createDayBeforeReminder(b, "Round");
    for (const b of event) await createDayBeforeReminder(b, "Event");
    for (const b of custom)
      await createDayBeforeReminder(
        b,
        b.tourType === "day" ? "Day" : "Round"
      );

    console.log("✅ Cron: all bookings checked");
  } catch (err) {
    console.error("❌ Cron error:", err);
  }
};
