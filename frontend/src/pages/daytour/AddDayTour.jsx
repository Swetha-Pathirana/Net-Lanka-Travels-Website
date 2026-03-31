import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DayTourForm from "../../components/admin/DayTourForm";

export default function AddDayTour() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    heroImageFile: null,
    heroImagePreview: "",
    heroTitle: "",
    heroSubtitle: "",
    aboutParagraphs: ["", ""],
    historyTitle: "",
    historyLeftList: [""],
    historyRightList: [""],
    gallerySlides: [],
    highlights: [""],
    duration: "",
    includes: [""],
    startLocation: "",
  });
  

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

        // Determine role & base path
        const role = sessionStorage.getItem("role") || "admin";
        const basePath = role === "superadmin" ? "/super-admin" : "/admin";

    try {
      // Upload DayTour
      const tourData = new FormData();
      tourData.append("title", formData.title);
      tourData.append("location", formData.location);
      tourData.append("desc", formData.desc);
      if (formData.imgFile) tourData.append("img", formData.imgFile);

      const tourRes = await axiosInstance.post(
        "/day-tours",
        tourData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const tourId = tourRes.data.tour._id;

      // Upload DayTourDetail
      const detailData = new FormData();
      detailData.append("tourId", tourId);
      detailData.append("heroTitle", formData.heroTitle);
      detailData.append("heroSubtitle", formData.heroSubtitle);
      if (formData.heroImageFile) detailData.append("heroImage", formData.heroImageFile);
      detailData.append("aboutParagraphs", JSON.stringify(formData.aboutParagraphs));
      detailData.append("historyTitle", formData.historyTitle);
      detailData.append("historyLeftList", JSON.stringify(formData.historyLeftList));
      detailData.append("historyRightList", JSON.stringify(formData.historyRightList));
      detailData.append("highlights", JSON.stringify(formData.highlights));
      detailData.append("duration", formData.duration);
      detailData.append("includes", JSON.stringify(formData.includes));
      detailData.append("startLocation", formData.startLocation);
      
      const gallerySlidesPayload = formData.gallerySlides.map((slide) => ({
        title: slide.title,
        desc: slide.desc,
      }));
      detailData.append("gallerySlides", JSON.stringify(gallerySlidesPayload));

      formData.gallerySlides.forEach((slide, idx) => {
        if (slide.imageFile) {
          detailData.append(`galleryImage_${idx}`, slide.imageFile);
        }
      });

      await axiosInstance.post(
        "/day-tours/detail",
        detailData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Day Tour added successfully!", {
        onClose: () => navigate(`${basePath}/day-tours`),
        autoClose: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.error("Error adding day tour!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      <main>
        <DayTourForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          submitLabel={isSaving ? "Saving..." : "Add Day Tour"}
        />
      </main>
    </div>
  );
}
