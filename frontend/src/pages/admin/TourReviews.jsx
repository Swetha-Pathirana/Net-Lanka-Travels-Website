import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TourReviewsAdmin = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  // ---------------- FETCH ALL REVIEWS ----------------
  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get("/tour-reviews");
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ---------------- DELETE REVIEW ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await axiosInstance.delete(`/tour-reviews/${id}`);
      if (res.data.success) {
        toast.success("Review deleted successfully");
        fetchReviews();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // ---------------- PAGINATION ----------------
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = reviews.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(reviews.length / rowsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* MAIN CONTENT */}
      <main>
        <h2 className="text-4xl font-bold text-[#0d203a] mb-6 px-5 mt-4">
          Manage Tour Reviews
        </h2>

        <table className="w-full border border-[#1a354e] rounded mb-6">
          <thead className="bg-[#0d203a] text-white">
            <tr>
              <th className="p-3 border border-[#1a354e]">Name</th>
              <th className="p-3 border border-[#1a354e]">Email</th>
              <th className="p-3 border border-[#1a354e]">Rating</th>
              <th className="p-3 border border-[#1a354e]">Message</th>
              <th className="p-3 border border-[#1a354e]">Date</th>
              <th className="p-3 border border-[#1a354e]">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  No reviews found
                </td>
              </tr>
            ) : (
              currentRows.map((rev) => (
                <tr key={rev._id} className="border-b border-[#2E5B84] hover:bg-blue-50">
                  <td className="p-3 border border-[#2E5B84]">{rev.name}</td>
                  <td className="p-3 border border-[#2E5B84]">{rev.email}</td>
                  <td className="p-3 border border-[#2E5B84]">{rev.rating}</td>
                  <td className="p-3 border border-[#2E5B84]">{rev.message}</td>
                  <td className="p-3 border border-[#2E5B84]">
                    {new Date(rev.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 border border-[#2E5B84]">
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDelete(rev._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

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
      </main>
    </div>
  );
};

export default TourReviewsAdmin;
