import React, { useEffect, useState, useMemo } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom";

export default function Blog() {
  const [showText, setShowText] = useState(false);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("oldest");

  const perPage = 6;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    const t = setTimeout(() => setShowText(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosInstance.get("/blog");
        setStories(res.data.blogs || []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // SORT + PAGINATE
  const currentBlogs = useMemo(() => {
    let sorted = [...stories];

    if (sortType === "oldest") {
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortType === "latest") {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortType === "random") {
      sorted.sort(() => Math.random() - 0.5);
    }

    const start = (currentPage - 1) * perPage;
    return sorted.slice(start, start + perPage);
  }, [stories, currentPage, sortType]);

  const totalPages = Math.ceil(stories.length / perPage);

  return (
    <div className="font-poppins bg-white text-[#222]">
      {/* HERO HEADER */}
      <div
        className="w-full h-[360px] md:h-[560px] bg-cover bg-center relative flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/images/blg1.webp')" }}
      >
        <div className="absolute inset-0 bg-black/20"></div>

        <div
          className={`absolute bottom-6 md:bottom-10 right-4 md:right-10 max-w-[90%] md:w-[300px] bg-black/80 text-white p-4 md:p-6 backdrop-blur-sm shadow-lg border-none flex items-center justify-end transition-all duration-700 ease-out ${
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="text-xl md:text-3xl leading-snug text-right mr-4">
            Enjoy <br />
            Your Vacation…
          </h2>
          <div className="w-[2px] bg-white h-10 md:h-12"></div>
        </div>
      </div>

      {/* BLOG PAGE */}
      <section className="w-full py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm md:text-lg text-gray-600 tracking-widest font-semibold mb-3">
            BLOG & NEWS
          </p>

          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-5">
            A Little Story From Us
          </h2>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            Read the Net Lanka Travels Blog & News for expert Sri Lanka travel
            guides, itineraries, best places to visit, and tourism updates for
            international travelers
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

          {/* BLOG GRID */}
          {loading ? (
            <p className="mt-10 text-gray-500">Loading blogs...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
              {currentBlogs.map((story) => (
                <div
                  key={story._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition"
                >
                  <img
                    src={story.heroImg || "/images/BlogSrilanka.webp"}
                    alt={story.title}
                    className="w-full h-[330px] object-cover rounded-t-xl"
                  />

                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {story.title}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(story.date).toLocaleDateString()}
                    </p>

                    <p className="text-gray-600 text-sm mt-3 line-clamp-3 text-justify">
                      {story.description}
                    </p>

                    <Link
                      to={`/blog/${story.slug}`}
                      className="mt-4 inline-flex items-center gap-2 text-[#8C1F28] font-medium hover:underline"
                    >
                      Read More <IoIosArrowForward />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-16 flex-wrap">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded-lg disabled:opacity-40"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg border ${
                      currentPage === page
                        ? "bg-black text-white"
                        : "bg-white hover:bg-gray-100"
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
                className="px-3 py-2 border rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}