import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { FaUserTie, FaHotel, FaUsers, FaCar, FaPlane } from "react-icons/fa";

export default function BookDayTour({ tourId, tourTitle, tourLocation }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    adults: 1,
    children: 0,
    members: 1,
    pickupLocation: "",
    startDate: "",
    startTime: "00:00",
    message: "",
    travelStyle: "",
    travelPurpose: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("94771234567");
  const [taxis, setTaxis] = useState([]);
  const [selectedTaxi, setSelectedTaxi] = useState("");
  const [showTravelStyleModal, setShowTravelStyleModal] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const travelStyles = [
    {
      title: "Private Tour, Permanent Guide",
      tooltip:
        "Enjoy a fully private tour with a certified SL National tourist guide or lecturer.",
      icon: <FaUserTie className="text-blue-500" />,
    },
    {
      title: "Transport Only with Chauffeur Guide",
      tooltip:
        "Travel independently with private transport and a professional chauffeur guide.",
      icon: <FaCar className="text-teal-500" />,
    },
    {
      title: "Private Transfer, Area Guide",
      tooltip:
        "Get private transportation and a local guide for specific areas during your trip.",
      icon: <FaCar className="text-green-500" />,
    },
    {
      title: "Join a Group Tour",
      tooltip:
        "Travel with a group of like-minded travelers with shared itinerary and guide.",
      icon: <FaUsers className="text-purple-500" />,
    },
    {
      title: "Organized Hotels/Transfer, No Guide",
      tooltip:
        "Accommodation and transfers are arranged, but no guide is included.",
      icon: <FaHotel className="text-orange-500" />,
    },
    {
      title: "Self-Organized - Transport Only, Without Guide",
      tooltip:
        "Plan your own trip and manage transportation independently, without a guide.",
      icon: <FaPlane className="text-red-500" />,
    },
  ];

  // Fetch WhatsApp number from backend
  useEffect(() => {
    axiosInstance
      .get("/contact")
      .then((res) => {
        const p = res.data?.whatsapp || res.data?.phone;
        if (p) setWhatsappNumber(p.replace(/\D/g, ""));
      })
      .catch(() => {
        // fallback already set
      });
  }, []);

  // ---------------- FETCH TAXIS ----------------
  useEffect(() => {
    const fetchTaxis = async () => {
      try {
        const res = await axiosInstance.get("/quick-taxi/taxis"); // correct endpoint
        if (res.data.success) setTaxis(res.data.taxis); // check response
      } catch (err) {
        console.error("Error fetching taxis:", err);
      }
    };
    fetchTaxis();
  }, []);

  // Update members dynamically
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      members: Number(prev.adults) + Number(prev.children),
    }));
  }, [formData.adults, formData.children]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email";
    }
    if (!selectedTaxi) newErrors.selectedTaxi = "Select a vehicle";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (Number(formData.adults) < 1)
      newErrors.adults = "At least 1 adult is required";
    if (Number(formData.children) < 0)
      newErrors.children = "Children cannot be negative";
    if (!formData.pickupLocation.trim())
      newErrors.pickupLocation = "Pickup location is required";
    if (!formData.startDate) newErrors.startDate = "Pickup date is required";
    else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(formData.startDate);
      if (selected < today) newErrors.startDate = "Date cannot be in the past";
    }
    if (!formData.startTime) newErrors.startTime = "Pickup time is required";
    if (!formData.travelPurpose) errors.push("Travel Purpose is required");
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept Terms & Privacy Policy";
    }

    if (!formData.travelStyle) newErrors.travelStyle = "Select a travel style";

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
      const res = await axiosInstance.post("/day-tour-booking", {
        ...formData,
        tourId,
        taxiId: selectedTaxi,
      });

      if (res.data.success) {
        setResponseMsg("Booking submitted successfully!");
        setIsError(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          adults: 1,
          children: 0,
          members: 1,
          pickupLocation: "",
          startDate: "",
          startTime: "",
          message: "",
          travelStyle: "",
        });
        setSelectedTaxi("");
      } else {
        setResponseMsg("Failed to submit booking. Please try again.");
        setIsError(true);
      }
    } catch (err) {
      console.error(err);
      setResponseMsg("Server error. Please try again later.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // Professional WhatsApp Booking Message
  const sendBookingViaWhatsApp = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setResponseMsg("Please fix the errors above before sending to WhatsApp");
      setIsError(true);
      return;
    }

    const selectedTaxiObj = taxis.find((t) => t._id === selectedTaxi);

    const message = `
  * Net Lanka Travels - Day Tour Booking *
  
  *Tour:* ${tourTitle}
  *Location:* ${tourLocation}
  *Vehicle:* ${
    selectedTaxiObj
      ? `${selectedTaxiObj.name} – Seats: ${selectedTaxiObj.seats} - ${
          selectedTaxiObj.ac ? "AC" : "Non-AC"
        }`
      : "-"
  }
  *Travel Style:* ${formData.travelStyle || "-"}
  *Travel Purpose:* ${formData.travelPurpose || "-"}
  *Customer Details:*
   -Name: ${formData.name}
   -Email: ${formData.email}
   -Phone: ${formData.phone}
  
  *Participants:*
   -Adults: ${formData.adults}
   -Children: ${formData.children}
   -Total Members: ${formData.members}
  
  *Pickup & Schedule:*
   -Pickup Location: ${formData.pickupLocation}
   -Pickup Date: ${formData.startDate}
   -Pickup Time: ${formData.startTime}
  
  *Additional Message:*
  ${formData.message || "–"}
  
  *We will contact you soon*
  
  *Thank you for booking with Net Lanka Travel!*
    `;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col gap-6 bg-white border border-[#2E5B84] rounded-2xl shadow-xl p-8 w-full max-w-[650px] mx-auto text-left">
      <h2 className="text-2xl font-bold text-center text-[#0B2545] mb-4">
        {tourTitle}
        <span className="block">{tourLocation} - Day Tour</span>
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="font-medium mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
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
        <div>
          <label htmlFor="email" className="font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email Address"
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

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="font-medium mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500 outline-none`}
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone}</span>
          )}
        </div>

        {/* TAXI LIST */}
        {taxis.length > 0 && (
          <div className="flex flex-col gap-1">
            <label className="font-medium text-[#0B2545] text-left">
              Select Vehicle <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedTaxi}
              onChange={(e) => setSelectedTaxi(e.target.value)}
              className="px-4 py-3 border rounded"
            >
              <option value="">Select Vehicle</option>
              {taxis.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} – Seats: {t.seats} - {t.ac ? "AC" : "Non-AC"}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ---------------- Travel Style ---------------- */}
        <div>
          <label className="font-medium mb-1 block">
            Travel Style <span className="text-red-500">*</span>
          </label>

          <button
            type="button"
            onClick={() => setShowTravelStyleModal(true)}
            className={`w-full flex justify-between items-center px-4 py-3 border rounded ${
              errors.travelStyle ? "border-red-500" : "border-gray-300"
            } bg-white text-gray-800 hover:bg-gray-100 transition font-semibold focus:ring-2 focus:ring-blue-500 outline-none`}
          >
            {formData.travelStyle || "Select Travel Style"}
            <svg
              className="w-5 h-5 ml-2 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {errors.travelStyle && (
            <span className="text-red-500 text-sm mt-1 block">
              {errors.travelStyle}
            </span>
          )}

          <div className="mt-2 text-gray-500 text-sm">
            {formData.travelStyle
              ? travelStyles.find((s) => s.title === formData.travelStyle)
                  ?.tooltip
              : "No travel style selected"}
          </div>
        </div>

        {/* ---------------- Travel Style Modal ---------------- */}
        {showTravelStyleModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[20000] flex items-center justify-center p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setShowTravelStyleModal(false)
            }
          >
            <div className="w-full max-w-[800px] h-[90vh] bg-white shadow-2xl flex flex-col overflow-hidden rounded-2xl relative p-6">
              <h3 className="text-xl font-bold mb-4">Select Travel Style</h3>

              <div className="flex flex-col gap-3 overflow-y-auto">
                {travelStyles.map((style) => (
                  <label
                    key={style.title}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                  >
                    {/* Left: Icon + Title & Tooltip */}
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{style.icon}</span>
                      <div>
                        <p className="font-semibold">{style.title}</p>
                        <p className="text-gray-500 text-sm">{style.tooltip}</p>
                      </div>
                    </div>

                    {/* Right: Radio for single selection */}
                    <input
                      type="radio"
                      name="travelStyle"
                      checked={formData.travelStyle === style.title}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          travelStyle: style.title,
                        }))
                      }
                      className="w-5 h-5"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowTravelStyleModal(false)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-[#283d9e] transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Travel Purpose *
          </label>

          <select
            name="travelPurpose"
            value={formData.travelPurpose}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                travelPurpose: e.target.value,
                customTravelPurpose: "", // reset custom if changed
              }));
            }}
            className="w-full p-4 rounded-lg border border-gray-300 bg-white cursor-pointer"
          >
            <option value="">Select purpose</option>
            {[
              "Family Tour",
              "Honeymoon",
              "Group",
              "Solo",
              "With Chauffeur",
              "Photography",
              "Other",
            ].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {/* Show custom text input if 'Other' selected */}
          {formData.travelPurpose === "Other" && (
            <input
              type="text"
              name="customTravelPurpose"
              value={formData.customTravelPurpose}
              onChange={handleChange}
              placeholder="Specify your purpose"
              className="w-full mt-2 p-3 rounded-lg border border-gray-300"
            />
          )}
        </div>

        {/* Adults & Children */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="adults" className="font-medium mb-1">
              Adults <span className="text-red-500">*</span>
            </label>
            <input
              id="adults"
              type="number"
              name="adults"
              min="1"
              value={formData.adults}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded border ${
                errors.adults ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 outline-none`}
            />
            {errors.adults && (
              <span className="text-red-500 text-sm">{errors.adults}</span>
            )}
          </div>
          <div>
            <label htmlFor="children" className="font-medium mb-1">
              Children
            </label>
            <input
              id="children"
              type="number"
              name="children"
              min="0"
              value={formData.children}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded border ${
                errors.children ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 outline-none`}
            />
            {errors.children && (
              <span className="text-red-500 text-sm">{errors.children}</span>
            )}
          </div>
        </div>

        {/* Pickup Location */}
        <div>
          <label htmlFor="pickupLocation" className="font-medium mb-1">
            Pickup Location <span className="text-red-500">*</span>
          </label>
          <input
            id="pickupLocation"
            type="text"
            name="pickupLocation"
            placeholder="Enter Pickup Location"
            value={formData.pickupLocation}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded border ${
              errors.pickupLocation ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500 outline-none`}
          />
          {errors.pickupLocation && (
            <span className="text-red-500 text-sm">
              {errors.pickupLocation}
            </span>
          )}
        </div>

        {/* Start Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="font-medium mb-1">
              Pickup Date <span className="text-red-500">*</span>
            </label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={today}
              className={`w-full px-4 py-3 rounded border ${
                errors.startDate ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 outline-none`}
            />
            {errors.startDate && (
              <span className="text-red-500 text-sm">{errors.startDate}</span>
            )}
          </div>
          <div>
            <label htmlFor="startTime" className="font-medium mb-1">
              Pickup Time <span className="text-red-500">*</span>
            </label>
            <input
              id="startTime"
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              step="60" // minutes
              className={`w-full px-4 py-3 rounded border ${
                errors.startTime ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 outline-none`}
            />
            {errors.startTime && (
              <span className="text-red-500 text-sm">{errors.startTime}</span>
            )}
          </div>
        </div>

        {/* Additional Message */}
        <div>
          <label htmlFor="message" className="font-medium mb-1">
            Additional Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Additional Message / Requests"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-28"
          ></textarea>
        </div>

        <p className="text-gray-800 text-sm md:text-base mt-2 text-center font-medium bg-gray-100 p-2 rounded">
          Price is calculated per participant and includes taxes.
          <br />
          Final total is confirmed upon booking.
        </p>

        {/* ---------------- Accept Terms ---------------- */}
        <div className="mt-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  acceptTerms: e.target.checked,
                }))
              }
              className="w-5 h-5"
            />
            <span className="text-gray-700 text-sm">
              I accept the{" "}
              <a
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700"
              >
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700"
              >
                Privacy Policy
              </a>
            </span>
          </label>
        </div>

        {/* Submit to Backend */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0B2545] hover:bg-[#142D57] text-white font-semibold px-6 py-3 rounded transition-colors duration-200"
        >
          {loading ? "Submitting..." : "Book Tour"}
        </button>

        {/* WhatsApp Booking */}
        <button
          type="button"
          onClick={sendBookingViaWhatsApp}
          className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-200"
        >
          Book Now via WhatsApp
        </button>

        {responseMsg && (
          <p
            className={`mt-2 text-center font-medium ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {responseMsg}
          </p>
        )}
      </form>
    </div>
  );
}
