import React, { useState, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTripadvisor,
  FaEnvelope,
  FaWhatsapp,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(null);
  const [sidebar, setSidebar] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contact, setContact] = useState(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* FETCH CONTACT (WhatsApp + Social Media) */
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axiosInstance.get("/contact");
        setContact(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchContact();
  }, []);

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
    { name: "HOME" },
    { name: "TAILOR-MADE TOURS" },
    { name: "DESTINATIONS" },
    { name: "TOURS", dropdown: ["Day Tours", "Round Tours"] },
    {
      name: "OUR STORY",
      dropdown: ["About", "Community Impact"],
    },
    {
      name: "INSIGHT",
      dropdown: ["Blog", "Events"],
    },

    { name: "EXPERIENCE" },
    { name: "CONTACT US" },
  ];

  const getPath = (text) => {
    switch (text) {
      case "HOME":
        return "/";
      case "TAILOR-MADE TOURS":
        return "/tailor-made-tours";
      case "DESTINATIONS":
        return "/destinations";
      case "TOURS":
        return "/tours";
      case "Day Tours":
        return "/day-tours";
      case "Round Tours":
        return "/round-tours";
      case "OUR STORY":
        return "/our-story";
      case "About":
        return "/about";
      // case "Our Team":
      //   return "/our-team";
      // case "Our Journey":
      //   return "/our-journey";
      case "Community Impact":
        return "/community-impact";
      case "Blog":
        return "/blog";
      case "Events":
        return "/events";

      case "EXPERIENCE":
        return "/experience";
      case "CONTACT US":
        return "/contact";
      default:
        return "/";
    }
  };

  // Close dropdown when clicking outside (desktop)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".nav-link") &&
        !event.target.closest(".dropdown")
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  const whatsappNumber = contact?.whatsapp?.replace(/\D/g, "");
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : "https://wa.me/94705325512";

  const emailLink = contact?.emails?.[0]
    ? `mailto:${contact.emails[0]}?subject=Tour Enquiry`
    : "mailto:inquiries@netlankatravels.com?subject=Tour Enquiry";

  return (
    <div className="w-full fixed top-0 left-0 z-[9999] font-[Poppins]">
      {/* HEADER AREA */}
      <div
        className={`w-full px-[6%] transition-all duration-300 ${
          scrolled
            ? "bg-black/90 py-4 shadow-[0_6px_30px_rgba(0,0,0,0.65)]"
            : "bg-header-gradient pt-6 pb-10"
        }`}
      >
        {/* TOP ROW */}
        <div
          className={`w-full flex items-center justify-between transition-all duration-300 ${
            scrolled
              ? "opacity-0 h-0 overflow-hidden mb-0 mt-0"
              : "opacity-100 h-auto mb-7 mt-10"
          }`}
        >
          {/* SOCIAL ICONS – LEFT OF LOGO */}
          <div className="hidden md:flex items-center gap-4">
            {contact?.socialMedia?.map((sm, i) => {
              const platform = sm.platform?.toLowerCase();
              const Icon = socialIcons[platform];
              if (!Icon) return null;

              let href = sm.url;

              if (platform === "email") {
                href = `mailto:${sm.url}`;
              } else if (platform === "whatsapp") {
                const phone = sm.url.replace(/\D/g, "");
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
                  aria-label={`Contact us via ${sm.platform}`}
                  className="text-white hover:text-gray-300 hover:scale-110 transition-transform"
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>

          {/* LOGO */}
          <div className="absolute left-1/2 -translate-x-1/2 mb-4">
            <Link to="/" onClick={() => setSidebar(false)}>
              <img
                src="/images/logo.webp"
                alt="Logo"
                className="w-[150px] opacity-95 transition-transform duration-300 hover:scale-105 cursor-pointer"
              />
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex items-center gap-8 text-white ml-auto">
            <div className="flex items-center gap-2 text-[15px]">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[15px] hover:text-green-400 transition"
              >
                <FaWhatsapp className="text-xl" />
                {contact?.whatsapp || "(+94) 705 325 512"}
              </a>
            </div>
            <a
              href={emailLink}
              className="px-6 py-[9px] border border-white rounded-full text-[14px] hover:bg-blue-950 hover:text-white transition inline-block"
            >
              ENQUIRE NOW
            </a>
          </div>

          {/* MOBILE HAMBURGER (FORCED RIGHT) */}
          <button
            className="text-white text-3xl md:hidden ml-auto"
            onClick={() => setSidebar(true)}
          >
            <FiMenu />
          </button>
        </div>

        {/* NAVBAR (desktop) */}
        <nav
          className={`hidden md:flex items-center justify-center relative text-white font-semibold text-[14px] tracking-widest transition-all duration-300 ${
            scrolled ? "mt-2 px-4" : "mt-6"
          }`}
        >
          {/* LOGO WHEN SCROLLED */}
          <div
            className={`absolute flex items-center transition-all duration-300 ${
              scrolled
                ? "left-[2%] opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <Link to="/">
              <img
                src="/images/logo-scroll.webp"
                alt="logo"
                className={`cursor-pointer transition-all duration-300 ${
                  scrolled ? "w-[100px]" : "w-[0px]"
                }`}
              />
            </Link>
          </div>

          {/* MENU */}
          <div className="flex justify-center gap-10 pl-[180px]">
            {menuItems.map((item, idx) => (
              <div key={idx} className="relative">
                {!item.dropdown ? (
                  <Link
                    to={getPath(item.name)}
                    className={`nav-link flex items-center gap-1 py-0 px-1 whitespace-nowrap transition-transform duration-300 hover:scale-100 ${
                      window.location.pathname === getPath(item.name)
                        ? "active"
                        : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => setOpenMenu(openMenu === idx ? null : idx)}
                      className="nav-link flex items-center gap-1 py-0 px-1 whitespace-nowrap transition-transform duration-300 hover:scale-100"
                    >
                      {item.name}
                      <IoChevronDown className="text-[13px] mt-[1px]" />
                    </button>
                    {openMenu === idx && (
                      <div className="dropdown absolute top-full left-0 bg-white text-black rounded-md shadow-lg w-48 py-2 z-50">
                        {item.dropdown.map((d, i) => (
                          <Link
                            key={i}
                            to={getPath(d)}
                            className="block px-4 py-2 hover:bg-gray-200 cursor-pointer text-sm whitespace-nowrap"
                            onClick={() => setOpenMenu(null)}
                          >
                            {d}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-[78%] max-w-[300px] 
  backdrop-blur-xl bg-black/80 border-l border-white/20 
  shadow-[0_10px_50px_rgba(0,0,0,0.6)]
  z-[2000] transition-transform duration-500 ${
    sidebar ? "translate-x-0" : "translate-x-full"
  }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/20">
          <Link to="/" onClick={() => setSidebar(false)}>
            <img
              src="/images/logo.webp"
              alt="logo"
              className="w-28 cursor-pointer"
            />
          </Link>

          <button
            onClick={() => setSidebar(false)}
            className="text-white text-3xl"
          >
            <FiX />
          </button>
        </div>

        {/* Menu Items */}
        <div className="px-6 mt-6 text-white">
          {menuItems.map((item, idx) => (
            <div key={idx} className="mb-5">
              {!item.dropdown ? (
                <Link
                  to={getPath(item.name)}
                  onClick={() => setSidebar(false)}
                  className="block text-[16px] tracking-wide font-medium py-2"
                >
                  {item.name}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() =>
                      setMobileOpen(mobileOpen === idx ? null : idx)
                    }
                    className="flex justify-between items-center w-full text-[16px] font-medium py-2"
                  >
                    {item.name}
                    <IoChevronDown
                      className={`transition-transform duration-300 ${
                        mobileOpen === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {mobileOpen === idx && (
                    <div className="ml-3 mt-2 flex flex-col gap-2">
                      {item.dropdown.map((d, i) => (
                        <Link
                          key={i}
                          to={getPath(d)}
                          className="text-white/80 text-[15px]"
                          onClick={() => setSidebar(false)}
                        >
                          {d}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 mt-10 text-white">
          <div className="flex items-center gap-2 mb-4 text-white">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 mb-4 text-white hover:text-green-400 transition"
            >
              <FaWhatsapp className="text-2xl text-green-400" />
              {contact?.whatsapp || "+94 705 325 512"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
