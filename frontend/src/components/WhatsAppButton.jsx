import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useFloatingButtons } from "../context/FloatingButtonsContext";

export default function WhatsAppFAB() {
  const location = useLocation();
  const { isWhatsAppOpen, setIsWhatsAppOpen } = useFloatingButtons();
  const { isScrollVisible } = useFloatingButtons();
  const [phone, setPhone] = useState("94771234567");
  const [tourTitle, setTourTitle] = useState("");

  // ---------------- Get WhatsApp number ----------------
  useEffect(() => {
    axiosInstance
      .get("/contact")
      .then((res) => {
        const p = res.data?.whatsapp || res.data?.phone;
        if (p) setPhone(p.replace(/\D/g, ""));
      })
      .catch(() => setPhone("94771234567"));
  }, []);

  // ---------------- Get tour title ----------------
  useEffect(() => {
    const path = location.pathname;
    const parts = path.split("/").filter(Boolean);
    const id = parts[parts.length - 1];

    if (path.startsWith("/day-tour-detail/") && id) {
      axiosInstance.get(`/day-tours/slug/${id}`).then((res) => {
        setTourTitle(
          res.data?.details?.heroTitle || res.data?.tour?.title || ""
        );
      });
    } else if (path.startsWith("/round-tours/") && id) {
      axiosInstance.get(`/round-tours/slug/${id}`).then((res) => {
        setTourTitle(
          res.data?.details?.heroTitle || res.data?.tour?.title || ""
        );
      }); 
    } else {
      setTourTitle("");
    }
  }, [location.pathname]);

  // ---------------- Open WhatsApp ----------------
  const openWhatsApp = (message) => {
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  // ---------------- Messages ----------------
  const getMessage = (option) => {
    const base = "*Net Lanka Travels*";

    if (tourTitle) {
      if (option === "book")
        return `${base}\n\nI’m interested in this tour:\n*${tourTitle}*\n\nI want to book it.`;
      if (option === "question")
        return `${base}\n\nI have a question about this tour:\n*${tourTitle}*`;
      if (option === "info")
        return `${base}\n\nI want more information about this tour:\n*${tourTitle}*`;
    }

    if (option === "book") return `${base}\n\nI want to book a tour.`;
    if (option === "question")
      return `${base}\n\nI have a question about your tours.`;
    if (option === "info")
      return `${base}\n\nI want more information about your tours.`;

    return `${base}\n\nHello!`;
  };

  return (
    <div
      className={`fixed right-6 z-50 flex flex-col items-end transition-all duration-300
    ${isScrollVisible ? "bottom-20" : "bottom-6"}
  `}
    >
      {/* CARD */}
      {isWhatsAppOpen && (
        <aside
          className="mb-4 w-80 bg-white rounded-xl shadow-2xl overflow-hidden animate-slideUp"
          role="region"
          aria-label="WhatsApp chat options"
        >
          <header className="bg-green-500 p-4 text-white flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Start a Conversation</h3>
              <p className="text-sm opacity-90">
                Click an option to chat on WhatsApp
              </p>
            </div>
            <button
              onClick={() => setIsWhatsAppOpen(false)}
              aria-label="Close WhatsApp chat options"
            >
              ✕
            </button>
          </header>

          <div className="flex items-center gap-4 p-4 border-b">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <FaWhatsapp className="text-white text-xl" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Net Lanka Travels</p>
              <p className="text-sm text-gray-500">
                Typically replies in a few minutes
              </p>
            </div>
          </div>

          <nav className="p-3 space-y-2" aria-label="WhatsApp chat options">
            <button
              onClick={() => openWhatsApp(getMessage("book"))}
              className="w-full bg-green-500 text-white py-2 rounded-lg"
              aria-label="Book a tour via WhatsApp"
            >
              Book Tour
            </button>

            <button
              onClick={() => openWhatsApp(getMessage("question"))}
              className="w-full bg-blue-500 text-white py-2 rounded-lg"
              aria-label="Ask a question via WhatsApp"
            >
              Ask Question
            </button>

            <button
              onClick={() => openWhatsApp(getMessage("info"))}
              className="w-full bg-yellow-500 text-white py-2 rounded-lg"
              aria-label="Get more info via WhatsApp"
            >
              More Info
            </button>
          </nav>
        </aside>
      )}

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition"
        aria-expanded={isWhatsAppOpen}
        aria-controls="WhatsApp chat options"
        aria-label="Open WhatsApp chat options"
      >
        <FaWhatsapp className="text-white text-3xl" aria-hidden="true" />
      </button>
    </div>
  );
}
