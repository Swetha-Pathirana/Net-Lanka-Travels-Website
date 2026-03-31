import React, { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CheckCircle } from "lucide-react";

dayjs.extend(relativeTime);

export default function SectionNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("done"); //done, read
  const [searchTerm, setSearchTerm] = useState("");

  // ================= FETCH =================
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/super-admin/notifications");
      let filtered = res.data.notifications;

      // Filter based on Super Admin filter
      if (statusFilter) {
        if (statusFilter === "done") {
          // only show notifications not yet read
          filtered = filtered.filter(
            (n) => n.status === "done" && !n.readBySuperAdmin
          );
        } else if (statusFilter === "read") {
          filtered = filtered.filter((n) => n.readBySuperAdmin);
        }
      }

      // Filter by search term
      if (searchTerm)
        filtered = filtered.filter((n) =>
          n.message.toLowerCase().includes(searchTerm.toLowerCase())
        );

      setNotifications(filtered || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch notifications");
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ================= MARK READ =================
  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/super-admin/notifications/${id}`);
      toast.success("Marked as read");
      fetchNotifications(); // Refresh list immediately
    } catch (err) {
      console.error(err);
      toast.error("Failed to update notification");
    }
  };

  // ================= DELETE =================
  const deleteNotification = async (id, superAdminOnly = false) => {
    try {
      await axiosInstance.delete(`/super-admin/notifications/${id}`, {
        params: { superAdminOnly }, // send flag to backend
      });
      toast.success("Notification deleted");
      fetchNotifications();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete notification");
    }
  };  

  return (
    <div>

      {/* Main */}
      <main>
        <h1 className="text-4xl font-bold text-[#0d203a] mb-2">
          Admin Task Completion Notifications
        </h1>
        <p className="text-gray-600 mb-8">
          View and manage notifications for tasks completed by Admins after
          Super Admin assignment.
        </p>

        {/* Status Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex gap-4 items-center">
          {["done", "read"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded font-medium ${
                statusFilter === status
                  ? "bg-[#2E5B84] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-[#2E5B84] rounded p-2 text-[#0d203a] w-full sm:w-64"
            />
            <button
              onClick={fetchNotifications}
              className="bg-[#2E5B84] hover:bg-[#1E3A60] text-white font-semibold px-4 py-2 rounded-xl transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notifications.length === 0 && (
            <p className="text-gray-500 col-span-full">
              No notifications found
            </p>
          )}

          {notifications.map((note) => (
            <div className="relative p-4 rounded-xl shadow-sm border transition bg-white"
     style={{
       borderColor: note.status === "pending"
         ? "#FBBF24" // yellow
         : note.status === "done"
         ? "#60A5FA" // blue
         : "#34D399", // green
     }}
>
  {/* Delete button top-right */}
  {statusFilter === "read" && note.readBySuperAdmin && (
    <button
      onClick={() => deleteNotification(note._id, true)}
      className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
      title="Delete Notification"
    >
      <Trash size={14} />
    </button>
  )}

  {/* Card content */}
  <p className="font-semibold text-[#0d203a] mb-2">
    Sections: {note.sections?.join(", ")}
  </p>

  <p className="text-gray-700 mb-2">{note.message}</p>

  {note.admin && (
  <p className="text-sm text-gray-600 mb-1">
    Admin: <span className="font-medium">
      {note.admin.name ? `${note.admin.name} (${note.admin.email})` : note.admin.email}
    </span>
  </p>
)}

  <p className="text-sm text-gray-500 mb-2">{dayjs(note.createdAt).fromNow()}</p>

  <p className="text-sm text-gray-500 mb-4">
    Action: <span className="font-medium">{note.action}</span> | Priority:{" "}
    <span className="font-medium">{note.priority}</span>
  </p>

  {/* Mark as Read (professional) */}
  {note.status === "done" && !note.readBySuperAdmin && (
    <div className="flex items-center gap-2 mt-2">
      <input
        type="checkbox"
        onChange={() => markAsRead(note._id)}
        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        id={`mark-read-${note._id}`}
      />
      <label htmlFor={`mark-read-${note._id}`} className="text-sm font-medium text-[#0d203a]">
        Mark as Read
      </label>
    </div>
  )}

  {/* Read status indicator */}
  {note.readBySuperAdmin && (
    <div className="flex items-center gap-1 mt-2">
      <CheckCircle size={16} className="text-green-600" />
      <span className="text-sm text-green-700 font-medium">Read</span>
    </div>
  )}
</div>

          ))}
        </div>
      </main>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
