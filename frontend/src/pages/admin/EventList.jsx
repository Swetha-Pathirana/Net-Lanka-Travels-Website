import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";

export default function EventList() {
  const [events, setEvents] = useState([]);

  const role = sessionStorage.getItem("role") || "admin"; // admin or superadmin
  const basePath = role === "superadmin" ? "/super-admin" : "/admin";

  const fetchEvents = async () => {
    try {
      const res = await axiosInstance.get("/events");
      setEvents(res.data.events || []);
    } catch (err) {
      console.error(err);
      alert("Error fetching events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axiosInstance.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Error deleting event");
    }
  };

  return (
    <div>
      <main>
        <h2 className="text-4xl font-bold mb-4">Manage Events</h2>
        <div className="flex justify-end mb-8">
          <Link 
          to={`${basePath}/events/new`}
          className="bg-[#2E5B84] text-white px-4 py-2 rounded">
            + Add Event
            </Link>
        </div>

        <table className="w-full border border-[#1a354e] rounded">
          <thead className="bg-[#0d203a] text-white">
            <tr>
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Location</th>
              <th className="p-3 border text-center w-36">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(ev => (
              <tr key={ev._id} className="border-b hover:bg-blue-50">
                <td className="p-2 border text-center"><img src={ev.img} alt={ev.title} className="h-12 w-12 object-cover rounded mx-auto" /></td>
                <td className="p-3 border">{ev.title}</td>
                <td className="p-3 border">{ev.location}</td>
                <td className="py-4 flex justify-center gap-2">
                  <Link 
                    to={`${basePath}/events/edit/${ev._id}`}
                  className="bg-[#2E5B84] text-white px-3 py-1 rounded text-sm">
                    Edit</Link>
                  <button onClick={() => handleDelete(ev._id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {events.length === 0 && <tr><td colSpan="4" className="text-center p-4 text-gray-500">No events found</td></tr>}
          </tbody>
        </table>
      </main>
    </div>
  );
}
