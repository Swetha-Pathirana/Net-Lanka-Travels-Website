import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useDropzone } from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const AdminManageJourney = () => {
  const [activeTab, setActiveTab] = useState("commonImage");
  const [isSaving, setIsSaving] = useState(false);

  const [journeyData, setJourneyData] = useState({
    fullDescription: [{ description: "" }],
    milestones: [{ year: "", title: "", description: "", image: "" }],
    commonImage: "",
  });

  const [files, setFiles] = useState({
    commonImage: null,
    milestoneImages: [],
  });

  const fetchJourney = async () => {
    try {
      const res = await axiosInstance.get("/journey");
      if (res.data) {
        setJourneyData({
          fullDescription: res.data.fullDescription || [{ description: "" }],
          milestones: res.data.milestones || [
            { year: "", title: "", description: "", image: "" },
          ],
          commonImage: res.data.commonImage || "",
        });
        setFiles({
          commonImage: null,
          milestoneImages: (res.data.milestones || []).map(() => null),
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load journey data");
    }
  };

  useEffect(() => {
    fetchJourney();
  }, []);

  // ------------------ Handlers ------------------
  const handleChangeParagraph = (e, index) => {
    const updated = [...journeyData.fullDescription];
    updated[index].description = e.target.value;
    setJourneyData({ ...journeyData, fullDescription: updated });
  };

  const handleAddParagraph = () => {
    setJourneyData({
      ...journeyData,
      fullDescription: [...journeyData.fullDescription, { description: "" }],
    });
  };

  const handleRemoveParagraph = (index) => {
    const updated = [...journeyData.fullDescription];
    updated.splice(index, 1);
    setJourneyData({ ...journeyData, fullDescription: updated });
  };

  const handleChangeMilestone = (e, index, field) => {
    const updated = [...journeyData.milestones];
    updated[index][field] = e.target.value;
    setJourneyData({ ...journeyData, milestones: updated });
  };

  const handleAddMilestone = () => {
    setJourneyData({
      ...journeyData,
      milestones: [
        ...journeyData.milestones,
        { year: "", title: "", description: "", image: "" },
      ],
    });
    setFiles({
      ...files,
      milestoneImages: [...files.milestoneImages, null],
    });
  };

  const handleRemoveMilestone = (index) => {
    const updated = [...journeyData.milestones];
    updated.splice(index, 1);
    setJourneyData({ ...journeyData, milestones: updated });

    const updatedFiles = [...files.milestoneImages];
    updatedFiles.splice(index, 1);
    setFiles({ ...files, milestoneImages: updatedFiles });
  };

  const handleDrop = (acceptedFiles, index, type = "milestone") => {
    const oversized = acceptedFiles.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length) toast.error("Some files exceed 50MB");

    const validFiles = acceptedFiles.filter((f) => f.size <= MAX_FILE_SIZE);

    if (type === "common") {
      setFiles({ ...files, commonImage: validFiles[0] });
      setJourneyData({
        ...journeyData,
        commonImage: validFiles[0] ? URL.createObjectURL(validFiles[0]) : "",
      });
    } else {
      const arr = [...files.milestoneImages];
      arr[index] = validFiles[0];
      setFiles({ ...files, milestoneImages: arr });

      const updatedMilestones = [...journeyData.milestones];
      updatedMilestones[index].image = validFiles[0]
        ? URL.createObjectURL(validFiles[0])
        : "";
      setJourneyData({ ...journeyData, milestones: updatedMilestones });
    }
  };

  const Dropzone = ({ index, type = "milestone" }) => {
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (files) => handleDrop(files, index, type),
      accept: { "image/*": [] },
      multiple: false,
    });

    return (
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-[#2E5B84] rounded-md p-4 text-center cursor-pointer hover:bg-blue-50 transition"
      >
        <input {...getInputProps()} />
        <p className="text-[#2E5B84] font-medium">
          Drag & drop image here or click
        </p>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(journeyData));

      if (files.commonImage) formData.append("commonImage", files.commonImage);
      files.milestoneImages.forEach((f, idx) => {
        if (f) formData.append(`milestones[${idx}][image]`, f);
      });

      const res = await axiosInstance.post(
        "/journey",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        toast.success("Journey updated successfully!");
        setJourneyData(res.data);
        setFiles({ commonImage: null, milestoneImages: [] });
      } else toast.error("Failed to update journey");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update journey");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      <main>
        <h2 className="text-4xl font-bold text-[#0d203a] mb-6">
          Manage Our Journey
        </h2>

        <div className="flex justify-end mb-8">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving}
            className={`bg-[#2E5B84] text-white px-6 py-3 rounded hover:bg-[#1E3A60] transition ${
              isSaving ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? "Saving..." : "Save Journey"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          {["commonImage", "fullDescription", "milestones"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t ${
                activeTab === tab
                  ? "bg-[#2E5B84] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab === "commonImage"
                ? "Mission Image"
                : tab === "fullDescription"
                ? "Full Description"
                : "Milestones"}
            </button>
          ))}
        </div>

        <form className="space-y-6 bg-white p-6 rounded shadow-md">
          {/* Mission Image Tab */}
          {activeTab === "commonImage" && (
            <div>
              <Dropzone type="common" />
              {journeyData.commonImage && (
                <div className="flex justify-center mt-2">
                  <img
                    src={journeyData.commonImage}
                    alt="Mission"
                    className="w-64 h-64 object-cover rounded"
                  />
                </div>
              )}
            </div>
          )}

          {/* Full Description Tab */}
          {activeTab === "fullDescription" && (
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
                  {journeyData.fullDescription.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-[#2E5B84] hover:bg-blue-50"
                    >
                      <td className="p-3 border border-[#2E5B84]">
                        <textarea
                          value={item.description}
                          onChange={(e) => handleChangeParagraph(e, idx)}
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

          {/* Milestones Tab */}
          {activeTab === "milestones" && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60]"
                >
                  + Add Milestone
                </button>
              </div>
              <table className="w-full border border-[#1a354e] rounded mb-6">
                <thead className="bg-[#0d203a] text-white">
                  <tr>
                    <th className="p-3 border border-[#1a354e]">Year</th>
                    <th className="p-3 border border-[#1a354e]">Title</th>
                    <th className="p-3 border border-[#1a354e]">Description</th>
                    <th className="p-3 border border-[#1a354e]">Image</th>
                    <th className="p-3 border border-[#1a354e] text-center w-24">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {journeyData.milestones.map((m, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-[#2E5B84] hover:bg-blue-50"
                    >
                      <td className="p-3 border border-[#2E5B84]">
                        <input
                          value={m.year}
                          onChange={(e) =>
                            handleChangeMilestone(e, idx, "year")
                          }
                          className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                        />
                      </td>
                      <td className="p-3 border border-[#2E5B84]">
                        <input
                          value={m.title}
                          onChange={(e) =>
                            handleChangeMilestone(e, idx, "title")
                          }
                          className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                        />
                      </td>
                      <td className="p-3 border border-[#2E5B84]">
                        <textarea
                          value={m.description}
                          onChange={(e) =>
                            handleChangeMilestone(e, idx, "description")
                          }
                          rows={6}
                          className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                        />
                      </td>

                      <td className="p-3 border border-[#2E5B84] text-center">
                        <Dropzone index={idx} />
                        {m.image && (
                          <img
                            src={m.image}
                            alt="milestone"
                            className="w-20 h-20 object-cover rounded mt-1 mx-auto"
                          />
                        )}
                      </td>
                      <td className="p-3 border border-[#2E5B84] text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(idx)}
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

export default AdminManageJourney;
