import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TailorComments = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  // ---------------- FETCH ALL TESTIMONIALS ----------------
  const fetchTestimonials = async () => {
    try {
      const res = await axiosInstance.get("/testimonials");
      if (res.data.success) {
        setTestimonials(res.data.testimonials);
      }
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // ---------------- DELETE TESTIMONIAL ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const res = await axiosInstance.delete(`/testimonials/${id}`);
      if (res.data.success) {
        toast.success("Testimonial deleted");
        fetchTestimonials();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // ---------------- PAGINATION LOGIC ----------------
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = testimonials.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(testimonials.length / rowsPerPage);

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
          Manage Tailor-Made Tour Comments
        </h2>

        <table className="w-full border border-[#1a354e] rounded mb-6">
          <thead className="bg-[#0d203a] text-white">
            <tr>
              <th className="p-3 border border-[#1a354e]">Title</th>
              <th className="p-3 border border-[#1a354e]">Name</th>
              <th className="p-3 border border-[#1a354e]">Email</th>
              <th className="p-3 border border-[#1a354e]">Rating</th>
              <th className="p-3 border border-[#1a354e]">Comment</th>
              <th className="p-3 border border-[#1a354e]">Date</th>
              <th className="p-3 border border-[#1a354e]">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  No comments found
                </td>
              </tr>
            ) : (
              currentRows.map((t) => (
                <tr key={t._id} className="border-b border-[#2E5B84] hover:bg-blue-50">
                  <td className="p-3 border border-[#2E5B84]">{t.title}</td>
                  <td className="p-3 border border-[#2E5B84]">{t.name}</td>
                  <td className="p-3 border border-[#2E5B84]">{t.email}</td>
                  <td className="p-3 border border-[#2E5B84]">{t.rating}</td>
                  <td className="p-3 border border-[#2E5B84]">{t.text}</td>
                  <td className="p-3 border border-[#2E5B84]">
                    {new Date(t.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 border border-[#2E5B84]">
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDelete(t._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION CONTROLS */}
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

export default TailorComments;
