import React, { useState } from "react";
import {
  FaHotel,
  FaUtensils,
  FaCar,
  FaUserTie,
  FaMapMarkedAlt,
  FaTicketAlt,
  FaPlaneArrival,
  FaWater,
  FaClock,
  FaUsers,
} from "react-icons/fa";
import { MdChildCare } from "react-icons/md";
import PackageForm from "./PackageForm"; // import your form component

const packages = [
  {
     id: "platinum",
    title: "Platinum Package",
    subtitle: "Luxury & Premium Experience",
    badge: "🌟",
    color: "border-purple-500",
    bestFor: "Honeymoon couples, luxury travelers, VIP guests, families",
    includes: [
      { icon: <FaHotel />, text: "5-Star / Luxury Hotels" },
      { icon: <FaUtensils />, text: "Daily Breakfast + Lunch + Dinner" },
      { icon: <FaCar />, text: "Luxury Private Vehicle (Air-conditioned)" },
      {
        icon: <FaUserTie />,
        text: "Professional Chauffeur Guide Driver (English speaking)",
      },
      { icon: <FaUsers />, text: "Private Guide (Optional)" },
      { icon: <FaMapMarkedAlt />, text: "Fully Customized Itinerary" },
      {
        icon: <FaTicketAlt />,
        text: "All Entrance Fees (Attractions & Sightseeing)",
      },
      { icon: <FaPlaneArrival />, text: "Airport Pick-up & Drop" },
      { icon: <FaWater />, text: "Complimentary Water Bottles" },
      {
        icon: <MdChildCare />,
        text: "Transportation Free for Kids (Under 14)",
      },
      { icon: <FaClock />, text: "24/7 Customer Support" },
    ],
  },
  {
     id: "gold",
    title: "Gold Package",
    subtitle: "Comfort & Value Balance",
    badge: "🥇",
    color: "border-yellow-500",
    bestFor: "Families, small groups, comfort travelers, couples",
    includes: [
      { icon: <FaHotel />, text: "4-Star Hotels" },
      { icon: <FaUtensils />, text: "Daily Breakfast / Lunch" },
      { icon: <FaCar />, text: "Private Air-Conditioned Vehicle" },
      { icon: <FaUserTie />, text: "Chauffeur Guide Driver (Request Language)" },
      { icon: <FaUsers />, text: "Private Guide (Optional)" },
      { icon: <FaMapMarkedAlt />, text: "Fully Customized Itinerary" },
      { icon: <FaTicketAlt />, text: "Selected Entrance Fees" },
      { icon: <FaPlaneArrival />, text: "Airport Pick-up & Drop" },
      { icon: <MdChildCare />, text: "Transportation Free for Kids (Under 14)" },
      { icon: <FaWater />, text: "Complimentary Water Bottles" },
    ],
  },
  {
    id: "silver",
    title: "Silver Package",
    subtitle: "Budget Friendly & Flexible",
    badge: "🥈",
    color: "border-gray-400",
    bestFor: "Budget travelers, backpackers, students, couples",
    includes: [
      { icon: <FaHotel />, text: "3-Star / Boutique Hotels" },
      { icon: <FaUtensils />, text: "Daily Breakfast" },
      { icon: <FaCar />, text: "Private Air-Conditioned Vehicle" },
      { icon: <FaUserTie />, text: "Chauffeur Guide Driver (English speaking)" },
      { icon: <MdChildCare />, text: "Transportation Free for Kids (Under 14)" },
      { icon: <FaMapMarkedAlt />, text: "Fully Customized Itinerary" },
      { icon: <FaTicketAlt />, text: "Entrance Fees Not Included" },
      { icon: <FaPlaneArrival />, text: "Airport Pick-up & Drop" },
    ],
  },
];

// ================== Package Card ==================
function PackageCard({ pkg }) {
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const visibleItems = expanded ? pkg.includes : pkg.includes.slice(0, 4);

  return (
    <>
      <div
        className={`bg-white rounded-2xl shadow-lg border-t-4 ${pkg.color} p-6 transition-all duration-300`}
      >
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold">
            {pkg.badge} {pkg.title}
          </h3>
          <p className="text-sm text-gray-500">{pkg.subtitle}</p>
        </div>

        {/* Includes */}
        <ul className="space-y-3 text-sm text-gray-700">
          {visibleItems.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-lg mt-0.5">{item.icon}</span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>

        {/* Expand / Collapse */}
        {pkg.includes.length > 4 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 text-sm font-medium text-blue-600 hover:underline self-start"
          >
            {expanded ? "Hide details ↑" : "View details ↓"}
          </button>
        )}

        {/* Best for */}
        {expanded && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-semibold text-gray-800">Best for:</p>
            <p className="text-sm text-gray-600">{pkg.bestFor}</p>
          </div>
        )}

        {/* Enquire Button */}
        <button
          onClick={() => setShowForm(true)}
          className="mt-5 w-full rounded-xl bg-black text-white py-2 hover:opacity-90 transition"
        >
          Enquire Now
        </button>
      </div>

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
              bg-white shadow-2xl z-[20001] rounded-2xl overflow-auto"
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

              {/* PackageForm component */}
             <PackageForm prefill={{ packageTitle: pkg.title, packageId: pkg.id }} />

            </div>
          </div>
        </>
      )}
    </>
  );
}

// ================= Tailor-Made Packages =================
export default function TailorMadePackages() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <header className="text-center mb-12 md:mb-14 px-4">
          <p className="text-sm md:text-lg tracking-wide text-gray-500 font-semibold uppercase">
            Luxury • Comfort • Budget
          </p>

          <h2
            id="tailor-made-section-title"
            className="text-center text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-14"
          >
            Tailor-Made Tour Packages
          </h2>
        </header>

        {/* Packages Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
          {packages.map((pkg, index) => (
            <PackageCard key={index} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}
