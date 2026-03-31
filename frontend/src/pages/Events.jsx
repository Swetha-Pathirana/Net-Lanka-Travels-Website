import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showText, setShowText] = useState(false);
  const [sortType, setSortType] = useState("oldest"); // default oldest first
  const perPage = 9; // 9 events per page

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axiosInstance.get("/events");
        if (res.data.success) setEvents(res.data.events || []);
      } catch (err) {
        console.error("", err);
      }
    }
    fetchEvents();
  }, []);

  // Hero animation
  useEffect(() => {
    const t = setTimeout(() => setShowText(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Sort + paginate events
  const sortedEvents = useMemo(() => {
    if (!events || events.length === 0) return [];

    const sorted = [...events].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      if (sortType === "oldest") return dateA - dateB;
      if (sortType === "latest") return dateB - dateA;
      if (sortType === "random") return Math.random() - 0.5;
      return 0;
    });

    const start = (currentPage - 1) * perPage;
    return sorted.slice(start, start + perPage);
  }, [events, currentPage, sortType]);

  const totalPages = Math.ceil(events.length / perPage);

  return (
    <div className="font-poppins bg-white text-[#222]">
      {/* HERO HEADER */}
      <div
        className="w-full h-[360px] md:h-[560px] bg-cover bg-center relative flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/images/vsk.webp')" }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className={`absolute bottom-6 md:bottom-10 right-4 md:right-10 max-w-[90%] md:w-[340px] bg-black/80 text-white p-4 md:p-6 backdrop-blur-sm shadow-lg border-none flex items-center justify-end transition-all duration-700 ease-out ${
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="text-xl md:text-3xl leading-snug text-right mr-4">
            Upcoming Events<br />
            Don't Miss...
          </h2>
          <div className="w-[2px] bg-white h-10 md:h-12"></div>
        </div>
      </div>

      {/* EVENTS HEADING */}
      <section className="w-full py-16 text-center">
        <p className="text-sm md:text-lg text-gray-600 tracking-widest font-semibold mb-3">
          EVENTS & EXPERIENCES
        </p>

        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-5">
          Don’t Miss Our Events
        </h2>

        <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
          Discover upcoming events, cultural experiences, <br /> and unforgettable
          journeys across Sri Lanka.
        </p>

        <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mt-6"></div>

        {/* SORT BUTTONS */}
        <div className="flex justify-center gap-4 mt-10 flex-wrap">
          {["oldest", "latest", "random"].map((type) => (
            <button
              key={type}
              onClick={() => { setSortType(type); setCurrentPage(1); }}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                sortType === type
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {type === "oldest" ? "Oldest" : type === "latest" ? "Latest" : "Random"}
            </button>
          ))}
        </div>
      </section>

      {/* EVENTS GRID */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-5 mt-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event) => (
              <Link
                key={event._id}
                to={`/events/${event.slug}`}
                state={event}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 flex flex-col h-[400px]"
              >
                <img
                  src={event.img}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute bottom-0 text-center w-full p-4 bg-black/50 backdrop-blur-sm flex flex-col">
                  <p className="text-xs uppercase tracking-widest text-gray-300 mb-1">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <h3 className="text-lg font-bold text-white leading-snug mb-1 group-hover:text-[#D4AF37] transition-colors hover:underline">
                    {event.title}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed mb-2 line-clamp-2">
                    {event.desc}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">
              No events available.
            </p>
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
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
            className="px-3 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
