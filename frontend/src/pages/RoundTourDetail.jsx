import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import BookRoundTour from "../components/BookRoundTour";
import { FiMapPin, FiPhone, FiMail} from "react-icons/fi";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Controller } from "swiper/modules";
import "swiper/css";
import TourReview from "../components/TourReview";
import Footer from "../components/Footer";

export default function RoundTourDetail() {
  const { slug } = useParams();
  const [tour, setTour] = useState(null);
  const [details, setDetails] = useState({});
  const [contact, setContact] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const mainSwiperRef = useRef(null);
  const thumbSwiperRef = useRef(null);

  // Scroll to top when slug changes
  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [slug]);

  // Fetch round tour details by slug
  useEffect(() => {
    if (!slug) return;
    axiosInstance.get(`/round-tours/slug/${slug}`) // keep as-is
      .then(res => {
        if (res.data.success) {
          setTour(res.data.tour);
          setDetails(res.data.details || {});
          // Preload gallery
          res.data.details?.gallerySlides?.forEach(slide => new Image().src = slide.image);
        }
      })
      .catch(err => console.error("", err));
  }, [slug]);

  useEffect(() => {
    axiosInstance.get("/contact").then(res => setContact(res.data || {})).catch(() => setContact({}));
  }, []);

  if (!tour) return;

  const slides =
    details.gallerySlides?.length > 0
      ? details.gallerySlides
      : [
          {
            image: details.heroImage || tour.img,
            title: tour.title,
            desc: tour.desc,
          },
        ];

  return (
    <>
      <div className=" flex flex-col min-h-screen font-poppins">
    {/* ================= HERO ================= */}
<section className="relative w-full h-[360px] md:h-[560px] flex items-center justify-center text-white overflow-hidden">
  {/* Background image */}
  <img
    src={details.heroImage || tour.img}
    alt={tour.title}
    className="absolute inset-0 w-full h-full object-cover"
    loading="eager"
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/30" />

  {/* Floating heading box */}
  <div
    className={`
      absolute bottom-6 md:bottom-10 right-4 md:right-10
      max-w-[90%] md:w-[420px]
      bg-black/80 text-white
      p-4 md:p-6
      backdrop-blur-sm
      shadow-xl
      flex items-center justify-end
      transition-all duration-700 ease-out
    `}
  >
    <h1 className="text-xl md:text-3xl leading-snug text-right mr-4 font-playfair">
      {details.heroTitle || tour.title}
      <span className="block text-sm md:text-lg text-[#D4AF37] mt-1">
        {tour.days}
      </span>
    </h1>

    {/* Vertical line */}
    <div className="w-[2px] bg-white h-10 md:h-12" />
  </div>
</section>

{/* ================= HERO INTRO ================= */}
<section className="bg-white py-14 md:py-20">
  <div className="max-w-[1100px] mx-auto px-6 text-center">
    {/* Small label */}
    <span className="text-sm md:text-base tracking-widest font-semibold text-gray-500 uppercase">
      Round Tour
    </span>

    {/* Main title */}
    <h2 className="mt-3 text-3xl md:text-5xl font-extrabold text-gray-900 leading-snug max-w-4xl mx-auto">
  {details.heroTitle || tour.title}
</h2>


    {/* Gold divider */}
    <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mt-6" />

    {/* Description */}
    <p className="mt-6 text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
      {details.heroSubtitle || tour.desc}
    </p>
  </div>
</section>


        {/* ================= CONTENT ================= */}
        <section className="w-full bg-[#F7FAFC] py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-16">
              {/* HIGHLIGHTS */}
              {details.highlights?.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10">
                    Tour Highlights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {details.highlights.map((item, i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-5 rounded-xl bg-gradient-to-r from-[#F0F9F5] to-[#F5FBFF]"
                      >
                        <FiMapPin className="text-green-500 text-xl mt-1" />
                        <p className="text-gray-700 break-words">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ITINERARY */}
              {details.itinerary?.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-10 sm:mb-12">
                    Daily Itinerary
                  </h2>

                  <div className="space-y-14 sm:space-y-16">
                    {details.itinerary.map((day) => (
                      <div
                        key={day.day}
                        className="relative flex flex-col sm:flex-row gap-6 sm:gap-8"
                      >
                        <div className="hidden sm:flex flex-col items-center">
                          <div className="w-[3px] h-36 bg-blue-600 rounded-full" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                              {day.day}
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold">
                              {day.title}
                            </h3>
                          </div>

                          <p className="text-gray-600 mb-6 break-words">
                            {day.desc}
                          </p>

                          <div className="flex flex-wrap gap-x-6 gap-y-4 text-sm text-gray-700">
                            {(day.activities || []).map((activity, i) => (
                              <div key={i} className="flex items-center gap-2">
                               <FaMapMarkedAlt className="text-green-500" size={16} />
                                <span>{activity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* INCLUSIONS / EXCLUSIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {details.inclusions?.length > 0 && (
                  <div className="bg-white rounded-3xl p-8 shadow-sm">
                    <h3 className="text-xl sm:text-2xl font-bold mb-6">
                      ✓ Tour Inclusions
                    </h3>
                    <ul className="space-y-4 text-gray-700">
                      {details.inclusions.map((item, i) => (
                        <li key={i} className="flex gap-3 break-words">
                          <span className="text-green-600">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {details.exclusions?.length > 0 && (
                  <div className="bg-white rounded-3xl p-8 shadow-sm">
                    <h3 className="text-xl sm:text-2xl font-bold mb-6">
                      ✕ Tour Exclusions
                    </h3>
                    <ul className="space-y-4 text-gray-700">
                      {details.exclusions.map((item, i) => (
                        <li key={i} className="flex gap-3 break-words">
                          <span className="text-red-500">✕</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="relative lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-semibold">
                      {details.tourFacts?.duration || "14 Days / 13 Nights"}
                    </span>
                  </div>

                  <div className="border-t pt-4 flex justify-between">
                    <span className="text-gray-500">Group Size</span>
                    <span className="font-semibold">
                      {details.tourFacts?.groupSize || "2–20 people"}
                    </span>
                  </div>

                  <div className="border-t pt-4 flex justify-between">
                    <span className="text-gray-500">Difficulty</span>
                    <span className="font-semibold">
                      {details.tourFacts?.difficulty || "Easy – Moderate"}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full py-4 rounded-full text-white font-semibold bg-gradient-to-r from-green-500 to-blue-600"
                  >
                    Book Now
                  </button>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Need Help?</h4>

                    {contact && (
                      <>
                        {/* Phone */}
                        <div className="flex gap-3 items-center text-gray-600 mb-3">
                          <FiPhone className="text-blue-600" />
                          <a
                            href={`tel:${contact.phone}`}
                            className="hover:text-blue-600"
                          >
                            {contact.phone}
                          </a>
                        </div>

                        {/* WhatsApp */}
                        <div className="flex gap-3 items-center text-gray-600 mb-3">
                          <FaWhatsapp className="text-green-600" />
                          <a
                            href={`https://wa.me/${contact.whatsapp.replace(
                              /\D/g,
                              ""
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-green-600"
                          >
                            {contact.whatsapp}
                          </a>
                        </div>

                        {/* Email (first email from array) */}
                        <div className="flex gap-3 items-center text-gray-600">
                          <FiMail className="text-blue-600" />
                          <a
                            href={`mailto:${contact.emails?.[0]}`}
                            className="hover:text-blue-600"
                          >
                            {contact.emails?.[0]}
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                  {/* ================= TOUR REVIEW ================= */}
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full py-4 rounded-full text-white font-semibold bg-gradient-to-r from-yellow-500 to-orange-600 mt-4"
                  >
                    Leave a Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= GALLERY ================= */}
        <h2 className="font-playfair text-3xl md:text-4xl mb-6 mt-16 text-center">
          Gallery
        </h2>

        <section className="relative w-full px-4 md:px-10 py-10">
          <Swiper
            modules={[Autoplay, Controller]}
            loop
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            onSwiper={(s) => (mainSwiperRef.current = s)}
            controller={{ control: thumbSwiperRef.current }}
            className="w-full h-[320px] sm:h-[450px] md:h-[600px]"
          >
            {slides.map(({ image, title, desc }, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative h-full w-full">
                  <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover brightness-[0.6] rounded-2xl"
                    loading={idx < 3 ? "eager" : "lazy"} // first few slides eager, rest lazy
                  />
                  <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 text-white max-w-full md:max-w-[35%] md:ml-auto">
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-playfair font-bold">
                      {title}
                    </h2>
                    <p className="text-sm sm:text-base mt-2 break-words">
                      {desc}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="hidden md:block absolute bottom-8 left-6 md:left-10 w-[500px] px-4 py-4">
            <Swiper
              modules={[Controller]}
              loop
              slidesPerView={3}
              spaceBetween={12}
              onSwiper={(s) => (thumbSwiperRef.current = s)}
              controller={{ control: mainSwiperRef.current }}
              className="h-44"
            >
              {slides.map(({ image, title }, idx) => (
                <SwiperSlide key={idx}>
                  <div className="h-full w-full relative rounded-xl overflow-hidden cursor-pointer">
                    <img
                      src={image}
                      alt={title}
                      className="h-full w-full rounded-lg object-cover"
                      loading="lazy"
                    />

                    <div className="absolute bottom-0 w-full bg-black/50 text-white text-xs text-center py-1">
                      {title}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* ================= MODAL ================= */}
        {showForm && (
          <>
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[20000]"
              onClick={() => setShowForm(false)}
            />
            <div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
  w-[95vw] sm:w-[90vw] max-w-[700px] h-[90vh]
  bg-white shadow-2xl
  z-[20001]
  rounded-2xl
  overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full overflow-y-auto p-4 sm:p-6">
                <div className="flex justify-end mb-4">
                  <button
                    className="text-3xl font-bold text-gray-600 hover:text-black"
                    onClick={() => setShowForm(false)}
                  >
                    ×
                  </button>
                </div>

                <BookRoundTour
                  tourId={tour._id}
                  tourTitle={tour.title}
                  tourLocation={tour.location}
                />
              </div>
            </div>
          </>
        )}

        {showReviewForm && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[20000]"
              onClick={() => setShowReviewForm(false)}
            />

            {/* Modal */}
            <div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
  w-[95vw] sm:w-[90vw] max-w-[700px] h-[90vh]
  bg-white shadow-2xl
  z-[20001]
  rounded-2xl
  overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* SCROLL AREA */}
              <div className="h-full overflow-y-auto p-4 sm:p-6">
                <div className="flex justify-end mb-4">
                  <button
                    className="text-3xl font-bold text-gray-600 hover:text-black"
                    onClick={() => setShowReviewForm(false)}
                  >
                    ×
                  </button>
                </div>

                {/* Review Form */}
                <TourReview tourId={tour._id} />
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
