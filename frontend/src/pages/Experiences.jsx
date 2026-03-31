import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import Footer from "../components/Footer";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";

export default function Experiences() {
  const [showText, setShowText] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("oldest");
  const [randomSeed, setRandomSeed] = useState(0);

  const perPage = 6;

  /* Animate hero text */
  useEffect(() => {
    const t = setTimeout(() => setShowText(true), 200);
    return () => clearTimeout(t);
  }, []);

  /* Fetch experiences */
  useEffect(() => {
    axiosInstance
      .get("/experience")
      .then((res) => {
        setExperiences(res.data || []);
      })
      .catch((err) => console.error("", err));
  }, []);

  /* Preload experience images */
  useEffect(() => {
    experiences.forEach((exp) => {
      if (exp.mainImg) {
        const img = new Image();
        img.src = exp.mainImg;
      }
    });
  }, [experiences]);

  /* Scroll to top on page change */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [currentPage]);

  /* Pagination logic */
  /* SORT + PAGINATION */
  const sortedExperiences = useMemo(() => {
    let list = [...experiences];

    if (sortType === "oldest") {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (sortType === "latest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sortType === "random") {
      list.sort(() => randomSeed - Math.random());
    }

    return list;
  }, [experiences, sortType, randomSeed]);

  const totalPages = Math.ceil(sortedExperiences.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentExperiences = sortedExperiences.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <Helmet>
        <title>Sri Lanka Experiences | Net Lanka Travels</title>
        <meta
          name="description"
          content="Enjoy authentic Sri Lanka experiences including safaris, cultural tours, hill country trips and beach adventures."
        />
        <link rel="canonical" href="https://www.netlankatravels.com/experience" />
      </Helmet>

      <div className="flex flex-col min-h-screen font-poppins bg-white text-[#222]">
        {/* ================= HERO ================= */}
        <header className="relative w-full h-[360px] md:h-[560px] overflow-hidden">
          <img
            src="/images/oo.webp"
            alt="Experiences in Sri Lanka"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "20% 10%" }} // horizontal 50%, vertical 40%
            fetchpriority="high"
            loading="eager"
            width={1920}
            height={1080}
          />

          <div className="absolute inset-0 bg-black/20" />

          <div
            className={`absolute bottom-6 md:bottom-10 right-4 md:right-10 
            max-w-[90%] md:w-[460px] bg-black/80 text-white p-4 md:p-6 
            backdrop-blur-sm shadow-lg flex items-center justify-end
            transition-all duration-700 ease-out
            ${
              showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <h1 className="text-xl md:text-3xl leading-snug text-right mr-4">
              Discover Unique Experiences <br />
              Across Sri Lanka
            </h1>
            <div className="w-[2px] bg-white h-10 md:h-12" />
          </div>
        </header>

        {/* ================= INTRO ================= */}
        <section className="w-full py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm md:text-lg text-gray-600 tracking-widest font-semibold mb-3">
              SIGNATURE EXPERIENCES
            </p>

            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-5">
              Curated Experiences in Sri Lanka
            </h2>

            <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
              Net Lanka Travels offers authentic Sri Lanka travel experiences,
              including cultural tours, hill country journeys, beach
              experiences, and wildlife safaris for international travelers.
            </p>

            <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mt-6" />
          </div>

          {/* ================= SORT BUTTONS ================= */}
          <div className="flex justify-center gap-4 mt-10 flex-wrap">
            {["oldest", "latest", "random"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSortType(type);
                  setCurrentPage(1);

                  if (type === "random") {
                    setRandomSeed(Math.random());
                  }
                }}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  sortType === type
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {type === "oldest" && "Oldest"}
                {type === "latest" && "Latest"}
                {type === "random" && "Random"}
              </button>
            ))}
          </div>

          {/* ================= CARD GRID ================= */}
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 mt-12">
            {currentExperiences.length > 0 ? (
              currentExperiences.map((item, index) => (
                <article
                  key={index}
                  className="group bg-white rounded-xl shadow-md 
                  hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  <img
                    src={item.mainImg || "/images/experience-header.webp"}
                    alt={item.title || "Experience"}
                    className="w-full h-56 object-cover rounded-t-xl bg-gray-200"
                    loading="eager"
                  />

                  <div className="p-6">
                    <p className="text-[#8C1F28] text-sm font-semibold tracking-wide mb-1">
                      {item.subtitle || ""}
                    </p>

                    <h3
                      className="text-2xl font-light text-gray-900 
                      group-hover:text-[#8C1F28] transition-colors"
                    >
                      {item.title}
                    </h3>
                    <br></br>
                    <p className="text-gray-600 text-sm mt-3 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                    <Link to={`/experience/${item.slug}`}>
                      <span
                        className="inline-block mt-4 text-[#8C1F28] 
                        font-semibold text-sm hover:underline"
                      >
                        Read more
                      </span>
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">
                No experiences available yet.
              </p>
            )}
          </div>

          {/* ================= PAGINATION ================= */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-16 flex-wrap">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border text-sm font-medium
                disabled:opacity-40 hover:bg-gray-100"
              >
                Prev
              </button>

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

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border text-sm font-medium
                disabled:opacity-40 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </>
  );
}
