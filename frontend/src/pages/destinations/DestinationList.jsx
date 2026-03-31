import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";

export default function DestinationList() {
  const [destinations, setDestinations] = useState([]);

  const role = sessionStorage.getItem("role") || "admin";
  const basePath = role === "superadmin" ? "/super-admin" : "/admin";
  
  const fetchDestinations = async () => {
    const res = await axiosInstance.get("/destination");
    setDestinations(res.data.destinations || []);
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this destination?")) return;
    await axiosInstance.delete(`/destination/${id}`);
    fetchDestinations();
  };

  return (
    <div>


      <main>
        <h2 className="text-4xl px-5 mt-4 font-bold text-[#0d203a] mb-4">
          Manage Destinations
        </h2>

        <div className="flex justify-end mb-8">
          <Link
          to={`${basePath}/destinations/new`}
            className="bg-[#2E5B84] text-white  px-4 py-2 rounded hover:bg-[#1E3A60] transition"
          >
            + Add Destination
          </Link>
        </div>

        <table className="w-full bg-white border border-[#1a354e] rounded shadow">
          <thead className="bg-[#0d203a] text-white">
            <tr>
              <th className="p-3 border border-[#1a354e] ">Image</th>
              <th className="p-3 border border-[#1a354e] ">Subtitle</th>
              <th className="p-3 border border-[#1a354e] ">Title</th>
              <th className="p-3 border border-[#1a354e] text-center w-36">Actions</th>
            </tr>
          </thead>

          <tbody>
            {destinations.map((d) => (
              <tr key={d._id} className="border-b border-[#2E5B84] hover:bg-blue-50">
                <td className="p-2 border border-[#2E5B84] text-center">
                  <img
                    src={d.img}
                    className="h-12 w-12 rounded object-cover mx-auto"
                    alt=""
                  />
                </td>

                <td className="p-3 border border-[#2E5B84]">{d.subtitle}</td>
                <td className="p-3 border border-[#2E5B84]">{d.title}</td>

                <td className=" py-4 flex justify-center items-center gap-2">
                  <Link
                  to={`${basePath}/destinations/edit/${d._id}`}
                    className="bg-[#2E5B84] text-white px-3 py-1 rounded hover:bg-[#1E3A60] transition text-sm"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(d._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
