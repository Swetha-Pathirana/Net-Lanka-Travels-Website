import { useState } from "react";

export default function ExperienceSelector({ experiences, initialSelected, onConfirm }) {
  const [tempSelected, setTempSelected] = useState(initialSelected || []);

  const handleToggle = (title) => {
    setTempSelected((prev) =>
      prev.includes(title)
        ? prev.filter((e) => e !== title)
        : [...prev, title]
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
        <h2 className="text-xl font-bold">Select Experiences</h2>
        <button
          onClick={() => onConfirm(initialSelected)}
          className="text-gray-500 hover:text-black text-2xl font-bold"
        >
          &times;
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {experiences.map((exp) => {
            const title = exp.title;
            const isSelected = tempSelected.includes(title);

            return (
              <div
                key={exp._id}
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
                  src={exp.mainImg || "/images/placeholder.webp"}
                  alt={title}
                  className="w-full h-36 object-cover"
                />

                <div className="p-2 text-center">
                  <h3 className="text-sm font-semibold">{title}</h3>
                  {exp.subtitle && (
                    <p className="text-xs text-gray-500">{exp.subtitle}</p>
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
