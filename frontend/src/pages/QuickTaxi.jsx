import React, { useEffect, useState } from "react";
import TaxiForm from "../components/TaxiForm";
import { FaUsers, FaSuitcase, FaSnowflake } from "react-icons/fa";
import { FaCheckCircle, FaShieldAlt, FaClock, FaIdCard } from "react-icons/fa";
import { axiosInstance } from "../lib/axios";
import { MdEventSeat } from "react-icons/md";

const QuickTaxi = () => {
  const [showText, setShowText] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // ---------------- FETCH VEHICLES ----------------
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axiosInstance.get("/quick-taxi/taxis");
        if (res.data.success) {
          setVehicles(res.data.taxis);
        } else {
          console.error("", res.data.error);
        }
      } catch (err) {
        console.error("", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[100vh] flex items-center justify-center bg-white">
        <p className="text-gray-500 text-lg"></p>
      </div>
    );
  }  

  return (
    <div className="font-poppins bg-white text-[#222]">
      {/* HERO HEADER */}
      <div
        className="w-full h-[360px] md:h-[560px] bg-cover bg-center relative flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/images/taxi.webp')" }}
      >
        <div className="absolute inset-0 bg-black/20"></div>

        <div
          className={`absolute bottom-6 md:bottom-10 right-4 md:right-10 max-w-[90%] md:w-[420px] bg-black/80 text-white p-4 md:p-6 backdrop-blur-sm shadow-lg flex items-center justify-end transition-all duration-700 ${
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="text-xl md:text-3xl leading-snug text-right mr-4">
            Fast & Reliable Taxi Service <br />
            Wherever You Need To Go
          </h2>
          <div className="w-[2px] bg-white h-10 md:h-12"></div>
        </div>
      </div>

      {/* INTRO SECTION */}
      <section className="w-full py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm md:text-lg text-gray-600 tracking-widest font-semibold mb-3">
            QUICK TAXI BOOKING
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-5">
            Get Your Ride Instantly Across Sri Lanka
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            Book your Sri Lanka taxi quickly with NetLanka Travels. Enjoy
            reliable drop & pickup services, airport transfers, and private
            drivers for a safe, comfortable, and hassle-free journey anywhere in
            Sri Lanka.
          </p>
          <div className="w-20 h-[3px] bg-yellow-500 mx-auto mt-6 rounded-full"></div>
        </div>
      </section>

      {/* VEHICLES GRID */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {vehicles.map((v) => (
            <div
              key={v._id}
              className="bg-gray-100 rounded-xl overflow-hidden shadow-lg border border-gray-200 cursor-pointer transform transition hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex items-center justify-center h-40 bg-gray-200">
                <img
                  src={v.image || ""}
                  alt={v.name}
                  className="w-36 h-36 object-contain"
                />
              </div>

              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {v.name}
                </h3>
                <div className="flex justify-between text-gray-700 text-sm">
                  <div className="flex flex-col items-center">
                    <MdEventSeat className="text-lg mb-1" />
                    <span>{v.seats}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <FaSuitcase className="text-lg mb-1" />
                    <span>{v.luggage}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <FaUsers className="text-lg mb-1" />
                    <span>{v.capacity}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <FaSnowflake className="text-lg mb-1" />
                    <span>{v.ac ? "AC" : "Non-AC"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING FORM SECTION */}
      <section className="bg-gray-50 w-full py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* LEFT INFO */}
          <div className="lg:sticky lg:top-28 self-start space-y-8">
            <h4 className="text-sm tracking-widest font-semibold text-gray-500 uppercase">
              Book Your Taxi
            </h4>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Ride Safe & Comfortable <br /> Across Sri Lanka
            </h2>
            <p className="text-gray-700 max-w-md leading-relaxed">
              Plan your journey effortlessly with our reliable taxi service.
              Choose the right vehicle, share your details, and let our
              professional drivers take care of the rest.
            </p>

            {/* ICON FEATURES */}
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center gap-3">
                <FaCheckCircle className="text-green-600 text-lg" /> Island-wide
                Taxi Service
              </li>
              <li className="flex items-center gap-3">
                <FaShieldAlt className="text-green-600 text-lg" /> Safe &
                Insured Vehicles
              </li>
              <li className="flex items-center gap-3">
                <FaClock className="text-green-600 text-lg" /> 24/7 Availability
              </li>
              <li className="flex items-center gap-3">
                <FaIdCard className="text-green-600 text-lg" /> Licensed
                Professional Drivers
              </li>
            </ul>

            {/* GOOGLE MAP */}
            <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 mt-6">
              <iframe
                title="Sri Lanka Map"
                src="https://www.google.com/maps?q=Sri+Lanka&z=7&output=embed"
                className="w-full h-56"
                loading="lazy"
              />
            </div>

            {/* TRUST BADGES */}
            <div className="flex flex-wrap gap-4 pt-6">
              <span className="px-5 py-2 bg-white shadow rounded-full text-sm font-semibold text-gray-900">
                ✔ Safe Travel
              </span>
              <span className="px-5 py-2 bg-white shadow rounded-full text-sm font-semibold text-gray-900">
                ✔ Licensed
              </span>
              <span className="px-5 py-2 bg-white shadow rounded-full text-sm font-semibold text-gray-900">
                ✔ 24/7 Support
              </span>
              <span className="px-5 py-2 bg-white shadow rounded-full text-sm font-semibold text-gray-900">
                ✔ Verified Tours
              </span>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="w-full bg-white p-6 rounded-xl shadow-lg">
            <TaxiForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuickTaxi;
