import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useParams, Link } from "react-router-dom";

export default function BlogView() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = sessionStorage.getItem("role") || "admin"; // admin or superadmin
  const basePath = role === "superadmin" ? "/super-admin" : "/admin";

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axiosInstance.get(`/blog/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
        alert("Error fetching blog data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading)
    return <div className="text-center py-20">Loading...</div>;

  if (!blog)
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold">Blog Not Found</h2>
      </div>
    );

  const paragraphs = blog.content
    ? blog.content.split(/\r?\n\r?\n/)
    : [];

  return (
    <div>

      {/* MAIN CONTENT */}
      <main>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {blog.title}
          </h1>
          <div className="flex gap-2">
            <Link
            to={`${basePath}/blogs/edit/${blog._id}`}
              className="bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60] transition"
            >
              Edit
            </Link>
            <Link
              to={`${basePath}/blogs`}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              Back
            </Link>
          </div>
        </div>

        {/* Subtitle & Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {blog.subtitle}
          </h2>
          <p className="text-gray-700">{blog.description}</p>
        </div>

        {/* Metadata */}
        <div className="flex flex-col md:flex-row gap-4 text-gray-500 mb-6">
          <div>
            <strong>Created:</strong>{" "}
            {new Date(blog.createdAt).toLocaleDateString()}
          </div>
          <div>
            <strong>Slug:</strong> {blog.slug}
          </div>
        </div>

        {/* Hero Image */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">
            Hero Image
          </h3>
          <div className="w-full md:w-96 h-64 md:h-72 overflow-hidden rounded-xl shadow-lg">
            <img
              src={blog.heroImg}
              alt={blog.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Gallery Images */}
        {blog.galleryImgs?.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">
              Gallery Images
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {blog.galleryImgs.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Gallery ${i + 1}`}
                  className="rounded-lg h-40 w-full object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {/* Blog Content */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">
            Content
          </h3>
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-gray-700 mb-4 leading-relaxed"
              >
                {p}
              </p>
            ))
          ) : (
            <p className="text-gray-500">
              No content available.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
