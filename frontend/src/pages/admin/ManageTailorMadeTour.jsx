import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useDropzone } from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const AdminManageTailorMadeTour = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const [tourData, setTourData] = useState({
    description: "",
    phone: "",
    whatsapp: "",
    howItWorks: [{ description: "", image: "" }],
    fullDescription: [{ description: "" }],
    gallery: [],
  });

  const [files, setFiles] = useState({ howItWorks: [], gallery: [] });
  const MAX_GALLERY_IMAGES = 6;

  // -------------------- Fetch Tour Data --------------------
  useEffect(() => {
    fetchTour();
  }, []);

  const fetchTour = async () => {
    try {
      const res = await axiosInstance.get("/tailor-made-tours");
      if (res.data) {
        setTourData({
          description: res.data.description || "",
          phone: res.data.phone || "",
          whatsapp: res.data.whatsapp || "",
          howItWorks: res.data.howItWorks?.length
            ? res.data.howItWorks
            : [{ description: "", image: "" }],
          fullDescription: res.data.fullDescription?.length
            ? res.data.fullDescription
            : [{ description: "" }],
          gallery: res.data.gallery?.length
            ? res.data.gallery.slice(0, MAX_GALLERY_IMAGES)
            : [],
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load Tailor Made Tour data");
    }
  };

  // -------------------- Handlers --------------------
  const handleChange = (e, section, idx) => {
    if (section) {
      const updated = [...tourData[section]];
      updated[idx].description = e.target.value;
      setTourData({ ...tourData, [section]: updated });
    } else {
      setTourData({ ...tourData, [e.target.name]: e.target.value });
    }
  };

  const handleAddItem = (section) => {
    setTourData({
      ...tourData,
      [section]: [...tourData[section], { description: "", image: "" }],
    });
  };

  const handleRemoveItem = (section, idx) => {
    const updated = [...tourData[section]];
    updated.splice(idx, 1);
    setTourData({ ...tourData, [section]: updated });

    if (files[section]) {
      const updatedFiles = [...files[section]];
      updatedFiles.splice(idx, 1);
      setFiles({ ...files, [section]: updatedFiles });
    }
  };

  const handleGalleryUpload = (newFiles) => {
    const existingCount = tourData.gallery.length + files.gallery.length;
    const availableSlots = MAX_GALLERY_IMAGES - existingCount;

    if (availableSlots <= 0) {
      toast.error(`Maximum ${MAX_GALLERY_IMAGES} gallery images allowed`);
      return;
    }

    const filesToAdd = newFiles.slice(0, availableSlots);

    setFiles((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...filesToAdd],
    }));
  };

  const handleDrop = (acceptedFiles, section, idx) => {
    const validFiles = acceptedFiles.filter((f) => f.size <= MAX_FILE_SIZE);
    if (!validFiles.length) return;

    if (section === "howItWorks") {
      const arr = [...files.howItWorks];
      arr[idx] = validFiles[0];
      setFiles({ ...files, howItWorks: arr });

      const updated = [...tourData.howItWorks];
      updated[idx].image = URL.createObjectURL(validFiles[0]);
      setTourData({ ...tourData, howItWorks: updated });
    } else if (section === "gallery") {
      handleGalleryUpload(validFiles);
    }
  };

  const Dropzone = ({ section, idx }) => {
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (acceptedFiles) => handleDrop(acceptedFiles, section, idx),
      accept: { "image/*": [] },
      multiple: section === "gallery", // only gallery allows multiple
    });
  
    const isGalleryFull =
      section === "gallery" &&
      tourData.gallery.length + files.gallery.length >= MAX_GALLERY_IMAGES;
  
    // Correct label text
    const labelText =
      section === "gallery"
        ? isGalleryFull
          ? "Gallery limit reached"
          : `Drag & drop ${MAX_GALLERY_IMAGES} images or click`
        : "Drag & drop 1 image or click"; // for How It Works
  
    return (
      <div
        {...(!isGalleryFull ? getRootProps() : {})}
        className={`border-2 border-dashed p-4 text-center rounded cursor-pointer
          ${isGalleryFull ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50"}
        `}
      >
        <input {...getInputProps()} />
        <p className="text-[#2E5B84] font-medium">{labelText}</p>
      </div>
    );
  };  

  // -------------------- Save Tour --------------------
  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(tourData));

      files.howItWorks.forEach(
        (file, idx) => file && formData.append(`howItWorks${idx}`, file)
      );
      files.gallery.forEach(
        (file) => file && formData.append("galleryFiles", file)
      );

      const res = await axiosInstance.post("/tailor-made-tours", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Tailor Made Tour updated successfully!");
      setTourData(res.data);
      setFiles({ howItWorks: [], gallery: [] });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Tailor Made Tour");
    } finally {
      setIsSaving(false);
    }
  };

  // -------------------- Render --------------------
  return (
    <div>
      <ToastContainer />

      <main>
        <h2 className="text-4xl font-bold text-[#0d203a] mb-4">
          Manage Tailor Made Tour
        </h2>

        <div className="flex justify-end mb-8">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className={`bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60] ${
              isSaving ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? "Saving..." : "Save Tour"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-4">
          {["general", "howItWorks", "full"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t ${
                activeTab === tab
                  ? "bg-[#2E5B84] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab === "general"
                ? "General Info"
                : tab === "howItWorks"
                ? "How It Works"
                : "Full Description & Gallery"}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === "general" && (
          <div className="px-5">
            <table className="w-full border border-[#1a354e] rounded mb-6">
              <tbody>
                <tr className="border-b border-[#2E5B84] hover:bg-blue-50">
                  <td className="p-3 border border-[#2E5B84] font-semibold w-40">
                    Phone
                  </td>
                  <td className="p-3 border border-[#2E5B84]">
                    <input
                      type="text"
                      value={tourData.phone || ""}
                      onChange={(e) =>
                        setTourData({ ...tourData, phone: e.target.value })
                      }
                      className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                      placeholder="Enter phone number"
                    />
                  </td>
                </tr>
                <tr className="border-b border-[#2E5B84] hover:bg-blue-50">
                  <td className="p-3 border border-[#2E5B84] font-semibold w-40">
                    WhatsApp
                  </td>
                  <td className="p-3 border border-[#2E5B84]">
                    <input
                      type="text"
                      value={tourData.whatsapp || ""}
                      onChange={(e) =>
                        setTourData({ ...tourData, whatsapp: e.target.value })
                      }
                      className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                      placeholder="Enter WhatsApp number"
                    />
                  </td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="p-3 border border-[#2E5B84] font-semibold">
                    Description
                  </td>
                  <td className="p-3 border border-[#2E5B84]">
                    <textarea
                      rows={3}
                      value={tourData.description || ""}
                      onChange={(e) =>
                        setTourData({
                          ...tourData,
                          description: e.target.value,
                        })
                      }
                      className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                      placeholder="Enter tour description"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* How It Works Tab */}
        {activeTab === "howItWorks" && (
          <div className="px-5">
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => handleAddItem("howItWorks")}
                className="bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60]"
              >
                + Add Step
              </button>
            </div>

            <table className="w-full border border-[#1a354e] rounded mb-6">
              <thead className="bg-[#0d203a] text-white">
                <tr>
                  <th className="p-3 border border-[#1a354e]">Description</th>
                  <th className="p-3 border border-[#1a354e] text-center">
                    Image
                  </th>
                  <th className="p-3 border border-[#1a354e] text-center w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tourData.howItWorks.map((step, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#2E5B84] hover:bg-blue-50"
                  >
                    <td className="p-3 border border-[#2E5B84]">
                      <textarea
                        value={step.description || ""}
                        onChange={(e) => handleChange(e, "howItWorks", idx)}
                        rows={3}
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                      />
                    </td>
                    <td className="p-3 border border-[#2E5B84] text-center">
                      <Dropzone section="howItWorks" idx={idx} />
                      {step.image && (
                        <img
                          src={step.image}
                          alt="step"
                          className="w-32 h-20 object-cover rounded mt-1 mx-auto"
                        />
                      )}
                    </td>
                    <td className="p-3 border border-[#2E5B84] text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem("howItWorks", idx)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Full Description & Gallery */}
        {activeTab === "full" && (
          <div className="px-5">
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => handleAddItem("fullDescription")}
                className="bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60]"
              >
                + Add Paragraph
              </button>
            </div>

            <table className="w-full border border-[#1a354e] rounded mb-6">
              <thead className="bg-[#0d203a] text-white">
                <tr>
                  <th className="p-3 border border-[#1a354e]">Paragraph</th>
                  <th className="p-3 border border-[#1a354e] text-center w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tourData.fullDescription.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#2E5B84] hover:bg-blue-50"
                  >
                    <td className="p-3 border border-[#2E5B84]">
                      <textarea
                        value={item.description || ""}
                        onChange={(e) =>
                          handleChange(e, "fullDescription", idx)
                        }
                        rows={3}
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                      />
                    </td>
                    <td className="p-3 border border-[#2E5B84] text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem("fullDescription", idx)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <label className="font-semibold mt-2">
              Gallery (Max 6 images):
            </label>

            <Dropzone section="gallery" onFilesAdded={handleGalleryUpload} />

            <div className="flex gap-3 mt-3 flex-wrap">
              {/* Existing Images */}
              {tourData.gallery.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt="gallery"
                    className="w-32 h-20 object-cover rounded border"
                  />

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() =>
                      setTourData((prev) => ({
                        ...prev,
                        gallery: prev.gallery.filter((_, i) => i !== idx),
                      }))
                    }
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded hidden group-hover:block"
                  >
                    ✕
                  </button>

                  {/* Replace */}
                  <label className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 rounded cursor-pointer hidden group-hover:block">
                    Edit
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        setFiles((prev) => ({
                          ...prev,
                          gallery: [...prev.gallery, file],
                        }));

                        setTourData((prev) => ({
                          ...prev,
                          gallery: prev.gallery.filter((_, i) => i !== idx),
                        }));
                      }}
                    />
                  </label>
                </div>
              ))}

              {/* New Images Preview */}
              {files.gallery.map((file, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="gallery"
                    className="w-32 h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFiles((prev) => ({
                        ...prev,
                        gallery: prev.gallery.filter((_, i) => i !== idx),
                      }))
                    }
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded hidden group-hover:block"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminManageTailorMadeTour;
