import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaWhatsapp, FaEnvelope, FaEye, FaTrash } from "react-icons/fa";

const QuickTaxiBookingAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const rowsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // ---------------- FETCH BOOKINGS ----------------
  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/quick-taxi/bookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (res.data.success) setBookings(res.data.bookings);
      else toast.error("Failed to fetch bookings");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ---------------- UPDATE STATUS ----------------
  const handleStatusChange = async (id, newStatus) => {
    const toastId = toast.info("Updating status...", { autoClose: false });
    try {
      const res = await axiosInstance.patch(
        `/quick-taxi/bookings/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      if (res.data.success) {
        toast.update(toastId, {
          render: "Status updated!",
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
      const res = await axiosInstance.delete(`/quick-taxi/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (res.data.success) {
        toast.success("Booking deleted");
        fetchBookings();
        setSelectedBooking(null);
      } else toast.error("Delete failed");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed. Check console.");
    }
  };

  // ---------------- MESSAGE GENERATOR ----------------
  const getStatusMessage = (status, firstName) => {
    switch (status) {
      case "Confirmed":
        return `Hello ${firstName}, your taxi booking has been confirmed! 🎉`;
      case "Cancelled":
        return `Hello ${firstName}, we are sorry to inform you that your taxi booking has been cancelled. 😔`;
      case "Completed":
        return `Hello ${firstName}, your taxi booking has been completed. Thank you! 😊`;
      case "Pending":
      default:
        return `Hello ${firstName}, your taxi booking is pending. We'll update you soon.`;
    }
  };

  const getSanitizedPhone = (phone) => (phone ? phone.replace(/\D/g, "") : "");

  // ---------------- PAGINATION ----------------
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const filteredBookings = bookings.filter((b) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      b.firstName?.toLowerCase().includes(search) ||
      b.lastName?.toLowerCase().includes(search) ||
      b.phone?.includes(search) ||
      b.pickupLocation?.toLowerCase().includes(search) ||
      b.dropLocation?.toLowerCase().includes(search) ||
      b.taxiId?.name?.toLowerCase().includes(search);

    const matchesStatus = statusFilter === "All" || b.status === statusFilter;

    const matchesDate =
      !dateFilter || b.pickupDate?.split("T")[0] === dateFilter;

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
          Manage Quick Taxi Bookings
        </h2>

        <div className="bg-[#0d203a] border border-[#1a354e] rounded mb-6 p-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <input
              type="text"
              placeholder="Search name, phone, pickup, vehicle..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded border border-[#1a354e] text-sm w-full sm:w-64
      focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Status */}
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
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Pickup Date */}
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

            {/* Clear */}
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

            {/* Count */}
            <span className="ml-auto text-sm text-gray-300">
              Showing <b>{filteredBookings.length}</b> bookings
            </span>
          </div>
        </div>

        {/* ---------------- TABLE ---------------- */}
        <div className="overflow-x-auto max-w-full">
          <table className="w-full table-fixed border border-[#1a354e] rounded mb-6 text-center">
            <thead className="bg-[#0d203a] text-white">
              <tr>
                <th className="p-3 border border-[#1a354e] text-sm">Name</th>
                <th className="p-3 border border-[#1a354e] text-sm">Phone</th>
                <th className="p-3 border border-[#1a354e] text-sm">Vehicle</th>
                <th className="p-3 border border-[#1a354e] text-sm">Pickup</th>
                <th className="p-3 border border-[#1a354e] text-sm">Drop</th>
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
                  const message = getStatusMessage(b.status, b.firstName);
                  return (
                    <tr
                      key={b._id}
                      className="border-b border-[#2E5B84] hover:bg-blue-50"
                    >
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {b.firstName} {b.lastName}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {b.phone}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {b.taxiId ? b.taxiId.name : "—"}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {b.pickupLocation}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {b.dropLocation}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {b.pickupDate || "—"}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        <select
                          value={b.status || "Pending"}
                          onChange={(e) =>
                            handleStatusChange(b._id, e.target.value)
                          }
                          className={`px-2 py-1 rounded w-full max-w-[140px] ${
                            b.status === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : b.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : b.status === "Completed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Completed">Completed</option>
                        </select>

                        {/* WhatsApp & Email buttons */}
                        <div className="flex gap-1 mt-1 justify-center">
                          <a
                            href={`https://wa.me/${getSanitizedPhone(
                              b.phone
                            )}?text=${encodeURIComponent(message)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-700 text-white px-2 py-2 rounded text-xs"
                          >
                            <FaWhatsapp />
                          </a>
                          {b.email && (
                            <a
                              href={`mailto:${
                                b.email
                              }?subject=Taxi Booking Update&body=${encodeURIComponent(
                                message
                              )}`}
                              className="bg-gray-700 text-white px-2 py-1 rounded text-xs"
                            >
                              <FaEnvelope />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Delete & View Details */}
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

        {/* ---------------- PAGINATION ---------------- */}
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
                  Quick Taxi Booking Details
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
                  {/* Name */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Name:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.firstName} {selectedBooking.lastName}
                  </p>

                  {/* Phone */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Phone:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.phone}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Country:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.country}
                  </p>

                  {/* Vehicle */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Vehicle:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.taxiId ? selectedBooking.taxiId.name : "—"}
                  </p>

                  {/* Service Type */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Service Type:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.serviceType}
                  </p>

                  {/* Pickup */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Pickup Location:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.pickupLocation}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Pickup Date:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.pickupDate}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Pickup Time:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedBooking.pickupTime}
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

                  {/* Drop (optional) */}
                  {selectedBooking.dropLocation && (
                    <>
                      <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                        Drop Location:
                      </p>
                      <p className="p-2 border-b border-blue-950">
                        {selectedBooking.dropLocation}
                      </p>
                      <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                        Drop Date:
                      </p>
                      <p className="p-2 border-b border-blue-950">
                        {selectedBooking.dropDate || "Not Specified"}
                      </p>
                    </>
                  )}

                  {/* Message */}
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
                      handleStatusChange(selectedBooking._id, e.target.value)
                    }
                    className="px-2 py-1 rounded border w-full"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
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
                      selectedBooking.firstName
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
                    }?subject=Quick Taxi Booking Update&body=${encodeURIComponent(
                      getStatusMessage(
                        selectedBooking.status,
                        selectedBooking.firstName
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

export default QuickTaxiBookingAdmin;
