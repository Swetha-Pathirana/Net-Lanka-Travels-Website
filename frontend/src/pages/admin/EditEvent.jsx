import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import EventForm from "../../components/admin/EventForm";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    location: "",
    date: "",
    desc: "",
    imgFile: null,
    imgPreview: "",
    heroTitle: "",
    heroSubtitle: "",
    heroImageFile: null,
    heroImagePreview: "",
    aboutParagraphs: ["", ""],
    highlights: [""],
    duration: "",
    includes: [""],
    startLocation: "",
    whyShouldAttend: "",
    whoShouldAttend: "",
    tipsForAttendees: "",
    planYourVisit: "",
    galleryImgs: [],
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await axiosInstance.get(`/events/${id}`);
        if (res.data.success) {
          const { event, detail } = res.data;
          setFormData({
            title: event.title || "",
            slug: event.slug || "",
            location: event.location || "",
            date: event.date?.split("T")[0] || "",
            desc: event.desc || "",
            imgFile: null,
            imgPreview: event.img || "",
            heroTitle: detail?.heroTitle || "",
            heroSubtitle: detail?.heroSubtitle || "",
            heroImageFile: null,
            heroImagePreview: detail?.heroImage || "",
            aboutParagraphs: Array.isArray(detail?.aboutParagraphs) ? detail.aboutParagraphs : ["", ""],
            highlights: Array.isArray(detail?.highlights) ? detail.highlights : [""],
            duration: detail?.duration || "",
            includes: Array.isArray(detail?.includes) ? detail.includes : [""],
            startLocation: detail?.startLocation || "",
            whyShouldAttend: detail?.whyShouldAttend || "",
            whoShouldAttend: detail?.whoShouldAttend || "",
            tipsForAttendees: detail?.tipsForAttendees || "",
            planYourVisit: detail?.planYourVisit || "",
            galleryImgs: Array.isArray(detail?.galleryImgs)
              ? detail.galleryImgs.map((img) => ({ title: "", desc: "", imageFile: null, imagePreview: img }))
              : [],
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching event data!");
      }
    }
    fetchEvent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

        // Determine role and base path
        const role = sessionStorage.getItem("role") || "admin";
        const basePath = role === "superadmin" ? "/super-admin" : "/admin";

    try {
      // ---------- Update Event ----------
      const eventData = new FormData();
      eventData.append("title", formData.title);
      eventData.append("slug", formData.slug);
      eventData.append("location", formData.location);
      eventData.append("date", formData.date);
      eventData.append("desc", formData.desc);
      if (formData.imgFile) eventData.append("img", formData.imgFile);
      await axiosInstance.put(`/events/${id}`, eventData, { headers: { "Content-Type": "multipart/form-data" } });

      // ---------- Update EventDetail ----------
      const detailData = new FormData();
      detailData.append("heroTitle", formData.heroTitle);
      detailData.append("heroSubtitle", formData.heroSubtitle);
      if (formData.heroImageFile) detailData.append("heroImage", formData.heroImageFile);
      detailData.append("aboutParagraphs", JSON.stringify(formData.aboutParagraphs));
      detailData.append("highlights", JSON.stringify(formData.highlights));
      detailData.append("duration", formData.duration);
      detailData.append("includes", JSON.stringify(formData.includes));
      detailData.append("startLocation", formData.startLocation);
      detailData.append("whyShouldAttend", formData.whyShouldAttend);
      detailData.append("whoShouldAttend", formData.whoShouldAttend);
      detailData.append("tipsForAttendees", formData.tipsForAttendees);
      detailData.append("planYourVisit", formData.planYourVisit);

      formData.galleryImgs.forEach((slide, idx) => {
        if (slide.imageFile) detailData.append(`galleryImg_${idx}`, slide.imageFile);
      });

      await axiosInstance.put(`/events/detail/${id}`, detailData, { headers: { "Content-Type": "multipart/form-data" } });

      toast.success("Event updated successfully!", {
        onClose: () => navigate(`${basePath}/events`),
        autoClose: 3000 });
    } catch (err) {
      console.error(err);
      toast.error("Error updating event!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <main>
        <EventForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          submitLabel={isSaving ? "Saving..." : "Update Event"}
        />
      </main>
    </div>
  );
}
