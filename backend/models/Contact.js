const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    phone: { type: String, default: "+94 776 301 329" },
    whatsapp: { type: String, default: "+94 776 301 329" },

    emails: { type: [String], default: ["inquiries@netlankatravels.com"] },

    offices: [
      {
        name: { type: String, default: "Head Office" },
        address: { type: String, default: "Address here" },
        coords: { type: [Number], default: [0, 0] },
      },
    ],

    workingHours: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "17:00" },
    },

    socialMedia: [
      {
        platform: String,
        icon: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
