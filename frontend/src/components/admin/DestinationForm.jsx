import React from "react";
import { useDropzone } from "react-dropzone";

export default function DestinationForm({
  formData,
  setFormData,
  handleSubmit,
  submitLabel,
}) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (files) => {
      const file = files[0];
      setFormData({
        ...formData,
        imgFile: file,
        imgPreview: URL.createObjectURL(file),
      });
    },
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#2E5B84] p-10 rounded-2xl shadow-xl w-full max-w-2xl mx-auto mt-10"
    >
      <h2 className="text-3xl font-bold text-[#0d203a] mb-8 text-center">
        {submitLabel}
      </h2>

      <div className="space-y-6">
        {/* Subtitle */}
        <div>
          <label className="block font-semibold mb-1 text-[#2E5B84]">
            Subtitle
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) =>
              setFormData({ ...formData, subtitle: e.target.value })
            }
            className="border border-[#2E5B84] focus:ring-[#2E5B84] focus:border-[#1E3A60] p-3 w-full rounded-lg"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block font-semibold mb-1 text-[#2E5B84]">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="border border-[#2E5B84] focus:ring-[#2E5B84] focus:border-[#1E3A60] p-3 w-full rounded-lg"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block font-semibold mb-2 text-[#2E5B84]">
            Destination Image
          </label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-[#2E5B84] rounded-xl p-8 text-center cursor-pointer hover:bg-[#e0f0ff] transition"
          >
            <input {...getInputProps()} />
            <p className="text-[#2E5B84] font-medium">
              Click or drag & drop image here
            </p>
          </div>
          {formData.imgPreview && (
            <img
              src={formData.imgPreview}
              className="w-48 h-48 object-cover rounded-xl mt-4 shadow-md mx-auto"
              alt="Preview"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#0d203a] text-white py-3 rounded-xl text-lg font-semibold hover:bg-[#2E5B84] transition"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
