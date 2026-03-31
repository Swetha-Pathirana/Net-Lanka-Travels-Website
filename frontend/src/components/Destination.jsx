import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

export default function DestinationHome() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axiosInstance.get("/destination");
        const allDestinations = res.data?.destinations || [];
// First added (oldest) destinations first
const firstAddedDestinations = allDestinations
  .sort((a, b) => (a._id > b._id ? 1 : -1))
  .slice(0, 8);

setDestinations(firstAddedDestinations);

      } catch (err) {
        console.error("Error fetching destinations:", err);
      }
    };
    fetchDestinations();
  }, []);

  return (
    <section
      className="w-full bg-slate-100 py-24"
      aria-labelledby="destinations-title"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Subtitle */}
        <p className="text-center text-sm md:text-lg font-semibold tracking-widest text-gray-500 uppercase">
          Hidden Magical Places
        </p>

        {/* Main SEO Heading */}
        <h2
          id="destinations-title"
          className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-14">
          Best Travel Destinations in Sri Lanka
        </h2>

        {/* Destination Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {destinations.length > 0 ? (
            destinations.map((item, i) => (
              <article key={i} className="flex flex-col w-full">
                <img
                  src={item.img}
                  alt={`${item.title} – popular travel destination in Sri Lanka`}
                  className="w-full h-56 object-cover rounded-xl shadow-md"
                  loading="lazy"
                  width={400}
                  height={224}
                />

                <p className="text-gray-500 text-sm mt-4">{item.subtitle}</p>

                <h3 className="text-xl font-semibold text-gray-900 mt-1">
                  {item.title}
                </h3>
              </article>
            ))
          ) : (
            <p className="col-span-4 text-center text-gray-500 mt-10">
              No destinations available.
            </p>
          )}

          {/* CTA Button */}
          <div className="col-span-full justify-self-center mt-12">
            <Link
              to="/destinations"
              className="inline-block bg-[#1A1A1A] hover:bg-black text-white font-semibold px-10 py-4 rounded-full text-lg transition text-center"
              aria-label="View all Sri Lanka destinations"
            >
              View All Destinations
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
