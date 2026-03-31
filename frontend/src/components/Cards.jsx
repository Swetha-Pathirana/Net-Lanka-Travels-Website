import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

export default function ExperienceSection() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axiosInstance.get("/home");
        if (res.data && Array.isArray(res.data.topActivities)) {
          setActivities(res.data.topActivities);
        }
      } catch (err) {
        console.error("Failed to fetch top activities:", err);
      }
    };
    fetchActivities();
  }, []);

  return (
    <section
      className="w-full bg-white py-16"
      aria-label="Top travel experiences and activities in Sri Lanka"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Subtitle */}
        <h2 className="text-center text-gray-500 text-sm md:text-lg font-semibold tracking-widest uppercase">
          Experiences
        </h2>

        {/* Main Heading */}
        <h3 className="text-center text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-14">
          Top Activities in Sri Lanka
        </h3>

        {/* Activity Cards */}
        <ul className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((act, index) => (
            <li
              key={index}
              className="flex flex-col items-center text-center
                 bg-white shadow-md rounded-lg px-4 py-6
                 w-full h-full
                 hover:shadow-xl hover:scale-105
                 transition duration-300"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 mb-3 flex items-center justify-center">
                {act.icon ? (
                  <img
                    src={act.icon}
                    alt={`${act.title} activity icon`}
                    className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-2xl">🎯</span>
                )}
              </div>

              <h4 className="text-sm sm:text-base font-serif text-black line-clamp-2">
                {act.title}
              </h4>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
