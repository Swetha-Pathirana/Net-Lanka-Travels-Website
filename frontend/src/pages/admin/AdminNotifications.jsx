import React, { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Check } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");

  // ================= FETCH =================
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/admin/notifications", {
        params: {
          status: statusFilter,
          search: searchTerm,
        },
      });

      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch notifications");
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ================= MARK DONE =================
  const markAsDone = async (id) => {
    try {
      await axiosInstance.patch(`/admin/notifications/${id}`);
      toast.success("Marked as done");
      fetchNotifications();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark as done");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main */}
      <main>
        <h1 className="text-4xl font-bold text-[#0d203a] mb-2">
          Section Change Requests from Super Admin
        </h1>
        <p className="text-gray-600 mb-8">
          Review and complete content update requests assigned by the Super
          Admin.
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex gap-4 items-center">
            <label className="font-semibold text-[#0d203a]">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-[#2E5B84] rounded p-2 text-[#0d203a]"
            >
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
          </div>

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

        {/* List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notifications.length === 0 && (
            <p className="text-gray-500 col-span-full">
              No notifications found
            </p>
          )}

          {notifications.map((note) => (
            <div
              key={note._id}
              className={`p-4 rounded-xl shadow-sm border transition ${
                note.status === "pending"
                  ? "border-yellow-400 bg-yellow-50"
                  : "border-green-400 bg-green-50"
              }`}
            >
              <p className="font-semibold text-[#0d203a] mb-2">
                Sections: {note.sections?.join(", ")}
              </p>

              <p className="text-gray-700 mb-2">{note.message}</p>

              <p className="text-sm text-gray-500 mb-2">
                {dayjs(note.createdAt).fromNow()}
              </p>

              <p className="text-sm text-gray-500 mb-4">
                Action: <span className="font-medium">{note.action}</span> |{" "}
                Priority: <span className="font-medium">{note.priority}</span>
              </p>

              <div className="flex gap-2">
                {note.status === "pending" && (
                  <button
                    onClick={() => markAsDone(note._id)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    <Check size={16} />
                    Mark as Done
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
