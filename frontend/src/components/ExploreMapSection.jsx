import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

import "swiper/css";
import "swiper/css/navigation";

export default function ExploreSriLankaSection() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await axiosInstance.get("/experience");
        setExperiences(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const mapImages = [
    { title: "Adventure Trails in Sri Lanka", image: "/images/adventure.webp" },
    { title: "Beach Escapes in Sri Lanka", image: "/images/beach.webp" },
    { title: "Cultural Wonders of Sri Lanka", image: "/images/culture.webp" },
    { title: "Wildlife Safaris in Sri Lanka", image: "/images/wildlife.webp" },
    { title: "Hidden Gems in Sri Lanka", image: "/images/hidden-gems.webp" },
  ];

  return (
    <section
      className="w-full py-24 bg-white"
      aria-labelledby="explore-sri-lanka-title"
    >
      <div className="relative max-w-[1440px] mx-auto px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
        {/* ---------------- LEFT INTRO ---------------- */}
        <header className="lg:col-span-3 space-y-6 p-6 lg:p-8 lg:-mr-16 xl:-mr-24 z-20">
          <p className="text-sm md:text-lg tracking-wide text-gray-500 font-semibold uppercase">
            Explore Sri Lanka
          </p>

          <h2
            id="explore-sri-lanka-title"
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900"
          >
            Experiences Across the Island
          </h2>

          <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-justify">
            Discover unforgettable Sri Lanka travel experiences - from serene
            temples and golden beaches to thrilling wildlife safaris and scenic
            adventure trails across the island.
          </p>

          <div className="w-12 h-[2px] bg-[#D4AF37]" />
        </header>

        {/* ---------------- CENTER MAP ---------------- */}
        <div className="lg:col-span-5 relative z-10">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop
            slidesPerView={1}
          >
            {mapImages.map((item, index) => (
              <SwiperSlide key={index}>
                <article className="bg-white">
                  <div className="relative h-[450px]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="py-4 text-center">
                    <h3 className="text-xl font-semibold tracking-wide text-gray-900">
                      {item.title}
                    </h3>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ---------------- RIGHT EXPERIENCE CARD ---------------- */}
        <div className="lg:col-span-4 relative p-4 lg:p-6 lg:-ml-8 xl:-ml-8 z-20">
          {loading ? (
            <p className="text-center text-gray-500" aria-live="polite">
              Loading travel experiences...
            </p>
          ) : (
            <>
              <Swiper
                modules={[Autoplay, Navigation]}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                loop={experiences.length > 1}
                slidesPerView={1}
                navigation={{ nextEl: ".exp-next", prevEl: ".exp-prev" }}
              >
                {experiences.map((exp, index) => (
                  <SwiperSlide key={index}>
                    <article className="rounded-3xl overflow-hidden shadow-xl bg-white">
                      <div className="relative h-[420px] group">
                        <img
                          src={exp.mainImg || "/images/placeholder.jpg"}
                          alt={`${exp.title} experience in Sri Lanka`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/80 to-transparent" />

                        <div className="absolute bottom-0 p-6 text-white">
                          <p className="uppercase text-xs tracking-widest mb-1 opacity-80">
                            {exp.subtitle || "Signature Sri Lanka Experience"}
                          </p>

                          <h3 className="text-2xl font-semibold mb-2">
                            {exp.title}
                          </h3>

                          <p className="text-sm leading-relaxed line-clamp-3 opacity-90">
                            {exp.description}
                          </p>

                          <Link
                            to={`/experience/${exp.slug}`}
                            aria-label={`Read more about ${exp.title}`}
                          >
                            <span className="mt-4 inline-block px-5 py-2 text-sm font-semibold bg-white text-black rounded-full hover:bg-[#D4AF37] transition">
                              Read More
                            </span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
