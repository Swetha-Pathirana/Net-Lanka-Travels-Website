import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RoundTourForm from "../../components/admin/RoundTourForm";

export default function EditRoundTour() {
  const { id } = useParams(); // RoundTour ID
  const navigate = useNavigate();

  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    days: "",
    location: "",
    desc: "",

    imgFile: null,
    imgPreview: "",

    heroTitle: "",
    heroSubtitle: "",
    heroImageFile: null,
    heroImagePreview: "",

    highlights: [""],
    itinerary: [],

    inclusions: [""],
    exclusions: [""],
    offers: [""],

    tourFacts: {
      duration: "",
      difficulty: "",
      groupSize: "",
    },

    gallerySlides: [],
  });

  /* ---------------- FETCH EXISTING DATA ---------------- */
  useEffect(() => {
    async function fetchTour() {
      try {
        const res = await axiosInstance.get(`/round-tours/${id}`);

        if (res.data.success) {
          const { tour, details } = res.data;

          setFormData({
            title: tour.title || "",
            days: tour.days || "",
            location: tour.location || "",
            desc: tour.desc || "",

            imgFile: null,
            imgPreview: tour.img || "",

            heroTitle: details?.heroTitle || "",
            heroSubtitle: details?.heroSubtitle || "",
            heroImageFile: null,
            heroImagePreview: details?.heroImage || "",

            highlights: Array.isArray(details?.highlights)
              ? details.highlights
              : [""],

            itinerary: Array.isArray(details?.itinerary)
              ? details.itinerary
              : [],

            inclusions: Array.isArray(details?.inclusions)
              ? details.inclusions
              : [""],

            exclusions: Array.isArray(details?.exclusions)
              ? details.exclusions
              : [""],

            offers: Array.isArray(details?.offers)
              ? details.offers
              : [""],

            tourFacts: {
              duration: details?.tourFacts?.duration || "",
              difficulty: details?.tourFacts?.difficulty || "",
              groupSize: details?.tourFacts?.groupSize || "",
            },

            gallerySlides: Array.isArray(details?.gallerySlides)
              ? details.gallerySlides.map((g) => ({
                  title: g.title || "",
                  desc: g.desc || "",
                  imageFile: null,
                  imagePreview: g.image || "",
                }))
              : [],
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load round tour data");
      }
    }

    fetchTour();
  }, [id]);

  /* ---------------- SUBMIT UPDATE ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

      // Determine role and base path
      const role = sessionStorage.getItem("role") || "admin";
      const basePath = role === "superadmin" ? "/super-admin" : "/admin";

    try {
      /* ---------- UPDATE MAIN TOUR ---------- */
      const tourData = new FormData();
      tourData.append("title", formData.title);
      tourData.append("days", formData.days);
      tourData.append("location", formData.location);
      tourData.append("desc", formData.desc);
      if (formData.imgFile) tourData.append("img", formData.imgFile);

      await axiosInstance.put(`/round-tours/${id}`, tourData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      /* ---------- UPDATE DETAIL ---------- */
      const detailData = new FormData();
      detailData.append("heroTitle", formData.heroTitle);
      detailData.append("heroSubtitle", formData.heroSubtitle);
      detailData.append("highlights", JSON.stringify(formData.highlights));
      detailData.append("itinerary", JSON.stringify(formData.itinerary));
      detailData.append("inclusions", JSON.stringify(formData.inclusions));
      detailData.append("exclusions", JSON.stringify(formData.exclusions));
      detailData.append("offers", JSON.stringify(formData.offers));
      detailData.append("tourFacts", JSON.stringify(formData.tourFacts));

      if (formData.heroImageFile) {
        detailData.append("heroImage", formData.heroImageFile);
      }

      const galleryPayload = formData.gallerySlides.map((g) => ({
        title: g.title,
        desc: g.desc,
        image: g.imagePreview,
      }));

      detailData.append("gallerySlides", JSON.stringify(galleryPayload));

      formData.gallerySlides.forEach((g, i) => {
        if (g.imageFile) {
          detailData.append(`galleryImage_${i}`, g.imageFile);
        }
      });

      await axiosInstance.put(`/round-tours/detail/${id}`, detailData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Round Tour updated successfully!", {
        autoClose: 2000,
        onClose: () => navigate(`${basePath}/round-tours`),
      });
    } catch (err) {
      console.error(err);
      toast.error("Error updating round tour");
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

    
      <main>
        <RoundTourForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          submitLabel={isSaving ? "Updating..." : "Update Round Tour"}
        />
      </main>
    </div>
  );
}
