const mongoose = require("mongoose");

const ContactFormSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.ContactForm ||
  mongoose.model("ContactForm", ContactFormSchema);
