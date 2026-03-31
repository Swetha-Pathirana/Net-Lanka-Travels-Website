import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

export default function ManageTripadvisorReviews() {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 5,
    message: "",
  });

  // ---------------- FETCH REVIEWS ----------------
  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get("/tripadvisor-reviews");
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reviews");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ---------------- PAGINATION LOGIC ----------------
  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ---------------- ADD REVIEW ----------------
  const submitReview = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/tripadvisor-reviews", form);
      toast.success("TripAdvisor review added");

      setForm({
        name: "",
        email: "",
        rating: 5,
        message: "",
      });

      setCurrentPage(1);
      fetchReviews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add review");
    }
  };

  // ---------------- DELETE REVIEW ----------------
  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await axiosInstance.delete(`/tripadvisor-reviews/${id}`);
      toast.success("Review deleted");

      setCurrentPage(1);
      fetchReviews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review");
    }
  };

  return (
    <div>
      {/* PAGE TITLE */}
      <h2 className="text-4xl font-bold text-[#0d203a] mb-6 px-5 mt-4">
        Manage TripAdvisor Reviews
      </h2>

      {/* ================= ADD REVIEW FORM ================= */}
      <form
        onSubmit={submitReview}
        className="bg-white border border-[#2E5B84] p-10 rounded-2xl shadow-xl w-full max-w-3xl mx-auto mb-16"
      >
        <h3 className="text-2xl font-bold text-[#0d203a] mb-6 text-center">
          Add New Review
        </h3>

        <input
          type="text"
          placeholder="Customer Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-3 w-full rounded mb-4"
          required
        />

        <input
          type="email"
          placeholder="Customer Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-3 w-full rounded mb-4"
          required
        />

        <select
          value={form.rating}
          onChange={(e) =>
            setForm({ ...form, rating: Number(e.target.value) })
          }
          className="border p-3 w-full rounded mb-4"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 && "s"}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Review Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="border p-3 w-full rounded mb-4"
          rows={4}
          required
        />

        <button
          type="submit"
          className="w-full bg-[#0d203a] text-white py-3 rounded-xl hover:bg-[#1E3A60]"
        >
          Add Review
        </button>
      </form>

      {/* ================= REVIEW TABLE ================= */}
      <div className="px-5">
        <table className="w-full bg-white border border-[#1a354e] rounded shadow">
          <thead className="bg-[#0d203a] text-white">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Rating</th>
              <th className="p-3 border">Message</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border w-28 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedReviews.map((r) => (
              <tr key={r._id} className="border-b">
                <td className="p-3 border">{r.name}</td>
                <td className="p-3 border">{r.email}</td>

                <td className="p-3 border">
                  <div className="flex gap-1 text-green-600">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <FaStar
                        key={n}
                        className={n <= r.rating ? "" : "text-gray-300"}
                      />
                    ))}
                  </div>
                </td>

                <td className="p-3 border max-w-sm truncate">
                  {r.message}
                </td>

                <td className="p-3 border">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3 border text-center">
                  <button
                    onClick={() => deleteReview(r._id)}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {paginatedReviews.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No TripAdvisor reviews added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() =>
                setCurrentPage((p) => Math.max(p - 1, 1))
              }
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#2E5B84] text-white hover:bg-[#1E3A60]"
              }`}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1
                    ? "bg-[#0d203a] text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(p + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#2E5B84] text-white hover:bg-[#1E3A60]"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
