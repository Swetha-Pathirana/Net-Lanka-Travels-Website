import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Check, X } from "lucide-react";

export default function AdminNotificationDropdown({ closeDropdown, scrollToTomorrowTable }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get("/admin-notifications/unread");
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await axiosInstance.put(`/admin-notifications/${id}/read`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative mt-5">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 rounded-full hover:bg-gray-200 relative transition-colors"
      >
        <span className="text-2xl">🔔</span>
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-72 overflow-auto">
          {/* Header */}
          <div className="p-3 border-b font-semibold text-gray-700 flex justify-between items-center">
            <span>Notifications</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{notifications.length} new</span>
              {/* Close Button */}
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notification Items */}
          <ul className="divide-y divide-gray-200">
            {notifications.slice(0, 5).map(notif => (
              <li key={notif._id} className="p-3 hover:bg-gray-50 transition-colors rounded-lg">
                <div className="flex flex-col gap-1">
                  <strong className="text-gray-800">{notif.title}</strong>
                  <p className="text-sm text-gray-600 truncate">{notif.message}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(notif.createdAt).toLocaleString("en-GB")}
                  </span>
                 <button
  onClick={() => handleMarkRead(notif._id)}
  className="mx-auto mt-2 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs flex items-left justify-center gap-1"
>
  <Check size={14} /> Mark Read
</button>

                </div>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="p-3 border-t text-center">
            <button
              onClick={() => {
                setShowNotifications(false);
                scrollToTomorrowTable();
              }}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              See All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
