import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../lib/axios";

const BlogComments = () => {
  const [comments, setComments] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  // ---------------- FETCH ALL COMMENTS & BLOGS ----------------
  const fetchComments = async () => {
    try {
      const [commentsRes, blogsRes] = await Promise.all([
        axiosInstance.get("/blog-comments"),
        axiosInstance.get("/blog")
      ]);

      if (commentsRes.data.success) setComments(commentsRes.data.comments);
      setBlogs(blogsRes.data.blogs);
    } catch (err) {
      console.error("Error fetching comments or blogs:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // ---------------- DELETE COMMENT ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await axiosInstance.delete(`/blog-comments/${id}`);
      if (res.data.success) {
        toast.success("Comment deleted");
        fetchComments();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // Helper to get blog title from blogId
  const getBlogTitle = (blogId) => {
    const blog = blogs.find((b) => b._id === blogId);
    return blog ? blog.title : "Unknown Blog";
  };

  // ---------------- PAGINATION LOGIC ----------------
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = comments.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(comments.length / rowsPerPage);

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
          Manage Blog Comments
        </h2>

        <table className="w-full border border-[#1a354e] rounded mb-6">
          <thead className="bg-[#0d203a] text-white">
            <tr>
              <th className="p-3 border border-[#1a354e]">Name</th>
              <th className="p-3 border border-[#1a354e]">Email</th>
              <th className="p-3 border border-[#1a354e]">Rating</th>
              <th className="p-3 border border-[#1a354e]">Message</th>
              <th className="p-3 border border-[#1a354e]">Blog Title</th>
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
              currentRows.map((c) => (
                <tr key={c._id} className="border-b border-[#2E5B84] hover:bg-blue-50">
                  <td className="p-3 border border-[#2E5B84]">{c.name}</td>
                  <td className="p-3 border border-[#2E5B84]">{c.email}</td>
                  <td className="p-3 border border-[#2E5B84]">{c.rating || "-"}</td>
                  <td className="p-3 border border-[#2E5B84]">{c.message}</td>
                  <td className="p-3 border border-[#2E5B84]">{getBlogTitle(c.blogId)}</td>
                  <td className="p-3 border border-[#2E5B84]">{new Date(c.createdAt).toLocaleString()}</td>
                  <td className="p-3 border border-[#2E5B84]">
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDelete(c._id)}
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

export default BlogComments;
