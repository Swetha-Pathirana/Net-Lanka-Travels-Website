import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BlogForm from "../../components/admin/BlogForm";
import { axiosInstance } from "../../lib/axios";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    contentParagraphs: [],
    heroImgFile: null,
    heroImgPreview: "",
    galleryImgFiles: [],
    galleryImgPreviews: [],
  });

  const [isSaving, setIsSaving] = useState(false);

  // -------------------- Fetch blog --------------------
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axiosInstance.get(`/blog/${id}`);
        const blog = res.data;

        setFormData({
          slug: blog.slug || "",
          title: blog.title || "",
          subtitle: blog.subtitle || "",
          description: blog.description || "",
          contentParagraphs: blog.content
            ? blog.content.split("\n\n")
            : [],
          heroImgPreview: blog.heroImg || "",
          heroImgFile: null,
          galleryImgPreviews: blog.galleryImgs || [],
          galleryImgFiles: [],
        });
      } catch (err) {
        console.error(err);
        toast.error("Error fetching blog!");
      }
    };

    fetchBlog();
  }, [id]);

  // -------------------- Submit update --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

        // Determine role and base path
        const role = sessionStorage.getItem("role") || "admin";
        const basePath = role === "superadmin" ? "/super-admin" : "/admin";

    const data = new FormData();
    data.append("slug", formData.slug);
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("description", formData.description);
    data.append(
      "content",
      (formData.contentParagraphs || []).join("\n\n")
    );

    if (formData.heroImgFile) {
      data.append("heroImg", formData.heroImgFile);
    }

    if (formData.galleryImgFiles?.length > 0) {
      formData.galleryImgFiles.forEach((img) =>
        data.append("galleryImgs", img)
      );
    }

    try {
      await axiosInstance.put(`/blog/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Blog updated successfully!", {
        onClose: () => navigate(`${basePath}/blogs`),
        autoClose: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.error("Error updating blog!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      <main>
        <BlogForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          submitLabel={isSaving ? "Saving..." : "Update Blog"}
        />
      </main>
    </div>
  );
}
