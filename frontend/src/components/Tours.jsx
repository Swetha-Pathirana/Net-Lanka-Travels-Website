import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function PopularTours() {
  const [dayTours, setDayTours] = useState([]);
  const [roundTours, setRoundTours] = useState([]);

 useEffect(() => {
  const fetchTours = async () => {
    try {
      // Day tours – first added 2
      const dayRes = await axiosInstance.get("/day-tours");
      const firstTwoDayTours = dayRes.data.tours
        ?.sort((a, b) => (a._id > b._id ? 1 : -1)) // oldest first
        .slice(0, 2);
      setDayTours(firstTwoDayTours || []);

      // Round tours – first added 2
      const roundRes = await axiosInstance.get("/round-tours");
      if (roundRes.data?.success) {
        const firstTwoRoundTours = roundRes.data.tours
          ?.sort((a, b) => (a._id > b._id ? 1 : -1)) // oldest first
          .slice(0, 2);
        setRoundTours(firstTwoRoundTours || []);
      }
    } catch (err) {
      console.error("Failed to fetch tours:", err);
    }
  };

  fetchTours();
}, []);

 // Interleave tours – keeps round-day-round-day
const allTours = [];
for (let i = 0; i < 2; i++) {
  if (roundTours[i]) allTours.push({ ...roundTours[i], type: "round" });
  if (dayTours[i]) allTours.push({ ...dayTours[i], type: "day" });
}


  return (
    <section
      className="w-full bg-slate-100 py-16"
      aria-label="Popular tour packages and itineraries in Sri Lanka"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Subtitle */}
        <h2 className="text-center text-gray-500 text-sm md:text-lg font-semibold tracking-widest uppercase">
          Itineraries
        </h2>

        {/* Main Heading */}
        <h3 className="text-center text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-14">
          Popular Tours in Sri Lanka
        </h3>

        {/* Tours Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-2">
          {allTours.length > 0 ? (
            allTours.map((tour) => (
              <article
                key={tour._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden border border-gray-100"
                aria-label={tour.title}
              >
                {/* Image */}
                <img
                  src={tour.img}
                  alt={`${tour.title} tour in ${tour.location || "Sri Lanka"}`}
                  className="w-full h-52 object-cover"
                  width="full"
                  height={208}
                  loading="lazy"
                />

                <div className="py-6 text-center flex flex-col items-center">
<h4
  className="
    text-lg sm:text-xl
    font-semibold text-gray-900 text-center
    leading-snug
    h-[3.2rem] sm:h-[3.6rem]
    flex items-center justify-center
    overflow-hidden
    [text-wrap:balance]
  "
>
  {tour.title ? (
    <>
      {tour.title.split(" ").slice(0, Math.ceil(tour.title.split(" ").length / 2)).join(" ")}
      <br />
      {tour.title.split(" ").slice(Math.ceil(tour.title.split(" ").length / 2)).join(" ")}
    </>
  ) : (
    "Tour Title"
  )}
</h4>



                  {/* Location */}
                  {tour.location && (
                    <p className="text-gray-500 mt-2 flex items-center gap-1">
                      <FaMapMarkerAlt
                        className="text-red-500"
                        size={16}
                        aria-hidden="true"
                      />
                      {tour.location}
                    </p>
                  )}

                  {/* Tour type */}
                  <span
                    className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                      tour.type === "round"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {tour.type === "round"
                      ? "Round Tour Package"
                      : "Day Tour Package"}
                  </span>

                  {/* CTA */}
                  <Link
                    to={
                      tour.type === "round"
                        ? `/round-tours/${tour.slug}`
                        : `/day-tour-detail/${tour.slug}`
                    }
                    className="mt-5 w-200px bg-gradient-to-r from-[#73A5C6] to-[#2E5B84] hover:from-[#82B3D2] hover:to-[#254A6A] text-white font-semibold rounded-full px-6 py-2 mx-auto transition"
                    aria-label={`View details of ${tour.title}`}
                  >
                    Read More → 
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <p className="text-center col-span-4 text-gray-500">
              No tours available at the moment
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
