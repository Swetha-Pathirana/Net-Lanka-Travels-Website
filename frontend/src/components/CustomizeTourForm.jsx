import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import DestinationSelector from "./DestinationSelector";
import ExperienceSelector from "./ExperienceSelector";
import { FaUserTie, FaHotel, FaUsers, FaCar, FaPlane } from "react-icons/fa";

const TailorMadeForm = () => {
  const [step, setStep] = useState(1);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [, setSelectedExperiences] = useState([]);
  const [showTravelStyleModal, setShowTravelStyleModal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    // Step 1
    title: "",
    fullName: "",
    country: "",
    email: "",
    phone: "",

    // Step 2
    tourType: "Budget",
    pickupLocation: "",
    dropLocation: "",
    startDate: "",
    endDate: "",
    travelStyle: "",
    accommodation: "",
    hotelCategory: "",
    adults: 1,
    children: 0,
    budget: "",
    currency: "USD",
    selectedDestinations: [],

    // Step 3
    entranceFee: "",
    travelPurpose: "",
    customTravelPurpose: "",
    vehicle: "",
    selectedExperiences: [],
    notes: "",
    hearAboutUs: "",
    acceptTerms: false,
  });

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

  // Update formData whenever destinations change
  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      selectedDestinations,
    }));
  }, [selectedDestinations]);

  React.useEffect(() => {
    axiosInstance
      .get("/experience")
      .then((res) => {
        setExperiences(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch experiences:", err);
        toast.error("Failed to load experiences");
      });
  }, []);

  React.useEffect(() => {
    axiosInstance
      .get("/quick-taxi/taxis")
      .then((res) => {
        if (res.data.success) setVehicles(res.data.taxis);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1 && !captchaChecked) {
      toast.warning("Please confirm you are not a robot!");
      return;
    }
    setStep(step + 1);
  };

  const handlePrev = () => setStep(step - 1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.title) errors.push("Title is required");
    if (!formData.fullName.trim()) errors.push("Full name is required");
    if (!formData.country.trim()) errors.push("Country is required");

    if (!formData.email.trim()) errors.push("Email is required");
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) errors.push("Invalid email format");
    }

    if (!formData.phone.trim()) errors.push("Phone number is required");
    if (!captchaChecked) errors.push("Please confirm you are not a robot");
    if (!formData.pickupLocation.trim())
      errors.push("Pickup location is required");
    if (!formData.dropLocation.trim()) errors.push("Drop location is required");
    if (!formData.startDate) errors.push("Start date is required");
    if (!formData.endDate) errors.push("End date is required");
    if (!formData.accommodation)
      errors.push("Accommodation selection is required");
    if (formData.accommodation === "with" && !formData.hotelCategory) {
      errors.push("Please select a hotel category");
    }
    if (!formData.vehicle.trim()) errors.push("Vehicle Selection is required");

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) errors.push("Start date cannot be after end date");
      if (start < today) errors.push("Start date cannot be in the past");
      if (end < today) errors.push("End date cannot be in the past");
    }

    if (
      formData.currency !== "No Idea" &&
      formData.budget &&
      Number(formData.budget) < 100
    ) {
      errors.push("Budget must be at least 100");
    }

    if (!formData.entranceFee)
      errors.push("Entrance Fee selection is required");
    if (!formData.travelPurpose) errors.push("Travel Purpose is required");
    if (
      formData.travelPurpose === "Other" &&
      !formData.customTravelPurpose.trim()
    )
      errors.push("Please specify your Travel Purpose");

    if (!formData.acceptTerms) {
      errors.push("You must accept Terms & Privacy Policy");
    }

    if (!formData.adults || Number(formData.adults) < 1)
      errors.push("At least 1 adult is required");
    if (formData.children < 0) errors.push("Children cannot be negative");

    if (
      formData.currency !== "No Idea" &&
      formData.budget &&
      Number(formData.budget) < 0
    ) {
      errors.push("Budget cannot be negative");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    try {
      await axiosInstance.post("/tailor-made-tours/inquiry", formData);
      toast.success("Your trip plan has been submitted!");

      setFormData({
        title: "",
        fullName: "",
        country: "",
        email: "",
        phone: "",
        pickupLocation: "",
        dropLocation: "",
        startDate: "",
        endDate: "",
        adults: 1,
        children: 0,
        budget: "",
        currency: "USD",
        accommodation: "",
        hotelCategory: "",
        notes: "",
        selectedDestinations: [],
        travelStyle: "",
        vehicle: "",
        selectedExperiences: [],
        hearAboutUs: "",
      });

      setSelectedDestinations([]);
      setSelectedExperiences([]);
      setStep(1);
      setCaptchaChecked(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit your plan. Try again.");
    }
  };

  return (
    <div className="lg:col-span-1 w-full">
      <div className="bg-blue-600 text-white rounded-t-xl px-6 py-5 mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-center">
          Plan Your Trip
        </h3>
        <p className="text-xs text-gray-400 mb-2 text-center">
          Fields marked with * are required
        </p>
      </div>

      <div className="max-w-xl mx-auto px-3 md:px-5">
        {/* Step 1 */}
        {step === 1 && (
          <form className="space-y-4">
            <h2 className="text-xl font-bold mb-4">
              Step 1: Personal Information
            </h2>
            <div className="flex justify-center space-x-3 mb-4 items-center">
              {[1, 2, 3, 4].map((n) => (
                <span
                  key={n}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= n
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {n}
                </span>
              ))}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Title *
              </label>
              <select
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select</option>
                <option>Mr.</option>
                <option>Mrs.</option>
                <option>Miss</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Your country name"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="+94 777 000 000"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={captchaChecked}
                onChange={(e) => setCaptchaChecked(e.target.checked)}
                className="w-5 h-5"
              />
              <label className="text-gray-700 font-semibold">
                I am not a robot
              </label>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-blue-500 text-white font-bold py-3 rounded-md hover:bg-[#283d9e] transition"
            >
              Next Step →
            </button>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form className="space-y-4">
            <h2 className="text-xl font-bold mb-4">
              Step 2: Your Trip Details
            </h2>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Pickup Location *
              </label>
              <input
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Where should we pick you up?"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Drop Location *
              </label>
              <input
                type="text"
                name="dropLocation"
                value={formData.dropLocation}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Where should we drop you off?"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={today}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || today}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            {/* ---------------- Travel Style ---------------- */}
            <div>
              <button
                type="button"
                onClick={() => setShowTravelStyleModal(true)}
                className="w-full flex justify-between items-center bg-white border border-gray-400 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
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
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[20000] flex items-center justify-center"
                onClick={(e) =>
                  e.target === e.currentTarget && setShowTravelStyleModal(false)
                }
              >
                <div className="w-[95vw] max-w-[800px] h-[90vh] bg-white shadow-2xl flex flex-col overflow-hidden rounded-2xl relative p-6">
                  <h3 className="text-xl font-bold mb-4">
                    Select Travel Style
                  </h3>

                  <div className="flex flex-col gap-3 overflow-y-auto">
                    {travelStyles.map((style) => (
                      <label
                        key={style.title}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                      >
                        {/* Left: Icon + Title & Tooltip */}
                        <div className="flex items-center gap-3">
                          {/* Icon */}
                          <span className="text-2xl">{style.icon}</span>

                          {/* Title & Tooltip */}
                          <div>
                            <p className="font-semibold">{style.title}</p>
                            <p className="text-gray-500 text-sm">
                              {style.tooltip}
                            </p>
                          </div>
                        </div>

                        {/* Right: Checkbox */}
                        <input
                          type="checkbox"
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

            {/* ---------------- Accommodation ---------------- */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Accommodation *
              </label>

              <div className="relative">
                <select
                  name="accommodation"
                  value={formData.accommodation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      accommodation: e.target.value,
                      hotelCategory: "", // reset when changed
                    }))
                  }
                  className="w-full p-3 rounded-md border border-gray-300 bg-white appearance-none"
                >
                  <option value="">Select accommodation</option>
                  <option value="with">With accommodation</option>
                  <option value="without">Without accommodation</option>
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                  ▼
                </div>
              </div>
            </div>
            {formData.accommodation === "with" && (
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Hotel Category *
                </label>

                <div className="relative">
                  <select
                    name="hotelCategory"
                    value={formData.hotelCategory}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md border border-gray-300 bg-white appearance-none"
                  >
                    <option value="">Select hotel category</option>
                    <option value="2_star">2 Star Hotel</option>
                    <option value="3_star">3 Star Hotel</option>
                    <option value="4_star">4 Star Hotel</option>
                    <option value="5_star">5 Star Hotel</option>
                    <option value="comfortable">Comfortable Hotel</option>
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                    ▼
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Adults *
                </label>
                <input
                  type="number"
                  name="adults"
                  value={formData.adults}
                  min={1}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Children
                </label>
                <input
                  type="number"
                  name="children"
                  value={formData.children}
                  min={0}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            {/* ---------------- Budget & Currency ---------------- */}
            <div className="mt-4 w-full sm:w-full">
              <label className="block text-gray-700 font-semibold mb-1">
                Estimated Budget (Per Person / Per Day)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Currency Dropdown */}
                <div className="relative">
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full p-4 rounded-lg border border-gray-300 bg-white text-gray-800 cursor-pointer appearance-none pr-10 transition-all duration-300 hover:border-blue-200"
                  >
                    <option value="" disabled>
                      Select currency
                    </option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="LKR">LKR</option>
                    <option value="No Idea">No Idea</option>
                    <option value="Other">Other</option>
                  </select>

                  {/* Dropdown arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                    ▼
                  </div>
                </div>

                {/* Budget Input */}
                {formData.currency !== "Other" ? (
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="Total Amount"
                    disabled={formData.currency === "No Idea"}
                    min={100} // <-- minimum 100
                    className={`p-4 rounded-lg border border-gray-300 w-full col-span-2 transition-all duration-300 ${
                      formData.currency === "No Idea"
                        ? "bg-gray-100 cursor-not-allowed"
                        : "hover:border-blue-200"
                    }`}
                  />
                ) : (
                  <>
                    {/* Custom Currency */}
                    <input
                      type="text"
                      name="customCurrency"
                      value={formData.customCurrency || ""}
                      onChange={handleChange}
                      placeholder="Enter Currency (e.g., INR)"
                      className="p-4 rounded-lg border border-gray-300 w-full transition-all duration-300 hover:border-blue-200"
                    />

                    {/* Custom Budget */}
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Total Amount"
                      min={100} // <-- minimum 100
                      className="p-4 rounded-lg border border-gray-300 w-full transition-all duration-300 hover:border-blue-200"
                    />
                  </>
                )}
              </div>

              {/* Display per person */}
              {formData.currency !== "No Idea" &&
                formData.budget &&
                (formData.currency !== "Other" || formData.customCurrency) && (
                  <p className="text-xs text-gray-500 mt-1">
                    Approx. per person:{" "}
                    <strong>
                      {Number(formData.budget).toFixed(2)}{" "}
                      {formData.currency === "Other"
                        ? formData.customCurrency
                        : formData.currency}
                    </strong>
                  </p>
                )}

              {formData.currency === "No Idea" && (
                <p className="text-xs text-gray-500 mt-1">
                  Don’t worry - we’ll suggest the best options for your trip.
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
              <button
                type="button"
                onClick={handlePrev}
                className="w-full bg-gray-300 text-gray-800 font-bold py-3 rounded-md hover:bg-gray-400 transition"
              >
                ← Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-blue-500 text-white font-bold py-3 rounded-md hover:bg-[#283d9e] transition"
              >
                Next Step →
              </button>
            </div>
          </form>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <form className="space-y-6">
            <h2 className="text-xl font-bold mb-2">
              Step 3: Customize Your Tour
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              Tell us how you would like to experience Sri Lanka
            </p>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Entrance Fee *
              </label>
              <select
                name="entranceFee"
                value={formData.entranceFee}
                onChange={handleChange}
                className="w-full p-4 rounded-lg border border-gray-300 bg-white cursor-pointer"
              >
                <option value="">Select option</option>
                <option value="with">With Entrance Fee</option>
                <option value="without">Without Entrance Fee</option>
              </select>
            </div>

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

            {/* ---------------- Vehicle Selection ---------------- */}
            <div className="mt-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Select Preferred Vehicle *
              </label>

              <select
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                className="w-full p-4 rounded-lg border border-gray-300 bg-white cursor-pointer"
              >
                <option value="">Select a vehicle</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v.name}>
                    {v.name} • {v.seats} Seats
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Selection */}
            <div>
              <button
                type="button"
                onClick={() => setShowDestinationModal(true)}
                className="w-full flex justify-between items-center bg-white border border-gray-400 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                Select Destinations
                <svg
                  className="w-5 h-5 ml-2 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>

              <div className="flex flex-wrap gap-2 mt-2">
                {selectedDestinations.length > 0 ? (
                  selectedDestinations.map((d, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                      {d}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">No destination selected</span>
                )}
              </div>
            </div>

            {showDestinationModal && (
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[20000] flex items-center justify-center"
                onClick={(e) =>
                  e.target === e.currentTarget && setShowDestinationModal(false)
                }
              >
                <div
                  className="w-[95vw] max-w-[700px] h-[90vh] bg-white shadow-2xl 
                 flex flex-col overflow-hidden rounded-2xl relative"
                >
                  <DestinationSelector
                    initialSelected={selectedDestinations}
                    onConfirm={(newSelection) => {
                      setSelectedDestinations(newSelection);
                      setShowDestinationModal(false);
                    }}
                  />
                </div>
              </div>
            )}

            {/* ---------------- Experiences ---------------- */}
            <div>
              <button
                type="button"
                onClick={() => setShowExperienceModal(true)}
                className="w-full flex justify-between items-center bg-white border border-gray-400 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                Select Experiences
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

              <div className="flex flex-wrap gap-2 mt-2">
                {formData.selectedExperiences.length > 0 ? (
                  formData.selectedExperiences.map((e, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
                    >
                      {e}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">No experience selected</span>
                )}
              </div>
            </div>

            {showExperienceModal && (
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[20000] flex items-center justify-center"
                onClick={(e) =>
                  e.target === e.currentTarget && setShowExperienceModal(false)
                }
              >
                <div
                  className="w-[95vw] max-w-[800px] h-[90vh] bg-white shadow-2xl 
      flex flex-col overflow-hidden rounded-2xl relative"
                >
                  <ExperienceSelector
                    experiences={experiences}
                    initialSelected={formData.selectedExperiences}
                    onConfirm={(newSelection) => {
                      setSelectedExperiences(newSelection);
                      setFormData((prev) => ({
                        ...prev,
                        selectedExperiences: newSelection,
                      }));
                      setShowExperienceModal(false);
                    }}
                  />
                </div>
              </div>
            )}

            {/* ---------------- Special Notes ---------------- */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Special Requests / Notes
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Hotel preferences, food requirements, wheelchair access, honeymoon details, etc."
                className="w-full border border-gray-300 rounded-md p-3 resize-none
        focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* ---------------- How Did You Hear About Us ---------------- */}
            <div className="mt-6 w-full">
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                How did you hear about us?
                <span className="text-gray-400 text-sm block">
                  Please select one option
                </span>
              </label>

              <div className="relative">
                <select
                  value={formData.hearAboutUs || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hearAboutUs: e.target.value,
                    }))
                  }
                  className="w-full p-4 rounded-lg border border-gray-300 bg-white text-gray-800 cursor-pointer appearance-none pr-10 transition-all duration-300 hover:border-blue-200"
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {[
                    "Friend/Family",
                    "Social Media",
                    "Google",
                    "Search Engine",
                    "Advertisement",
                    "Travel Blog/Website",
                    "Other",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                {/* Dropdown arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                  ▼
                </div>
              </div>
            </div>

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

            {/* ---------------- Navigation ---------------- */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={handlePrev}
                className="w-full bg-gray-300 text-gray-800 font-bold py-3 rounded-md hover:bg-gray-400 transition"
              >
                ← Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-blue-500 text-white font-bold py-3 rounded-md hover:bg-[#283d9e] transition"
              >
                Review Details →
              </button>
            </div>
          </form>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <form className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Step 4: Review & Submit</h2>

            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              {Object.entries(formData).map(([key, value]) => {
                if (key === "selectedDestinations") {
                  return (
                    <p key={key}>
                      <strong>Destinations:</strong>{" "}
                      {value.length > 0 ? value.join(", ") : "Not specified"}
                    </p>
                  );
                }
                if (key === "notes") {
                  return (
                    <p key={key}>
                      <strong>Special Requests:</strong> {value || "None"}
                    </p>
                  );
                }
                if (key === "budget") {
                  return (
                    <p key={key}>
                      <strong>Estimated Budget:</strong>{" "}
                      {value
                        ? `${formData.currency || "USD"} ${Number(
                            value
                          ).toLocaleString()}`
                        : formData.currency === "No Idea"
                        ? "No Idea"
                        : "Not specified"}
                    </p>
                  );
                }
                if (key === "accommodation") {
                  return (
                    <p key={key}>
                      <strong>Accommodation:</strong>{" "}
                      {value === "with"
                        ? `With accommodation (${formData.hotelCategory.replace(
                            "_",
                            " "
                          )})`
                        : "Without accommodation"}
                    </p>
                  );
                }

                if (key === "acceptTerms") {
                  return (
                    <p key={key}>
                      <strong>Terms & Privacy:</strong>{" "}
                      {value ? "Accepted" : "Not Accepted"}
                    </p>
                  );
                }

                if (key === "hotelCategory") return null;

                if (["currency"].includes(key)) return null;
                return (
                  <p key={key}>
                    <strong>{key.replace(/([A-Z])/g, " $1")}:</strong>{" "}
                    {value || "Not specified"}
                  </p>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                type="button"
                onClick={handlePrev}
                className="w-full bg-gray-300 text-gray-800 font-bold py-3 rounded-md hover:bg-gray-400 transition"
              >
                ← Previous
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white font-bold py-3 rounded-md hover:bg-[#283d9e] transition"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TailorMadeForm;
