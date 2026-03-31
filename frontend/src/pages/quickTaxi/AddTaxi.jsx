import React, { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import TaxiForm from "../../components/admin/TaxiForm";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export default function AddTaxi() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    transmission: "Manual",
    seats: 4,
    luggage: "",
    capacity: "",
    ac: true,
    imageFile: null,
    imagePreview: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

            // Determine role & base path
        const role = sessionStorage.getItem("role") || "admin";
        const basePath = role === "superadmin" ? "/super-admin" : "/admin";

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) fd.append(key, value);
      });

      await axiosInstance.post("/quick-taxi/taxis", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Vehicle added successfully!", {
        onClose: () => navigate(`${basePath}/taxis`),
      });
    } catch (err) {
      toast.error("Failed to add vehicle!");
    }
  };

  return (
    <div>
      <ToastContainer />
  
      <main>
        <TaxiForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          submitLabel="Add Vehicle"
        />
      </main>
    </div>
  );
}
