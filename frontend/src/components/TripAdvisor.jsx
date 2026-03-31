import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaStar, FaTripadvisor } from "react-icons/fa";
import { axiosInstance } from "../lib/axios";
import "swiper/css";
import "swiper/css/navigation";

export default function Testimonials() {
  const [messages, setMessages] = useState([]);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Fetch TripAdvisor reviews
  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get("/tripadvisor-reviews");
      setMessages(res.data?.reviews || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <section
      className="w-full py-24 bg-slate-100 font-sans"
      aria-labelledby="customer-reviews-heading"
    >
      <div className="max-w-7xl mx-auto px-6 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          {/* LEFT SUMMARY */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2
              id="customer-reviews-heading"
              className="text-2xl font-extrabold text-black uppercase tracking-wide"
            >
              Excellent Reviews
            </h2>

            {/* STAR RATING */}
            <div
              className="flex gap-1 mt-3 text-green-600"
              aria-label="5 star TripAdvisor rating"
            >
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={28} />
              ))}
            </div>

            <p className="mt-2 text-gray-700 text-sm">
              Based on <span className="font-bold">{messages.length}</span>{" "}
              verified TripAdvisor reviews
            </p>

            {/* TRIPADVISOR BRAND */}
            <div className="flex items-center gap-2 mt-4 text-green-600">
              <FaTripadvisor size={36} aria-hidden="true" />
              <span className="font-semibold text-lg">TripAdvisor</span>
            </div>
          </div>

          {/* RIGHT SLIDER */}
          <div className="relative lg:col-span-3">
            <Swiper
              modules={[Navigation, Autoplay]}
              loop={messages.length > 1}
              slidesPerView={1}
              centeredSlides={true} // Center on mobile
              spaceBetween={28}
              autoplay={{ delay: 1500, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 1.5, centeredSlides: true },
                768: { slidesPerView: 2, centeredSlides: false },
                1024: { slidesPerView: 2.5, centeredSlides: false },
                1280: { slidesPerView: 3, centeredSlides: false },
              }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onInit={(swiper) => {
                // Attach navigation buttons after Swiper init
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
            >
              {messages.map((item, i) => (
                <SwiperSlide key={i}>
                  <article
                    className="bg-white p-6 rounded-3xl shadow-md border border-gray-200 min-h-[260px] flex flex-col"
                    itemScope
                    itemType="https://schema.org/Review"
                  >
                    {/* HEADER */}
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold"
                        aria-hidden="true"
                      >
                        {item.name?.[0]}
                      </div>

                      <div>
                        <h3
                          className="font-semibold text-lg text-gray-900"
                          itemProp="author"
                        >
                          {item.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* TRIPADVISOR ICON */}
                      <FaTripadvisor
                        className="ml-auto text-green-600"
                        size={22}
                        aria-label="TripAdvisor review"
                      />
                    </div>

                    {/* RATING */}
                    <div
                      className="flex gap-1 text-green-600 text-lg mb-3"
                      itemProp="reviewRating"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <FaStar
                          key={n}
                          className={
                            n <= (item.rating || 5) ? "" : "text-gray-300"
                          }
                        />
                      ))}
                    </div>

                    {/* REVIEW TEXT */}
                    <p
                      className="text-gray-700 text-sm leading-relaxed line-clamp-4 flex-1"
                      itemProp="reviewBody"
                    >
                      {item.message}
                    </p>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
