import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useDropzone } from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminManageTeam = () => {
  const MAX_FILE_SIZE = 50 * 1024 * 1024;
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const [teamData, setTeamData] = useState({
    description: "",
    fullDescription: [],
    teamImage: "",
    members: [],
  });

  const [files, setFiles] = useState({
    teamImage: null,
    memberImages: [],
  });

  // Fetch existing team data
  const fetchTeam = async () => {
    try {
      const res = await axiosInstance.get("/team");
      if (res.data) {
        setTeamData({
          ...res.data,
          members: res.data.members || [],
          fullDescription: res.data.fullDescription || [],
          teamImage: res.data.teamImage || "",
        });
        setFiles({
          teamImage: null,
          memberImages: res.data.members
            ? res.data.members.map(() => null)
            : [],
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load team data");
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  // Handle input changes
  const handleChange = (e, section, index, field) => {
    if (section === "members") {
      const updated = [...teamData.members];
      updated[index][field] = e.target.value;
      setTeamData({ ...teamData, members: updated });
    } else if (section === "fullDescription") {
      const updated = [...teamData.fullDescription];
      updated[index].description = e.target.value;
      setTeamData({ ...teamData, fullDescription: updated });
    } else {
      setTeamData({ ...teamData, [e.target.name]: e.target.value });
    }
  };

  // Add new item
  const handleAddItem = (section, template = {}) => {
    setTeamData({
      ...teamData,
      [section]: [...(teamData[section] || []), template],
    });
    if (section === "members") {
      setFiles((prev) => ({
        ...prev,
        memberImages: [...prev.memberImages, null],
      }));
    }
  };

  // Remove item
  const handleRemoveItem = (section, idx) => {
    const updated = [...(teamData[section] || [])];
    updated.splice(idx, 1);
    setTeamData({ ...teamData, [section]: updated });

    if (section === "members") {
      const updatedFiles = [...files.memberImages];
      updatedFiles.splice(idx, 1);
      setFiles({ ...files, memberImages: updatedFiles });
    }
  };

  // Handle file drop
  const handleDrop = (acceptedFiles, type, index) => {
    const oversizedFiles = acceptedFiles.filter(
      (file) => file.size > MAX_FILE_SIZE
    );
    if (oversizedFiles.length) toast.error("Some files exceed 50MB");

    const validFiles = acceptedFiles.filter(
      (file) => file.size <= MAX_FILE_SIZE
    );

    if (type === "teamImage") {
      setFiles({ ...files, teamImage: validFiles[0] });
      setTeamData({
        ...teamData,
        teamImage: validFiles[0] ? URL.createObjectURL(validFiles[0]) : "",
      });
    } else if (type === "member") {
      const arr = [...files.memberImages];
      arr[index] = validFiles[0];
      setFiles({ ...files, memberImages: arr });

      const updatedMembers = [...teamData.members];
      updatedMembers[index].image = validFiles[0]
        ? URL.createObjectURL(validFiles[0])
        : "";
      setTeamData({ ...teamData, members: updatedMembers });
    }
  };

  // Dropzone component
  const Dropzone = ({ type, index }) => {
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (acceptedFiles) => handleDrop(acceptedFiles, type, index),
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

  // Submit data
  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(teamData));

      if (files.teamImage) formData.append("teamImage", files.teamImage);
      files.memberImages.forEach((file, idx) => {
        if (file) formData.append(`members[${idx}][image]`, file); // By index
      });

      const res = await axiosInstance.post("/team", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        toast.success("Team updated successfully!");
        setTeamData({
          ...res.data,
          members: res.data.members || [],
          fullDescription: res.data.fullDescription || [],
          teamImage: res.data.teamImage || "",
        });
        setFiles({
          teamImage: null,
          memberImages: res.data.members.map(() => null),
        });
      } else {
        toast.error("Failed to update team");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update team");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
 

      <main>
        <h2 className="text-4xl font-bold text-[#0d203a] mb-4 px-5 mt-4">
          Manage Our Team
        </h2>

        {/* Save Button */}
        <div className="flex justify-end mb-6 px-5">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className={`bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60] ${
              isSaving ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? "Saving..." : "Save Team"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-4">
          {["description", "fullDescription", "members"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t ${
                activeTab === tab
                  ? "bg-[#2E5B84] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab === "description"
                ? "Team Image"
                : tab === "fullDescription"
                ? "Full Description"
                : "Team Members"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "description" && (
          <div className="mb-6 px-5">
            <h3 className="text-xl font-semibold text-[#0d203a] mb-2">
              Team Image
            </h3>
            <Dropzone type="teamImage" />
            {teamData.teamImage && (
              <div className="flex justify-center mt-2">
                <img
                  src={teamData.teamImage}
                  alt="team"
                  className="w-64 max-h-64 object-cover rounded"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "fullDescription" && (
          <div className="px-5">
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() =>
                  handleAddItem("fullDescription", { description: "" })
                }
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
                {(teamData.fullDescription || []).map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#2E5B84] hover:bg-blue-50"
                  >
                    <td className="p-3 border border-[#2E5B84]">
                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          handleChange(e, "fullDescription", idx, "description")
                        }
                        rows={4}
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
          </div>
        )}

        {activeTab === "members" && (
          <div className="px-5">
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() =>
                  handleAddItem("members", {
                    name: "",
                    role: "",
                    description: "",
                    image: "",
                  })
                }
                className="bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60]"
              >
                + Add Member
              </button>
            </div>
            <table className="w-full border border-[#1a354e] rounded mb-6">
              <thead className="bg-[#0d203a] text-white">
                <tr>
                  <th className="p-3 border border-[#1a354e]">Name</th>
                  <th className="p-3 border border-[#1a354e]">Role</th>
                  <th className="p-3 border border-[#1a354e]">Description</th>
                  <th className="p-3 border border-[#1a354e]">Image</th>
                  <th className="p-3 border border-[#1a354e] text-center w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {(teamData.members || []).map((member, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#2E5B84] hover:bg-blue-50"
                  >
                    <td className="p-3 border border-[#2E5B84]">
                      <input
                        value={member.name || ""}
                        onChange={(e) =>
                          handleChange(e, "members", idx, "name")
                        }
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                      />
                    </td>
                    <td className="p-3 border border-[#2E5B84]">
                      <input
                        value={member.role || ""}
                        onChange={(e) =>
                          handleChange(e, "members", idx, "role")
                        }
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                      />
                    </td>
                    <td className="p-3 border border-[#2E5B84]">
                      <textarea
                        value={member.description || ""}
                        onChange={(e) =>
                          handleChange(e, "members", idx, "description")
                        }
                        rows={6}
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-[#2E5B84]"
                      />
                    </td>
                    <td className="p-3 border border-[#2E5B84] text-center">
                      <Dropzone type="member" index={idx} />
                      {member.image && (
                        <img
                          src={member.image}
                          alt="member"
                          className="w-20 h-20 object-cover rounded mt-1 mx-auto"
                        />
                      )}
                    </td>
                    <td className="p-3 border border-[#2E5B84] text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem("members", idx)}
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
      </main>
    </div>
  );
};

export default AdminManageTeam;
