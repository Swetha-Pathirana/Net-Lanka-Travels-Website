import React, { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "../lib/axios";
import { Check, Settings } from "lucide-react";

export default function Header() {
  // Slideshow images
  const images = useMemo(
    () => [
      { src: "/images/d2.webp", alt: "Sri Lanka destination" },
      { src: "/images/destination.webp", alt: "Beautiful destination in Sri Lanka" },
      { src: "/images/blog.webp", alt: "Sri Lanka travel inspiration" },
    ],
    []
  );

  const [currentImage, setCurrentImage] = useState(0);
  const [homeData, setHomeData] = useState({
    name: "",
    info: { subtitle: "" },
  });

  // Fetch home content
  useEffect(() => {
    axiosInstance.get("/home").then((res) => {
      if (res.data) {
        setHomeData({
          name: res.data.name || "Net Lanka Travels",
          info: res.data.info || {},
        });
      }
    });
  }, []);

  // Preload all images immediately
  useEffect(() => {
    images.forEach((img) => {
      const preloaded = new Image();
      preloaded.src = img.src;
    });
  }, [images]);

  // Slideshow interval
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <header
      className="relative w-full h-[650px] sm:h-[700px] md:h-[750px] overflow-hidden flex items-center justify-center"
      aria-label="Hero section"
    >
      {/* Background Images */}
      {images.map((img, index) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          width="1920"
          height="1080"
          fetchpriority={index === 0 ? "high" : undefined} // high priority for LCP
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2500ms]
            ${index === currentImage ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/85"
        aria-hidden="true"
      />

      {/* Content */}
      <main className="relative z-10 text-center px-4 max-w-4xl text-white">
        <h1 className="mt-20 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light font-serif-custom">
          {homeData.name || "Net Lanka Travels"}
        </h1>

        <p className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl font-light">
        Discover Sri Lanka, The Net Lanka Way
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <a
            href="/destinations"
            aria-label="View curated travel itineraries in Sri Lanka"
            className="bg-[#487898] hover:bg-[#0c3956] text-white uppercase px-6 py-3 rounded-full flex items-center gap-2 transition"
          >
            Curated Itineraries <Check size={18} aria-hidden="true" />
          </a>

          <a
            href="/tailor-made-tours"
            aria-label="Explore tailor-made travel experiences in Sri Lanka"
            className="bg-[#ce2a40] hover:bg-[#ef0530] text-white uppercase px-6 py-3 rounded-full flex items-center gap-2 transition"
          >
            Tailormade Experiences <Settings size={18} aria-hidden="true" />
          </a>
        </div>
      </main>
    </header>
  );
}
