import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);

  const role = sessionStorage.getItem("role") || "admin"; // admin or superadmin
  const basePath = role === "superadmin" ? "/super-admin" : "/admin";

  const fetchBlogs = async () => {
    const res = await axiosInstance.get("/blog");
    setBlogs(res.data.blogs || []);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    await axiosInstance.delete(`/blog/${id}`);
    fetchBlogs();
  };

  return (
    <div>

      <main>
        <h2 className="text-4xl font-bold text-[#0d203a] mb-4 px-5 mt-4 ">
          Manage Blogs
        </h2>
        <div className="flex justify-end mb-8">
          <Link
           to={`${basePath}/blogs/new`}
            className="bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60]"
          >
            + Add Blog
          </Link>
        </div>

        <table className="w-full bg-white border border-[#1a354e] rounded shadow">
          <thead className="bg-[#0d203a] text-white">
            <tr>
              <th className="p-3 border border-[#1a354e]">Hero Image</th>
              <th className="p-3 border border-[#1a354e]">Title</th>
              <th className="p-3 border border-[#1a354e]">Subtitle</th>
              <th className="p-3 border border-[#1a354e]">Date</th>
              <th className="p-3 border border-[#1a354e] text-center w-36">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((b) => (
              <tr
                key={b._id}
                className="border-b border-[#1a354e] transition-colors"
              >
                <td className="p-3 border border-[#1a354e] text-center">
                  <img
                    src={b.heroImg}
                    alt="img"
                    className="h-12 w-12 object-cover rounded mx-auto"
                  />
                </td>
                <td className="p-3 border border-[#1a354e]">{b.title}</td>
                <td className="p-3 border border-[#1a354e]">{b.subtitle}</td>
                <td className="p-3 border border-[#1a354e]">
                  {new Date(b.date).toLocaleDateString()}
                </td>
                <td className="p-3 py-4 text-center flex justify-center items-center gap-2">
                  {/* View Button */}
                  <Link
                    to={`${basePath}/blogs/view/${b._id}`}
                    className="bg-[#6B8FB6] text-white px-4 py-1 rounded hover:bg-[#4b6f8f] text-sm transition"
                  >
                    View
                  </Link>

                  {/* Edit Button */}
                  <Link
                  to={`${basePath}/blogs/edit/${b._id}`}
                    className="bg-[#2E5B84] text-white px-4 py-1 rounded hover:bg-[#1E3A60] text-sm transition"
                  >
                    Edit
                  </Link>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm transition"
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
