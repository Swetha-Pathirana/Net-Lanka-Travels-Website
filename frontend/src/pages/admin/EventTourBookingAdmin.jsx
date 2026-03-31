import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaWhatsapp, FaEnvelope, FaEye, FaTrash } from "react-icons/fa";

const EventTourBookingAdmin = () => {
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
      const res = await axiosInstance.get("/event-tour-booking");

      if (res.data.success) {
        setBookings(
          res.data.bookings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((b) => ({ ...b }))
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch event bookings");
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
  const handleStatusChange = async (id, newStatus) => {
    const toastId = toast.info("Updating status...", { autoClose: false });

    try {
      const res = await axiosInstance.patch(`/event-tour-booking/${id}`, {
        status: newStatus,
      });

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
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;

    try {
      const res = await axiosInstance.delete(`/event-tour-booking/${id}`);

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
        return `Hello ${name}, your event booking has been approved! 🎉`;
      case "Cancelled":
        return `Hello ${name}, your event booking has been cancelled. 😔`;
      case "Completed":
        return `Hello ${name}, your event booking has been completed. Thank you! 😊`;
      case "Pending":
      default:
        return `Hello ${name}, your event booking is pending. We'll update you soon.`;
    }
  };

  const getSanitizedPhone = (phone) => (phone ? phone.replace(/\D/g, "") : "");

  // ---------------- PAGINATION ----------------
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const filteredBookings = bookings.filter((b) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      b.name?.toLowerCase().includes(search) ||
      b.phone?.includes(search) ||
      b.email?.toLowerCase().includes(search) ||
      b.eventId?.title?.toLowerCase().includes(search);

    const matchesStatus = statusFilter === "All" || b.status === statusFilter;

    const matchesDate =
      !dateFilter || b.startDate?.split("T")[0] === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const currentRows = filteredBookings.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* MAIN CONTENT */}
      <main>
        <h2 className="text-4xl font-bold text-[#0d203a] mb-6 px-5 mt-4">
          Manage Event Bookings
        </h2>

        <div className="bg-[#0d203a] border border-[#1a354e] rounded mb-6 p-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by name, phone, email, event..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded border border-[#1a354e] text-sm w-full sm:w-64
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Status Filter */}
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
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Date Filter */}
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

            {/* COUNT */}
            <span className="ml-auto text-sm text-gray-300">
              Showing <b>{filteredBookings.length}</b> bookings
            </span>
          </div>
        </div>

        <div className="overflow-x-auto max-w-full">
          <table className="w-full table-fixed border border-[#1a354e] rounded mb-6 text-center">
            <thead className="bg-[#0d203a] text-white">
              <tr>
                <th className="p-3 border border-[#1a354e] text-sm">Event</th>
                <th className="p-3 border border-[#1a354e] text-sm">Name</th>
                <th className="p-3 border border-[#1a354e] text-sm">Phone</th>
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
                  <td colSpan={7} className="text-center p-4">
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
                        {b.eventId?.title || "—"}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {b.name}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {b.phone}
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

                      {/* Status + WhatsApp/Email */}
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        <div className="flex flex-col items-center">
                          <select
                            value={b.status || "Pending"}
                            onChange={(e) =>
                              handleStatusChange(b._id, e.target.value)
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

                          <div className="flex gap-1 mt-2">
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
                                }?subject=Event Booking Update&body=${encodeURIComponent(
                                  message
                                )}`}
                                className="bg-gray-700 text-white px-2 py-2 rounded text-xs flex items-center justify-center"
                              >
                                <FaEnvelope />
                              </a>
                            )}
                          </div>
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
                          onClick={() => handleDelete(b._id)}
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
          <div className="flex justify-center gap-3 mt-2">
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
                  Event Tour Booking Details
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
                  {/* Event */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Event:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.eventId?.title || "—"}
                  </p>

                  {/* Location */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Location:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.eventId?.location || "—"}
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

                  {/* Name */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Name:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.name}
                  </p>

                  {/* Email */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Email:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.email || "—"}
                  </p>

                  {/* Phone */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Phone:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.phone}
                  </p>

                  {/* Adults */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Adults:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.adults || 0}
                  </p>

                  {/* Children */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Children:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.children || 0}
                  </p>

                  {/* Date */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Date:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.startDate
                      ? new Date(selectedBooking.startDate)
                          .toISOString()
                          .split("T")[0]
                      : "—"}
                  </p>

                  {/* Time */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Time:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.startTime || "—"}
                  </p>

                  {/* Message (if exists) */}
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
              </div>

              {/* Footer / Actions */}
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
                    }?subject=Event Booking Update&body=${encodeURIComponent(
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

export default EventTourBookingAdmin;
