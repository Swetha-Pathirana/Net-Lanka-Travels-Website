import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EventForm from "../../components/admin/EventForm";

export default function AddEvent() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

        // Determine role & base path
        const role = sessionStorage.getItem("role") || "admin";
        const basePath = role === "superadmin" ? "/super-admin" : "/admin";

    try {
      // ---------- Event Main ----------
      const eventData = new FormData();
      eventData.append("title", formData.title);
      eventData.append("slug", formData.slug);
      eventData.append("location", formData.location);
      eventData.append("date", formData.date);
      eventData.append("desc", formData.desc);
      if (formData.imgFile) eventData.append("img", formData.imgFile);

      const eventRes = await axiosInstance.post("/events", eventData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const eventId = eventRes.data.event._id;

      // ---------- Event Detail ----------
      const detailData = new FormData();
      detailData.append("eventId", eventId);
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

      await axiosInstance.post("/events/detail", detailData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Event added successfully!", {
        onClose: () => navigate(`${basePath}/events`),
        autoClose: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.error("Error adding event!");
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
          submitLabel={isSaving ? "Saving..." : "Add Event"}
        />
      </main>
    </div>
  );
}
