import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { axiosInstance } from "../lib/axios";

const TestimonialForm = () => {
  const [testimonialForm, setTestimonialForm] = useState({
    title: "",
    text: "",
    name: "",
    email: "",
    rating: 0,
  });

  const [hover, setHover] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });

  // Validate form fields
  const validate = () => {
    const newErrors = {};
  
    if (!testimonialForm.title.trim()) newErrors.title = "Title is required";
    if (!testimonialForm.text.trim()) newErrors.text = "Message is required";
    if (!testimonialForm.name.trim()) newErrors.name = "Name is required";
  
    if (testimonialForm.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(testimonialForm.email))
        newErrors.email = "Invalid email format";
    }
    if (!testimonialForm.email.trim()) newErrors.email = "Email is required";
  
    // Rating check (number, not string)
    if (!testimonialForm.rating || testimonialForm.rating === 0) {
      newErrors.rating = "Please provide a rating";
    }
  
    return newErrors;
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage({ text: "Please fix the errors above!", type: "error" });
      return;
    }

    try {
      const res = await axiosInstance.post("/testimonials", testimonialForm);
      if (res.data.success || res.status === 200) {
        setMessage({ text: "Thank you for your feedback!", type: "success" });
        setTestimonialForm({ title: "", text: "", name: "", email: "", rating: 0 });
        setErrors({});
      } else {
        setMessage({ text: "Failed to submit testimonial. Please try again.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Server error: could not submit testimonial", type: "error" });
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-white rounded-xl shadow-xl p-8 w-full max-w-[650px] mx-auto text-left">
      <h2 className="text-center text-3xl font-extrabold text-[#0B2545]">
        Share Your Experience With Us
      </h2>

      <form
        onSubmit={handleSubmit}
        className="w-full space-y-5 flex flex-col items-center bg-white border border-[#2E5B84] p-6 rounded-2xl"
      >
        {/* Title */}
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="title" className="font-medium text-[#0B2545]">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Title"
            value={testimonialForm.title}
            onChange={(e) =>
              setTestimonialForm({ ...testimonialForm, title: e.target.value })
            }
            className={`w-full border p-3 rounded-md ${
              errors.title ? "border-red-500" : ""
            }`}
          />
          {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
        </div>

        {/* Message */}
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="text" className="font-medium text-[#0B2545]">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="text"
            name="text"
            placeholder="Write your experience..."
            value={testimonialForm.text}
            onChange={(e) =>
              setTestimonialForm({ ...testimonialForm, text: e.target.value })
            }
            className={`w-full border p-3 rounded-md ${
              errors.text ? "border-red-500" : ""
            }`}
            rows={5}
          />
          {errors.text && <span className="text-red-500 text-sm">{errors.text}</span>}
        </div>

        {/* Name */}
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="name" className="font-medium text-[#0B2545]">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            value={testimonialForm.name}
            onChange={(e) =>
              setTestimonialForm({ ...testimonialForm, name: e.target.value })
            }
            className={`w-full border p-3 rounded-md ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
        </div>

        {/* Email */}
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="email" className="font-medium text-[#0B2545]">
            Your Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email"
            value={testimonialForm.email}
            onChange={(e) =>
              setTestimonialForm({ ...testimonialForm, email: e.target.value })
            }
            className={`w-full border p-3 rounded-md ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        {/* Rating */}
        <div className="w-full flex flex-col gap-1">
          <label className="font-medium text-[#0B2545]">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setTestimonialForm({ ...testimonialForm, rating: star })}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
              >
                <FaStar
                  size={24}
                  color={(hover || testimonialForm.rating) >= star ? "#FFD700" : "#e4e5e9"}
                />
              </button>
            ))}
            <span>{testimonialForm.rating} / 5</span>
          </div>
          {errors.rating && <span className="text-red-500 text-sm">{errors.rating}</span>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md"
        >
          Submit Testimonial
        </button>

        {/* Form Message */}
        {message.text && (
          <p
            className={`mt-2 text-center font-medium ${
              message.type === "success"
                ? "text-green-600"
                : message.type === "error"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
};

export default TestimonialForm;
