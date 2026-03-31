import React from "react";
import { useDropzone } from "react-dropzone";
import SubExperienceItem from "./SubExperienceItem";

export default function ExperienceForm({
  formData,
  setFormData,
  handleSubmit,
  submitLabel,
}) {
  // Hero Dropzone
  const { getRootProps: getHeroProps, getInputProps: getHeroInput } =
    useDropzone({
      accept: { "image/*": [] },
      multiple: false,
      onDrop: (files) =>
        setFormData({
          ...formData,
          heroImgFile: files[0],
          heroImgPreview: URL.createObjectURL(files[0]),
        }),
    });

  // Main Dropzone
  const { getRootProps: getMainProps, getInputProps: getMainInput } =
    useDropzone({
      accept: { "image/*": [] },
      multiple: false,
      onDrop: (files) =>
        setFormData({
          ...formData,
          mainImgFile: files[0],
          mainImgPreview: URL.createObjectURL(files[0]),
        }),
    });

  // Gallery Dropzone (multiple files)
  const { getRootProps: getGalleryProps, getInputProps: getGalleryInput } =
    useDropzone({
      accept: { "image/*": [] },
      multiple: true,
      onDrop: (files) =>
        setFormData({
          ...formData,
          galleryFiles: [...(formData.galleryFiles || []), ...files],
        }),
    });

  // Sub Experiences Handlers
  const addSubExperience = React.useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      subExperiences: [
        ...(prev.subExperiences || []),
        { location: "", place: "", image: "", desc: "" },
      ],
    }));
  }, [setFormData]);  

  const updateSubExperience = React.useCallback(
    (index, key, value) => {
      setFormData((prev) => {
        const updated = [...(prev.subExperiences || [])];
        updated[index] = { ...updated[index], [key]: value };
        return { ...prev, subExperiences: updated };
      });
    },
    [setFormData]
  );
  
  const removeSubExperience = React.useCallback(
    (index) => {
      setFormData((prev) => {
        const updated = [...(prev.subExperiences || [])];
        updated.splice(index, 1);
        return { ...prev, subExperiences: updated };
      });
    },
    [setFormData]
  );  

  // Tips Handlers
  const addTip = () =>
    setFormData({ ...formData, tips: [...(formData.tips || []), ""] });
  const updateTip = (index, value) => {
    const updated = [...(formData.tips || [])];
    updated[index] = value;
    setFormData({ ...formData, tips: updated });
  };
  const removeTip = (index) => {
    const updated = [...(formData.tips || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, tips: updated });
  };

  // Gallery removal
  const removeExistingGalleryImage = (url) => {
    const removed = [...(formData.removeGallery || [])];
    if (!removed.includes(url)) removed.push(url);
    setFormData({ ...formData, removeGallery: removed });
  };
  const removeNewGalleryFile = (i) => {
    const updated = [...(formData.galleryFiles || [])];
    updated.splice(i, 1);
    setFormData({ ...formData, galleryFiles: updated });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#2E5B84] p-10 rounded-2xl shadow-xl w-full max-w-5xl mx-auto mt-10"
    >
      <h2 className="text-3xl font-bold text-[#0d203a] mb-8 text-center">
        {submitLabel}
      </h2>

      {/* Slug */}
      <input
        type="text"
        placeholder="Slug"
        value={formData.slug}
        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
        className="border p-3 w-full rounded mb-4"
      />

      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="border p-3 w-full rounded mb-4"
      />

      {/* Subtitle */}
      <input
        type="text"
        placeholder="Subtitle"
        value={formData.subtitle}
        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
        className="border p-3 w-full rounded mb-4"
      />

      {/* Description */}
      <textarea
        placeholder="Description (short)"
        value={formData.description || ""}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="border p-3 w-full rounded mb-4"
      />

      {/* Main Description */}
      <textarea
        placeholder="Main Description"
        value={formData.mainDesc || ""}
        onChange={(e) => setFormData({ ...formData, mainDesc: e.target.value })}
        className="border p-3 w-full rounded mb-4"
      />

      {/* Sub Description */}
      <textarea
        placeholder="Sub Description"
        value={formData.subDesc || ""}
        onChange={(e) => setFormData({ ...formData, subDesc: e.target.value })}
        className="border p-3 w-full rounded mb-4"
      />

      {/* Hero Image */}
      <div className="mt-4 mb-4">
        <label className="font-semibold text-[#2E5B84]">Hero Image</label>
        <div
          {...getHeroProps()}
          className="border-2 border-dashed p-6 mt-2 cursor-pointer"
        >
          <input {...getHeroInput()} />
          <p>Click or drag & drop hero image here</p>
        </div>
        {formData.heroImgPreview ? (
          <img
            src={formData.heroImgPreview}
            alt="preview"
            className="w-48 h-48 mt-2 object-cover rounded"
          />
        ) : formData.heroImg ? (
          <img
            src={formData.heroImg}
            alt="hero"
            className="w-48 h-48 mt-2 object-cover rounded"
          />
        ) : null}
      </div>

      {/* Main Image */}
      <div className="mt-4 mb-4">
        <label className="font-semibold text-[#2E5B84]">Main Image</label>
        <div
          {...getMainProps()}
          className="border-2 border-dashed p-6 mt-2 cursor-pointer"
        >
          <input {...getMainInput()} />
          <p>Click or drag & drop main image here</p>
        </div>
        {formData.mainImgPreview ? (
          <img
            src={formData.mainImgPreview}
            alt="preview"
            className="w-48 h-48 mt-2 object-cover rounded"
          />
        ) : formData.mainImg ? (
          <img
            src={formData.mainImg}
            alt="main"
            className="w-48 h-48 mt-2 object-cover rounded"
          />
        ) : null}
      </div>

      {/* Gallery */}
      <div className="mt-6 mb-4">
        <label className="font-semibold text-[#2E5B84]">Gallery Images</label>
        <div
          {...getGalleryProps()}
          className="border-2 border-dashed p-6 mt-2 cursor-pointer"
        >
          <input {...getGalleryInput()} />
          <p>Click or drag & drop multiple images here</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {(formData.gallery || []).map((url, i) => {
            const removed = (formData.removeGallery || []).includes(url);
            if (removed) return null;
            return (
              <div key={i} className="relative">
                <img
                  src={url}
                  alt={`g-${i}`}
                  className="w-24 h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeExistingGalleryImage(url)}
                  className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs"
                >
                  x
                </button>
              </div>
            );
          })}

          {(formData.galleryFiles || []).map((f, i) => (
            <div key={`new-${i}`} className="relative">
              <img
                src={URL.createObjectURL(f)}
                alt={`new-${i}`}
                className="w-24 h-24 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeNewGalleryFile(i)}
                className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sub Experiences */}
      <div className="mt-6 mb-4">
        <h3 className="text-[#2E5B84] font-semibold mb-2">Sub Experiences</h3>
        {(formData.subExperiences || []).map((sub, idx) => (
          <SubExperienceItem
            sub={sub}
            idx={idx}
            updateSubExperience={updateSubExperience}
            removeSubExperience={removeSubExperience}
            preview={formData.subPreviews?.[idx]}
            onImageDrop={(file, preview) => {
              setFormData((prev) => {
                const files = [...(prev.subExperienceFiles || [])];
                files[idx] = file;

                return {
                  ...prev,
                  subExperienceFiles: files,
                  subPreviews: {
                    ...(prev.subPreviews || {}),
                    [idx]: preview,
                  },
                };
              });
            }}
          />
        ))}
        <button
          type="button"
          onClick={addSubExperience}
          className="bg-[#2E5B84] text-white px-4 py-1 rounded mt-2"
        >
          + Add Sub Experience
        </button>
      </div>

      {/* Tips */}
      <div className="mt-6 mb-4">
        <h3 className="text-[#2E5B84] font-semibold mb-2">Tips</h3>
        {(formData.tips || []).map((tip, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              placeholder="Tip"
              value={tip}
              onChange={(e) => updateTip(i, e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={() => removeTip(i)}
              className="bg-red-600 text-white px-2 rounded"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addTip}
          className="bg-[#2E5B84] text-white px-4 py-1 rounded mt-2"
        >
          + Add Tip
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-[#0d203a] text-white py-3 rounded-xl mt-6"
      >
        {submitLabel}
      </button>
    </form>
  );
}
