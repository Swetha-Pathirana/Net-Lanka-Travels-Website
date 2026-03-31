import React from "react";
import { useDropzone } from "react-dropzone";

export default function SocialMediaItem({
  sm,
  idx,
  onChange,
  onRemove,
  onFileDrop,
}) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (files) => onFileDrop(idx, files),
  });

  return (
    <div className="flex items-center gap-2 mb-4">
      <div
        {...getRootProps()}
        className="w-16 h-16 border-2 border-dashed flex items-center justify-center cursor-pointer rounded"
      >
        <input {...getInputProps()} />
        {sm.icon || sm.iconPreview ? (
          <img
            src={sm.icon || sm.iconPreview}
            alt={sm.platform}
            className="w-16 h-16 object-cover"
          />
        ) : (
          <span>Drop</span>
        )}
      </div>

      <input
        type="text"
        placeholder="Platform"
        value={sm.platform}
        onChange={(e) => onChange(idx, "platform", e.target.value)}
        className="border p-2 rounded flex-1"
      />
      <input
        type="text"
        placeholder="URL"
        value={sm.url}
        onChange={(e) => onChange(idx, "url", e.target.value)}
        className="border p-2 rounded flex-1"
      />

      <button
        type="button"
        onClick={() => onRemove(idx)}
        className="bg-red-500 text-white px-2 rounded"
      >
        X
      </button>
    </div>
  );
}
