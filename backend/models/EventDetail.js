const mongoose = require("mongoose");

const EventDetailSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  heroTitle: String,
  heroSubtitle: String,
  heroImage: String,
  aboutParagraphs: [String],
  highlights: [String],
  duration: String,
  includes: [String],
  startLocation: String,
  galleryImgs: [String], 
  whyShouldAttend: String,
  whoShouldAttend: String,
  tipsForAttendees: String,
  planYourVisit: String,
});

module.exports = mongoose.model("EventDetail", EventDetailSchema);
