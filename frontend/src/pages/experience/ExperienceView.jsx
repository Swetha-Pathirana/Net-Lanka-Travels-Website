import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useParams, Link } from "react-router-dom";

export default function ExperienceView() {
  const { id } = useParams();
  const [exp, setExp] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = sessionStorage.getItem("role") || "admin"; // admin or superadmin
  const basePath = role === "superadmin" ? "/super-admin" : "/admin";

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await axiosInstance.get(`/experience/${id}`);
        setExp(res.data);
      } catch (err) {
        console.error("Error fetching experience:", err);
        alert("Error fetching experience data.");
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!exp)
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold">Experience Not Found</h2>
      </div>
    );

  return (
    <div>

      {/* Main Content */}
      <main>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {exp.title}
          </h1>
          <div className="flex gap-2">
            <Link
             to={`${basePath}/experiences/edit/${exp._id}`}
              className="bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60] transition"
            >
              Edit
            </Link>
            <Link
             to={`${basePath}/experiences`}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              Back
            </Link>
          </div>
        </div>

        {/* Subtitle & Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{exp.subtitle}</h2>
          <p className="text-gray-700">{exp.description}</p>
        </div>

        {/* Hero + Main Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="shadow-lg rounded overflow-hidden">
            <h3 className="font-semibold p-2 bg-gray-100">Hero Image</h3>
            <img
              src={exp.heroImg || "/images/default.jpg"}
              alt="hero"
              className="w-full h-64 object-cover"
            />
          </div>

          <div className="shadow-lg rounded overflow-hidden">
            <h3 className="font-semibold p-2 bg-gray-100">Main Image</h3>
            <img
              src={exp.mainImg || "/images/default.jpg"}
              alt="main"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>

        {/* Main Description */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-2">Main Description</h3>
          <p className="text-gray-700">{exp.mainDesc}</p>
        </div>

        {/* Sub Description */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-2">Sub Description</h3>
          <p className="text-gray-700">{exp.subDesc}</p>
        </div>

        {/* Sub Experiences */}
        {exp.subExperiences.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Sub Experiences</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exp.subExperiences.map((s, i) => (
                <div key={i} className="bg-white shadow rounded-lg overflow-hidden">
                  {s.image && (
                    <img
                      src={s.image}
                      alt={s.place || s.location}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold">
                      {s.location} — {s.place}
                    </h4>
                    <p className="text-gray-700 mt-2">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {exp.gallery.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Gallery</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {exp.gallery.map((g, i) => (
                <img
                  key={i}
                  src={g}
                  alt={`gallery-${i}`}
                  className="w-full h-32 object-cover rounded shadow"
                />
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {exp.tips.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-3">Tips</h3>
            <ul className="list-disc pl-6 text-gray-700">
              {exp.tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
