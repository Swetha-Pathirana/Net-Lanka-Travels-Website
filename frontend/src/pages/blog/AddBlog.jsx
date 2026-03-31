import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BlogForm from "../../components/admin/BlogForm";
import { axiosInstance } from "../../lib/axios";

export default function AddBlog() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    contentParagraphs: [],
    heroImgFile: null,
    heroImgPreview: "",
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

            // Determine role & base path
            const role = sessionStorage.getItem("role") || "admin";
            const basePath = role === "superadmin" ? "/super-admin" : "/admin";

    const data = new FormData();
    data.append("slug", formData.slug);
data.append("title", formData.title);
data.append("subtitle", formData.subtitle);
data.append("description", formData.description);
data.append("content", (formData.contentParagraphs || []).join("\n\n"));


if (formData.heroImgFile)
  data.append("heroImg", formData.heroImgFile);

if (formData.galleryImgFiles) {
  formData.galleryImgFiles.forEach((img) =>
    data.append("galleryImgs", img)
  );
}

    try {
      await axiosInstance.post("/blog", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Blog added successfully!", {
        onClose: () => navigate(`${basePath}/blogs`),
        autoClose: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.error("Error adding blog!");
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
          submitLabel={isSaving ? "Saving..." : "Add Blog"}
        />
      </main>
    </div>
  );
}
