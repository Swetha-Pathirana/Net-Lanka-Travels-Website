import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useDropzone } from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const AdminCommunityImpact = () => {
  const [activeTab, setActiveTab] = useState("description");
  const [isSaving, setIsSaving] = useState(false);
  const [communityData, setCommunityData] = useState({
    description: [""],
    impacts: [],
  });
  const [files, setFiles] = useState({ impactImages: [] });

  useEffect(() => {
    fetchCommunity();
  }, []);

  const fetchCommunity = async () => {
    try {
      const res = await axiosInstance.get("/communityImpact");
      if (res.data) {
        setCommunityData({
          description: Array.isArray(res.data.description)
            ? res.data.description
            : [res.data.description || ""],
          impacts: Array.isArray(res.data.impacts) ? res.data.impacts : [],
        });
        setFiles({
          impactImages: (res.data.impacts || []).map(() => []),
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load community data");
    }
  };

  // ---------------- Handlers ----------------
  const handleDescriptionChange = (e, idx) => {
    const updated = [...communityData.description];
    updated[idx] = e.target.value;
    setCommunityData({ ...communityData, description: updated });
  };

  const handleAddParagraph = () =>
    setCommunityData({
      ...communityData,
      description: [...communityData.description, ""],
    });

  const handleRemoveParagraph = (idx) => {
    const updated = [...communityData.description];
    updated.splice(idx, 1);
    setCommunityData({ ...communityData, description: updated });
  };

  const handleImpactChange = (e, idx, field) => {
    const updated = [...communityData.impacts];
    updated[idx][field] = e.target.value;
    setCommunityData({ ...communityData, impacts: updated });
  };

  const handleAddImpact = () => {
    setCommunityData({
      ...communityData,
      impacts: [
        ...communityData.impacts,
        { title: "", description: "", images: [] },
      ],
    });
    setFiles({ ...files, impactImages: [...files.impactImages, []] });
  };

  const handleRemoveImpact = (idx) => {
    const updated = [...communityData.impacts];
    updated.splice(idx, 1);
    setCommunityData({ ...communityData, impacts: updated });

    const updatedFiles = [...files.impactImages];
    updatedFiles.splice(idx, 1);
    setFiles({ ...files, impactImages: updatedFiles });
  };

  const handleDrop = (acceptedFiles, idx) => {
    const oversized = acceptedFiles.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length) toast.error("Some files exceed 50MB");

    const validFiles = acceptedFiles.filter((f) => f.size <= MAX_FILE_SIZE);
    const impactFiles = [...files.impactImages];
    impactFiles[idx] = validFiles;
    setFiles({ ...files, impactImages: impactFiles });

    const updatedImpacts = [...communityData.impacts];
    updatedImpacts[idx].images = [
      ...(communityData.impacts[idx].images || []),
      ...validFiles.map((f) => URL.createObjectURL(f)),
    ];
    setCommunityData({ ...communityData, impacts: updatedImpacts });
  };

  const Dropzone = ({ idx }) => {
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (files) => handleDrop(files, idx),
      accept: { "image/*": [] },
      multiple: true,
    });

    return (
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-[#2E5B84] rounded-md p-4 text-center cursor-pointer hover:bg-blue-50 transition"
      >
        <input {...getInputProps()} />
        <p className="text-[#2E5B84] font-medium">
          Drag & drop images here or click
        </p>
      </div>
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(communityData));

      files.impactImages.forEach((arr, impactIndex) => {
        arr.forEach((file) => {
          formData.append(`impactImages_${impactIndex}`, file);
        });
      });

      const res = await axiosInstance.post(
        "/communityImpact",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 200) {
        toast.success("Community Impact updated successfully!");
        setCommunityData(res.data);
        setFiles({ impactImages: [] });
      } else toast.error("Failed to save community impact");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save community impact");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      <main>
        <h2 className="text-4xl font-bold text-[#0d203a] mb-6">
          Manage Community Impact
        </h2>

        <div className="flex justify-end mb-8">
          <button
            type="submit"
            onClick={handleSave}
            disabled={isSaving}
            className={`bg-[#2E5B84] text-white px-6 py-3 rounded hover:bg-[#1E3A60] transition ${
              isSaving ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? "Saving..." : "Save Community Impact"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          {["description", "impacts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t ${
                activeTab === tab
                  ? "bg-[#2E5B84] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab === "description" ? "Description" : "Impacts"}
            </button>
          ))}
        </div>

        <form className="space-y-6 bg-white p-6 rounded shadow-md">
          {/* Description */}
          {activeTab === "description" && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={handleAddParagraph}
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
                  {communityData.description.map((para, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-[#2E5B84] hover:bg-blue-50"
                    >
                      <td className="p-3 border border-[#2E5B84]">
                        <textarea
                          value={para}
                          onChange={(e) => handleDescriptionChange(e, idx)}
                          rows={4}
                          className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                        />
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveParagraph(idx)}
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

          {/* Impacts */}
          {activeTab === "impacts" && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={handleAddImpact}
                  className="bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60]"
                >
                  + Add Impact
                </button>
              </div>
              <table className="w-full border border-[#1a354e] rounded mb-6">
                <thead className="bg-[#0d203a] text-white">
                  <tr>
                    <th className="p-3 border border-[#1a354e]">Title</th>
                    <th className="p-3 border border-[#1a354e]">Description</th>
                    <th className="p-3 border border-[#1a354e]">Images</th>
                    <th className="p-3 border border-[#1a354e] text-center w-24">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {communityData.impacts.map((impact, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-[#2E5B84] hover:bg-blue-50"
                    >
                      <td className="p-3 border border-[#2E5B84]">
                        <input
                          value={impact.title}
                          onChange={(e) => handleImpactChange(e, idx, "title")}
                          className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                        />
                      </td>
                      <td className="p-3 border border-[#2E5B84]">
                        <textarea
                          value={impact.description}
                          onChange={(e) =>
                            handleImpactChange(e, idx, "description")
                          }
                          rows={6}
                          className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                        />
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-center">
                        <Dropzone idx={idx} />
                        {impact.images?.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="impact"
                            className="w-20 h-20 object-cover rounded mt-1 mx-auto"
                          />
                        ))}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveImpact(idx)}
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
        </form>
      </main>
    </div>
  );
};

export default AdminCommunityImpact;
