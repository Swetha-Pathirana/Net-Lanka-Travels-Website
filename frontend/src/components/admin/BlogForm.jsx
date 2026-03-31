import React from "react";
import { useDropzone } from "react-dropzone";

export default function BlogForm({
  formData,
  setFormData,
  handleSubmit,
  submitLabel,
}) {
  const heroDropzone = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (files) =>
      setFormData({
        ...formData,
        heroImgFile: files[0],
        heroImgPreview: URL.createObjectURL(files[0]),
      }),
  });

  const galleryDropzone = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 5,
    onDrop: (files) =>
      setFormData({
        ...formData,
        galleryImgFiles: files,
        galleryImgPreviews: files.map((f) =>
          URL.createObjectURL(f)
        ),
      }),
  });

  const addParagraph = () => {
    setFormData({
      ...formData,
      contentParagraphs: [...(formData.contentParagraphs || []), ""],
    });
  };

  const updateParagraph = (idx, value) => {
    const updated = [...(formData.contentParagraphs || [])];
    updated[idx] = value;
    setFormData({ ...formData, contentParagraphs: updated });
  };

  const removeParagraph = (idx) => {
    const updated = [...(formData.contentParagraphs || [])];
    updated.splice(idx, 1);
    setFormData({ ...formData, contentParagraphs: updated });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#2E5B84] p-10 rounded-2xl shadow-xl w-full max-w-3xl mx-auto mt-10"
    >
      <h2 className="text-3xl font-bold text-[#0d203a] mb-8 text-center">
        {submitLabel}
      </h2>

      <input
        type="text"
        placeholder="Slug"
        value={formData.slug}
        onChange={(e) =>
          setFormData({ ...formData, slug: e.target.value })
        }
        className="border p-3 w-full rounded mb-4"
      />

      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) =>
          setFormData({ ...formData, title: e.target.value })
        }
        className="border p-3 w-full rounded mb-4"
      />

      <input
        type="text"
        placeholder="Subtitle"
        value={formData.subtitle}
        onChange={(e) =>
          setFormData({ ...formData, subtitle: e.target.value })
        }
        className="border p-3 w-full rounded mb-4"
      />

      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="border p-3 w-full rounded mb-4"
        rows={3}
      />

      {/* Content Paragraphs */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="font-semibold text-[#2E5B84]">
            Content Paragraphs
          </label>
          <button
            type="button"
            onClick={addParagraph}
            className="bg-[#2E5B84] text-white px-4 py-1 rounded"
          >
            + Add Paragraph
          </button>
        </div>

        {(formData.contentParagraphs || []).map((para, idx) => (
          <div key={idx} className="mb-2 flex gap-2">
            <textarea
              value={para}
              onChange={(e) =>
                updateParagraph(idx, e.target.value)
              }
              className="border p-3 w-full rounded"
            />
            <button
              type="button"
              onClick={() => removeParagraph(idx)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Hero Image */}
      <div className="mb-4">
        <label className="font-semibold text-[#2E5B84]">
          Hero Image
        </label>
        <div
          {...heroDropzone.getRootProps()}
          className="border-2 border-dashed p-6 mt-2 cursor-pointer"
        >
          <input {...heroDropzone.getInputProps()} />
          <p>Click or drag & drop image here</p>
        </div>

        {formData.heroImgPreview && (
          <img
            src={formData.heroImgPreview}
            className="w-48 h-48 mt-2 object-cover rounded"
            alt=""
          />
        )}
      </div>

      {/* Gallery Images */}
      <div className="mb-4">
        <label className="font-semibold text-[#2E5B84]">
          Gallery Images (Max 5)
        </label>

        <div
          {...galleryDropzone.getRootProps()}
          className="border-2 border-dashed p-6 mt-2 cursor-pointer"
        >
          <input {...galleryDropzone.getInputProps()} />
          <p>Click or drag & drop images</p>
        </div>

        <div className="flex gap-3 mt-3 flex-wrap">
          {formData.galleryImgPreviews?.map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-24 h-24 object-cover rounded"
              alt=""
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#0d203a] text-white py-3 rounded-xl mt-6"
      >
        {submitLabel}
      </button>
    </form>
  );
}
