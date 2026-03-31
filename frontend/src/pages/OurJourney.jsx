import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { axiosInstance } from "../lib/axios";

const OurJourney = () => {
  const [showText, setShowText] = useState(false);
  const [journeyData, setJourneyData] = useState({
    commonImage: "",
    fullDescription: [],
    milestones: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 200);
    return () => clearTimeout(timer);
  }, []);

useEffect(() => {
  const fetchJourneyData = async () => {
    try {
      const res = await axiosInstance.get("/journey");
      if (res.data) {
        // Ensure all fields have safe defaults
        setJourneyData({
          commonImage: res.data.commonImage || "",
          fullDescription: Array.isArray(res.data.fullDescription)
            ? res.data.fullDescription
            : [],
          milestones: Array.isArray(res.data.milestones)
            ? res.data.milestones
            : [],
        });
      }
    } catch (err) {
      console.error("", err);
    } finally {
      setLoading(false);
    }
  };

  fetchJourneyData();
}, []);


  if (loading) {
    return ;
  }

  return (
    <div className=" flex flex-col min-h-screen font-poppins bg-white text-[#222]">
      {/* ---------------------------- HERO HEADER ---------------------------- */}
      <div
        className="w-full h-[360px] md:h-[560px] bg-cover bg-center relative flex items-center justify-center text-white"
        style={{
          backgroundImage: "url('/images/journey-header.webp')",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>

        <div
          className={`absolute bottom-6 md:bottom-10 right-4 md:right-10 max-w-[90%] md:w-[320px] bg-black/80 text-white p-4 md:p-6 backdrop-blur-sm shadow-lg border-none flex items-center justify-end transition-all duration-700 ease-out ${
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="text-xl md:text-3xl leading-snug text-right mr-4">
            Our Journey <br />
            Through Sri Lanka
          </h2>
          <div className="w-[2px] bg-white h-10 md:h-12"></div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-0 py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 relative group overflow-hidden rounded-lg shadow-lg">
          <img
            src={journeyData.commonImage}
            alt="Mission"
            className="w-full h-auto transform transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-70 transition-opacity duration-500 flex items-center justify-center">
            <span className="text-white font-semibold text-lg text-center px-4">
              Our Mission & Vision
            </span>
          </div>
        </div>

        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a]">
            Our Mission & Vision
          </h2>
          {(journeyData.fullDescription || []).map((para, idx) => (
            <p
              key={idx}
              className="text-gray-600 text-base md:text-lg leading-relaxed transition-all duration-500 transform hover:translate-x-1"
            >
              {para.description}
            </p>
          ))}
        </div>
      </section>

      {/* ---------------------------- JOURNEY TIMELINE ---------------------------- */}
      <section className="max-w-7xl mx-auto px-6 lg:px-0 py-20 space-y-20">
        {journeyData.milestones.map((milestone, idx) => (
          <div
            key={idx}
            className={`flex flex-col lg:flex-row items-center gap-12 relative group ${
              idx % 2 !== 0 ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* IMAGE WITH OVERLAY */}
            <div className="lg:w-1/2 relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
              <img
                src={milestone.image}
                alt={milestone.title}
                className="w-full h-auto transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-60 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-white font-semibold text-xl">
                  {milestone.year}
                </span>
              </div>
            </div>

            {/* TEXT */}
            <div className="lg:w-1/2 space-y-4">
              <span className="text-sm uppercase text-[#1a73e8] font-semibold transition-transform transform group-hover:translate-x-1">
                {milestone.year}
              </span>
              <h3 className="text-3xl font-bold text-[#1a1a1a] transition-transform transform group-hover:translate-x-1">
                {milestone.title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed transition-transform transform group-hover:translate-x-1">
                {milestone.description}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ---------------------------- CTA TO OUR TEAM ---------------------------- */}
      <section className="max-w-7xl mx-auto px-6 lg:px-0 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
          Meet the Experts Behind Our Journey
        </h2>
        <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
          Our passionate team of travel specialists, guides, and coordinators
          bring Sri Lanka to life. From planning your perfect itinerary to
          offering insider tips, our experts ensure unforgettable adventures.
        </p>
        <div className="flex justify-center mt-8">
          <a
            href="/our-team"
            className="
      bg-[#1a73e8] hover:bg-[#155ab6]
      text-white uppercase px-6 py-3 rounded-full font-semibold
      flex items-center gap-2 text-sm shadow-lg transition-colors duration-300
      justify-center
    "
          >
            View Our Team
            <Users className="w-4" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default OurJourney;
