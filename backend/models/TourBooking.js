const mongoose = require("mongoose");

const TourBookingSchema = new mongoose.Schema(
  {
    tourType: {
      type: String,
      enum: ["day", "round"],
      required: true,
    },

    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "tourRef",
    },

    tourRef: {
      type: String,
      required: true,
      enum: ["DayTour", "RoundTour"],
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
      required: function () {
        return this.tourType === "round";
      },
    },    

    hotelCategory: {
      type: String,
      enum: ["", "2_star", "3_star", "4_star", "5_star", "comfortable"],
      default: "",
    },    

    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    members: { type: Number },

    pickupLocation: { type: String },
    startDate: { type: Date, required: true },

    startTime: { type: String },
    message: { type: String },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

TourBookingSchema.pre("save", function (next) {
  this.members = Number(this.adults || 0) + Number(this.children || 0);
  next();
});

module.exports = mongoose.model("TourBooking", TourBookingSchema);
