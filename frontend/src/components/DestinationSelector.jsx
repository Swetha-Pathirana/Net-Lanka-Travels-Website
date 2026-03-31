import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

export default function DestinationSelector({ initialSelected, onConfirm }) {
  const [destinations, setDestinations] = useState([]);
  const [tempSelected, setTempSelected] = useState(initialSelected || []);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axiosInstance.get("/destination");
        setDestinations(res.data.destinations || []);
      } catch (err) {
        console.error("Error fetching destinations:", err);
      }
    };
    fetchDestinations();
  }, []);

  const handleToggle = (title) => {
    setTempSelected((prev) =>
      prev.includes(title)
        ? prev.filter((d) => d !== title)
        : [...prev, title]
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
        <h2 className="text-xl font-bold">Select Destinations</h2>
        <button
          onClick={() => onConfirm(initialSelected)}
          className="text-gray-500 hover:text-black text-2xl font-bold"
        >
          &times;
        </button>
      </div>

      {/* ✅ Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map((d) => {
            const title = d.title || d.name;
            const isSelected = tempSelected.includes(title);

            return (
              <div
                key={d._id}
                onClick={() => handleToggle(title)}
                className={`relative border rounded-xl overflow-hidden cursor-pointer transition
                  hover:shadow-md ${
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-300"
                      : "border-gray-200"
                  }`}
              >
                {/* Checkbox */}
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full border bg-white flex items-center justify-center">
                  {isSelected && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  )}
                </div>

                <img
                  src={d.img || d.image || "/images/placeholder.webp"}
                  alt={title}
                  className="w-full h-36 object-cover"
                />

                <div className="p-2 text-center">
                  <h3 className="text-sm font-semibold">{title}</h3>
                  {d.subtitle && (
                    <p className="text-xs text-gray-500">{d.subtitle}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-white sticky bottom-0">
        <button
          onClick={() => onConfirm(tempSelected)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          OK →
        </button>
      </div>
    </div>
  );
}
