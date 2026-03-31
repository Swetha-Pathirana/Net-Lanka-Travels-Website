import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FaStar } from "react-icons/fa";
import "swiper/css";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axiosInstance.get("/testimonials");
        if (res.data.success) {
          setTestimonials(res.data.testimonials);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials", err);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="bg-gray-100 px-4 md:px-0 mt-2 pt-10">
      <p className="text-sm text-center md:text-lg font-semibold tracking-widest text-gray-500 mb-3">
        SEE WHAT OUR GUESTS ARE SAYING ABOUT US
      </p>

      <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 text-center mb-6">
        Don’t Take Our Word for It
      </h2>

      <div
        className="relative bg-cover bg-center py-14 md:py-20"
        style={{
          backgroundImage: "url('/images/stats.webp')",
          backgroundPosition: "center 50%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            autoplay={{ delay: 5000 }}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 1 },
              1024: { slidesPerView: 2 },
            }}
          >
            {testimonials.map((t, idx) => (
              <SwiperSlide key={idx} className="flex">
                <div className="bg-white/70 backdrop-blur-md rounded-xl p-5 md:p-6 shadow-lg flex-1 flex flex-col justify-center items-center text-center min-h-[380px] md:min-h-[500px]">
                  <h4 className="text-lg md:text-xl font-bold mb-2">
                    {t.title}
                  </h4>

                  <p className="text-gray-700 text-sm md:text-base mb-4 overflow-auto max-h-[180px] md:max-h-none">
                    {t.text}
                  </p>

                  <h5 className="font-semibold text-sm md:text-base">
                    {t.name}
                  </h5>

                  <div className="mt-3 flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="relative w-6 h-6">
                        {/* Background: border star */}
                        <FaStar
                          size={24}
                          className="absolute top-0 left-0 text-gray-100"
                        />
                        {/* Foreground: filled star */}
                        {t.rating >= star && (
                          <FaStar
                            size={24}
                            className="absolute top-0 left-0 text-yellow-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
