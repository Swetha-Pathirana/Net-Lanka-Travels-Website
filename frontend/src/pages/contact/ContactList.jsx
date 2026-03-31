import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: "/images/marker-icon-2x-blue.webp",
  shadowUrl: "/images/marker-shadow.webp",
});

export default function AdminContactList() {
  const [contact, setContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("basic");
  const defaultCenter = [7.0, 80.0];
  const navigate = useNavigate();

  const role = sessionStorage.getItem("role") || "admin"; // admin or superadmin
  const basePath = role === "superadmin" ? "/super-admin" : "/admin";

  const handleEdit = () => {
    navigate(`${basePath}/contacts/edit`);
  };

  // Fetch contact info
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axiosInstance.get("/contact");
        setContact(res.data);
      } catch (err) {
        console.error("Failed to fetch contact info", err);
        toast.error("Failed to load contact data");
      }
    };
    fetchContact();
  }, []);

  // Fetch contact form messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get("/contact-form");
        setMessages(res.data.forms || []);
      } catch (err) {
        console.error("Failed to fetch form messages", err);
        toast.error("Failed to load form messages");
      }
    };
    fetchMessages();
  }, []);

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      await axiosInstance.delete(`/contact-form/${id}`);
      setMessages(messages.filter((msg) => msg._id !== id));
      toast.success("Message deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete message");
    }
  };

  if (!contact) return <div className="text-center mt-10">Loading...</div>;

  const tabs = [
    { key: "basic", label: "General Info" },
    { key: "offices", label: "Offices" },
    { key: "social", label: "Social Links" },
    { key: "map", label: "Map" },
    { key: "messages", label: "Customer Messages" },
  ];

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />


      <main>
        <h2 className="text-4xl font-bold text-[#0d203a] mb-4 px-5 mt-4">
         Manage Contact Information
        </h2>

        {/* Edit Button */}
        <div className="flex justify-end mb-6 px-5">
          <button
            onClick={handleEdit}
            className="bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60]"
          >
            Edit Contact
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-t ${
                activeTab === tab.key
                  ? "bg-[#2E5B84] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === "basic" && (
          <table className="w-full border border-[#1a354e] rounded mb-6">
            <thead className="bg-[#0d203a] text-white">
              <tr>
                <th className="p-3 border border-[#1a354e]">Field</th>
                <th className="p-3 border border-[#1a354e]">Value</th>
              </tr>
            </thead>
            <tbody>
  <tr className="border-b border-[#2E5B84] hover:bg-blue-50">
    <td className="p-3 border border-[#2E5B84] font-semibold">Phone</td>
    <td className="p-3 border border-[#2E5B84]">{contact.phone}</td>
  </tr>

  <tr className="border-b border-[#2E5B84] hover:bg-blue-50">
  <td className="p-3 border border-[#2E5B84] font-semibold">WhatsApp</td>
  <td className="p-3 border border-[#2E5B84]">
    {contact.whatsapp ? (
      <a
        href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium hover:underline"
      >
        {contact.whatsapp}
      </a>
    ) : (
      "-"
    )}
  </td>
</tr>


  {contact.emails?.map((email, idx) => (
    <tr key={idx} className="border-b border-[#2E5B84] hover:bg-blue-50">
      {idx === 0 && (
        <td
          rowSpan={contact.emails.length}
          className="p-3 border border-[#2E5B84] font-semibold"
        >
          Email
        </td>
      )}
      <td className="p-3 border border-[#2E5B84]">{email}</td>
    </tr>
  ))}

  <tr className="border-b border-[#2E5B84] hover:bg-blue-50">
    <td className="p-3 border border-[#2E5B84] font-semibold">Working Hours</td>
    <td className="p-3 border border-[#2E5B84]">
      {contact.workingHours?.start} - {contact.workingHours?.end}
    </td>
  </tr>
</tbody>

          </table>
        )}

        {activeTab === "offices" && (
          <table className="w-full border border-[#1a354e] rounded mb-6">
            <thead className="bg-[#0d203a] text-white">
              <tr>
                <th className="p-3 border border-[#1a354e]">Office</th>
                <th className="p-3 border border-[#1a354e]">Address</th>
              </tr>
            </thead>
            <tbody>
              {contact.offices?.map((office, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#2E5B84] hover:bg-blue-50"
                >
                  <td className="p-3 border border-[#2E5B84] font-semibold">
                    {office.name}
                  </td>
                  <td className="p-3 border border-[#2E5B84]">
                    {office.address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "social" && (
          <table className="w-full border border-[#1a354e] rounded mb-6">
            <thead className="bg-[#0d203a] text-white">
              <tr>
                <th className="p-3 border border-[#1a354e]">Icon</th>
                <th className="p-3 border border-[#1a354e]">Platform</th>
                <th className="p-3 border border-[#1a354e]">URL</th>
              </tr>
            </thead>
            <tbody>
              {contact.socialMedia?.map((sm, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#2E5B84] hover:bg-blue-50"
                >
                  <td className="p-3 border flex justify-center items-center">
                    {sm.icon || sm.iconPreview ? (
                      <img
                      src={sm.iconPreview || sm.icon || ""}
                      alt={sm.platform}
                      className="w-12 h-12 object-cover rounded"
                    />                    
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td className="p-3 border border-[#2E5B84] font-semibold">
                    {sm.platform}
                  </td>
                  <td className="p-3 border border-[#2E5B84]">
                    <a
                      href={sm.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {sm.url}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "map" && contact.offices?.length > 0 && (
          <div className="h-[400px] w-full rounded-lg overflow-hidden border-2 border-[#2E5B84] mt-4">
            <MapContainer
              center={contact.offices[0].coords || defaultCenter}
              zoom={8}
              className="w-full h-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {contact.offices.map((office, idx) => (
                <Marker key={idx} position={office.coords || defaultCenter}>
                  <Popup>{office.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {/* Form Messages */}
        {activeTab === "messages" && (
          <table className="w-full border border-[#1a354e] rounded mb-6">
            <thead className="bg-[#0d203a] text-white">
              <tr>
                <th className="p-3 border border-[#1a354e]">Name</th>
                <th className="p-3 border border-[#1a354e]">Email</th>
                <th className="p-3 border border-[#1a354e]">Message</th>
                <th className="p-3 border border-[#1a354e]">Date</th>
                <th className="p-3 border border-[#1a354e]">Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    No messages found
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr
                    key={msg._id}
                    className="border-b border-[#2E5B84] hover:bg-blue-50"
                  >
                    <td className="p-3 border border-[#2E5B84]">
                      {msg.firstName} {msg.lastName}
                    </td>
                    <td className="p-3 border border-[#2E5B84]">{msg.email}</td>
                    <td className="p-3 border border-[#2E5B84]">
                      {msg.message}
                    </td>
                    <td className="p-3 border border-[#2E5B84]">
                      {new Date(msg.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 border border-[#2E5B84]">
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => handleDeleteMessage(msg._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
