import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../lib/axios";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.email || !formData.message) {
      toast.warning("Please fill in all required fields!");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosInstance.post("/contact-form", formData);
      if (res.data.success) {
        toast.success("Form submitted successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        toast.error("Failed to submit form. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Server error: could not submit form"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            required
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            required
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium text-gray-700">Your Message</label>
          <textarea
            name="message"
            rows="5"
            placeholder="Write your message"
            value={formData.message}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition flex items-center gap-2 shadow-lg duration-300 justify-center"
        >
          {submitting ? "Sending..." : "Connect with Us"}
          <ArrowRight className="w-4" />
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
