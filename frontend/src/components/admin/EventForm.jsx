import React from "react";
import { useDropzone } from "react-dropzone";

// Gallery Image Component (images only)
function GalleryUpload({ slide, index, onFile, onRemove }) {
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
        <img src={slide.imagePreview} alt="Gallery" className="w-48 h-32 mt-2 object-cover rounded" />
      )}

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

export default function EventForm({ formData, setFormData, handleSubmit, submitLabel }) {
  // Main Event Image
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (files) =>
      setFormData({
        ...formData,
        imgFile: files[0],
        imgPreview: URL.createObjectURL(files[0]),
      }),
  });

  // Hero Image
  const { getRootProps: getHeroProps, getInputProps: getHeroInput } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (files) =>
      setFormData({
        ...formData,
        heroImageFile: files[0],
        heroImagePreview: URL.createObjectURL(files[0]),
      }),
  });

  // Add Gallery Image
  const addGallery = () =>
    setFormData({
      ...formData,
      galleryImgs: [...(formData.galleryImgs || []), { imageFile: null, imagePreview: "" }],
    });

  const updateGalleryFile = (i, file) => {
    const arr = [...formData.galleryImgs];
    arr[i].imageFile = file;
    arr[i].imagePreview = file ? URL.createObjectURL(file) : arr[i].imagePreview;
    setFormData({ ...formData, galleryImgs: arr });
  };

  const removeGallery = (i) => {
    const arr = [...formData.galleryImgs];
    arr.splice(i, 1);
    setFormData({ ...formData, galleryImgs: arr });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border p-10 rounded-2xl shadow-xl max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center">{submitLabel}</h2>

      {/* Basic Info */}
      <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="border p-3 w-full rounded" />
      <input type="text" placeholder="Slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="border p-3 w-full rounded" />
      <input type="text" placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="border p-3 w-full rounded" />
      <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="border p-3 w-full rounded" />
      <textarea placeholder="Short Description" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="border p-3 w-full rounded" />

      {/* Main Image */}
      <div>
        <label className="font-semibold">Event Image</label>
        <div {...getRootProps()} className="border-2 border-dashed p-6 mt-2 cursor-pointer">
          <input {...getInputProps()} />
          <p>Click or drag & drop image here</p>
        </div>
        {formData.imgPreview && <img src={formData.imgPreview} alt="Event" className="w-48 h-48 mt-2 object-cover rounded" />}
      </div>

      {/* Hero Section */}
      <h3 className="text-xl font-semibold">Hero Section</h3>
      <input type="text" placeholder="Hero Title" value={formData.heroTitle} onChange={e => setFormData({...formData, heroTitle: e.target.value})} className="border p-3 w-full rounded" />
      <input type="text" placeholder="Hero Subtitle" value={formData.heroSubtitle} onChange={e => setFormData({...formData, heroSubtitle: e.target.value})} className="border p-3 w-full rounded" />
      <div {...getHeroProps()} className="border-2 border-dashed p-6 mt-2 cursor-pointer">
        <input {...getHeroInput()} />
        <p>Click or drag & drop hero image here</p>
      </div>
      {formData.heroImagePreview && <img src={formData.heroImagePreview} alt="Hero" className="w-48 h-48 mt-2 object-cover rounded" />}

      {/* About Paragraphs */}
      <h3 className="text-xl font-semibold">About Paragraphs</h3>
      {formData.aboutParagraphs.map((p, idx) => (
        <textarea key={idx} placeholder={`Paragraph ${idx+1}`} value={p} onChange={e => {
          const arr = [...formData.aboutParagraphs]; arr[idx] = e.target.value; setFormData({...formData, aboutParagraphs: arr});
        }} className="border p-3 w-full rounded mb-2"/>
      ))}

      {/* Highlights */}
      <h3 className="text-xl font-semibold">Highlights</h3>
      {formData.highlights.map((h, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input type="text" placeholder={`Highlight ${idx+1}`} value={h} onChange={e => {
            const arr = [...formData.highlights]; arr[idx] = e.target.value; setFormData({...formData, highlights: arr});
          }} className="border p-2 w-full rounded"/>
          <button type="button" onClick={() => { const arr = [...formData.highlights]; arr.splice(idx, 1); setFormData({...formData, highlights: arr}); }} className="bg-red-600 text-white px-2 rounded">Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => setFormData({...formData, highlights:[...formData.highlights,""]})} className="bg-[#2E5B84] text-white px-4 py-2 rounded">+ Add Highlight</button>

      {/* Duration, Includes, Start Location */}
      <input type="text" placeholder="Duration" value={formData.duration} onChange={e => setFormData({...formData,duration:e.target.value})} className="border p-3 w-full rounded" />
      <input type="text" placeholder="Includes (comma separated)" value={formData.includes.join(",")} onChange={e => setFormData({...formData,includes:e.target.value.split(",")})} className="border p-3 w-full rounded" />
      <input type="text" placeholder="Start Location" value={formData.startLocation} onChange={e => setFormData({...formData,startLocation:e.target.value})} className="border p-3 w-full rounded" />

      {/* Why/Who/Tips/Plan */}
      <textarea placeholder="Why Should Attend?" value={formData.whyShouldAttend} onChange={e=>setFormData({...formData,whyShouldAttend:e.target.value})} className="border p-3 w-full rounded" />
      <textarea placeholder="Who Should Attend?" value={formData.whoShouldAttend} onChange={e=>setFormData({...formData,whoShouldAttend:e.target.value})} className="border p-3 w-full rounded" />
      <textarea placeholder="Tips For Attendees" value={formData.tipsForAttendees} onChange={e=>setFormData({...formData,tipsForAttendees:e.target.value})} className="border p-3 w-full rounded" />
      <textarea placeholder="Plan Your Visit" value={formData.planYourVisit} onChange={e=>setFormData({...formData,planYourVisit:e.target.value})} className="border p-3 w-full rounded" />

      {/* Gallery */}
      <div>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Gallery Images</h3>
          <button type="button" onClick={addGallery} className="bg-[#2E5B84] text-white px-4 py-1 rounded">+ Add Image</button>
        </div>
        {(formData.galleryImgs||[]).map((slide,i)=>(
          <GalleryUpload key={i} slide={slide} index={i} onFile={updateGalleryFile} onRemove={removeGallery}/>
        ))}
      </div>

      <button type="submit" className="w-full bg-[#0d203a] text-white py-3 rounded-xl">{submitLabel}</button>
    </form>
  );
}
