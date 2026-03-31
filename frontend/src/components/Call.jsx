import React, { useEffect, useState } from "react";
import { FaPhone, FaWhatsapp } from "react-icons/fa";
import { axiosInstance } from "../lib/axios";

export default function Call() {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axiosInstance.get("/contact");
        setContact(res.data);
      } catch (err) {
        console.error("Failed to fetch contact info", err);
      }
    };
    fetchContact();
  }, []);

  // Fallback if contact data hasn't loaded yet
  const phone = contact?.phones?.[0] || "+94 72 917 1089";

  return (
    <section className="relative bg-zinc-100">
      <div className="mx-6 md:mx-12 lg:mx-20 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* LEFT: circular image */}
            <div className="flex-shrink-0 w-full md:w-1/3 flex justify-center md:justify-start">
              <div className="w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden shadow-lg">
                <img
                  src="/images/12.jpg"
                  alt="Traveler"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* RIGHT: CTA text */}
            <div className="w-full md:w-2/3 px-14">
              <p className="text-sm md:text-lg text-gray-500 uppercase tracking-widest mb-6">
                Call to Action
              </p>

              <h2 className="font-extrabold text-4xl md:text-5xl leading-tight text-gray-900 mb-6">
                Keep us in mind
              </h2>

              <p className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Planning the adventure of a lifetime? Keep us in mind for an
                unforgettable journey!
              </p>

              <p className="text-gray-400 max-w-xl mb-8">
                Ready for the adventure? We’ll make it one to remember!{" "}
                <strong className="text-gray-700">Call us today</strong> and
                start your journey with confidence.
              </p>

              {/* Phone row */}
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#2E5B84] text-white shadow">
                  <FaPhone size={20} aria-hidden="true" />
                </div>

                <div>
                  <div className="text-sm text-gray-500">Call:</div>
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="inline-block text-lg md:text-xl font-bold text-gray-900"
                  >
                    {phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp button */}
      <a
        href={`https://wa.me/${phone.replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-6 bottom-6 z-50"
        aria-label="WhatsApp"
      >
        <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg transform hover:scale-105 transition">
          <FaWhatsapp size={20} className="text-white" />
        </div>
      </a>
    </section>
  );
}
