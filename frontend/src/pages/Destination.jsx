import React, { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "../lib/axios";
import { Helmet } from "react-helmet-async";

export default function Destination() {
  const [showText, setShowText] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("oldest"); // default oldest first
  const perPage = 12;

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axiosInstance.get("/destination");
        setDestinations(res.data.destinations || []);
      } catch (err) {
        console.error("", err);
      }
    };
    fetchDestinations();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    destinations.slice(0, 4).forEach((d) => {
      const img = new Image();
      img.src = d.img;
    });
  }, [destinations]);

  const totalPages = Math.ceil(destinations.length / perPage);

  // Sort + paginate destinations
  const currentDestinations = useMemo(() => {
    if (!destinations || destinations.length === 0) return [];

    const sorted = [...destinations].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      if (sortType === "oldest") return dateA - dateB;
      if (sortType === "latest") return dateB - dateA;
      if (sortType === "random") return Math.random() - 0.5;
      return 0;
    });

    const start = (currentPage - 1) * perPage;
    return sorted.slice(start, start + perPage);
  }, [currentPage, destinations, sortType]);

  const SkeletonCard = () => (
    <div className="animate-pulse">
      <div className="w-full h-56 bg-gray-200 rounded-xl"></div>
      <div className="h-4 bg-gray-200 rounded mt-4 w-2/3"></div>
      <div className="h-5 bg-gray-300 rounded mt-2 w-1/2"></div>
    </div>
  );

  return (
    <div className="font-poppins bg-white text-[#222]">
      <Helmet>
        <title>Sri Lanka Destinations | Net Lanka Travels</title>
        <meta
          name="description"
          content="Explore top Sri Lanka destinations including beaches, hill country, cultural sites and wildlife parks with Net Lanka Travels."
        />
        <link rel="canonical" href="https://www.netlankatravels.com/destinations" />
      </Helmet>

      {/* HERO HEADER */}
      <div className="w-full h-[360px] md:h-[560px] relative flex items-center justify-center text-white">
        <img
          src="/images/pll.webp"
          alt="Explore Sri Lanka Destinations"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
          fetchpriority="high"
          style={{ objectPosition: "45% 33%" }}
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className={`absolute bottom-6 md:bottom-10 right-4 md:right-10 max-w-[90%] md:w-[360px] bg-black/80 text-white p-4 md:p-6 backdrop-blur-sm shadow-lg border-none flex items-center justify-end transition-all duration-700 ease-out ${
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h1 className="text-xl md:text-3xl leading-snug text-right mr-4">
            Explore Destination <br /> With Us…
          </h1>
          <div className="w-[2px] bg-white h-10 md:h-12"></div>
        </div>
      </div>

      {/* DESTINATIONS GRID */}
      <section className="w-full py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm md:text-lg text-gray-600 tracking-widest font-semibold mb-3">
            HIDDEN MAGICAL PLACES
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5">
            Best Destinations in Sri Lanka
          </h2>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            Find the best destinations in Sri Lanka for your perfect holiday,
            including cultural attractions, hill country escapes, beach
            destinations, and popular Sri Lanka tourist places for sightseeing
            and adventure.
          </p>

          <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mt-6"></div>

          {/* SORT BUTTONS */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mt-12">
            {destinations.length === 0
              ? Array.from({ length: perPage }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : currentDestinations.map((item) => (
                  <article key={item._id} className="flex flex-col w-full">
                    <img
                      src={item.img}
                      alt={`${item.title} - ${item.subtitle}`}
                      className="w-full h-56 object-cover rounded-xl shadow-md bg-gray-200"
                      loading="lazy"
                    />
                    <p className="text-gray-500 text-sm mt-4">
                      {item.subtitle}
                    </p>
                    <h3 className="text-xl font-semibold text-gray-900 mt-1">
                      {item.title}
                    </h3>
                  </article>
                ))}
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

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="px-3 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}
