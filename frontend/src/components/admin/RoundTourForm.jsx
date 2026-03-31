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

// ---------------- Main Form ----------------
export default function RoundTourForm({ formData, setFormData, handleSubmit, submitLabel }) {
  // ---------- Helpers ----------
  const updateField = (field, value) => setFormData({ ...formData, [field]: value });

  const handleDropFile = (field, file) => {
    setFormData({ ...formData, [field + "File"]: file, [field + "Preview"]: URL.createObjectURL(file) });
  };

  // ---------- Itinerary ----------
  const addItinerary = () =>
    setFormData({
      ...formData,
      itinerary: [...(formData.itinerary || []), { day: (formData.itinerary || []).length + 1, title: "", desc: "", activities: [] }],
    });

  const updateItinerary = (i, key, value) => {
    const arr = [...formData.itinerary];
    arr[i][key] = value;
    setFormData({ ...formData, itinerary: arr });
  };

  const removeItinerary = (i) => {
    const arr = [...formData.itinerary];
    arr.splice(i, 1);
    setFormData({ ...formData, itinerary: arr });
  };

  // ---------- Text Arrays ----------
  const addTextItem = (key) => setFormData({ ...formData, [key]: [...(formData[key] || []), ""] });
  const updateTextItem = (key, i, value) => {
    const arr = [...formData[key]];
    arr[i] = value;
    setFormData({ ...formData, [key]: arr });
  };
  const removeTextItem = (key, i) => {
    const arr = [...formData[key]];
    arr.splice(i, 1);
    setFormData({ ...formData, [key]: arr });
  };

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

  // ---------- Dropzones ----------
  const { getRootProps: getCardRootProps, getInputProps: getCardInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (files) => handleDropFile("img", files[0]),
  });

  const { getRootProps: getHeroRootProps, getInputProps: getHeroInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (files) => handleDropFile("heroImage", files[0]),
  });

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">{submitLabel}</h2>

      {/* ---------- Basic Info ---------- */}
      <div>
        <input className="border p-3 w-full rounded mb-3" placeholder="Title" value={formData.title} onChange={(e) => updateField("title", e.target.value)} />
        <input className="border p-3 w-full rounded mb-3" placeholder="Days" value={formData.days} onChange={(e) => updateField("days", e.target.value)} />
        <input className="border p-3 w-full rounded mb-3" placeholder="Location" value={formData.location} onChange={(e) => updateField("location", e.target.value)} />
        <textarea className="border p-3 w-full rounded mb-3" placeholder="Short Description" value={formData.desc} onChange={(e) => updateField("desc", e.target.value)} />
      </div>

      {/* ---------- Tour Card Image ---------- */}
      <div>
        <label className="font-semibold">Tour Card Image</label>
        <div {...getCardRootProps()} className="border-2 border-dashed p-6 mt-2 cursor-pointer">
          <input {...getCardInputProps()} />
          <p>Click or drag & drop image here</p>
        </div>
        {formData.imgPreview && <img src={formData.imgPreview} alt="Tour Card" className="w-48 h-32 mt-2 object-cover rounded shadow" />}
      </div>

      {/* ---------- Hero Section ---------- */}
      <div>
        <h3 className="font-semibold mb-2">Hero</h3>
        <input className="border p-3 w-full rounded mb-3" placeholder="Hero Title" value={formData.heroTitle} onChange={(e) => updateField("heroTitle", e.target.value)} />
        <input className="border p-3 w-full rounded mb-3" placeholder="Hero Subtitle" value={formData.heroSubtitle} onChange={(e) => updateField("heroSubtitle", e.target.value)} />
        <div {...getHeroRootProps()} className="border-2 border-dashed p-6 mt-2 cursor-pointer">
          <input {...getHeroInputProps()} />
          <p>Click or drag & drop hero image here</p>
        </div>
        {formData.heroImagePreview && <img src={formData.heroImagePreview} className="w-60 h-36 rounded mt-3 object-cover shadow" alt="Hero" />}
      </div>

      {/* ---------- Highlights ---------- */}
      <div>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Highlights</h3>
          <button type="button" onClick={() => addTextItem("highlights")} className="bg-[#2E5B84] text-white px-4 py-1 rounded">+ Add</button>
        </div>
        {(formData.highlights || []).map((item, i) => (
          <div key={i} className="flex gap-2 mt-2">
            <input className="border p-2 flex-1 rounded" placeholder="Highlight text" value={item} onChange={(e) => updateTextItem("highlights", i, e.target.value)} />
            <button type="button" onClick={() => removeTextItem("highlights", i)} className="bg-red-600 text-white px-3 rounded">✕</button>
          </div>
        ))}
      </div>

      {/* ---------- Daily Itinerary ---------- */}
      <div>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Daily Itinerary</h3>
          <button type="button" onClick={addItinerary} className="bg-[#2E5B84] text-white px-4 py-1 rounded">+ Add Day</button>
        </div>
        {(formData.itinerary || []).map((day, i) => (
          <div key={i} className="border p-4 rounded mt-3 space-y-2">
            <input className="border p-2 w-full rounded" placeholder="Day Number" value={day.day} onChange={(e) => updateItinerary(i, "day", e.target.value)} />
            <input className="border p-2 w-full rounded" placeholder="Title" value={day.title} onChange={(e) => updateItinerary(i, "title", e.target.value)} />
            <textarea className="border p-2 w-full rounded" placeholder="Description" value={day.desc} onChange={(e) => updateItinerary(i, "desc", e.target.value)} />

            {/* Activities */}
            <div className="mt-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Activities</span>
                <button type="button" onClick={() => {
                  const it = [...formData.itinerary];
                  it[i].activities = [...(it[i].activities || []), ""];
                  setFormData({ ...formData, itinerary: it });
                }} className="text-sm bg-green-600 text-white px-2 rounded">+ Add</button>
              </div>
              {(day.activities || []).map((a, ai) => (
                <div key={ai} className="flex gap-2 mt-1">
                  <input className="border p-2 flex-1 rounded" placeholder="Activity" value={a} onChange={(e) => {
                    const it = [...formData.itinerary];
                    it[i].activities[ai] = e.target.value;
                    setFormData({ ...formData, itinerary: it });
                  }} />
                  <button type="button" onClick={() => {
                    const it = [...formData.itinerary];
                    it[i].activities.splice(ai, 1);
                    setFormData({ ...formData, itinerary: it });
                  }} className="bg-red-600 text-white px-2 rounded">✕</button>
                </div>
              ))}
            </div>

            <button type="button" onClick={() => removeItinerary(i)} className="bg-red-600 text-white px-3 py-1 rounded mt-2">Remove Day</button>
          </div>
        ))}
      </div>

      {/* ---------- Inclusions / Exclusions / Offers ---------- */}
      {["inclusions", "exclusions", "offers"].map((key) => (
        <div key={key}>
          <div className="flex justify-between items-center">
            <h3 className="font-semibold capitalize">{key}</h3>
            <button type="button" onClick={() => addTextItem(key)} className="bg-[#2E5B84] text-white px-4 py-1 rounded">+ Add</button>
          </div>
          {(formData[key] || []).map((item, i) => (
            <div key={i} className="flex gap-2 mt-2">
              <input className="border p-2 flex-1 rounded" value={item} onChange={(e) => updateTextItem(key, i, e.target.value)} />
              <button type="button" onClick={() => removeTextItem(key, i)} className="bg-red-600 text-white px-3 rounded">✕</button>
            </div>
          ))}
          <hr className="my-3" />
        </div>
      ))}

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

      {/* ---------- Tour Facts ---------- */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Tour Facts</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Duration</label>
            <input type="text" placeholder="e.g., 14 Days / 13 Nights" className="border p-2 w-full rounded"
              value={formData.tourFacts.duration} onChange={(e) => setFormData({ ...formData, tourFacts: { ...formData.tourFacts, duration: e.target.value } })} />
          </div>
          <div>
            <label className="block mb-1">Group Size</label>
            <input type="text" placeholder="e.g., 2–20 people" className="border p-2 w-full rounded"
              value={formData.tourFacts.groupSize} onChange={(e) => setFormData({ ...formData, tourFacts: { ...formData.tourFacts, groupSize: e.target.value } })} />
          </div>
          <div>
            <label className="block mb-1">Difficulty</label>
            <input type="text" placeholder="e.g., Easy – Moderate" className="border p-2 w-full rounded"
              value={formData.tourFacts.difficulty} onChange={(e) => setFormData({ ...formData, tourFacts: { ...formData.tourFacts, difficulty: e.target.value } })} />
          </div>
        </div>
      </div>

      {/* ---------- Submit Button ---------- */}
      <div>
        <button type="submit" className="bg-[#2E5B84] text-white px-6 py-2 rounded w-full">{submitLabel}</button>
      </div>
    </form>
  );
}
