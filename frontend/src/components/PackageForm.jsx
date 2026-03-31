import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import DestinationSelector from "./DestinationSelector";
import ExperienceSelector from "./ExperienceSelector";
import { FaChevronDown } from "react-icons/fa";

const PackageForm = ({ prefill }) => {
  const today = new Date().toISOString().split("T")[0];

  const [whatsappNumber, setWhatsappNumber] = useState("94771234567");
  const [vehicles, setVehicles] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);

  const [formData, setFormData] = useState({
    tourType: prefill?.tourType || "Day Tour",
    fullName: prefill?.fullName || "",
    country: prefill?.country || "",
    email: prefill?.email || "",
    phone: prefill?.phone || "",
    pickupLocation: prefill?.pickupLocation || "",
    dropLocation: prefill?.dropLocation || "",
    startDate: prefill?.startDate || "",
    endDate: prefill?.endDate || "",
    adults: prefill?.adults || 1,
    children: prefill?.children || 0,
    travelPurpose: prefill?.travelPurpose || "",
    customTravelPurpose: prefill?.customTravelPurpose || "",

    vehicle: prefill?.vehicle || "",
    selectedDestinations: prefill?.selectedDestinations || [],
    selectedExperiences: prefill?.selectedExperiences || [],
    notes: prefill?.notes || "",
  });

  // Fetch WhatsApp number
  useEffect(() => {
    axiosInstance
      .get("/contact")
      .then((res) => {
        const p = res.data?.whatsapp || res.data?.phone;
        if (p) setWhatsappNumber(p.replace(/\D/g, ""));
      })
      .catch(() => {});
  }, []);

  // Fetch vehicles
  useEffect(() => {
    axiosInstance
      .get("/quick-taxi/taxis")
      .then((res) => {
        if (res.data.success) setVehicles(res.data.taxis);
      })
      .catch(console.error);
  }, []);

  // Fetch experiences
  useEffect(() => {
    axiosInstance
      .get("/experience")
      .then((res) => setExperiences(res.data || []))
      .catch(() => toast.error("Failed to load experiences"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validateForm = () => {
    const errors = [];
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (!formData.tourType) errors.push("Tour type is required");
    if (!formData.fullName.trim()) errors.push("Full name is required");
    if (!formData.country.trim()) errors.push("Country is required");
    if (!formData.email.trim()) errors.push("Email is required");
    if (!formData.phone.trim()) errors.push("Phone is required");
    if (!formData.pickupLocation.trim()) errors.push("Pickup location required");
    if (!formData.dropLocation.trim()) errors.push("Drop location required");
    if (!formData.startDate) errors.push("Start date required");
    if (!formData.endDate) errors.push("End date required");
    if (start < now) errors.push("Start date cannot be in the past");
    if (start > end) errors.push("Start date cannot be after end date");
    if (!formData.vehicle.trim()) errors.push("Please select a vehicle");
    if (!formData.travelPurpose) errors.push("Travel Purpose is required");
    if (formData.travelPurpose === "Other" && !formData.customTravelPurpose.trim())
      errors.push("Please specify your Travel Purpose");
    if (formData.selectedDestinations.length === 0)
      errors.push("Please select at least one destination");

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    const finalTravelPurpose =
  formData.travelPurpose === "Other"
    ? formData.customTravelPurpose
    : formData.travelPurpose;

    // WhatsApp message like the second code
    const phone = whatsappNumber.replace(/\D/g, "");
    const message =
      "Hello!\n\n" +
      "* Net Lanka Travels - Tour Booking *\n\n" +
      `I am interested in your *${prefill?.packageTitle || "tour package"}*. Here are my details:\n\n` +
      `*Tour Type:* ${formData.tourType}\n` +
      `*Name:* ${formData.fullName}\n` +
      `*Country:* ${formData.country}\n` +
      `*Email:* ${formData.email}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Pickup Location:* ${formData.pickupLocation}\n` +
      `*Drop Location:* ${formData.dropLocation}\n` +
      `*Start Date:* ${formData.startDate}\n` +
      `*End Date:* ${formData.endDate}\n` +
      `*Adults:* ${formData.adults}\n` +
      `*Children:* ${formData.children}\n` +
      `*Travel Purpose:* ${finalTravelPurpose}\n` +
      `*Vehicle:* ${formData.vehicle}\n` +
      `*Destinations:* ${formData.selectedDestinations.join(", ")}\n` +
      `*Experiences:* ${formData.selectedExperiences.length ? formData.selectedExperiences.join(", ") : (prefill?.selectedExperiences?.join(", ") || "N/A")}\n` +
      `*Notes:* ${formData.notes || "N/A"}\n\n` +
      "Could you please provide more information about this tour? Thank you!";

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="max-w-xl mx-auto px-3 md:px-5">
      {prefill?.packageTitle && (
        <h2 className="text-2xl font-bold text-center mb-6">
          {prefill.packageTitle}
        </h2>
      )}

      {/* Basic Inputs */}
      {[{ label: "Full Name", name: "fullName" },
        { label: "Country", name: "country" },
        { label: "Email", name: "email" },
        { label: "Phone", name: "phone" },
        { label: "Pickup Location", name: "pickupLocation" },
        { label: "Drop Location", name: "dropLocation" }].map((f) => (
        <div key={f.name} className="mt-4">
          <label className="font-semibold">{f.label} *</label>
          <input
            name={f.name}
            value={formData[f.name]}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />
        </div>
      ))}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
  <div>
    <label className="block text-black font-semibold mb-1">
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
    <label className="block text-black font-semibold mb-1 ">
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


 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
  {/* Vehicle */}
  <div>
    <label className="block text-black font-semibold mb-2">
      Select Vehicle *
    </label>
    <div className="relative">
      <select
        name="vehicle"
        value={formData.vehicle}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-md appearance-none pr-10"
      >
        <option value="">Select a vehicle</option>
        {vehicles.map((v) => (
          <option key={v._id} value={v.name}>
            {v.name} • {v.seats} Seats
          </option>
        ))}
      </select>
      <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
    </div>
  </div>

  {/* Travel Purpose */}
  <div>
    <label className="block text-black font-semibold mb-2">
      Travel Purpose *
    </label>
    <div className="relative">
      <select
        name="travelPurpose"
        value={formData.travelPurpose}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            travelPurpose: e.target.value,
            customTravelPurpose: e.target.value === "Other" ? prev.customTravelPurpose : "",
          }))
        }
        className="w-full p-3 border border-gray-300 rounded-md appearance-none pr-10"
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
        ].map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
    </div>

    {formData.travelPurpose === "Other" && (
      <input
        type="text"
        name="customTravelPurpose"
        value={formData.customTravelPurpose}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, customTravelPurpose: e.target.value }))
        }
        placeholder="Specify travel purpose"
        className="w-full mt-2 p-2 border border-gray-300 rounded-md"
      />
    )}
  </div>
</div>


<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 ">
  {/* ================= Destination ================= */}
  <div>
     <label className="block text-black font-semibold mb-2">
      Destinations *
    </label>
    <button
      type="button"
      onClick={() => setShowDestinationModal(true)}
      className="w-full border p-3 rounded-md  flex justify-between items-center"
    >
      Select destinations
      <FaChevronDown className="ml-2 " />
    </button>

    <div className="flex flex-wrap gap-2 mt-2">
      {formData.selectedDestinations.map((d, i) => (
        <span
          key={i}
          className="bg-blue-100 px-2 py-1 rounded-full text-sm"
        >
          {d}
        </span>
      ))}
    </div>
  </div>

  {/* ================= Experience ================= */}
  <div>
    <label className="block text-black font-semibold mb-2">
     Experiences *
    </label>
    <button
      type="button"
      onClick={() => setShowExperienceModal(true)}
      className="w-full border p-3 rounded-md  flex justify-between items-center"
    >
      Select experiences
      <FaChevronDown className="ml-2 " />
    </button>

    <div className="flex flex-wrap gap-2 mt-2">
      {formData.selectedExperiences.map((e, i) => (
        <span
          key={i}
          className="bg-green-100 px-2 py-1 rounded-full text-sm"
        >
          {e}
        </span>
      ))}
    </div>
  </div>
</div>

     <div className="mt-4">
  <label
    htmlFor="notes"
    className="block mb-1 font-semibold text-black"
  >
    Notes
  </label>

  <textarea
    id="notes"
    name="notes"
    value={formData.notes}
    onChange={(e) =>
      setFormData({ ...formData, notes: e.target.value })
    }
    rows={4}
  
    className="w-full border p-3 rounded-md"
  />
</div>
{/* Inquiry Prompt */}
<p className="mt-3 text-gray-600 text-sm italic text-center">
  Got any ideas for your dream trip? Tell us about the destinations, experiences, or special requests you’d like included!
</p>

      <button
        onClick={handleSubmit}
        className="w-full mt-6 bg-green-600 text-white py-3 rounded-md font-bold"
      >
        Send via WhatsApp
      </button>

      {/* Destination Modal */}
      {showDestinationModal && (
        <div className="fixed inset-0 bg-black/50 z-[20000] flex justify-center items-center">
          <div className="bg-white w-[95vw] max-w-[700px] h-[90vh] rounded-xl overflow-hidden">
            <DestinationSelector
              initialSelected={formData.selectedDestinations}
              onConfirm={(d) => {
                setFormData((p) => ({ ...p, selectedDestinations: d }));
                setShowDestinationModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Experience Modal */}
      {showExperienceModal && (
        <div className="fixed inset-0 bg-black/50 z-[20000] flex justify-center items-center">
          <div className="bg-white w-[95vw] max-w-[800px] h-[90vh] rounded-xl overflow-hidden">
            <ExperienceSelector
              experiences={experiences}
              initialSelected={formData.selectedExperiences}
              onConfirm={(e) => {
                setFormData((p) => ({ ...p, selectedExperiences: e }));
                setShowExperienceModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageForm;
