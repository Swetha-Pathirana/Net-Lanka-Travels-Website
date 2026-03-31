import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { axiosInstance } from "../lib/axios";
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  ArrowRight,
  MapPin,
  Clock,
  Hotel,
  Car,
  Mountain,
  Wallet,
} from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TestimonialForm from "../components/TestimonialForm";
import TailorMadeForm from "../components/CustomizeTourForm";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

const TailorMadeTours = () => {
  const Why = lazy(() => import("../components/Why"));
  const TestimonialsSection = lazy(() =>
    import("../components/TestimonialsSection")
  );

  const [tourData, setTourData] = useState({});
  const [showText, setShowText] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const customizeOptions = useMemo(
    () => [
      { icon: MapPin, label: "Destinations & Routes" },
      { icon: Clock, label: "Tour Duration" },
      { icon: Hotel, label: "Hotel Category (Budget to Luxury)" },
      { icon: Car, label: "Private Transport & Driver" },
      { icon: Mountain, label: "Activities & Experiences" },
      { icon: Wallet, label: "Budget & Travel Style" },
    ],
    []
  );

  // Fetch Tailor Made Tours data
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await axiosInstance.get("/tailor-made-tours");
        setTourData(res.data || {});

        // Preload gallery and howItWorks images
        res.data?.gallery?.forEach((img) => (new Image().src = img));
        res.data?.howItWorks?.forEach((step) => (new Image().src = step.image));
      } catch (err) {
        console.error("", err);
      }
    };
    fetchTour();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-white text-[#222]">
      <Helmet>
        <title>Tailor Made Tours | Net Lanka Travels</title>
        <meta
          name="description"
          content="Create your own tailor-made Sri Lanka tour with Net Lanka Travels. Fully customized itineraries, private transport and expert planning."
        />
        <link
          rel="canonical"
          href="https://www.netlankatravels.com/tailor-made-tours"
        />
      </Helmet>

      <ToastContainer position="top-right" autoClose={3000} />

      {/* HERO HEADER */}
      <header
        className="w-full h-[360px] md:h-[560px] relative flex items-center justify-center text-white"
        role="banner"
      >
        <img
          src="/images/7270.webp"
          alt="Tailor-made tour in Sri Lanka"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
          loading="eager"
          fetchpriority="high"
          style={{ objectPosition: "45% 33%" }}
        />

        <div className="absolute inset-0 bg-black/20" />
        <div
          className={`absolute bottom-6 md:bottom-10 right-4 md:right-10 max-w-[90%] md:w-[480px] bg-black/80 text-white p-4 md:p-6 backdrop-blur-sm shadow-lg border-none flex items-center justify-end transition-all duration-700 ease-out ${
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h1 className="text-xl md:text-3xl leading-snug text-right mr-4">
            Experience Sri Lanka,
            <br />
            Exactly The Way You Imagine…
          </h1>
          <div className="w-[2px] bg-white h-10 md:h-12" aria-hidden="true" />
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto py-20 px-6 text-center space-y-6">
        <p className="text-sm md:text-lg font-semibold tracking-widest text-gray-500 mb-3">
          CUSTOMIZED HOLIDAYS CRAFTED JUST FOR YOU
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
          Tailor-Made Sri Lanka Tours & Holidays
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
          {tourData?.description || "No description available."}
        </p>
        <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mt-6" />
      </section>

      {/* CUSTOMIZATION OPTIONS */}
      <section className="max-w-7xl mx-auto px-6 pt-2 pb-20">
        <h3 className="text-2xl md:text-4xl font-bold text-center mb-12">
          What You Can Customize
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {customizeOptions.map(({ icon: Icon, label }, idx) => (
            <div
              key={idx}
              className="border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition group"
            >
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-800 transition">
                  <Icon
                    className="w-7 h-7 text-blue-800 group-hover:text-white transition"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <p className="font-semibold text-lg text-gray-800">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLAN YOUR TRIP SECTION */}
      <section className="max-w-7xl mx-auto px-5 md:px-20 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <TailorMadeForm />
        <div className="lg:col-span-2 px-4 md:px-12 py-10 md:py-20">
          <h3 className="text-2xl md:text-4xl font-bold mb-6 text-center">
            The Best Call You’ll <br /> Make Today
          </h3>

          <div className="flex flex-col sm:flex-row justify-center items-center text-center sm:text-left space-y-6 sm:space-y-0 sm:space-x-10 mb-6">
            <div className="flex items-center space-x-2 text-green-600 text-xl font-semibold">
              <div className="bg-green-600 text-white rounded-full p-3">
                <FaWhatsapp className="w-5 h-5" aria-hidden="true" />
              </div>
              <span>{tourData?.whatsapp || "(+94) 705 325 512"}</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600 text-xl font-semibold">
              <div className="bg-blue-600 text-white rounded-full p-3">
                <FaPhoneAlt className="w-5 h-5" aria-hidden="true" />
              </div>
              <span>{tourData?.phone || "(+94) 705 325 512"}</span>
            </div>
          </div>

          <p className="text-gray-500 text-center text-base md:text-lg">
            We are here to support you 24 hours a day. If you’re travelling and
            need emergency assistance.
          </p>

          <div className="mt-16">
            <h3 className="text-2xl md:text-4xl font-bold mb-10 text-center">
              How Our Service Works?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 place-items-center">
              {tourData?.howItWorks?.map((step, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center max-w-xs"
                >
                  <img
                    src={step?.image || ""}
                    alt={step?.description || "Step image"}
                    className="w-20 h-20 mb-4"
                    loading="lazy"
                  />
                  <p className="text-gray-700 text-sm md:text-base">
                    {step?.description || ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <Why />
      </Suspense>

      <Suspense fallback={null}>
        <TestimonialsSection />
      </Suspense>

      {/* TESTIMONIAL CTA */}
      <section className="max-w-7xl mx-auto px-5 md:px-20 py-10 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Ready to Share Your Experience?
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition"
        >
          Write a Testimonial
        </button>
      </section>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[20000] flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="testimonialModalTitle"
        >
          <div
            className="w-[95vw] max-w-[700px] h-[90vh] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-6 py-4 border-b">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2
                     text-2xl font-bold text-gray-500 hover:text-black"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <TestimonialForm />
            </div>
          </div>
        </div>
      )}

      {/* GALLERY AND DESCRIPTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="flex justify-center mb-6 sm:mb-8 flex-wrap gap-4">
          {tourData?.gallery?.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Gallery ${idx + 1}`}
              className="w-36 h-36 object-cover hover:scale-105 transition-transform duration-500 rounded-lg"
              loading="lazy"
            />
          ))}
        </div>

        <p className="text-sm sm:text-base text-center text-gray-600 leading-relaxed">
          {tourData?.description ||
            "Our tailor-made tours are thoughtfully designed around your comfort, interests, and pace."}
        </p>

        {showFull && (
          <div className="text-sm sm:text-base text-center text-gray-600 leading-relaxed mt-4 sm:mt-6 space-y-4">
            {tourData?.fullDescription?.map((item, idx) => (
              <p key={idx}>{item?.description}</p>
            ))}
          </div>
        )}

        <div className="mt-3 sm:mt-4 flex justify-center pb-4 sm:pb-7">
          <button
            onClick={() => setShowFull(!showFull)}
            className="cursor-pointer text-blue-600 font-semibold flex items-center space-x-2 hover:underline"
            aria-expanded={showFull}
          >
            <span>{showFull ? "SHOW LESS" : "READ MORE"}</span>
            {showFull ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </section>

      {/* CUSTOM TOUR CTA */}
      <section className="relative -mt-4 sm:-mt-8 lg:-mt-28">
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch relative h-auto lg:h-[800px]">
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center px-4 sm:px-6 py-10 sm:py-14 lg:py-0 z-10 space-y-2 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Ready to Design <br /> Your Dream Sri Lanka Tour?
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Tell us your ideas - we’ll take care of the rest.
            </p>
            <div className="mt-4">
              <a
                href="/contact"
                className="bg-[#ce2a40] hover:bg-[#ef0530] text-white uppercase px-6 py-3 rounded-full font-semibold flex items-center gap-2 text-sm shadow-lg transition-colors duration-300 justify-center"
              >
                Connect with Us
                <ArrowRight className="w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="w-full lg:w-1/2 lg:absolute lg:top-0 lg:right-0 lg:h-full">
            <img
              src="/images/sigiriya-art.webp"
              alt="Sigiriya Art"
              className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TailorMadeTours;
