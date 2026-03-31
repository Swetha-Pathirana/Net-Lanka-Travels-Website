import React, { useState } from "react";
import { FaCar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFloatingButtons } from "../context/FloatingButtonsContext";

export default function QuickTaxiButton() {
  const navigate = useNavigate();
  const { isScrollVisible, isWhatsAppOpen } = useFloatingButtons();
  const [open, setOpen] = useState(false);

  // Hide button if WhatsApp is open
  if (isWhatsAppOpen) return null;

  const handleOpenBooking = () => {
    setOpen(false);
    navigate("/quick-taxi");
  };

  return (
    <div
      className={`fixed right-6 z-[9999] flex flex-col items-end transition-all duration-300
    ${isScrollVisible ? "bottom-40" : "bottom-28"}
  `}
    >
      {/* CARD ABOVE BUTTON */}
      {open && (
        <aside
          id="quick-taxi-card"
          className="mb-3 w-72 bg-white rounded-xl shadow-xl overflow-hidden animate-slideUp"
          role="region"
          aria-label="Quick Taxi booking card"
        >
          <header className="bg-blue-600 p-3 text-white flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">Quick Taxi</h3>
              <p className="text-sm opacity-90">Book your ride quickly</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white text-lg"
              aria-label="Close Quick Taxi booking card"
            >
              ✕
            </button>
          </header>

          {/* Contact Info */}
          <div className="flex items-center gap-4 p-4 border-b">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <FaCar className="text-white text-xl" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Net Lanka Travels</p>
              <p className="text-sm text-gray-500">
                Typically replies in a few minutes
              </p>
            </div>
          </div>

          {/* Book Now Button */}
          <div className="p-3">
            <button
              onClick={handleOpenBooking}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              aria-label="Book a Quick Taxi ride with Net Lanka Travels"
            >
              Book Now
            </button>
          </div>
        </aside>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 text-white py-2 px-4 rounded-full shadow-lg hover:scale-105 transition text-sm font-semibold"
        aria-expanded={open}
        aria-controls="quick-taxi-card"
        aria-label="Open Quick Taxi booking card"
      >
        Quick Taxi
      </button>
    </div>
  );
}
