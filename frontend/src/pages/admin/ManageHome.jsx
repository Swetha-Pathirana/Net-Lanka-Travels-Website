import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useDropzone } from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminManageHome = () => {
  const MAX_FILE_SIZE = 50 * 1024 * 1024;
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const [homeData, setHomeData] = useState({
    name: "",
    info: { title: "", subtitle: "", description: "", video: "", videoPreview: "" },
    stats: [],
    topActivities: [],
    whyChooseUs: [],
  });

  const [files, setFiles] = useState({
    infoVideo: null,
    stats: {},
    topActivities: {},
    whyChooseUs: {},
  });

  // Fetch Home data
  const fetchHomeData = async () => {
    try {
      const response = await axiosInstance.get("/home");
      const data = response.data;

      if (data) {
        setHomeData({
          name: data.name || "",
          info: {
            title: data.info?.title || "",
            subtitle: data.info?.subtitle || "",
            description: data.info?.description || "",
            video: data.info?.video || "",
            videoPreview: data.info?.video || "",
          },
          stats: Array.isArray(data.stats)
            ? data.stats.map((s) => ({ ...s, preview: s.icon || "" }))
            : [],
          topActivities: Array.isArray(data.topActivities)
            ? data.topActivities.map((a) => ({ ...a, preview: a.icon || "" }))
            : [],
          whyChooseUs: Array.isArray(data.whyChooseUs)
            ? data.whyChooseUs.map((w) => ({ ...w, preview: w.icon || "" }))
            : [],
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load Home page data");
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  // Handle input changes
  const handleChange = (e, section, index, field) => {
    if (section) {
      const updated = [...homeData[section]];
      updated[index][field] = e.target.value;
      setHomeData({ ...homeData, [section]: updated });
    } else {
      setHomeData({
        ...homeData,
        info: { ...homeData.info, [e.target.name]: e.target.value },
      });
    }
  };

  const handleAddItem = (section, template = {}) => {
    setHomeData({ ...homeData, [section]: [...homeData[section], template] });
  };

  const handleRemoveItem = (section, idx) => {
    const updated = [...homeData[section]];
    updated.splice(idx, 1);
    setHomeData({ ...homeData, [section]: updated });
    setFiles((prev) => ({
      ...prev,
      [section]: { ...prev[section], [idx]: null },
    }));
  };

  // Handle file drop
  const handleDrop = (acceptedFiles, section, index) => {
    const oversizedFiles = acceptedFiles.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      toast.error("File exceeds 50MB and was not added.");
    }

    const validFiles = acceptedFiles.filter((file) => file.size <= MAX_FILE_SIZE);
    if (!validFiles[0]) return;

    const file = validFiles[0];

    // Update files state
    setFiles((prev) => ({
      ...prev,
      [section]: { ...prev[section], [index]: file },
    }));

    // Update preview in homeData
    if (section === "infoVideo") {
      setFiles((prev) => ({ ...prev, infoVideo: file }));
      setHomeData({
        ...homeData,
        info: { ...homeData.info, videoPreview: URL.createObjectURL(file) }, // preview before upload
      });
    } else {
      const updated = [...homeData[section]];
      updated[index].preview = URL.createObjectURL(file);
      setHomeData({ ...homeData, [section]: updated });
    }
  };

  // Dropzone component
  const Dropzone = ({ type, index, currentImage, acceptVideo = false }) => {
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (acceptedFiles) => handleDrop(acceptedFiles, type, index),
      accept: acceptVideo ? { "video/*": [] } : { "image/*": [] },
      multiple: false,
    });

    return (
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-[#2E5B84] rounded-md p-2 text-center cursor-pointer hover:bg-blue-50 transition"
      >
        <input {...getInputProps()} />
        {currentImage ? (
          acceptVideo ? (
            <video
              src={currentImage} // will be either preview or backend URL
              controls
              className="w-64 h-36 mx-auto rounded mt-2"
            />
          ) : (
            <img
              src={currentImage}
              alt="img"
              className="w-12 h-12 mx-auto mt-2 rounded"
            />
          )
        ) : (
          <p className="text-[#2E5B84] text-sm">
            {acceptVideo ? "Drag & drop video or click" : "Drag & drop image or click"}
          </p>
        )}
      </div>
    );
  };

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(homeData));

      // Add info video
      if (files.infoVideo) formData.append("infoVideo", files.infoVideo);

      // Add images for each section
      ["stats", "topActivities", "whyChooseUs"].forEach((section) => {
        Object.keys(files[section]).forEach((key) => {
          const file = files[section][key];
          if (file) {
            let fieldName =
              section === "stats"
                ? `stats${key}`
                : section === "topActivities"
                ? `activities${key}`
                : `choose${key}`;
            formData.append(fieldName, file);
          }
        });
      });

      const res = await axiosInstance.post("/home", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        toast.success("Home page updated successfully!");
        fetchHomeData(); // ✅ fetch saved URLs from backend
        setFiles({
          infoVideo: null,
          stats: {},
          topActivities: {},
          whyChooseUs: {},
        });
      } else {
        toast.error("Failed to update Home page");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Home page");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-4xl font-bold text-[#0d203a] mb-4 px-5 mt-4">
        Manage Home Contents
      </h2>

      <div className="flex justify-end mb-8">
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className={`bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60] ${
            isSaving ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSaving ? "Saving..." : "Save Home Page"}
        </button>
      </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-4">
          {["info", "stats", "topActivities", "whyChooseUs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t ${
                activeTab === tab
                  ? "bg-[#2E5B84] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab === "info"
                ? "Info"
                : tab === "stats"
                ? "Stats"
                : tab === "topActivities"
                ? "Top Activities"
                : "Why Choose Us"}
            </button>
          ))}
        </div>

        {/* Info Tab */}
        {activeTab === "info" && (
          <table className="w-full border border-[#1a354e] rounded mb-6">
            <thead className="bg-[#0d203a] text-white">
              <tr>
                <th className="p-3 border border-[#1a354e]">Field</th>
                <th className="p-3 border border-[#1a354e]">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#2E5B84]">
                <td className="p-3 border border-[#2E5B84] font-semibold">
                  Name
                </td>
                <td className="p-3 border border-[#2E5B84]">
                  <input
                    name="name"
                    value={homeData.name}
                    onChange={(e) =>
                      setHomeData({ ...homeData, name: e.target.value })
                    }
                    className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                  />
                </td>
              </tr>
              {["title", "subtitle", "description"].map((field) => (
                <tr key={field} className="border-b border-[#2E5B84]">
                  <td className="p-3 border border-[#2E5B84] font-semibold">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </td>
                  <td className="p-3 border border-[#2E5B84]">
                    {field === "description" ? (
                      <textarea
                        name={field}
                        value={homeData.info[field]}
                        onChange={(e) => handleChange(e)}
                        rows={4}
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                      />
                    ) : (
                      <input
                        name={field}
                        value={homeData.info[field]}
                        onChange={(e) => handleChange(e)}
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                      />
                    )}
                  </td>
                </tr>
              ))}
              <tr className="border-b border-[#2E5B84]">
                <td className="p-3 border border-[#2E5B84] font-semibold">
                  Video
                </td>
                <td className="p-3 border border-[#2E5B84] text-center">
                  <Dropzone
                    type="infoVideo"
                    index={0}
                    currentImage={homeData.info.videoPreview}
                    acceptVideo
                  />
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div>
            <div className="flex justify-end mb-8">
              <button
                type="button"
                onClick={() =>
                  handleAddItem("stats", { icon: "", title: "", count: 0, preview: "" })
                }
                className="bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60]"
              >
                + Add Stat
              </button>
            </div>
            <table className="w-full border border-[#1a354e] rounded mb-6">
              <thead className="bg-[#0d203a] text-white">
                <tr>
                  <th className="p-3 border border-[#1a354e]">Icon</th>
                  <th className="p-3 border border-[#1a354e]">Title</th>
                  <th className="p-3 border border-[#1a354e]">Count</th>
                  <th className="p-3 border border-[#1a354e] text-center w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {homeData.stats.map((stat, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#2E5B84] hover:bg-blue-50"
                  >
                    <td className="p-3 border border-[#2E5B84] text-center">
                      <Dropzone type="stats" index={idx} currentImage={stat.preview} />
                    </td>
                    <td className="p-3 border border-[#2E5B84]">
                      <input
                        value={stat.title}
                        onChange={(e) => handleChange(e, "stats", idx, "title")}
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                      />
                    </td>
                    <td className="p-3 border border-[#2E5B84]">
                      <input
                        type="number"
                        value={stat.count}
                        onChange={(e) => handleChange(e, "stats", idx, "count")}
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                      />
                    </td>
                    <td className="p-3 border border-[#2E5B84] text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem("stats", idx)}
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

        {/* Top Activities Tab */}
        {activeTab === "topActivities" && (
          <div>
            <div className="flex justify-end mb-8">
              <button
                type="button"
                onClick={() =>
                  handleAddItem("topActivities", { icon: "", title: "", preview: "" })
                }
                className="bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60]"
              >
                + Add Activity
              </button>
            </div>
            <table className="w-full border border-[#1a354e] rounded mb-6">
              <thead className="bg-[#0d203a] text-white">
                <tr>
                  <th className="p-3 border border-[#1a354e]">Icon</th>
                  <th className="p-3 border border-[#1a354e]">Title</th>
                  <th className="p-3 border border-[#1a354e] text-center w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {homeData.topActivities.map((act, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#2E5B84] hover:bg-blue-50"
                  >
                    <td className="p-3 border border-[#2E5B84] text-center">
                      <Dropzone type="topActivities" index={idx} currentImage={act.preview} />
                    </td>
                    <td className="p-3 border border-[#2E5B84]">
                      <input
                        value={act.title}
                        onChange={(e) => handleChange(e, "topActivities", idx, "title")}
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                      />
                    </td>
                    <td className="p-3 border border-[#2E5B84] text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem("topActivities", idx)}
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

        {/* Why Choose Us Tab */}
        {activeTab === "whyChooseUs" && (
          <div>
            <div className="flex justify-end mb-8">
              <button
                type="button"
                onClick={() =>
                  handleAddItem("whyChooseUs", { icon: "", title: "", description: "", preview: "" })
                }
                className="bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60]"
              >
                + Add Item
              </button>
            </div>
            <table className="w-full border border-[#1a354e] rounded mb-6">
              <thead className="bg-[#0d203a] text-white">
                <tr>
                  <th className="p-3 border border-[#1a354e]">Icon</th>
                  <th className="p-3 border border-[#1a354e]">Title</th>
                  <th className="p-3 border border-[#1a354e]">Description</th>
                  <th className="p-3 border border-[#1a354e] text-center w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {homeData.whyChooseUs.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#2E5B84] hover:bg-blue-50"
                  >
                    <td className="p-3 border border-[#2E5B84] text-center">
                      <Dropzone type="whyChooseUs" index={idx} currentImage={item.preview} />
                    </td>
                    <td className="p-3 border border-[#2E5B84]">
                      <input
                        value={item.title}
                        onChange={(e) => handleChange(e, "whyChooseUs", idx, "title")}
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                      />
                    </td>
                    <td className="p-3 border border-[#2E5B84]">
                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          handleChange(e, "whyChooseUs", idx, "description")
                        }
                        rows={2}
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                      />
                    </td>
                    <td className="p-3 border border-[#2E5B84] text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem("whyChooseUs", idx)}
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
    
    </div>
  );
};

export default AdminManageHome;
