import React, { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Sections for selection
const SIDEBAR_SECTIONS = [
  { section: "Home Content" },
  { section: "About" },
  { section: "Community Impact" },
  { section: "Day Tours" },
  { section: "Round Tours" },
  { section: "Tailor-Made Tours" },
  { section: "Destinations" },
  { section: "Blogs" },
  { section: "Events" },
  { section: "Experiences" },
  { section: "Manage Vehicles" },
  { section: "Taxi Bookings" },
  { section: "Day Tour Bookings" },
  { section: "Round Tour Bookings" },
  { section: "Customize Tour Bookings" },
  { section: "Event Tour Bookings" },
  { section: "Blog Comments" },
  { section: "Tour Reviews" },
  { section: "Tailor Reviews" },
  { section: "TripAdvisor Reviews" },
  { section: "Contact" },
];

export default function AdminSectionRequest() {
  const [selectedSections, setSelectedSections] = useState([]);
  const [actionType, setActionType] = useState("edit");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("medium");

  const handleCheckbox = (section) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const sendNotification = async () => {
    if (selectedSections.length === 0) {
      toast.error("Select at least one section");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      // Send ONE notification with all sections
      await axiosInstance.post("/super-admin/notifications", {
        sections: selectedSections, // array of sections
        action: actionType,
        message,
        priority,
      });

      toast.success("Notification sent to admin!");
      setSelectedSections([]);
      setMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send notification");
    }
  };

  return (
    <div>
      {/* Main Content */}
      <main>
        <h1 className="text-4xl font-bold text-[#0d203a] mb-2">
          Super Admin - Admin Section Change Requests
        </h1>

        <p className="text-gray-600 mb-8">
          Send section-wise change requests to Admins for adding, editing, or
          removing content.
        </p>

        {/* Panels Container */}
        <div className="bg-white border border-[#2E5B84] rounded-xl p-4 shadow-sm hover:shadow-md transition mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
            {/* Action Type */}
            <div>
              <label className="font-semibold text-[#0d203a] block mb-2">
                Action Type
              </label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="w-full border border-[#2E5B84] p-2 rounded text-[#0d203a]"
              >
                <option value="add">Add</option>
                <option value="edit">Edit</option>
                <option value="delete">Delete</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="font-semibold text-[#0d203a] block mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-[#2E5B84] p-2 rounded text-[#0d203a]"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Message Box */}
          <div>
            <label className="font-semibold text-[#0d203a] block mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message to the admin..."
              className="w-full border border-[#2E5B84] rounded p-2 min-h-[120px] text-[#0d203a]"
            />
          </div>

          <div className="bg-white border border-[#2E5B84] rounded-xl p-4 shadow-sm hover:shadow-md transition mt-6">
            {/* Selected Count */}
            <p className="text-sm text-gray-500 mb-4">
              Selected {selectedSections.length} of {SIDEBAR_SECTIONS.length}{" "}
              sections
            </p>

            {/* Sections Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SIDEBAR_SECTIONS.map((sec) => (
                <label
                  key={sec.section}
                  className={`flex items-center gap-3 border rounded-2xl p-4 cursor-pointer transition
                ${
                  selectedSections.includes(sec.section)
                    ? "border-green-600 bg-green-50 shadow-md"
                    : "border-[#2E5B84] bg-white shadow-sm hover:shadow-md"
                }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(sec.section)}
                    onChange={() => handleCheckbox(sec.section)}
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-[#0d203a] font-medium">
                    {sec.section}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={sendNotification}
            className="mt-6 bg-[#2E5B84] hover:bg-[#1E3A60] text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Send Notification
          </button>
        </div>
      </main>

      <ToastContainer />
    </div>
  );
}
