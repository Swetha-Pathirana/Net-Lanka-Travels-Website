import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Helmet } from "react-helmet-async";

export default function DayTour() {
  const [tours, setTours] = useState([]);
  const [showText, setShowText] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("oldest"); 
  const perPage = 8;

  // Fetch tours
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axiosInstance.get("/day-tours");
        if (res.data.success) setTours(res.data.tours || []);
      } catch (err) {
        console.error("", err);
      }
    };
    fetchTours();
  }, []);

  // Hero animation
  useEffect(() => {
    const t = setTimeout(() => setShowText(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    if (currentPage === 1) return; // skip initial load
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50); // small delay to let layout render
    return () => clearTimeout(t);
  }, [currentPage]);

  const totalPages = Math.ceil(tours.length / perPage);

  const currentTours = useMemo(() => {
    if (!tours || tours.length === 0) return [];

    const sortedTours = [...tours].sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt).getTime(); // use 'date' or fallback 'createdAt'
      const dateB = new Date(b.date || b.createdAt).getTime();

      if (sortType === "oldest") return dateA - dateB;
      if (sortType === "latest") return dateB - dateA;
      if (sortType === "random") return Math.random() - 0.5;
      return 0;
    });

    const start = (currentPage - 1) * perPage;
    return sortedTours.slice(start, start + perPage);
  }, [currentPage, tours, sortType]);

  return (
    <div className="font-poppins bg-white text-[#222] pb-16">
      <Helmet>
        <title>Day Tours in Sri Lanka | Net Lanka Travels</title>
        <meta
          name="description"
          content="Discover Sri Lanka in a day with our private day tours. Visit cultural landmarks, scenic spots and hidden gems with expert guides."
        />
        <link rel="canonical" href="https://www.netlankatravels.com/day-tours" />
      </Helmet>

      {/* HERO HEADER */}
      <div className="w-full h-[360px] md:h-[560px] relative flex items-center justify-center text-white">
        {/* Hero Image */}
        <img
          src="/images/daytours.webp"
          alt="Travel Day Tour in Sri Lanka"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
          fetchpriority="high" // ✅ load immediately
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Hero Text */}
        <div
          className={`absolute bottom-6 md:bottom-10 right-4 md:right-10 max-w-[90%] md:w-[300px] bg-black/80 text-white p-4 md:p-6 backdrop-blur-sm shadow-lg border-none flex items-center justify-end transition-all duration-700 ease-out ${
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h1 className="text-xl md:text-3xl leading-snug text-right mr-4">
            Travel Day Tour <br /> With Us…
          </h1>
          <div className="w-[2px] bg-white h-10 md:h-12"></div>
        </div>
      </div>

      {/* INTRO */}
      <div className="max-w-[1100px] mx-auto text-center px-6 mt-10">
        <p className="text-sm md:text-lg text-gray-600 tracking-widest font-semibold mb-3">
          Day Tours
        </p>

        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-5">
          Enjoy A Day Tour In Sri Lanka
        </h2>

        <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
          Net Lanka Travels offers Sri Lanka day tours with private drivers and
          local guides, covering popular tourist attractions, cultural
          highlights, and nature experiences across the island.
        </p>

        <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mt-6"></div>
      </div>

      <div className="flex justify-center gap-4 mt-10 flex-wrap">
        {["oldest", "latest", "random"].map((type) => (
          <button
            key={type}
            onClick={() => {
              setSortType(type);
              setCurrentPage(1);
            }}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              sortType === type
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type === "oldest"
              ? "Oldest"
              : type === "latest"
              ? "Latest"
              : "Random"}
          </button>
        ))}
      </div>

      {/* TOURS GRID */}
      <div className="space-y-10 px-6 sm:px-10 md:px-32 mt-16">
        {currentTours.length > 0 ? (
          currentTours.map((t) => (
            <article
              key={t._id}
              className="flex flex-col lg:flex-row bg-gray-100 shadow-lg rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl"
            >
              {/* IMAGE */}
              <div
                className="relative shrink-0 shadow-lg rounded-2xl overflow-hidden mx-auto mt-4 lg:mt-0"
                style={{
                  width: "100%",
                  maxWidth: "380px",
                  borderRadius: "0 0 50% 0 / 0 0 50% 0",
                  boxShadow: "12px 0 25px rgba(0,0,0,0.18)",
                }}
              >
                <div className="w-full aspect-[19/20]">
                  <img
                    src={t.img}
                    alt={`${t.title} in ${t.location}`}
                    loading="eager" // ✅ load immediately
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex flex-col justify-center px-4 py-6 sm:px-6 md:px-14 flex-1 text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
                  {t.title}
                </h2>

                <p className="text-sm font-semibold tracking-widest text-[#2E5B84] uppercase mb-3">
                  {t.location}
                </p>

                <p className="text-gray-600 leading-relaxed mb-6 text-justify hyphens-auto line-clamp-3">
                  {t.desc}
                </p>

                <Link
                  to={`/day-tour-detail/${t.slug}`}
                  className="mx-auto lg:mx-0"
                >
                  <button
                    aria-label={`View details for ${t.title}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#73A5C6] to-[#2E5B84] hover:from-[#82B3D2] hover:to-[#254A6A] text-white font-semibold rounded-full px-6 py-2 transition"
                  >
                    View Tour →
                  </button>
                </Link>
              </div>
            </article>
          ))
        ) : (
          <p className="text-center text-gray-500">No tours available.</p>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex justify-center items-center gap-2 mt-16 flex-wrap"
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="px-3 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                aria-label={`Go to page ${page}`}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold ${
                  currentPage === page
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="px-3 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
