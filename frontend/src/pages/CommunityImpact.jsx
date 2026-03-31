import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { axiosInstance } from "../lib/axios";

const OurCommunity = () => {
  const [showText, setShowText] = useState(false);
  const [communityData, setCommunityData] = useState({
    description: "",
    impacts: [],
  });
  const [activeIndex, setActiveIndex] = useState(null);

  /* Scroll to top */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  /* Fetch data */
  useEffect(() => {
    axiosInstance
      .get("/communityImpact")
      .then((res) => {
        if (res.data) setCommunityData(res.data);
      })
      .catch((err) =>
        console.error("", err)
      );
  }, []);

  /* Animate hero text */
  useEffect(() => {
    const t = setTimeout(() => setShowText(true), 200);
    return () => clearTimeout(t);
  }, []);

  /* Preload impact images */
  useEffect(() => {
    communityData.impacts.forEach((impact) => {
      if (impact.images?.[0]) {
        const img = new Image();
        img.src = impact.images[0];
      }
    });
  }, [communityData]);

  return (
    <div className="font-poppins bg-white text-[#222]">
      {/* ================= HERO ================= */}
      <header className="relative w-full h-[360px] md:h-[560px] overflow-hidden">
        <img
          src="/images/co.webp"
          alt="Community Impact Sri Lanka"
          className="absolute inset-0 w-full h-full object-cover"
          fetchpriority="high"
          loading="eager"
          width={1920}
          height={1080}
        />

        <div className="absolute inset-0 bg-black/20" />

        <div
          className={`absolute bottom-6 md:bottom-10 right-4 md:right-10 
          max-w-[90%] md:w-[420px] bg-black/80 text-white p-4 md:p-6 
          backdrop-blur-sm shadow-lg flex items-center justify-end
          transition-all duration-700 ease-out
          ${showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <h1 className="text-xl md:text-3xl leading-snug text-right mr-4">
            Our Journey <br /> From Passion to Excellence
          </h1>
          <div className="w-[2px] bg-white h-10 md:h-12" />
        </div>
      </header>

      {/* ================= INTRO ================= */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-center space-y-4">
        <p className="text-sm md:text-lg font-semibold tracking-widest text-gray-500">
          OUR JOURNEY
        </p>

        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
          From Passion to Excellence
        </h2>

        <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
          {communityData.description}
        </p>

        <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mt-6" />
      </section>

      {/* ================= IMPACT CARDS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {communityData.impacts.map((impact, idx) => (
          <div
            key={idx}
            className="relative group bg-white shadow-lg rounded-xl overflow-hidden"
          >
            {/* IMAGE */}
            <img
              src={impact.images?.[0] || "/images/blog.webp"}
              alt={impact.title}
              className="w-full h-64 object-cover bg-gray-200 transition-transform duration-500 group-hover:scale-105"
              loading="eager"
            />

            {/* LEARN MORE */}
            <button
              onClick={() => setActiveIndex(idx)}
              className="absolute bottom-0 left-0 w-full bg-black/60 text-white 
              font-semibold py-3 text-center backdrop-blur-sm hover:bg-black/70 transition"
            >
              Learn More
            </button>

            {/* OVERLAY */}
            <div
              className={`absolute top-0 left-0 h-full bg-white/80 backdrop-blur-md
              transition-all duration-500 overflow-hidden
              ${activeIndex === idx ? "w-full" : "w-0"}`}
            >
              <div className="p-6 h-full flex flex-col">
                <button
                  onClick={() => setActiveIndex(null)}
                  className="self-end text-gray-700 hover:text-black text-2xl font-bold"
                >
                  &times;
                </button>

                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  {impact.title}
                </h3>

                <p className="text-gray-700 leading-relaxed">
                  {impact.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ================= CTA ================= */}
      <section className="relative bg-white py-12 flex justify-center items-center">
        <div className="max-w-3xl text-center px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Ready to Explore Sri Lanka?
          </h2>

          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6">
            Let our dedicated experts <br /> craft an unforgettable journey.
          </h3>

          <a
            href="/contact"
            className="bg-[#ce2a40] hover:bg-[#ef0530]
            text-white uppercase px-8 py-4 rounded-full font-semibold
            flex items-center gap-2 shadow-lg transition-colors
            justify-center mx-auto"
          >
            Explore with Us
            <ArrowRight className="w-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default OurCommunity;
