import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { axiosInstance } from "../lib/axios";

const TourReview = ({ tourId }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    message: "",
  });
  const [hover, setHover] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email";
    }
    if (formData.rating === 0) newErrors.rating = "Please select a rating";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMsg("");
    setIsError(false);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setResponseMsg("Please fix the errors above");
      setIsError(true);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await axiosInstance.post("/tour-reviews", {
        tourId,
        ...formData,
      });

      if (res.data.success) {
        setResponseMsg("Review submitted successfully!");
        setIsError(false);
        setFormData({ name: "", email: "", rating: 0, message: "" });
      } else {
        setResponseMsg("Failed to submit review");
        setIsError(true);
      }
    } catch (err) {
      console.error(err);
      setResponseMsg("Server error: could not submit review");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-white border border-[#2E5B84] rounded-2xl shadow-xl p-8 w-full max-w-[650px] mx-auto text-left">
      <h2 className="text-4xl font-bold text-center text-[#0B2545]">
        Leave a Review
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        {/* Name */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500 outline-none`}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name}</span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500 outline-none`}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>

        {/* Rating */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, rating: star }))
                }
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
                className="focus:outline-none"
              >
                <FaStar
                  size={28}
                  color={(hover || formData.rating) >= star ? "#FFD700" : "#e4e5e9"}
                />
              </button>
            ))}
            {errors.rating && (
              <span className="text-red-500 text-sm ml-2">{errors.rating}</span>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            rows="5"
            placeholder="Write your review here"
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded border ${
              errors.message ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500 outline-none resize-none h-28`}
          />
          {errors.message && (
            <span className="text-red-500 text-sm">{errors.message}</span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#0B2545] hover:bg-[#142D57] text-white font-semibold px-6 py-3 rounded transition"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>

        {responseMsg && (
          <p
            className={`text-center font-medium ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {responseMsg}
          </p>
        )}
      </form>
    </div>
  );
};

export default TourReview;
