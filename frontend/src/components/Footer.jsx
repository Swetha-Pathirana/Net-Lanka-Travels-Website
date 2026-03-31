import React, { useEffect, useState } from "react";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTripadvisor,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { axiosInstance } from "../lib/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Footer() {
  const [contact, setContact] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axiosInstance.get("/contact");
        setContact(res.data);
      } catch (err) {
        console.error("Error fetching contact info:", err);
      }
    };
    fetchContact();
  }, []);

  // ------------------- Newsletter Subscription -------------------
  const subscribeNewsletter = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.warning("Please enter your email!", { theme: "colored" });
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/newsletter", { email });

      if (res.data.success) {
        toast.success(res.data.message || "Subscribed successfully!", {
          theme: "colored",
        });
        setEmail(""); // clear input
      } else {
        toast.error(res.data.message || "Subscription failed", {
          theme: "colored",
        });
      }
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      toast.error("Server error. Please try again later.", {
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const socialIcons = {
    facebook: FaFacebookF,
    instagram: FaInstagram,
    youtube: FaYoutube,
    tripadvisor: FaTripadvisor,
    email: FaEnvelope,
    whatsapp: FaWhatsapp,
    twitter: FaTwitter,
    linkedin: FaLinkedinIn,
  };

  const menuItems = [
    { name: "HOME", path: "/" },
    { name: "TAILOR-MADE TOURS", path: "/tailor-made-tours" },
    { name: "DESTINATIONS", path: "/destinations" },
    { name: "DAY TOURS", path: "/day-tours" },
    { name: "ROUND TOURS", path: "/round-tours" },
    { name: "ABOUT US", path: "/about" },
    { name: "COMMUNITY IMPACTS", path: "/community-impact" },
    { name: "BLOG", path: "/blog" },
    { name: "EVENT", path: "/events" },
    { name: "EXPERIENCE", path: "/experience" },
    { name: "CONTACT US", path: "/contact" },
  ];

  return (
    <footer
      className="
    bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_40%,rgba(0,0,0,0.65)_70%,rgba(0,0,0,0.5)_100%)]
    text-white
    pt-20
    pb-10
    font-[Poppins]
  "
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-14">
        {/* ---------------- LOGO & SOCIAL ---------------- */}
        <div className="flex flex-col items-center text-center">
          <img
            src="/images/logo.webp"
            alt="NetLanka Travels Logo"
            className="w-40 mb-5 opacity-95"
          />
          <p className="text-gray-200 text-[15px] leading-relaxed mb-4 max-w-sm">
            Net Lanka Travels is your trusted travel partner in Sri Lanka,
            offering tailor-made tours, adventures, and premium travel
            experiences.
          </p>
          <div className="flex gap-4 mt-2" aria-label="Social Media Links">
          {contact?.socialMedia?.map((sm, i) => {
  const platform = sm.platform?.toLowerCase();
  const Icon = socialIcons[platform];
  if (!Icon) return null;

  let href = sm.url;

  if (platform === "email") {
    href = `mailto:${sm.url}`;
  }
  else if (platform === "whatsapp") {
    const phone = sm.url.replace(/\D/g, "");
    href = `https://wa.me/${phone}`;
  }
  else if (!href.startsWith("http")) {
    href = `https://${href}`;
  }

  return (
    <a
      key={i}
      href={href}
      target={platform === "email" ? "_self" : "_blank"}
      rel="noopener noreferrer"
      aria-label={`Contact us via ${sm.platform}`}
      className="hover:scale-110 transition-transform"
    >
      <Icon size={20} />
    </a>
  );
})}

          </div>
        </div>
        {/* ---------------- CONTACT INFO ---------------- */}
        <div className="space-y-12">
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
            <address className="not-italic space-y-5">
              {contact?.phone && (
                <div className="flex gap-3 items-center">
                  <FaPhoneAlt />
                  <a
                    href={`tel:${contact.phone}`}
                    className="hover:text-blue-300"
                  >
                    {contact.phone}
                  </a>
                </div>
              )}

              {contact?.whatsapp && (
                <div className="flex gap-3 items-center">
                  <FaWhatsapp />
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(
                      /\D/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-400"
                  >
                    {contact.whatsapp}
                  </a>
                </div>
              )}

              {contact?.emails?.[0] ? (
                <div className="flex gap-3 items-center">
                  <FaEnvelope />
                  <a
                    href={`mailto:${contact.emails[0]}`}
                    className="hover:text-blue-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contact.emails[0]}
                  </a>
                </div>
              ) : (
                <p>No email found</p>
              )}

              {contact?.offices?.map((o, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <FaMapMarkerAlt />
                  <div>
                    <p className="font-medium">{o.name}</p>
                    <p className="text-gray-300">{o.address}</p>
                  </div>
                </div>
              ))}

              {contact?.workingHours && (
                <div className="flex gap-3 items-center">
                  <FaClock />
                  <span>
                    {contact.workingHours.start} - {contact.workingHours.end}
                  </span>
                </div>
              )}
            </address>
          </div>

          {/* ---------------- QUICK LINKS (LEGAL) ---------------- */}
          <nav aria-label="Quick Legal Links">
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-gray-200">
              <li>
                <a
                  href="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>

              <li>
                <a
                  href="/terms-and-conditions"
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* ---------------- navigation ---------------- */}
        <nav aria-label="Navigation">
          <h3 className="text-xl font-semibold mb-6">Navigation's</h3>
          <ul className="space-y-3 text-gray-200">
            {menuItems.map((item, i) => (
              <li key={i}>
                <a href={item.path} className="hover:text-white">
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ---------------- NEWSLETTER ---------------- */}
        <div>
          <h3 className="text-xl font-semibold mb-6">
            Subscribe to our Newsletter
          </h3>

          <p className="text-gray-300 text-sm mb-4">
            Get updates, offers, and travel tips directly in your inbox.
          </p>

          <form
            className="flex flex-col gap-3"
            onSubmit={subscribeNewsletter}
            aria-label="Newsletter Subscription Form"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {/* 🔒 Privacy Consent */}
          <p className="mt-4 text-xs text-gray-300 leading-relaxed">
            By subscribing, you agree to our{" "}
            <a
              href="/privacy-policy"
              className="underline hover:text-white transition"
            >
              Privacy Policy
            </a>{" "}
            and consent to receive emails from Net Lanka Travels.
          </p>
        </div>
      </div>

      <hr className="border-gray-900 my-8" />

      <div
        className="px-6
  text-gray-900 font-semibold text-xs md:text-sm 
  flex flex-col sm:flex-row justify-between gap-2 
 "
      >
        <p>© {new Date().getFullYear()} NetLanka Tours. All rights reserved.</p>
        <p>Website Design & Development by NetIT Technology</p>
      </div>
    </footer>
  );
}
