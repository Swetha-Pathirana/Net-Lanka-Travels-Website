import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SocialMediaItem from "../../components/admin/SocialMediaItem";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: "/images/marker-icon-2x-blue.webp",
  shadowUrl: "/images/marker-shadow.webp",
});


export default function EditContact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [mapCenter, setMapCenter] = useState([7.0, 80.0]);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axiosInstance.get("/contact");
        const data = res.data;
        setFormData({
          phone: data.phone || "",
          whatsapp: data.whatsapp || "",
          emails: data.emails || (data.email ? [data.email] : [""]),
          offices: data.offices || [
            {
              name: data.corporateOffice || "Corporate Office",
              address: data.corporateOffice || "",
              coords: data.corporateCoords || [7.0, 80.0],
            },
            {
              name: data.regionalOffice || "Regional Office",
              address: data.regionalOffice || "",
              coords: data.regionalCoords || [7.0, 80.0],
            },
          ],
          workingHours: data.workingHours || { start: "09:00", end: "17:00" },
          socialMedia: data.socialMedia || [
            { platform: "", url: "", iconPreview: "", iconFile: null },
          ],
        });        
        const firstOfficeCoords = data.corporateCoords || [7.0, 80.0];
        setMapCenter(firstOfficeCoords);
      } catch (err) {
        toast.error("Failed to load contact details");
      }
    };
    fetchContact();
  }, []);

  const handleSocialMediaChange = (idx, key, value) => {
    const newSM = [...formData.socialMedia];
    newSM[idx][key] = value;
    setFormData({ ...formData, socialMedia: newSM });
  };

  const handleSocialIconDrop = (idx, files) => {
    const file = files[0];
    const newSM = [...formData.socialMedia];
    newSM[idx].iconFile = file;
    newSM[idx].iconPreview = URL.createObjectURL(file);
    setFormData({ ...formData, socialMedia: newSM });
  };

  const handleAddSocialLink = () => {
    setFormData({
      ...formData,
      socialMedia: [
        ...formData.socialMedia,
        { platform: "", url: "", iconPreview: "", iconFile: null },
      ],
    });
  };

  const handleRemoveSocialLink = (idx) => {
    const newSM = formData.socialMedia.filter((_, i) => i !== idx);
    setFormData({ ...formData, socialMedia: newSM });
  };

  const geocodeOffice = async (address, idx) => {
    if (!address) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        const newOffices = [...formData.offices];
        newOffices[idx].coords = coords;
        setFormData({ ...formData, offices: newOffices });
        setMapCenter(coords);
      } else {
        toast.error("Address not found. Try a broader location.");
      }
    } catch (err) {
      toast.error("Unable to find location.");
    }
  };

  const handleMarkerDrag = async (idx, latlng) => {
    const newOffices = [...formData.offices];
    newOffices[idx].coords = [latlng.lat, latlng.lng];
    setFormData({ ...formData, offices: newOffices });

    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.display_name) {
        newOffices[idx].address = data.display_name;
        setFormData({ ...formData, offices: newOffices });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

        // Determine role and base path
        const role = sessionStorage.getItem("role") || "admin";
        const basePath = role === "superadmin" ? "/super-admin" : "/admin";

    try {
      const dataToSend = new FormData();
      formData.socialMedia.forEach((sm, idx) => {
        if (sm.iconFile) {
          const uniqueName = Date.now() + "-" + sm.iconFile.name;
          dataToSend.append("socialIcons", sm.iconFile, uniqueName);
          sm.iconFileName = uniqueName;
        } else if (sm.icon) {
          sm.iconFileName = sm.icon.split("/").pop();
        } else {
          sm.iconFileName = "";
        }
      });      
      dataToSend.append(
        "data",
        JSON.stringify({
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          emails: formData.emails,
          offices: formData.offices,
          workingHours: formData.workingHours,
          socialMedia: formData.socialMedia.map((sm) => ({
            platform: sm.platform,
            url: sm.url,
            iconFileName: sm.iconFileName,
          })),
        })
      );      
      await axiosInstance.put("/contact", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Contact updated successfully!");
      setTimeout(() => navigate(`${basePath}/contacts`), 800);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update contact");
    }
  };

  if (!formData) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div>
      <ToastContainer />
 

      <main>
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#2E5B84] p-10 rounded-2xl shadow-xl w-full max-w-4xl mx-auto mt-10"
        >
          <h2 className="text-3xl font-bold text-[#0d203a] mb-8 text-center">
            Update Contact Information
          </h2>

{/* Phone */}
<h3 className="font-semibold mt-4 mb-2">Phone</h3>
<input
  type="text"
  value={formData.phone}
  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
  className="border p-2 rounded w-full mb-4"
/>

{/* WhatsApp */}
<h3 className="font-semibold mt-4 mb-2">WhatsApp</h3>
<input
  type="text"
  value={formData.whatsapp}
  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
  className="border p-2 rounded w-full mb-4"
/>

          {/* Emails */}
          <h3 className="font-semibold mt-4 mb-2">Emails</h3>
          {formData.emails.map((email, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  const newEmails = [...formData.emails];
                  newEmails[idx] = e.target.value;
                  setFormData({ ...formData, emails: newEmails });
                }}
                className="border p-2 rounded w-full"
              />
              <button
                type="button"
                onClick={() => {
                  const newEmails = formData.emails.filter((_, i) => i !== idx);
                  setFormData({ ...formData, emails: newEmails });
                }}
                className="bg-red-500 text-white px-2 rounded"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, emails: [...formData.emails, ""] })
            }
            className="bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60]"
          >
            Add Email
          </button>

          {/* Offices */}
          <h3 className="font-semibold mt-4 mb-2">Offices</h3>
          {formData.offices.map((office, idx) => (
            <div key={idx} className="mb-4 border p-3 rounded">
              <input
                type="text"
                placeholder="Office Name"
                value={office.name}
                onChange={(e) => {
                  const newOffices = [...formData.offices];
                  newOffices[idx].name = e.target.value;
                  setFormData({ ...formData, offices: newOffices });
                }}
                className="border p-2 rounded w-full mb-2"
              />
              <input
                type="text"
                placeholder="Address"
                value={office.address}
                onChange={(e) => {
                  const newOffices = [...formData.offices];
                  newOffices[idx].address = e.target.value;
                  setFormData({ ...formData, offices: newOffices });
                }}
                onBlur={(e) => geocodeOffice(e.target.value, idx)} 
                className="border p-2 rounded w-full mb-2"
              />

              <button
                type="button"
                onClick={() => {
                  const newOffices = formData.offices.filter(
                    (_, i) => i !== idx
                  );
                  setFormData({ ...formData, offices: newOffices });
                }}
                className="bg-red-500 text-white px-2 rounded mb-2"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                offices: [
                  ...formData.offices,
                  { name: "New Office", address: "", coords: [7.0, 80.0] },
                ],
              })
            }
            className="bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60]"
          >
            Add Office
          </button>

          {/* Map for offices */}
          <div className="h-[400px] w-full rounded-lg overflow-hidden border-2 border-[#2E5B84] mt-6 mb-6">
            <MapContainer center={mapCenter} zoom={8} className="w-full h-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {formData.offices.map((office, idx) => (
                <Marker
                  key={idx}
                  position={office.coords}
                  draggable
                  eventHandlers={{
                    dragend: (e) => handleMarkerDrag(idx, e.target.getLatLng()),
                  }}
                >
                  <Popup>
                    <div className="font-semibold">{office.name}</div>
                    <div>{office.address}</div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Working Hours */}
          <h3 className="font-semibold mt-4 mb-2">Working Hours</h3>
          <input
            type="text"
            placeholder="09:00 - 17:00"
            value={`${formData.workingHours.start} - ${formData.workingHours.end}`}
            onChange={(e) => {
              const [start, end] = e.target.value
                .split("-")
                .map((x) => x.trim());
              setFormData({
                ...formData,
                workingHours: { start: start || "", end: end || "" },
              });
            }}
            className="border p-2 rounded w-full mb-4"
          />

          {/* Social Media */}
          <h3 className="font-semibold mt-4 mb-2">Social Media Links</h3>
          {formData.socialMedia.map((sm, idx) => (
            <SocialMediaItem
              key={idx}
              sm={sm}
              idx={idx}
              onChange={handleSocialMediaChange}
              onRemove={handleRemoveSocialLink}
              onFileDrop={handleSocialIconDrop}
            />
          ))}

          <button
            type="button"
            onClick={handleAddSocialLink}
            className="bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60]"
          >
            Add Social Link
          </button>

          <button
            type="submit"
            className="w-full bg-[#0d203a] text-white py-3 rounded-xl mt-6"
          >
            Update Contact
          </button>
        </form>
      </main>
    </div>
  );
}
