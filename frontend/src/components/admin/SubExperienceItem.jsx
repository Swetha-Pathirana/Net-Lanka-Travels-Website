import React from "react";
import { useDropzone } from "react-dropzone";

const SubExperienceItem = React.memo(function SubExperienceItem({
  sub,
  idx,
  updateSubExperience,
  removeSubExperience,
  preview,
  onImageDrop,
}) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (files) => {
      const file = files[0];
      if (!file) return;
      onImageDrop(file, URL.createObjectURL(file));
    },
  });

  return (
    <div className="mb-3 border p-3 rounded">
      <input
        placeholder="Location"
        value={sub.location || ""}
        onChange={(e) =>
          updateSubExperience(idx, "location", e.target.value)
        }
        className="border p-2 rounded w-full mb-2"
      />

      <input
        placeholder="Subtitle"
        value={sub.place || ""}
        onChange={(e) =>
          updateSubExperience(idx, "place", e.target.value)
        }
        className="border p-2 rounded w-full mb-2"
      />

      <div
        {...getRootProps()}
        className="border-2 border-dashed p-4 mb-2 cursor-pointer text-center"
      >
        <input {...getInputProps()} />
        <p>Click or drag & drop sub experience image here</p>
      </div>

      {preview ? (
        <img
          src={preview}
          alt="sub preview"
          className="w-48 h-28 object-cover rounded mt-2"
        />
      ) : sub.image ? (
        <img
          src={sub.image}
          alt="sub existing"
          className="w-48 h-28 object-cover rounded mt-2"
        />
      ) : null}

      <input
        placeholder="Short desc"
        value={sub.desc || ""}
        onChange={(e) =>
          updateSubExperience(idx, "desc", e.target.value)
        }
        className="border p-2 rounded w-full mt-2 mb-2"
      />

      <button
        type="button"
        onClick={() => removeSubExperience(idx)}
        className="bg-red-600 text-white px-3 py-1 rounded"
      >
        Remove
      </button>
    </div>
  );
});

export default SubExperienceItem;
