import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaWhatsapp, FaEnvelope, FaEye, FaTrash } from "react-icons/fa";

const CustomizeTourBookingAdmin = () => {
  const [inquiries, setInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const rowsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await axiosInstance.get("/tailor-made-tours/inquiries");
      setInquiries(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch inquiries");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/tailor-made-tours/inquiries/${id}`, {
        status: newStatus,
      });

      // Update inquiries array in state
      setInquiries((prev) =>
        prev.map((inq) =>
          inq._id === id ? { ...inq, status: newStatus } : inq
        )
      );

      // Update modal if it's open for the same inquiry
      if (selectedInquiry && selectedInquiry._id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }

      toast.success("Status updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?"))
      return;
    try {
      await axiosInstance.delete(`/tailor-made-tours/inquiries/${id}`);
      toast.success("Inquiry deleted!");
      fetchInquiries();
      setSelectedInquiry(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete inquiry.");
    }
  };

  const getSanitizedPhone = (phone) => (phone ? phone.replace(/\D/g, "") : "");

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.phone?.includes(searchTerm) ||
      inq.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.pickupLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.dropLocation?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || inq.status === statusFilter;

    const matchesDate =
      !dateFilter ||
      (inq.startDate &&
        new Date(inq.startDate).toISOString().split("T")[0] === dateFilter);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = filteredInquiries.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredInquiries.length / rowsPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const getStatusMessage = (status, fullName) => {
    switch (status) {
      case "Confirmed":
        return `Hello ${fullName}, your tour booking has been approved! 🎉`;
      case "Cancelled":
        return `Hello ${fullName}, your tour booking has been cancelled 😔`;
      case "Completed":
        return `Hello ${fullName}, your tour booking is completed. Thank you! 😊`;
      case "Pending":
      default:
        return `Hello ${fullName}, your tour booking is pending. We'll update you soon.`;
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      <main>
        <h2 className="text-4xl font-bold text-[#0d203a] mb-6 px-5 mt-4">
          Manage Customize Tour Bookings
        </h2>

        <div className="bg-[#0d203a] border border-[#1a354e] rounded mb-6 p-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search name / phone / email / location"
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
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
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

            {/* COUNT */}
            <span className="ml-auto text-sm text-gray-300">
              Showing <b>{filteredInquiries.length}</b> bookings
            </span>
          </div>
        </div>

        <div className="overflow-x-auto max-w-full">
          <table className="w-full table-fixed border border-[#1a354e] rounded mb-6 text-center">
            <thead className="bg-[#0d203a] text-white">
              <tr>
                <th className="p-3 border border-[#1a354e] text-sm">Name</th>
                <th className="p-3 border border-[#1a354e] text-sm">Phone</th>
                <th className="p-3 border border-[#1a354e] text-sm">
                  Location
                </th>
                <th className="p-3 border border-[#1a354e] text-sm">Members</th>
                <th className="p-3 border border-[#1a354e] text-sm">Date</th>
                <th className="p-3 border border-[#1a354e] text-sm">Vehicle</th>
                <th className="p-3 border border-[#1a354e] text-sm w-[160px]">
                  Accommodation
                </th>

                <th className="p-3 border border-[#1a354e] text-sm">Budget</th>
                <th className="p-3 border border-[#1a354e] text-sm">Status</th>
                <th className="p-3 border border-[#1a354e] text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                currentRows.map((inq) => {
                  const message = getStatusMessage(inq.status, inq.fullName);
                  return (
                    <tr
                      key={inq._id}
                      className="border-b border-[#2E5B84] hover:bg-blue-50"
                    >
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {inq.fullName}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {inq.phone}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {inq.pickupLocation || "Not Specified"}{" "}
                        <span className="text-red-600 font-semibold">🡆</span>{" "}
                        {inq.dropLocation || "Not Specified"}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {Number(inq.adults || 0) + Number(inq.children || 0)}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {inq.startDate
                          ? new Date(inq.startDate).toLocaleDateString("en-GB")
                          : "Not Specified"}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {inq.vehicle}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {inq.accommodation === "with"
                          ? `With (${
                              inq.hotelCategory?.replace("_", " ") || "Hotel"
                            })`
                          : "Without"}
                      </td>

                      <td className="p-3 border border-[#2E5B84] text-sm">
                        {inq.currency && inq.budget
                          ? `${inq.currency} ${Number(
                              inq.budget
                            ).toLocaleString()}`
                          : "Not Specified"}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-sm">
                        <select
                          value={inq.status || "Pending"}
                          onChange={(e) =>
                            handleStatusChange(inq._id, e.target.value)
                          }
                          className={`px-2 py-1 rounded w-full max-w-[140px] ${
                            inq.status === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : inq.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : inq.status === "Completed"
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
                              inq.phone
                            )}?text=${encodeURIComponent(message)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-700 text-white px-2 py-2 rounded text-xs"
                          >
                            <FaWhatsapp />
                          </a>

                          {inq.email && (
                            <a
                              href={`mailto:${
                                inq.email
                              }?subject=Taxi Booking Update&body=${encodeURIComponent(
                                message
                              )}`}
                              className="bg-gray-700 text-white px-2 py-2 rounded text-xs"
                            >
                              <FaEnvelope />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="flex justify-center items-center gap-2 mt-3 py-4">
                        <button
                          className="bg-[#2E5B84] text-white p-2 rounded hover:bg-[#1E3A60] transition"
                          onClick={() => setSelectedInquiry(inq)}
                          title="View"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                          onClick={() => deleteInquiry(inq._id)}
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
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* MODAL */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center bg-[#0d203a] px-6 py-3 flex-shrink-0">
                <h3 className="text-xl font-bold text-white">
                  Customize Tour Booking Details
                </h3>
                <button
                  className="text-white text-xl font-bold hover:text-gray-300 transition"
                  onClick={() => setSelectedInquiry(null)}
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
                    {selectedInquiry.title} {selectedInquiry.fullName}
                  </p>

                  {/* Country*/}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Country:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.country || "Not Specified"}
                  </p>

                  {/* Email */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Email:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.email || "Not Specified"}
                  </p>

                  {/* Phone */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Phone:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.phone}
                  </p>

                  {/* Pickup */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Pickup Location:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.pickupLocation || "Not Specified"}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Pickup Date:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.startDate
                      ? new Date(selectedInquiry.startDate).toLocaleDateString()
                      : "Not Specified"}
                  </p>

                  {/* Drop */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Drop Location:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.dropLocation || "Not Specified"}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Drop Date:
                  </p>

                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.endDate
                      ? new Date(selectedInquiry.endDate).toLocaleDateString()
                      : "Not Specified"}
                  </p>

                  {/* Vehicle */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Vehicle:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.vehicle || "Not Specified"}
                  </p>

                  {/* Accommodation */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Accommodation:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.accommodation === "with"
                      ? `With accommodation (${selectedInquiry.hotelCategory?.replace(
                          "_",
                          " "
                        )})`
                      : "Without accommodation"}
                  </p>

                  {/* Adults */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Adults:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.adults || 0}
                  </p>

                  {/* Children */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Children:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.children || 0}
                  </p>

                  {/* Budget */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Budget:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.currency && selectedInquiry.budget
                      ? `${selectedInquiry.currency} ${selectedInquiry.budget}`
                      : "Not Specified"}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Entrance Fee:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.entranceFee || "Not Selected"}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Destinations:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.selectedDestinations &&
                    selectedInquiry.selectedDestinations.length > 0
                      ? selectedInquiry.selectedDestinations.join(", ")
                      : "Not Specified"}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Travel Style:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.travelStyle || "Not Selected"}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Travel Purpose:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.purpose || "Not Selected"}
                  </p>

                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Experiences:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.selectedExperiences?.length
                      ? selectedInquiry.selectedExperiences.join(", ")
                      : "Not Selected"}
                  </p>

                  {/* Notes */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    Note:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.notes || "—"}
                  </p>

                  {/* How Did You Hear About Us */}
                  <p className="p-2 border-b border-r border-blue-950 font-semibold bg-gray-50">
                    How Did You Hear About Us:
                  </p>
                  <p className="p-2 border-b border-blue-950">
                    {selectedInquiry.hearAboutUs || "Not Selected"}
                  </p>
                </div>

                {/* Status selector */}
                <div className="mt-2">
                  <label className="block font-semibold mb-1">Status:</label>
                  <select
                    value={selectedInquiry.status || "Pending"}
                    onChange={(e) =>
                      handleStatusChange(selectedInquiry._id, e.target.value)
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
                  href={`tel:${selectedInquiry.phone}`}
                  className="flex-1 bg-gray-700 text-white rounded px-4 py-2 text-center hover:bg-gray-800 transition"
                >
                  Call
                </a>
                <a
                  href={`https://wa.me/${getSanitizedPhone(
                    selectedInquiry.phone
                  )}?text=${encodeURIComponent(
                    getStatusMessage(
                      selectedInquiry.status,
                      selectedInquiry.fullName
                    )
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-700 text-white rounded px-4 py-2 text-center hover:bg-green-800 transition"
                >
                  WhatsApp
                </a>
                {selectedInquiry.email && (
                  <a
                    href={`mailto:${
                      selectedInquiry.email
                    }?subject=Customize Tour Booking Update&body=${encodeURIComponent(
                      getStatusMessage(
                        selectedInquiry.status,
                        selectedInquiry.fullName
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

export default CustomizeTourBookingAdmin;
