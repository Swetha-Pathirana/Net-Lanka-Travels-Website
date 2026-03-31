import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useDropzone } from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageDestination() {
  const [destinations, setDestinations] = useState([
    { img: "", subtitle: "", title: "" },
  ]);

  const [imageFiles, setImageFiles] = useState([]);

  // ---------------- FETCH DESTINATIONS ----------------
  const fetchDestinations = async () => {
    try {
      const res = await axiosInstance.get("/destination");
      if (res.data) {
        setDestinations(res.data.destinations || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load destinations");
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // --------------- INPUT HANDLER ----------------
  const handleChange = (e, index, field) => {
    const updated = [...destinations];
    updated[index][field] = e.target.value;
    setDestinations(updated);
  };

  // --------------- ADD DESTINATION ----------------
  const handleAdd = () => {
    setDestinations([
      ...destinations,
      { img: "", subtitle: "", title: "" },
    ]);
    setImageFiles([...imageFiles, null]);
  };

  // --------------- REMOVE DESTINATION ----------------
  const handleRemove = (idx) => {
    const updated = [...destinations];
    updated.splice(idx, 1);
    setDestinations(updated);

    const imgFiles = [...imageFiles];
    imgFiles.splice(idx, 1);
    setImageFiles(imgFiles);
  };

  // --------------- DROPZONE ----------------
  const Dropzone = ({ index }) => {
    const { getRootProps, getInputProps } = useDropzone({
      accept: { "image/*": [] },
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        const updatedFiles = [...imageFiles];
        updatedFiles[index] = file;
        setImageFiles(updatedFiles);

        const updatedDest = [...destinations];
        updatedDest[index].img = URL.createObjectURL(file);
        setDestinations(updatedDest);
      },
    });

    return (
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-blue-400 rounded-md p-4 text-center cursor-pointer hover:bg-blue-50"
      >
        <input {...getInputProps()} />
        <p className="text-blue-600">Drag & drop image or click</p>
      </div>
    );
  };

  // --------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("data", JSON.stringify({ destinations }));

    imageFiles.forEach((file) => {
      if (file) formData.append("images", file);
    });

    try {
      const res = await axiosInstance.post("/destinations", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Destinations updated successfully!");
      setDestinations(res.data.destinations);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update destinations");
    }
  };

  // ---------------- UI ----------------
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />


      {/* Main Content */}
      <main>
        <h2 className="text-3xl font-bold mb-6 text-blue-800">
          Manage Destinations
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded shadow-md">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((item, idx) => (
              <div key={idx} className="p-4 border bg-blue-50 rounded space-y-3 relative">

                {/* Image Upload */}
                <Dropzone index={idx} />

                {/* Preview */}
                {item.img && (
                  <div className="flex justify-center mt-2">
                    <img
                      src={item.img}
                      className="w-40 h-40 object-cover rounded shadow"
                      alt="preview"
                    />
                  </div>
                )}

                {/* Fields */}
                <input
                  placeholder="Subtitle"
                  value={item.subtitle}
                  onChange={(e) => handleChange(e, idx, "subtitle")}
                  className="border p-2 w-full rounded"
                />

                <input
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => handleChange(e, idx, "title")}
                  className="border p-2 w-full rounded"
                />

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="text-blue-600 underline font-semibold"
          >
            + Add Destination
          </button>

          <button
            type="submit"
            className="block bg-blue-700 text-white px-8 py-3 rounded mt-4 hover:bg-blue-800"
          >
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
}
