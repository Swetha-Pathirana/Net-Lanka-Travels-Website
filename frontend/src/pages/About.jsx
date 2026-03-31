import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaBullseye, FaEye } from "react-icons/fa";
import Testimonials from "../components/Testimonials";
import { ArrowRight, Calendar } from "lucide-react";
import { axiosInstance } from ".././lib/axios";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

const About = () => {
  const [showFull, setShowFull] = useState(false);
  const [showText, setShowText] = useState(false);
  const [about, setAbout] = useState({});
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  // Show hero text with animation
  useEffect(() => {
    setTimeout(() => setShowText(true), 200);
  }, []);

  // Fetch about data
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axiosInstance.get("/about");
        setAbout(res.data || {});
      } catch (err) {
        console.error("Failed to load About page", err);
      }
    };
    fetchAbout();
  }, []);

  return (
    <>
      <Helmet>
        <title>About Us | Net Lanka Travels</title>
        <meta
          name="description"
          content="Learn about Net Lanka Travels, our story, mission, and vision. Private Sri Lanka tours and custom travel packages."
        />
        <link rel="canonical" href="https://www.netlankatravels.com/about" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen font-poppins bg-white text-[#222]">
        {/* ---------------------------- HERO HEADER ---------------------------- */}
        <div className="relative w-full h-[360px] md:h-[560px] flex items-center justify-center text-white overflow-hidden">
          {/* IMAGE */}
          <img
            src="/images/ab.webp"
            alt="About NetLanka Tours"
            className="absolute inset-0 w-full h-full object-cover"
            fetchpriority="high"
            decoding="async"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/20"></div>

          {/* TEXT BOX */}
          <div
            className={`absolute bottom-6 md:bottom-10 right-4 md:right-10 max-w-[90%] md:w-[340px]
      bg-black/80 text-white p-4 md:p-6 backdrop-blur-sm shadow-lg
      flex items-center justify-end transition-all duration-700 ease-out
      ${showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          >
            <h2 className="text-xl md:text-3xl leading-snug text-right mr-4">
              {about.heroText || "Discover Sri Lanka With Us..."}
            </h2>
            <div className="w-[2px] bg-white h-10 md:h-12"></div>
          </div>
        </div>

        {/* ---------------------------- ABOUT CONTENT ---------------------------- */}
        <div className="max-w-6xl mx-auto py-20 px-6 text-center space-y-6">
          <p className="text-sm md:text-lg font-semibold tracking-widest text-gray-500 mb-3">
            {about.subtitle || "Your Adventure Awaits"}
          </p>

          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
            {about.heading || "About NetLanka Tours"}
          </h2>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            {about.smallDescription ||
              "Explore Sri Lanka with us for unforgettable experiences."}
          </p>

          <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mt-6"></div>

          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            {about.description ||
              "We offer curated tours and personalized travel experiences."}
          </p>

          {showFull && (
            <div className="text-base md:text-lg text-gray-600 leading-relaxed mt-6 space-y-4">
              {about.fullDescription?.map((item, idx) => (
                <p key={idx}>{item.description}</p>
              ))}
            </div>
          )}

          <div className="mt-4">
            <span
              onClick={() => setShowFull(!showFull)}
              className="cursor-pointer text-blue-600 font-semibold flex items-center justify-center hover:underline space-x-2"
            >
              <span>{showFull ? "SHOW LESS" : "READ MORE"}</span>
              {showFull ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
        </div>

        {/* ------------------- FULL WIDTH IMAGE ------------------- */}
        <div className="-mt-16 w-full">
          <img
            src="/images/about-desc.webp"
            alt="About NetLanka Tours"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* ------------------- MISSION & VISION ------------------- */}
        <section className="relative mt-24 mb-28 max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
              Who We Are
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-3">
              Our Mission & Vision
            </h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Mission Card */}
            <div className="group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 relative overflow-hidden hover:scale-105">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ce2a40]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Icon + Title */}
              <div className="flex items-center mb-4 relative z-10">
                <FaBullseye className="text-[#ce2a40] text-4xl mr-4" />
                <h3 className="text-3xl font-extrabold text-gray-900">
                  Mission
                </h3>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed relative z-10">
                To provide personalized, reliable, and authentic Sri Lanka
                travel experiences through expert local knowledge, trusted
                service, and seamless journey planning.
              </p>
            </div>

            {/* Vision Card */}
            <div className="group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 relative overflow-hidden hover:scale-105">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Icon + Title */}
              <div className="flex items-center mb-4 relative z-10">
                <FaEye className="text-[#D4AF37] text-4xl mr-4" />
                <h3 className="text-3xl font-extrabold text-gray-900">
                  Vision
                </h3>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed relative z-10">
                To become a trusted global travel brand showcasing the best of
                Sri Lanka through authentic, responsible, and unforgettable
                travel experiences.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------- WHY NETLANKA TOURS ------------------- */}
        <section className="mt-16 mb-20 max-w-7xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-12">
            Why Net Lanka Tours
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {(about.features || []).map((f, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img src={f.image} alt={f.title} className="w-24 h-24 mb-4" />
                <p className="text-gray-600 text-base md:text-lg max-w-xs text-center">
                  {f.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate("/tailor-made-tours")}
              className="
        bg-[#ce2a40] hover:bg-[#ef0530]
        text-white uppercase px-6 py-3 rounded-full font-semibold flex items-center gap-2 text-sm
        shadow-lg transition-colors duration-300
        justify-center
      "
            >
              Start Planning Your Trip
              <Calendar className="w-4" />
            </button>
          </div>
        </section>

        {/* ---------------------------- GALLERY ---------------------------- */}
        <section className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#1a1a1a] mb-8 sm:mb-12">
            Captured Moments with Our Clients
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {(about.gallery || []).map((url, idx) => (
              <div key={idx} className="w-full">
                {url?.endsWith(".mp4") ? (
                  <video
                    src={url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={url}
                    alt="img"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------- TESTIMONIALS ---------------------------- */}
        <Testimonials />

        {/* ---------------------------- CUSTOM TOUR CTA ---------------------------- */}
        <section className="relative -mt-4 sm:-mt-8 lg:-mt-28">
          <div className="flex flex-col lg:flex-row items-center lg:items-stretch relative h-auto lg:h-[800px]">
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center px-4 sm:px-6 py-10 sm:py-14 lg:py-0 z-10 space-y-2 sm:space-y-4">
              <h2 className="text-base sm:text-lg md:text-3xl font-semibold text-[#1a1a1a]">
                Looking for an
              </h2>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a]">
                Exclusive Customized Tour?
              </h2>

              <h2 className="text-base sm:text-lg md:text-3xl font-semibold text-[#1a1a1a]">
                No Problem
              </h2>

              <div className="mt-4">
                <a
                  href="/tailor-made-tours"
                  className="
            bg-[#ce2a40] hover:bg-[#ef0530]
            text-white uppercase px-6 py-3 rounded-full font-semibold 
            flex items-center gap-2 text-sm shadow-lg transition-colors duration-300
            justify-center
          "
                >
                  Connect with Us
                  <ArrowRight className="w-4" />
                </a>
              </div>
            </div>

            <div className="w-full lg:w-1/2 lg:absolute lg:top-0 lg:right-0 lg:h-full">
              <img
                src="/images/sigiriya-art.webp"
                alt="Sigiriya Art"
                className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-full object-cover"
              />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;
