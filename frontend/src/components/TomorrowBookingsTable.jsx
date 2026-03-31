import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Plane, Compass, Star, Check } from "lucide-react";

export default function TomorrowBookingsTable() {
  const [tomorrowBookings, setTomorrowBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchTomorrowBookings = async () => {
    try {
      const res = await axiosInstance.get("/admin-notifications/unread");
      setTomorrowBookings(res.data.notifications || []);
    } catch (err) {
      console.error("Error fetching tomorrow bookings:", err);
      setTomorrowBookings([]);
    }
  };

  useEffect(() => {
    fetchTomorrowBookings();
    const interval = setInterval(fetchTomorrowBookings, 60000); 
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await axiosInstance.put(`/admin-notifications/${id}/read`);
      setTomorrowBookings((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBookings = tomorrowBookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(tomorrowBookings.length / itemsPerPage);

  // Helper to choose icon by booking type
  const getIcon = (type) => {
    switch (type) {
      case "Day":
        return <Plane size={16} className="text-blue-600" />;
      case "Round":
        return <Compass size={16} className="text-green-600" />;
      case "Event":
        return <Star size={16} className="text-yellow-600" />;
      default:
        return <Star size={16} className="text-gray-400" />;
    }
  };

  return (
    <div id="tomorrow-bookings" className="bg-white p-5 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Star size={20} /> Tomorrow's Bookings
      </h2>

      {tomorrowBookings.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Message</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 flex items-center gap-1">
                      {getIcon(b.bookingType)} {b.bookingType} Tour
                    </td>
                    <td className="px-4 py-2">{b.message || "—"}</td>
                    <td className="px-4 py-2">
                      {new Date(b.startDate || b.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleMarkRead(b._id)}
                        className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200 text-xs"
                      >
                        <Check size={14} /> Mark
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end mt-4 gap-2 items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-300"
              }`}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No bookings for tomorrow</p>
      )}
    </div>
  );
}
