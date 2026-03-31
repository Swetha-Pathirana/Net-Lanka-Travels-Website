import React, { useState, useEffect } from "react";
import BookTour from "./BookTour";
import { axiosInstance } from "../lib/axios";

export default function Video1() {
  const [showForm, setShowForm] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  // Fetch background video
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axiosInstance.get("/home");
        if (res?.data?.info?.video) {
          setVideoUrl(res.data.info.video);
        }
      } catch (err) {
        console.error("Failed to fetch video:", err);
      }
    };
    fetchVideo();
  }, []);

  return (
    <>
      <section
        className="relative w-full h-screen overflow-hidden"
        aria-labelledby="hero-title"
      >
        {/* Background Video */}
        {videoUrl && (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/stats.webp"
            aria-hidden="true"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Hero Content */}
        <header className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">
          <p className="text-white tracking-[3px] text-sm md:text-base mb-4 uppercase">
            Start Your Adventure
          </p>

          {/* MAIN PAGE H1 */}
          <h1
            id="hero-title"
            className="text-center text-2xl sm:text-4xl md:text-6xl font-extrabold text-white mt-3 mb-14"
          >
            Discover Sri Lanka with Net Lanka Travels
          </h1>

          <p className="text-gray-200 max-w-3xl text-sm md:text-lg mb-10">
            Net Lanka Travels is a trusted Sri Lanka travel agency offering
            tailor-made tour packages, private drivers, day tours, and
            unforgettable island experiences for foreign travelers.
          </p>

          {/* CTA */}
          <button
            onClick={() => setShowForm(true)}
            aria-label="Book your Sri Lanka tour now"
            className="bg-white text-black px-10 py-4 rounded-full font-medium text-lg shadow-lg transition hover:bg-gray-200"
          >
            Book Your Tour
          </button>
        </header>
      </section>

      {/* Booking Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[20000] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Tour booking form"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-[95vw] max-w-[700px] h-[90vh] bg-white shadow-2xl rounded-2xl relative flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative px-6 py-6 border-b">
              <button
                onClick={() => setShowForm(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-600 hover:text-black"
                aria-label="Close booking form"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <BookTour />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
