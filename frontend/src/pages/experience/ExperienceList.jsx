import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";

export default function ExperienceList() {
  const [experiences, setExperiences] = useState([]);

  const role = sessionStorage.getItem("role") || "admin"; // admin or superadmin
  const basePath = role === "superadmin" ? "/super-admin" : "/admin";

  const fetchExperiences = async () => {
    const res = await axiosInstance.get("/experience");
    setExperiences(res.data || []);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this experience?")) return;
    await axiosInstance.delete(`/experience/${id}`);
    fetchExperiences();
  };

  return (
    <div>
     

      <main>
        <h2 className="text-4xl font-bold text-[#0d203a] px-5 mt-4  mb-4">
         Manage Experiences
        </h2>

        <div className="flex justify-end mb-8">
          <Link
          to={`${basePath}/experiences/new`}
            className="bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60]"
          >
            + Add Experience
          </Link>
        </div>

        <table className="w-full bg-white border border-[#1a354e] rounded shadow">
          <thead className="bg-[#0d203a] text-white">
            <tr>
              <th className="p-3 border border-[#1a354e] ">Hero Image</th>
              <th className="p-3 border border-[#1a354e] ">Title</th>
              <th className="p-3 border border-[#1a354e] ">Subtitle</th>
              <th className="p-3 border border-[#1a354e] ">Actions</th>
            </tr>
          </thead>
          <tbody>
  {experiences.length > 0 ? (
    experiences.map((exp) => (
      <tr
        key={exp._id}
        className="border-b border-[#2E5B84] hover:bg-blue-50"
      >
        <td className="p-2 border border-[#2E5B84] text-center">
          <img
            src={exp.heroImg || "/images/placeholder.jpg"}
            alt=""
            className="h-12 w-12 rounded object-cover mx-auto"
          />
        </td>
        <td className="p-3 border border-[#2E5B84]">{exp.title || "-"}</td>
        <td className="p-3 border border-[#2E5B84]">{exp.subtitle || "-"}</td>
        <td className="py-4 flex justify-center items-center gap-2">
          <Link
          to={`${basePath}/experiences/view/${exp._id}`}
            className="bg-[#6B8FB6] text-white px-3 py-1 rounded hover:bg-[#4b6f8f] text-sm"
          >
            View
          </Link>
          <Link
           to={`${basePath}/experiences/edit/${exp._id}`}
            className="bg-[#2E5B84] text-white px-3 py-1 rounded hover:bg-[#1E3A60] text-sm"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(exp._id)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
          >
            Delete
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan={4}
        className="text-center text-gray-500 py-6 border border-[#2E5B84]"
      >
        No experiences available.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </main>
    </div>
  );
}
