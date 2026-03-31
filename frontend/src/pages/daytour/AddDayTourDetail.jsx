import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { useDropzone } from "react-dropzone";

export default function AddDayTourDetail() {
  const { id } = useParams(); // Tour ID
  const navigate = useNavigate();

  // Determine role and base path
  const role = sessionStorage.getItem("role") || "admin"; // default to admin
  const basePath = role === "superadmin" ? "/super-admin" : "/admin";

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
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (files) =>
      setFormData({
        ...formData,
        heroImageFile: files[0],
        heroImagePreview: URL.createObjectURL(files[0]),
      }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("tourId", id);
    data.append("heroTitle", formData.heroTitle);
    data.append("heroSubtitle", formData.heroSubtitle);
    data.append("aboutParagraphs", JSON.stringify(formData.aboutParagraphs));
    data.append("historyTitle", formData.historyTitle);
    data.append("historyLeftList", JSON.stringify(formData.historyLeftList));
    data.append("historyRightList", JSON.stringify(formData.historyRightList));
    data.append("gallerySlides", JSON.stringify(formData.gallerySlides));
    if (formData.heroImageFile) data.append("heroImage", formData.heroImageFile);

    try {
      await axiosInstance.post("/day-tours/detail", data);

      // ✅ Redirect based on role
      navigate(`${basePath}/day-tours`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add tour detail");
    }
  };

  return (
    <div>
      <main>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 shadow rounded max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-6">Add Day Tour Detail</h2>

          {/* Hero Image */}
          <div
            {...getRootProps()}
            className="border-2 border-dashed p-6 mb-3 cursor-pointer"
          >
            <input {...getInputProps()} />
            <p>Upload Hero Image</p>
          </div>
          {formData.heroImagePreview && (
            <img
              src={formData.heroImagePreview}
              alt="img"
              className="w-48 h-48 object-cover mb-3"
            />
          )}

          <input
            className="border p-3 w-full mb-3"
            placeholder="Hero Title"
            value={formData.heroTitle}
            onChange={(e) =>
              setFormData({ ...formData, heroTitle: e.target.value })
            }
          />
          <input
            className="border p-3 w-full mb-3"
            placeholder="Hero Subtitle"
            value={formData.heroSubtitle}
            onChange={(e) =>
              setFormData({ ...formData, heroSubtitle: e.target.value })
            }
          />

          <input
            className="border p-3 w-full mb-3"
            placeholder="About Paragraph 1"
            value={formData.aboutParagraphs[0]}
            onChange={(e) => {
              const p = [...formData.aboutParagraphs];
              p[0] = e.target.value;
              setFormData({ ...formData, aboutParagraphs: p });
            }}
          />
          <input
            className="border p-3 w-full mb-3"
            placeholder="About Paragraph 2"
            value={formData.aboutParagraphs[1]}
            onChange={(e) => {
              const p = [...formData.aboutParagraphs];
              p[1] = e.target.value;
              setFormData({ ...formData, aboutParagraphs: p });
            }}
          />

          <input
            className="border p-3 w-full mb-3"
            placeholder="History Title"
            value={formData.historyTitle}
            onChange={(e) =>
              setFormData({ ...formData, historyTitle: e.target.value })
            }
          />
          <input
            className="border p-3 w-full mb-3"
            placeholder="History Left List (comma separated)"
            value={formData.historyLeftList.join(",")}
            onChange={(e) => {
              setFormData({
                ...formData,
                historyLeftList: e.target.value.split(","),
              });
            }}
          />
          <input
            className="border p-3 w-full mb-3"
            placeholder="History Right List (comma separated)"
            value={formData.historyRightList.join(",")}
            onChange={(e) => {
              setFormData({
                ...formData,
                historyRightList: e.target.value.split(","),
              });
            }}
          />

          <button className="bg-blue-600 text-white px-6 py-3 rounded">
            Add Detail
          </button>
        </form>
      </main>
    </div>
  );
}
