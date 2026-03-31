import React from "react";
import { useDropzone } from "react-dropzone";

// ---------------- Gallery Slide Component ----------------
function GalleryUpload({ slide, index, onFile, onTitleChange, onDescChange, onRemove }) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (files) => onFile(index, files[0]),
  });

  return (
    <div className="border p-3 rounded mt-3">
      <div {...getRootProps()} className="border-2 border-dashed p-4 cursor-pointer">
        <input {...getInputProps()} />
        <p>Click or drag & drop gallery image</p>
      </div>

      {slide.imagePreview && (
        <img
          src={slide.imagePreview}
          className="w-48 h-32 mt-2 object-cover rounded"
          alt="Gallery"
        />
      )}

      <input
        placeholder="Title"
        value={slide.title}
        onChange={(e) => onTitleChange(index, e.target.value)}
        className="border p-2 w-full rounded mt-2"
      />

      <textarea
        placeholder="Description"
        value={slide.desc}
        onChange={(e) => onDescChange(index, e.target.value)}
        className="border p-2 w-full rounded mt-2"
      />

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="bg-red-600 text-white px-3 py-1 rounded mt-2"
      >
        Remove
      </button>
    </div>
  );
}
export default function DayTourForm({
  formData,
  setFormData,
  handleSubmit,
  submitLabel,
}) {
  // Main image
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (files) =>
      setFormData({
        ...formData,
        imgFile: files[0],
        imgPreview: URL.createObjectURL(files[0]),
      }),
  });

  // Hero image
  const { getRootProps: getHeroProps, getInputProps: getHeroInput } =
    useDropzone({
      accept: { "image/*": [] },
      onDrop: (files) =>
        setFormData({
          ...formData,
          heroImageFile: files[0],
          heroImagePreview: URL.createObjectURL(files[0]),
        }),
    });

  // ---------- Gallery ----------
  const addGallery = () =>
    setFormData({
      ...formData,
      gallerySlides: [...(formData.gallerySlides || []), { title: "", desc: "", imageFile: null, imagePreview: "" }],
    });

  const updateGalleryFile = (i, file) => {
    const arr = [...formData.gallerySlides];
    arr[i].imageFile = file;
    arr[i].imagePreview = file ? URL.createObjectURL(file) : arr[i].imagePreview;
    setFormData({ ...formData, gallerySlides: arr });
  };

  const updateGalleryField = (i, key, value) => {
    const arr = [...formData.gallerySlides];
    arr[i][key] = value;
    setFormData({ ...formData, gallerySlides: arr });
  };

  const removeGallery = (i) => {
    const arr = [...formData.gallerySlides];
    arr.splice(i, 1);
    setFormData({ ...formData, gallerySlides: arr });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#2E5B84] p-10 rounded-2xl shadow-xl max-w-4xl mx-auto space-y-6"
    >
      <h2 className="text-3xl font-bold text-[#0d203a] mb-8 text-center">
        {submitLabel}
      </h2>

      {/* Tour Info */}
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="border p-3 w-full rounded mb-4"
      />
      <input
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        className="border p-3 w-full rounded mb-4"
      />
      <textarea
        placeholder="Short Description"
        value={formData.desc}
        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
        className="border p-3 w-full rounded mb-4"
      />

      {/* Main Image */}
      <div className="mb-4">
        <label className="font-semibold text-[#2E5B84]">Tour Image</label>
        <div
          {...getRootProps()}
          className="border-2 border-dashed p-6 mt-2 cursor-pointer"
        >
          <input {...getInputProps()} />
          <p>Click or drag & drop image here</p>
        </div>
        {formData.imgPreview && (
          <img
            src={formData.imgPreview}
            alt="Tour"
            className="w-48 h-48 mt-2 object-cover rounded"
          />
        )}
      </div>

      {/* Hero Section */}
      <h3 className="text-xl font-semibold text-[#0d203a] mb-2">
        Hero Section
      </h3>
      <input
        type="text"
        placeholder="Hero Title"
        value={formData.heroTitle}
        onChange={(e) =>
          setFormData({ ...formData, heroTitle: e.target.value })
        }
        className="border p-3 w-full rounded mb-4"
      />
      <input
        type="text"
        placeholder="Hero Subtitle"
        value={formData.heroSubtitle}
        onChange={(e) =>
          setFormData({ ...formData, heroSubtitle: e.target.value })
        }
        className="border p-3 w-full rounded mb-4"
      />
      <div
        {...getHeroProps()}
        className="border-2 border-dashed p-6 mt-2 cursor-pointer mb-4"
      >
        <input {...getHeroInput()} />
        <p>Click or drag & drop hero image here</p>
      </div>
      {formData.heroImagePreview && (
        <img
          src={formData.heroImagePreview}
          alt="Hero"
          className="w-48 h-48 mt-2 object-cover rounded"
        />
      )}

      {/* About Section */}
      <h3 className="text-xl font-semibold text-[#0d203a] mb-2">
        About Paragraphs
      </h3>
      {formData.aboutParagraphs.map((p, idx) => (
        <textarea
          key={idx}
          placeholder={`Paragraph ${idx + 1}`}
          value={p}
          onChange={(e) => {
            const newParas = [...formData.aboutParagraphs];
            newParas[idx] = e.target.value;
            setFormData({ ...formData, aboutParagraphs: newParas });
          }}
          className="border p-3 w-full rounded mb-4"
        />
      ))}

      {/* Highlights */}
<h3 className="text-xl font-semibold text-[#0d203a] mb-2">Highlights</h3>
{formData.highlights.map((h, idx) => (
  <div key={idx} className="flex gap-2 mb-2">
    <input
      type="text"
      placeholder={`Highlight ${idx + 1}`}
      value={h}
      onChange={(e) => {
        const newHighlights = [...formData.highlights];
        newHighlights[idx] = e.target.value;
        setFormData({ ...formData, highlights: newHighlights });
      }}
      className="border p-2 w-full rounded"
    />
    <button
      type="button"
      onClick={() => {
        const newHighlights = [...formData.highlights];
        newHighlights.splice(idx, 1);
        setFormData({ ...formData, highlights: newHighlights });
      }}
      className="bg-red-600 text-white px-2 rounded"
    >
      Remove
    </button>
  </div>
))}
<button
  type="button"
  onClick={() => setFormData({ ...formData, highlights: [...formData.highlights, ""] })}
  className="bg-[#2E5B84] text-white px-4 py-2 rounded mb-4"
>
  + Add Highlight
</button>

{/* Duration */}
<input
  type="text"
  placeholder="Duration (e.g., Full day)"
  value={formData.duration}
  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
  className="border p-3 w-full rounded mb-4"
/>

{/* Includes */}
<input
  type="text"
  placeholder="Includes (comma separated)"
  value={formData.includes.join(",")}
  onChange={(e) => setFormData({ ...formData, includes: e.target.value.split(",") })}
  className="border p-3 w-full rounded mb-4"
/>

{/* Start Location */}
<input
  type="text"
  placeholder="Start Location"
  value={formData.startLocation}
  onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
  className="border p-3 w-full rounded mb-4"
/>

      {/* History Section */}
      <h3 className="text-xl font-semibold text-[#0d203a] mb-2">
        History Section
      </h3>
      <input
        type="text"
        placeholder="History Title"
        value={formData.historyTitle}
        onChange={(e) =>
          setFormData({ ...formData, historyTitle: e.target.value })
        }
        className="border p-3 w-full rounded mb-4"
      />
      <input
        type="text"
        placeholder="Left List (comma separated)"
        value={formData.historyLeftList.join(",")}
        onChange={(e) =>
          setFormData({
            ...formData,
            historyLeftList: e.target.value.split(","),
          })
        }
        className="border p-3 w-full rounded mb-4"
      />
      <input
        type="text"
        placeholder="Right List (comma separated)"
        value={formData.historyRightList.join(",")}
        onChange={(e) =>
          setFormData({
            ...formData,
            historyRightList: e.target.value.split(","),
          })
        }
        className="border p-3 w-full rounded mb-4"
      />


      {/* ---------- Gallery Slides ---------- */}
      <div>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Gallery Slides</h3>
          <button type="button" onClick={addGallery} className="bg-[#2E5B84] text-white px-4 py-1 rounded">+ Add Slide</button>
        </div>
        {(formData.gallerySlides || []).map((slide, i) => (
          <GalleryUpload
            key={i}
            slide={slide}
            index={i}
            onFile={updateGalleryFile}
            onTitleChange={(idx, v) => updateGalleryField(idx, "title", v)}
            onDescChange={(idx, v) => updateGalleryField(idx, "desc", v)}
            onRemove={removeGallery}
          />
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-[#0d203a] text-white py-3 rounded-xl"
      >
        {submitLabel}
      </button>
    </form>
  );
}
