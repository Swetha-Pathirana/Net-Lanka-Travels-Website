import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DayTourForm from "../../components/admin/DayTourForm";

export default function EditDayTour() {
  const { id } = useParams();
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

  useEffect(() => {
    async function fetchTour() {
      try {
        const res = await axiosInstance.get(`/day-tours/${id}`);
        if (res.data.success) {
          const { tour, details } = res.data;
  
          setFormData({
            title: tour.title || "",
            location: tour.location || "",
            desc: tour.desc || "",
            imgFile: null,
            imgPreview: tour.img || "",
            heroTitle: details?.heroTitle || "",
            heroSubtitle: details?.heroSubtitle || "",
            heroImageFile: null,
            heroImagePreview: details?.heroImage || "",
            aboutParagraphs: Array.isArray(details?.aboutParagraphs) ? details.aboutParagraphs : ["", ""],
            historyTitle: details?.historyTitle || "",
            historyLeftList: Array.isArray(details?.historyLeftList) ? details.historyLeftList : [""],
            historyRightList: Array.isArray(details?.historyRightList) ? details.historyRightList : [""],
            highlights: Array.isArray(details?.highlights) ? details.highlights : [""],
            includes: Array.isArray(details?.includes) ? details.includes : [""],
            duration: details?.duration || "",
            startLocation: details?.startLocation || "",
            gallerySlides: Array.isArray(details?.gallerySlides) 
              ? details.gallerySlides.map(s => ({
                  title: s.title || "",
                  desc: s.desc || "",
                  imageFile: null,
                  imagePreview: s.image || "",
                }))
              : [],
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching tour data!");
      }
    }
    fetchTour();
  }, [id]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
  
    // Determine role and base path
    const role = sessionStorage.getItem("role") || "admin";
    const basePath = role === "superadmin" ? "/super-admin" : "/admin";
  
    try {
      // Update DayTour
      const tourData = new FormData();
      tourData.append("title", formData.title);
      tourData.append("location", formData.location);
      tourData.append("desc", formData.desc);
      if (formData.imgFile) tourData.append("img", formData.imgFile);
  
      await axiosInstance.put(`/day-tours/${id}`, tourData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      // Update DayTourDetail
      const detailData = new FormData();
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
        image: slide.imagePreview,
      }));
      detailData.append("gallerySlides", JSON.stringify(gallerySlidesPayload));
  
      formData.gallerySlides.forEach((slide, idx) => {
        if (slide.imageFile) {
          detailData.append(`galleryImage_${idx}`, slide.imageFile);
        }
      });
  
      await axiosInstance.put(`/day-tours/detail/${id}`, detailData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      toast.success("Day Tour updated successfully!", {
        onClose: () => navigate(`${basePath}/day-tours`),
        autoClose: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.error("Error updating day tour!");
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
          submitLabel={isSaving ? "Saving..." : "Update Day Tour"}
        />
      </main>
    </div>
  );
}
