import React, { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExperienceForm from "../../components/admin/ExperienceForm";

export default function AddExperience() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    subtitle: "",
    description: "",
    mainDesc: "",
    subDesc: "",
    heroImgFile: null,
    mainImgFile: null,
    galleryFiles: [],
    subExperienceFiles: [],
    subExperiences: [],
    tips: [],
    removeGallery: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

         // Determine role & base path
         const role = sessionStorage.getItem("role") || "admin";
         const basePath = role === "superadmin" ? "/super-admin" : "/admin";

    try {
      const data = new FormData();
      const jsonData = {
        slug: formData.slug,
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        mainDesc: formData.mainDesc,
        subDesc: formData.subDesc,
        subExperiences: formData.subExperiences,
        tips: formData.tips,
      };

      data.append("data", JSON.stringify(jsonData));

      if (formData.heroImgFile) data.append("heroImg", formData.heroImgFile);
      if (formData.mainImgFile) data.append("mainImg", formData.mainImgFile);

      (formData.galleryFiles || []).forEach((file) =>
        data.append("galleryFiles", file)
      );
      (formData.subExperienceFiles || []).forEach((file, i) =>
        data.append(`subExperienceImages${i}`, file)
      );

      const res = await axiosInstance.post(
        "/experience",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        toast.success("Experience added successfully!", {
          onClose: () => navigate(`${basePath}/experiences`),
        });
      } else {
        toast.error("Failed to add experience!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding experience!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
     
      <main>
        <ExperienceForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          submitLabel={isSaving ? "Saving..." : "Add Experience"}
          isSaving={isSaving}
        />
      </main>
    </div>
  );
}
