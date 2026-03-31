import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaWhatsapp, FaEnvelope, FaEye, FaTrash } from "react-icons/fa";

const DayTourBookingAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const rowsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [, setTaxis] = useState([]);

  // ---------------- FETCH BOOKINGS ----------------
  const fetchBookings = async () => {
    try {
      const resDay = await axiosInstance.get("/day-tour-booking");
      const dayBookings = resDay.data.success
        ? resDay.data.bookings.map((b) => ({ ...b, source: "day" }))
        : [];

      const resCommon = await axiosInstance.get("/book-tour");
      const commonDayBookings = resCommon.data.success
        ? resCommon.data.bookings
            .filter((b) => b.tourType === "day")
            .map((b) => ({ ...b, source: "common" }))
        : [];

      const allBookings = [...dayBookings, ...commonDayBookings].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setBookings(allBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to fetch bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    axiosInstance.get("/quick-taxi/taxis").then((res) => {
      if (res.data.success) setTaxis(res.data.taxis);
    });
  }, []);

  // ---------------- STATUS UPDATE ----------------
  const handleStatusChange = async (id, newStatus, source) => {
    const apiPath =
      source === "day" ? `/day-tour-booking/${id}` : `/book-tour/${id}`;
    const toastId = toast.info("Updating status...", { autoClose: false });

    try {
      const res = await axiosInstance.patch(apiPath, { status: newStatus });

      if (res.data.success) {
        toast.update(toastId, {
          render: "Status updated successfully!",
          type: "success",
          autoClose: 3000,
          isLoading: false,
        });
        fetchBookings();
        if (selectedBooking && selectedBooking._id === id)
          setSelectedBooking({ ...selectedBooking, status: newStatus });
      } else {
        toast.update(toastId, {
          render: "Failed to update status",
          type: "error",
          autoClose: 3000,
          isLoading: false,
        });
      }
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        render: "Error updating status",
        type: "error",
        autoClose: 3000,
        isLoading: false,
      });
    }
  };

  // ---------------- DELETE BOOKING ----------------
  const handleDelete = async (id, source) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;

    try {
      const apiPath =
        source === "day" ? `/day-tour-booking/${id}` : `/book-tour/${id}`;
      const res = await axiosInstance.delete(apiPath);

      if (res.data.success) {
        toast.success("Booking deleted");
        fetchBookings();
        if (selectedBooking && selectedBooking._id === id)
          setSelectedBooking(null);
      } else toast.error("Delete failed");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // ---------------- MESSAGE GENERATOR ----------------
  const getStatusMessage = (status, name) => {
    switch (status) {
      case "Approved":
        return `Hello ${name}, your day tour booking has been approved! 🎉`;
      case "Cancelled":
        return `Hello ${name}, your day tour booking has been cancelled. 😔`;
      case "Completed":
        return `Hello ${name}, your day tour booking has been completed. Thank you! 😊`;
      case "Pending":
      default:
        return `Hello ${name}, your day tour booking is pending. We'll update you soon.`;
    }
  };

  const getSanitizedPhone = (phone) => (phone ? phone.replace(/\D/g, "") : "");

  // ---------------- PAGINATION ----------------
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone?.includes(searchTerm) ||
      b.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tourId?.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || b.status === statusFilter;

    const matchesDate =
      !dateFilter ||
      b.startDate === dateFilter ||
      b.createdAt?.split("T")[0] === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);

  const currentRows = filteredBookings.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* MAIN CONTENT */}
      <main>
        <h2 className="text-4xl font-bold text-[#0d203a] mb-6 px-5 mt-4">
          Manage Day Tour Bookings
        </h2>

        <div className="bg-[#0d203a] border border-[#1a354e] rounded mb-6 p-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search name / phone / email / tour"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded border border-[#1a354e] text-sm w-full sm:w-64
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* STATUS */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded border border-[#1a354e] text-sm w-full sm:w-44
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* DATE */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded border border-[#1a354e] text-sm w-full sm:w-44
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* CLEAR */}
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
                setDateFilter("");
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-gray-300 text-sm rounded hover:bg-gray-400 transition"
            >
              Clear
            </button>

            {/* RESULT COUNT (OPTIONAL – looks professional) */}
            <span className="ml-auto text-sm text-gray-300">
              Showing <b>{filteredBookings.length}</b> bookings
            </span>
          </div>
        </div>

        <div className="overflow-x-auto max-w-full">
          <table className="w-full table-fixed border border-[#1a354e] rounded mb-6 text-center">
            <thead className="bg-[#0d203a] text-white">
              <tr>
                <th className="p-3 border border-[#1a354e] text-sm">Tour</th>
                <th className="p-3 border border-[#1a354e] text-sm">Name</th>
                <th className="p-3 border border-[#1a354e] text-sm">Phone</th>
                <th className="p-3 border border-[#1a354e] text-sm">
                  Pickup Location
                </th>
                <th className="p-3 border border-[#1a354e] text-sm">
                  Travel Style
                </th>
                <th className="p-3 border border-[#1a354e] text-sm">Vehicle</th>
                <th className="p-3 border border-[#1a354e] text-sm">Date</th>
                <th className="p-3 border border-[#1a354e] text-sm">Status</th>
                <th className="p-3 border border-[#1a354e] text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center p-6 text-gray-500 font-medium"
                  >
                    No bookings found
                  </td>
                </tr>
              ) : (
                currentRows.map((b) => {
                  const message = getStatusMessage(b.status, b.name);
                  return (
                    <tr
                      key={b._id}
                      className="border-b border-[#2E5B84] hover:bg-blue-50"
                    >
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {b.tourId?.title || "—"}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {b.name}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {b.phone}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {b.pickupLocation || "—"}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {b.travelStyle || "—"}
                      </td>
                      <td>{b.taxiId ? b.taxiId.name : "—"}</td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {b.startDate
                          ? new Date(b.startDate).toISOString().split("T")[0]
                          : "—"}
                      </td>

                      {/* Status selector + WhatsApp/Email */}
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        <div className="flex justify-center">
                          <select
                            value={b.status || "Pending"}
                            onChange={(e) =>
                              handleStatusChange(
                                b._id,
                                e.target.value,
                                b.source
                              )
                            }
                            className={`px-2 py-1 rounded w-full max-w-[140px] ${
                              b.status === "Approved"
                                ? "bg-green-100 text-green-700"
                                : b.status === "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : b.status === "Completed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>

                        <div className="flex gap-1 justify-center mt-2">
                          <a
                            href={`https://wa.me/${getSanitizedPhone(
                              b.phone
                            )}?text=${encodeURIComponent(message)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-700 text-white px-2 py-2 rounded text-xs flex items-center justify-center"
                          >
                            <FaWhatsapp />
                          </a>
                          {b.email && (
                            <a
                              href={`mailto:${
                                b.email
                              }?subject=Day Tour Booking Update&body=${encodeURIComponent(
                                message
                              )}`}
                              className="bg-gray-700 text-white px-2 py-2 rounded text-xs flex items-center justify-center"
                            >
                              <FaEnvelope />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="flex justify-center items-center gap-2 mt-3 py-4">
                        <button
                          className="bg-[#2E5B84] text-white p-2 rounded hover:bg-[#1E3A60] transition"
                          onClick={() => setSelectedBooking(b)}
                          title="View"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                          onClick={() => handleDelete(b._id, b.source)}
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* ---------------- MODAL ---------------- */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center bg-[#0d203a] px-6 py-3 flex-shrink-0">
                <h3 className="text-xl font-bold text-white">
                  Day Tour Booking Details
                </h3>
                <button
                  className="text-white text-xl font-bold hover:text-gray-300 transition"
                  onClick={() => setSelectedBooking(null)}
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 text-sm text-gray-700 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-0 border border-blue-950 rounded">
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Tour:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.tourId?.title || "—"}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Location:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.tourId?.location || "—"}
                  </p>

                  {/* Travel Style */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Travel Style:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.travelStyle || "—"}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Travel Purpose:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.purpose || "Not Selected"}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Vehicle:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.taxiId
                      ? `${selectedBooking.taxiId.name} - Seats: ${
                          selectedBooking.taxiId.seats
                        } - ${selectedBooking.taxiId.ac ? "AC" : "Non-AC"}`
                      : "—"}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Name:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.name}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Email:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.email || "—"}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Phone:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.phone}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Adults:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.adults || 0}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Children:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.children || 0}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Pickup Location:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.pickupLocation || "—"}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Pickup Date:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.startDate
                      ? new Date(selectedBooking.startDate)
                          .toISOString()
                          .split("T")[0]
                      : "—"}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Pickup Time:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.startTime || "—"}
                  </p>

                  {selectedBooking.message && (
                    <>
                      <p className="p-2 border-r border-blue-950 font-semibold bg-gray-50">
                        Message:
                      </p>
                      <p className="p-2 break-words">
                        {selectedBooking.message}
                      </p>
                    </>
                  )}
                </div>

                {/* Status selector */}
                <div className="mt-2">
                  <label className="block font-semibold mb-1">Status:</label>
                  <select
                    value={selectedBooking.status || "Pending"}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedBooking._id,
                        e.target.value,
                        selectedBooking.source
                      )
                    }
                    className="px-2 py-1 rounded border w-full"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Call / WhatsApp / Email buttons */}
              <div className="flex flex-col sm:flex-row gap-3 px-6 py-4 flex-shrink-0">
                <a
                  href={`tel:${selectedBooking.phone}`}
                  className="flex-1 bg-gray-700 text-white rounded px-4 py-2 text-center hover:bg-gray-800 transition"
                >
                  Call
                </a>
                <a
                  href={`https://wa.me/${getSanitizedPhone(
                    selectedBooking.phone
                  )}?text=${encodeURIComponent(
                    getStatusMessage(
                      selectedBooking.status,
                      selectedBooking.name
                    )
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-700 text-white rounded px-4 py-2 text-center hover:bg-green-800 transition"
                >
                  WhatsApp
                </a>
                {selectedBooking.email && (
                  <a
                    href={`mailto:${
                      selectedBooking.email
                    }?subject=Day Tour Booking Update&body=${encodeURIComponent(
                      getStatusMessage(
                        selectedBooking.status,
                        selectedBooking.name
                      )
                    )}`}
                    className="flex-1 bg-blue-600 text-white rounded px-4 py-2 text-center hover:bg-blue-700 transition"
                  >
                    Email
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DayTourBookingAdmin;
