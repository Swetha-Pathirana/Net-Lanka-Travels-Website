import React, { useEffect, useState } from "react";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaClock,
  FaMapMarkerAlt,
  FaShareAlt,
} from "react-icons/fa";
import Testimonials from "../components/Testimonials";
import ContactForm from "../components/admin/ContactForm";
import { axiosInstance } from "../lib/axios";
import L from "leaflet";
import "leaflet-routing-machine";
import { Helmet } from "react-helmet-async";

// Make Leaflet global for routing machine
window.L = L;

const ContactMap = React.lazy(() => import("../components/ContactMap"));

/* --------------------------- MAIN CONTACT PAGE --------------------------- */
const Contact = () => {
  const [contact, setContact] = useState({
    offices: [],
    phones: [],
    emails: [],
    socialMedia: [],
    workingHours: { start: "", end: "" },
  });
  const [userLocation, setUserLocation] = useState(null);
  const [showText, setShowText] = useState(false);
  const [currentPage] = useState(1);
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [currentPage]);
  useEffect(() => {
    setTimeout(() => setShowText(true), 300);
  }, []);

  useEffect(() => {
    axiosInstance
      .get("/contact")
      .then((res) => setContact(res.data || {}))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, []);

  return (
    <div className="font-poppins bg-white text-[#222]">
      <Helmet>
        <title>Contact Us | Net Lanka Travels</title>
        <meta
          name="description"
          content="Contact Net Lanka Travels to plan your Sri Lanka tour. Get expert advice, custom itineraries and reliable travel services."
        />
        <link rel="canonical" href="https://www.netlankatravels.com/contact" />
      </Helmet>

      {/* HERO HEADER */}
      <div
        className="w-full h-[360px] md:h-[560px] bg-cover bg-center relative flex items-center justify-center text-white"
        style={{
          backgroundImage: "url('/images/contact-header.webp')",
          backgroundPosition: "center 20%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className={`absolute bottom-6 md:bottom-10 right-4 md:right-10 max-w-[90%] md:w-[320px] bg-black/80 text-white p-4 md:p-6 backdrop-blur-sm shadow-lg border-none flex items-center justify-end transition-all duration-700 ease-out ${
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="text-xl md:text-3xl leading-snug text-right mr-4">
            Contact Us Anytime
          </h2>
          <div className="w-[2px] bg-white h-10 md:h-12"></div>
        </div>
      </div>

      {/* SECTION TITLE */}
      <section className="w-full py-8 sm:py-12 text-center max-w-5xl mx-auto px-4">
        <p className="text-xs sm:text-sm font-semibold text-gray-600 tracking-widest mb-1 sm:mb-2">
          CONTACT
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4">
          Get In Touch With Us
        </h2>
        <p className="text-gray-700 text-base sm:text-lg">
          We’re here to help you plan your perfect journey.
        </p>
        <div className="w-12 sm:w-16 h-[3px] bg-[#D4AF37] mx-auto mt-4 sm:mt-6"></div>
      </section>

      {/* CONTACT + FORM */}
      <section className="py-6 px-4 sm:px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-9 gap-10 sm:gap-12 items-center">
        {/* CONTACT INFO */}
        <div className="space-y-8 lg:col-span-4 pl-1 sm:pl-10 max-md:pl-3">
          {/* OFFICES */}
          <div>
            {contact.offices.map((office, i) => (
              <div key={i} className="mb-4">
                <h4 className="font-bold text-lg sm:text-xl text-[#122453] mb-1 flex items-center gap-2">
                  <FaMapMarkerAlt /> {office.name}
                </h4>
                <p className="pl-6 text-gray-700 text-sm sm:text-base">
                  {office.address}
                </p>
              </div>
            ))}
          </div>

          {/* PHONE */}
          <div>
            <h4 className="font-bold text-lg sm:text-xl text-[#122453] mb-2 flex items-center gap-2">
              <FaPhoneAlt /> Phone
            </h4>
            <p className="pl-6 mb-1 text-sm sm:text-base">{contact.phone}</p>
          </div>

          {/* WHATSAPP */}
          <div>
            <h4 className="font-bold text-lg sm:text-xl text-[#122453] mb-2 flex items-center gap-2">
              <FaWhatsapp /> WhatsApp
            </h4>
            <p className="pl-6 mb-1 text-sm sm:text-base">{contact.whatsapp}</p>
          </div>

          {/* EMAIL */}
          <div>
            <h4 className="font-bold text-lg sm:text-xl text-[#122453] mb-2 flex items-center gap-2">
              <FaEnvelope /> Email
            </h4>
            {contact.emails.map((e, i) => (
              <p key={i} className="pl-6 mb-1 text-sm sm:text-base">
                {e}
              </p>
            ))}
          </div>

          {/* HOURS */}
          <div>
            <h4 className="font-bold text-lg sm:text-xl text-[#122453] mb-2 flex items-center gap-2">
              <FaClock /> Working Hours
            </h4>
            <p className="pl-6 mb-1 text-sm sm:text-base">
              {contact.workingHours.start} – {contact.workingHours.end}{" "}
              (UTC+5:30)
            </p>
          </div>

          {/* SOCIAL */}
          <div>
            <h4 className="font-bold text-lg sm:text-xl text-[#122453] mb-4 flex items-center gap-2">
              <FaShareAlt /> Connect With Us Online
            </h4>
            <div className="flex gap-3 sm:gap-4 items-center flex-wrap max-md:pl-1">
              {contact?.socialMedia?.map((s, i) => {
                const platform = s.platform?.toLowerCase();
                let href = s.url;

                if (platform === "email") {
                  href = `mailto:${s.url}`;
                } else if (platform === "whatsapp") {
                  const phone = s.url.replace(/\D/g, "");
                  href = `https://wa.me/${phone}`;
                } else if (!href.startsWith("http")) {
                  href = `https://${href}`;
                }

                return (
                  <a
                    key={i}
                    href={href}
                    target={platform === "email" ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition"
                    aria-label={`Contact via ${s.platform}`}
                  >
                    {s.icon ? (
                      <img
                        src={s.icon}
                        alt={s.platform}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                      />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white shadow-xl p-5 sm:p-8 rounded-xl space-y-6 border border-gray-100 lg:col-span-5">
          <ContactForm />
        </div>
      </section>

      {/* MAP */}
      <section className="w-full px-4 sm:px-6 mt-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 text-center">
          Our Locations at a Glance
        </h2>
        <div className="w-16 h-[3px] bg-yellow-500 mx-auto mb-6 rounded"></div>

        <div
          className="relative rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          style={{ height: 350 }}
        >
          <React.Suspense
            fallback={<div className="text-center py-10">Loading map...</div>}
          >
            <ContactMap offices={contact.offices} userLocation={userLocation} />
          </React.Suspense>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />
    </div>
  );
};

export default Contact;
