import React from "react";
import { useDropzone } from "react-dropzone";

export default function TaxiForm({
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
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
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
        {/* Name */}
        <div>
          <label className="block font-semibold mb-1 text-[#2E5B84]">
            Vehicle Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="border border-[#2E5B84] p-3 w-full rounded-lg"
          />
        </div>

{/* Transmission */}
<div>
  <label className="block font-semibold mb-1 text-[#2E5B84]">
    Transmission
  </label>

  <select
    value={formData.transmission}
    onChange={(e) =>
      setFormData({ ...formData, transmission: e.target.value })
    }
    className="border border-[#2E5B84] p-3 w-full rounded-lg"
  >
    <option value="">Select Transmission</option>
    <option value="Manual">Manual</option>
    <option value="Automatic">Automatic</option>
    <option value="Both">Manual & Automatic</option>
  </select>
</div>

        {/* Seats */}
        <div>
          <label className="block font-semibold mb-1 text-[#2E5B84]">
            Seats
          </label>
          <input
            type="number"
            value={formData.seats}
            onChange={(e) =>
              setFormData({ ...formData, seats: e.target.value })
            }
            className="border border-[#2E5B84] p-3 w-full rounded-lg"
          />
        </div>

        {/* Luggage */}
        <div>
          <label className="block font-semibold mb-1 text-[#2E5B84]">
            Luggage
          </label>
          <input
            type="text"
            value={formData.luggage}
            onChange={(e) =>
              setFormData({ ...formData, luggage: e.target.value })
            }
            className="border border-[#2E5B84] p-3 w-full rounded-lg"
          />
        </div>

        {/* Capacity */}
        <div>
          <label className="block font-semibold mb-1 text-[#2E5B84]">
            Passanger Capacity
          </label>
          <input
            type="text"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({ ...formData, capacity: e.target.value })
            }
            className="border border-[#2E5B84] p-3 w-full rounded-lg"
          />
        </div>

        {/* AC */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.ac}
            onChange={(e) => setFormData({ ...formData, ac: e.target.checked })}
          />
          <label className="font-semibold text-[#2E5B84]">
            Air Conditioned
          </label>
        </div>

        {/* Image */}
        <div>
          <label className="block font-semibold mb-2 text-[#2E5B84]">
            Vehicle Image
          </label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-[#2E5B84] rounded-xl p-8 text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            <p className="text-[#2E5B84] font-medium">
              Click or drag & drop image here
            </p>
          </div>

          {formData.imagePreview && (
            <img
              src={formData.imagePreview}
              className="w-40 h-40 object-cover rounded-xl mt-4 mx-auto"
              alt="Preview"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#0d203a] text-white py-3 rounded-xl text-lg font-semibold hover:bg-[#2E5B84]"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
