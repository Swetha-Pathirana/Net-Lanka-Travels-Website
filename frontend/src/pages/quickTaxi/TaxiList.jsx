import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";

export default function TaxiList() {
  const [taxis, setTaxis] = useState([]);

  const role = sessionStorage.getItem("role") || "admin"; // admin or superadmin
  const basePath = role === "superadmin" ? "/super-admin" : "/admin";

  const fetchTaxis = async () => {
    const res = await axiosInstance.get("/quick-taxi/taxis");
    setTaxis(res.data.taxis || []);
  };

  useEffect(() => {
    fetchTaxis();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;
    await axiosInstance.delete(`/quick-taxi/taxis/${id}`);
    fetchTaxis();
  };

  return (
    <div>
 
      <main>
        <h2 className="text-4xl px-5 mt-4 font-bold text-[#0d203a] mb-4">
          Manage Taxi Vehicles
        </h2>

        <div className="flex justify-end mb-8">
          <Link
          to={`${basePath}/taxis/new`}
            className="bg-[#2E5B84] text-white  px-4 py-2 rounded hover:bg-[#1E3A60] transition"
          >
            + Add Vehicle
          </Link>
        </div>

        <table className="w-full bg-white border border-[#1a354e] rounded shadow">
          <thead className="bg-[#0d203a] text-white">
            <tr>
              <th className="p-3 border border-[#1a354e] ">Image</th>
              <th className="p-3 border border-[#1a354e] ">Name</th>
              <th className="p-3 border border-[#1a354e] ">Seats</th>
              <th className="p-3 border border-[#1a354e] ">AC</th>
              <th className="p-3 border border-[#1a354e] text-center w-36">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {taxis.map((t) => (
              <tr
                key={t._id}
                className="border-b border-[#2E5B84] hover:bg-blue-50"
              >
                <td className="p-2 border border-[#2E5B84] text-center">
                  <img
                    src={t.image}
                    alt="vehicle"
                    className="h-12 w-12 rounded object-cover mx-auto"
                  />
                </td>
                <td className="p-3 border border-[#2E5B84]">{t.name}</td>
                <td className="p-3 border border-[#2E5B84]">{t.seats}</td>
                <td className="p-3 border border-[#2E5B84]">
                  {t.ac ? "Yes" : "No"}
                </td>
                <td className=" py-4 flex justify-center items-center gap-2">
                  <Link
                  to={`${basePath}/taxis/edit/${t._id}`}
                    className="bg-[#2E5B84] text-white px-3 py-1 rounded hover:bg-[#1E3A60] transition text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(t._id)}
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
