const mongoose = require("mongoose");

const RoundTourBookingSchema = new mongoose.Schema({
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoundTour",
    required: true,
  },

  taxiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuickTaxi",
    required: false,
  },

  travelStyle: {
    type: String,
    default: null,
  },

  purpose: {
    type: String,
    default: "",
  },

  accommodation: {
    type: String,
    enum: ["with", "without"],
    required: true,
  },

  hotelCategory: {
    type: String,
    enum: ["2_star", "3_star", "4_star", "5_star", "comfortable"],
    required: function () {
      return this.accommodation === "with";
    },
    default: undefined,
  },

  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },

  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 },
  pickupLocation: { type: String },

  members: { type: Number, default: 1 },
  startDate: { type: Date, required: true },

  startTime: { type: String },
  message: String,

  status: {
    type: String,
    enum: ["Pending", "Approved", "Cancelled", "Completed"],
    default: "Pending",
  },

  createdAt: { type: Date, default: Date.now },
});

/**
 * Auto-calculate members
 */
RoundTourBookingSchema.pre("save", function (next) {
  this.members = (this.adults || 0) + (this.children || 0);
  next();
});

/**
 * Conditional validation
 */
RoundTourBookingSchema.pre("validate", function (next) {
  // If accommodation is "with", hotelCategory must be set
  if (this.accommodation === "with" && !this.hotelCategory) {
    this.invalidate(
      "hotelCategory",
      "Hotel category is required when accommodation is selected"
    );
  }

  // If accommodation is "without", unset hotelCategory
  if (this.accommodation === "without") {
    this.hotelCategory = undefined; // ✅ use undefined, not null
  }

  next();
});

module.exports = mongoose.model(
  "RoundTourBooking",
  RoundTourBookingSchema
);
