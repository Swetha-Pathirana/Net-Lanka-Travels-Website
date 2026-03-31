import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Helmet } from "react-helmet-async";

export default function RoundTour() {
  const [tours, setTours] = useState([]);
  const [showText, setShowText] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("oldest"); // default: oldest first

  const perPage = 9; // ✅ 9 cards per page

  useEffect(() => {
    setTimeout(() => setShowText(true), 200);
  }, []);

  useEffect(() => {
    async function fetchTours() {
      try {
        const res = await axiosInstance.get("/round-tours");
        if (res.data.success) setTours(res.data.tours || []);
      } catch (err) {
        console.error("", err);
      }
    }
    fetchTours();
  }, []);
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [currentPage]);
  // Pagination logic
  const totalPages = Math.ceil(tours.length / perPage);

  let sortedTours = [...tours];

  if (sortType === "oldest") {
    sortedTours.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sortType === "latest") {
    sortedTours.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortType === "random") {
    sortedTours.sort(() => Math.random() - 0.5);
  }

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentTours = sortedTours.slice(indexOfFirst, indexOfLast);

  return (
    <div className="font-poppins bg-white text-[#222] pb-16">
      <Helmet>
        <title>Sri Lanka Round Tours | Net Lanka Travels</title>
        <meta
          name="description"
          content="Experience complete Sri Lanka round tours covering culture, nature, wildlife and beaches with Net Lanka Travels."
        />
        <link rel="canonical" href="https://www.netlankatravels.com/round-tours" />
      </Helmet>

      {/* HERO HEADER */}
      <div className="relative w-full h-[360px] md:h-[560px] flex items-center justify-center text-white">
        <img
          src="/images/rt4.webp"
          alt="Round Tours Sri Lanka"
          className="absolute inset-0 w-full h-full object-cover"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-black/20"></div>

        <div
          className={`absolute bottom-6 md:bottom-10 right-4 md:right-10 max-w-[90%] md:w-[360px] bg-black/80 text-white p-4 md:p-6 backdrop-blur-sm shadow-lg border-none flex items-center justify-end transition-all duration-700 ease-out ${
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="text-xl md:text-3xl leading-snug text-right mr-4">
            Explore Sri Lanka With <br /> Our Round Tours
          </h2>
          <div className="w-[2px] bg-white h-10 md:h-12"></div>
        </div>
      </div>

      {/* INTRO */}
      <div className="max-w-[1100px] mx-auto text-center px-6 mt-14">
        <div className="text-sm md:text-lg text-gray-600 tracking-widest font-semibold mb-3">
          Round Tours
        </div>

        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-5">
          Discover Sri Lanka Across Every Corner
        </h2>

        <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
          Net Lanka Travels provides Sri Lanka round tours and multi-day tour
          packages, featuring private transport, guided sightseeing, and
          tailor-made itineraries for foreign travelers.
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
            className={`px-6 py-2 rounded-full font-semibold transition
        ${
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

      {/* CARD GRID */}
      <div className="max-w-[1350px] mx-auto mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
        {currentTours.length > 0 ? (
          currentTours.map((t) => (
            <article
              key={t._id}
              className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col"
            >
              <div className="relative w-full aspect-[4/3] bg-gray-200 overflow-hidden">
                <img
                  src={t.img}
                  alt={`${t.title} - ${t.location || "Sri Lanka Tour"}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="px-8 py-10 flex flex-col flex-grow">
                <h3 className="text-2xl font-serif font-semibold mb-2 text-center">
                  {t.title ? (
                    <>
                      {t.title
                        .split(" ")
                        .slice(0, Math.ceil(t.title.split(" ").length / 2))
                        .join(" ")}
                      <br />
                      {t.title
                        .split(" ")
                        .slice(Math.ceil(t.title.split(" ").length / 2))
                        .join(" ")}
                    </>
                  ) : (
                    " Title"
                  )}
                </h3>

                {t.location && (
                  <div className="text-gray-500 italic mb-2 text-center">
                    {t.location}
                  </div>
                )}
                {t.days && (
                  <div className="font-semibold text-gray-700 mb-4 text-center ">
                    {t.days}
                  </div>
                )}
                <p className="text-gray-600 leading-relaxed mb-8 text-justify hyphens-auto line-clamp-3">
                  {t.desc}
                </p>
                <Link to={`/round-tours/${t.slug}`} className="mx-auto">
                  <button className="mt-5 bg-gradient-to-r from-[#73A5C6] to-[#2E5B84] text-white rounded-full px-6 py-2">
                    READ MORE →
                  </button>
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500 p-8">
            No tours available.
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages >= 1 && (
        <div className="flex justify-center items-center gap-2 mt-16 flex-wrap">
          {/* Prev */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border text-sm font-medium
                       disabled:opacity-40 disabled:cursor-not-allowed
                       hover:bg-gray-100"
          >
            Prev
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold
                  ${
                    currentPage === page
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next */}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border text-sm font-medium
                       disabled:opacity-40 disabled:cursor-not-allowed
                       hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
