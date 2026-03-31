import React, { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import DestinationForm from "../../components/admin/DestinationForm";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddDestination() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subtitle: "",
    title: "",
    imgPreview: "",
    imgFile: null,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Determine role & base path
    const role = sessionStorage.getItem("role") || "admin";
    const basePath = role === "superadmin" ? "/super-admin" : "/admin";

    try {
      const fd = new FormData();
      fd.append("subtitle", formData.subtitle);
      fd.append("title", formData.title);
      if (formData.imgFile) fd.append("imgFile", formData.imgFile);

      await axiosInstance.post("/destination", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Destination created successfully!", {
        onClose: () => navigate(`${basePath}/destinations`),
        autoClose: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.error("Error creating destination!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
   
      <main>
        <DestinationForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          submitLabel={isSaving ? "Saving..." : "Create Destination"}
        />
      </main>
    </div>
  );
}
