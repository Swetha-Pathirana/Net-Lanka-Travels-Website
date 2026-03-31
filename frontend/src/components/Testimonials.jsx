import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import {
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaTripadvisor,
} from "react-icons/fa";
import { axiosInstance } from "../lib/axios";
import "swiper/css";
import "swiper/css/navigation";

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState([]);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Fetch backend reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get(`/tour-reviews`);
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  // Fetch TripAdvisor reviews
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get("/tripadvisor-reviews");
        setMessages(res.data?.reviews || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, []);

  // Google rating average
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // Generate color from string
  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++)
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    const color = `hsl(${hash % 360}, 60%, 50%)`;
    return color;
  }

  return (
    <section className="w-full py-24 bg-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* LEFT CONTENT */}
        <div>
          <p className="text-sm font-semibold tracking-widest text-gray-500">
            TESTIMONIALS
          </p>
          <h2 className="text-5xl font-extrabold text-gray-900 mt-4 leading-tight">
            Message From <br /> Adventurers
          </h2>
          <p className="text-gray-600 mt-6 text-lg leading-relaxed max-w-md">
            Every journey leaves a story behind. From misty mountains to golden
            shores, our adventures in Sri Lanka reminded us how travel connects
            hearts, cultures, and unforgettable moments.
          </p>
        </div>

        {/* GOOGLE REVIEW BIG CARD */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{ prevEl: ".g-prev", nextEl: ".g-next" }}
            autoplay={{ delay: 1500, disableOnInteraction: false }}
            loop={true}
            slidesPerView={1}
            className="bg-[#f7f7f7] rounded-2xl shadow-lg"
            centeredSlides={true} // center mobile card
          >
            {reviews.map((item, i) => (
              <SwiperSlide key={i}>
                <div className="bg-[#f7f7f7] p-10 rounded-2xl">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div
                      className="w-20 h-20 text-white rounded-full flex items-center justify-center text-3xl font-bold relative"
                      style={{ backgroundColor: stringToColor(item.name) }}
                    >
                      {item.name[0].toUpperCase()}
                      <span className="absolute -bottom-1 right-2 text-white bg-[#4285F4] px-1 py-[1px] text-xs rounded-full">
                        G
                      </span>
                    </div>
                    <h3 className="font-semibold mt-3">{item.name}</h3>
                    <p className="text-gray-500 text-sm">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex justify-center gap-1 text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < item.rating ? "text-yellow-400" : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-center leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* GOOGLE arrows */}
          <button
            className="hidden md:flex absolute left-[-50px] top-1/2 -translate-y-1/2 bg-white shadow-lg w-10 h-10 rounded-full items-center justify-center z-10"
            aria-label="Previous reviews"
          >
            <FaChevronLeft />
          </button>
          <button
            className="hidden md:flex absolute right-[-50px] top-1/2 -translate-y-1/2 bg-white shadow-lg w-10 h-10 rounded-full items-center justify-center z-10"
            aria-label="Next reviews"
          >
            {" "}
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* GOOGLE score */}
      <p className="text-center mt-14 text-gray-700 text-lg">
        Google rating score:{" "}
        <span className="font-bold text-black">{averageRating.toFixed(1)}</span>{" "}
        of 5, based on <span className="font-bold">{reviews.length}</span>{" "}
        reviews
      </p>

      {/* BOTTOM TRIPADVISOR SECTION */}
      <div className="max-w-7xl mx-auto px-6 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          {/* LEFT SUMMARY */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="text-2xl font-extrabold text-black uppercase tracking-wide">
              Excellent Reviews
            </h2>
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
            <div className="flex items-center gap-2 mt-4 text-green-600">
              <FaTripadvisor size={36} aria-hidden="true" />
              <span className="font-semibold text-lg">TripAdvisor</span>
            </div>
          </div>

          {/* RIGHT SWIPER */}
          <div className="relative lg:col-span-3">
            <Swiper
              modules={[Navigation, Autoplay]}
              loop={messages.length > 1}
              autoplay={{ delay: 1500, disableOnInteraction: false }}
              slidesPerView={1}
              spaceBetween={28}
              centeredSlides={true} // center on mobile
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
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
            >
              {messages.map((item, i) => (
                <SwiperSlide key={i}>
                  <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-200 min-h-[260px] h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                        {item.name[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <FaTripadvisor
                        className="ml-auto text-green-600"
                        size={22}
                        aria-label="TripAdvisor review"
                      />
                    </div>
                    <div className="flex gap-1 text-green-600 text-lg mb-3">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <FaStar
                          key={n}
                          className={
                            n <= (item.rating || 5)
                              ? "text-green-600"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 flex-1">
                      {item.message}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* arrows */}
            <button
              ref={prevRef}
              className="hidden md:flex absolute left-[-50px] top-1/2 -translate-y-1/2 bg-white shadow-lg w-10 h-10 rounded-full items-center justify-center z-10"
              aria-label="Previous reviews"
            >
              <FaChevronLeft />
            </button>
            <button
              ref={nextRef}
              className="hidden md:flex absolute right-[-50px] top-1/2 -translate-y-1/2 bg-white shadow-lg w-10 h-10 rounded-full items-center justify-center z-10"
              aria-label="Next reviews"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
