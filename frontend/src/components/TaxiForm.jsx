import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TaxiForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
    serviceType: "pickup",
    pickupLocation: "",
    dropLocation: "",
    pickupDate: "",
    dropDate: "",
    pickupTime: "",
    adults: 1,
    children: 0,
    message: "",
    taxiId: "",
  });

  const [errors, setErrors] = useState({});
  const [setResponseMsg] = useState("");
  const [setIsError] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("94729171089"); // fallback
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/quick-taxi/taxis") // your backend route
      .then((res) => {
        if (res.data.success) setVehicles(res.data.taxis);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch WhatsApp number from backend
  useEffect(() => {
    axiosInstance
      .get("/contact")
      .then((res) => {
        const p = res.data?.whatsapp || res.data?.phone;
        if (p) setWhatsappNumber(p.replace(/\D/g, ""));
      })
      .catch(() => {
        // fallback number already set
      });
  }, []);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const e = {};

    if (!formData.firstName.trim()) e.firstName = "First name is required";
    if (!formData.lastName.trim()) e.lastName = "Last name is required";
    if (!formData.phone.trim()) e.phone = "Phone number is required";
    if (!formData.country.trim()) e.country = "Country is required";
    if (!formData.taxiId) e.taxiId = "Please select a vehicle";
    if (!formData.pickupLocation.trim())
      e.pickupLocation = "Pickup location is required";
    if (!formData.dropLocation.trim())
      e.dropLocation = "Drop location is required";
    if (!formData.pickupDate) e.pickupDate = "Pickup date is required";
    if (!formData.dropDate) e.dropDate = "Drop date is required";
    if (!formData.pickupTime) e.pickupTime = "Pickup time is required";
    if (formData.serviceType === "drop" && !formData.dropDate)
      e.dropDate = "Drop date is required";
    if (Number(formData.adults) < 1) e.adults = "At least 1 adult is required";

    return e;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);

    if (Object.keys(v).length === 0) {
      try {
        const { data } = await axiosInstance.post(
          "/quick-taxi/bookings",
          formData
        );
        if (data.success) {
          toast.success("Taxi booking submitted successfully!");
          setFormData({
            firstName: "",
            lastName: "",
            phone: "",
            country: "",
            serviceType: "pickup",
            pickupLocation: "",
            dropLocation: "",
            pickupDate: "",
            dropDate: "",
            pickupTime: "",
            adults: 1,
            children: 0,
            message: "",
            taxiId: "",
          });
        } else {
          toast.error(
            "Failed to submit booking: " + (data.error || "Unknown error")
          );
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to submit booking. Check console for details.");
      }
    }
  };

  /* ---------------- WHATSAPP ---------------- */
  const sendBookingViaWhatsApp = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setResponseMsg("Please fix the errors above before sending to WhatsApp");
      setIsError(true);
      toast.error("Please fix the errors before sending to WhatsApp");
      return;
    }

    const message = `
🚕 *NET LANKA TRAVELS – TAXI BOOKING*

👤 Name: ${formData.firstName} ${formData.lastName}
📞 Phone: ${formData.phone}
🌍 Country: ${formData.country}

🚏 Service: ${formData.serviceType.toUpperCase()}
📍 Pickup: ${formData.pickupLocation}
📍 Drop: ${formData.dropLocation}

📅 Pickup Date: ${formData.pickupDate}
📅 Drop Date: ${formData.dropDate || "N/A"}
⏰ Time: ${formData.pickupTime}

👥 Adults: ${formData.adults}
👶 Children: ${formData.children}

📝 Message:
${formData.message || "—"}
`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  const inputBase =
    "w-full px-4 py-3 min-h-[48px] rounded border focus:ring-2 focus:ring-[#0B2545] outline-none";

  return (
    <div
      className="flex flex-col gap-6 bg-white border border-[#2E5B84] rounded-2xl shadow-xl
    p-6 sm:p-8 pb-10 w-full max-w-[650px] mx-auto text-left"
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-center text-[#0B2545] mb-2">
        Quick Taxi Booking
        <span className="block text-base font-medium text-gray-600">
          Safe & Reliable Transfers Across Sri Lanka
        </span>
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-4">
        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded border ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-[#0B2545] outline-none`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="font-medium">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded border ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-[#0B2545] outline-none`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="font-medium">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-[#0B2545] outline-none`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="font-medium">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded border ${
              errors.country ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-[#0B2545] outline-none`}
          />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country}</p>
          )}
        </div>

        <div>
          <label className="font-medium">
            Select Vehicle <span className="text-red-500">*</span>
          </label>
          <select
            name="taxiId"
            value={formData.taxiId}
            onChange={(e) =>
              setFormData({ ...formData, taxiId: e.target.value })
            }
            className={`w-full px-4 py-3 rounded border ${
              errors.taxiId ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-[#0B2545] outline-none`}
          >
            <option value="">-- Select Vehicle --</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name} ({v.seats} seats, {v.ac ? "AC" : "Non-AC"})
              </option>
            ))}
          </select>
          {errors.taxiId && (
            <p className="text-red-500 text-sm">{errors.taxiId}</p>
          )}
        </div>

        {/* Locations */}
        <div>
          <label className="font-medium">
            Pickup Location <span className="text-red-500">*</span>
          </label>
          <input
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded border ${
              errors.pickupLocation ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-[#0B2545] outline-none`}
          />
        </div>

        <div>
          <label className="font-medium">
            Drop Location <span className="text-red-500">*</span>
          </label>
          <input
            name="dropLocation"
            value={formData.dropLocation}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded border ${
              errors.dropLocation ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-[#0B2545] outline-none`}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full">
            <label className="font-medium">
              Pickup Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              className={`${inputBase} ${
                errors.pickupDate ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          <div className="w-full">
            <label className="font-medium">
              Drop Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dropDate"
              value={formData.dropDate}
              onChange={handleChange}
              className={`${inputBase} ${
                errors.dropDate ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
        </div>

        {/* Time */}
        <div className="w-full mt-4">
          <label className="font-medium">
            Pickup Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="pickupTime"
            value={formData.pickupTime}
            onChange={handleChange}
            className={`${inputBase} ${
              errors.pickupTime ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        {/* Message */}
        <div>
          <label className="font-medium">Additional Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded border border-gray-300 resize-none h-28"
          />
        </div>

        {/* Buttons */}
        <button
          type="submit"
          className="w-full bg-[#0B2545] hover:bg-[#142D57] text-white font-semibold px-6 py-3 rounded transition-colors duration-200"
        >
          Book Taxi
        </button>

        <button
          type="button"
          onClick={sendBookingViaWhatsApp}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-200"
        >
          Book via WhatsApp
        </button>
      </form>
    </div>
  );
}
