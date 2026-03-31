import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";

export default function DayTourList() {
  const [tours, setTours] = useState([]);

  const role = sessionStorage.getItem("role") || "admin"; // admin or superadmin
  const basePath = role === "superadmin" ? "/super-admin" : "/admin";

  // Fetch all tours
  const fetchTours = async () => {
    try {
      const res = await axiosInstance.get("/day-tours");
      setTours(res.data.tours || []);
    } catch (err) {
      console.error(err);
      alert("Error fetching day tours");
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  // Delete a tour
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this day tour?")) return;

    try {
      await axiosInstance.delete(`/day-tours/${id}`);
      fetchTours();
    } catch (err) {
      console.error(err);
      alert("Error deleting day tour");
    }
  };

  return (
    <div>
      <main>
        <h2 className="text-4xl font-bold text-[#0d203a] mb-4 px-5 mt-4">
          Manage Day Tours
        </h2>

        <div className="flex justify-end mb-8">
          <Link
            to={`${basePath}/day-tours/new`}
            className="bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60]"
          >
            + Add Day Tour
          </Link>
        </div>

        <table className="w-full bg-white border border-[#1a354e] rounded shadow">
          <thead className="bg-[#0d203a] text-white">
            <tr>
              <th className="p-3 border border-[#1a354e]">Image</th>
              <th className="p-3 border border-[#1a354e]">Title</th>
              <th className="p-3 border border-[#1a354e]">Location</th>
              <th className="p-3 border border-[#1a354e] text-center w-36">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour._id} className="border-b border-[#2E5B84] hover:bg-blue-50">
                <td className="p-2 border border-[#2E5B84] text-center">
                  <img
                    src={tour.img}
                    alt={tour.title}
                    className="h-12 w-12 object-cover rounded mx-auto"
                  />
                </td>
                <td className="p-3 border border-[#2E5B84]">{tour.title}</td>
                <td className="p-3 border border-[#2E5B84]">{tour.location}</td>
                <td className="py-4 flex justify-center items-center gap-2">
                  <Link
                    to={`${basePath}/day-tours/edit/${tour._id}`}
                    className="bg-[#2E5B84] text-white px-3 py-1 rounded hover:bg-[#1E3A60] text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(tour._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {tours.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No day tours found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}
