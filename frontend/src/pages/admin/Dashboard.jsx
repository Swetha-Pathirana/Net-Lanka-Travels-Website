import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import {
  LayoutDashboard,
  Plane,
  Star,
  MapPin,
  FileText,
  Calendar,
  Compass,
  CarFront,
  Bell,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    roundTours: 0,
    dayTours: 0,
    events: 0,
    experiences: 0,
    destinations: 0,
    blog: 0,
    tailorMade: 0,
    team: 0,
    inquiries: 0,
    taxis: 0,
    taxiBookings: 0,
  });
  const [taxiBookings, setTaxiBookings] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminName, setAdminName] = useState(""); // <-- Logged-in admin name
  const [taxiPage, setTaxiPage] = useState(1);
  const rowsPerPageTaxi = 5; // or 10, whatever you like

  const location = useLocation();

  // Fetch logged-in admin info
  const fetchAdminProfile = async () => {
    try {
      const res = await axiosInstance.get("/admin/profile"); // your backend should return logged-in admin
      setAdminName(res.data.name || "Admin");
    } catch (err) {
      console.error("Failed to fetch admin profile:", err);
    }
  };

  // Fetch notifications
  const fetchUnreadNotifications = async () => {
    try {
      const res = await axiosInstance.get("/admin/notifications", {
        params: { status: "pending", page: 1, limit: 1000 },
      });
      const notifications = res.data.notifications;
      const uniqueMessages = new Set(
        notifications.map(
          (note) => `${note.message}_${note.action}_${note.priority}`
        )
      );
      setUnreadCount(uniqueMessages.size);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
    fetchUnreadNotifications();
    const interval = setInterval(fetchUnreadNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchUnreadNotifications();
  }, [location.pathname]);

  // Load all dashboard stats (your existing loadStats function)
  const loadStats = async () => {
    try {
      const [
        dayToursRes,
        roundToursRes,
        eventsRes,
        blogRes,
        destinationsRes,
        experiencesRes,
        taxiRes,
        taxiBookingRes,
      ] = await Promise.all([
        axiosInstance.get("/day-tours"),
        axiosInstance.get("/round-tours"),
        axiosInstance.get("/events"),
        axiosInstance.get("/blog"),
        axiosInstance.get("/destination"),
        axiosInstance.get("/experience"),
        axiosInstance.get("/quick-taxi/taxis"),
        axiosInstance.get("/quick-taxi/bookings"),
      ]);

      setStats({
        dayTours: dayToursRes.data.tours?.length || 0,
        roundTours: roundToursRes.data.tours?.length || 0,
        events: eventsRes.data.events?.length || 0,
        blog: blogRes.data?.blogs?.length || 0,
        destinations: destinationsRes.data?.destinations?.length || 0,
        experiences: experiencesRes.data?.length || 0,
        taxis: taxiRes.data.taxis?.length || 0,
        taxiBookings: taxiBookingRes.data.bookings?.length || 0,
      });

      setTaxiBookings(taxiBookingRes.data.bookings || []);
    } catch (err) {
      console.error("Dashboard loading error:", err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div>
      <main className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LayoutDashboard size={28} /> Admin Dashboard
          </h1>

          {/* Admin name + Bell */}
          <div className="flex items-center gap-4">
            {/* Logged-in admin */}
            <span className="font-semibold text-gray-700 text-lg">
              Hello, {adminName}
            </span>

            {/* Colorful Notification Bell */}
            <NavLink
              to="/admin/notifications"
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
              <Bell
                size={28}
                className="text-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse"
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          </div>
        </div>

        {/* ---------------- STATS CARDS ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-6">
          {[
            {
              title: "Day Tours",
              value: stats.dayTours,
              icon: <Plane size={36} className="text-sky-700" />,
            }, // dark blue
            {
              title: "Round Tours",
              value: stats.roundTours,
              icon: <Compass size={36} className="text-green-700" />,
            }, // dark green
            {
              title: "Event Tours",
              value: stats.events,
              icon: <Calendar size={36} className="text-yellow-600" />,
            }, // darker yellow
            {
              title: "Blogs",
              value: stats.blog,
              icon: <FileText size={36} className="text-pink-700" />,
            }, // dark pink
            {
              title: "Destinations",
              value: stats.destinations,
              icon: <MapPin size={36} className="text-teal-700" />,
            }, // dark teal
            {
              title: "Experiences",
              value: stats.experiences,
              icon: <Star size={36} className="text-amber-700" />,
            }, // dark amber
            {
              title: "Taxis",
              value: stats.taxis,
              icon: <CarFront size={36} className="text-orange-700" />,
            }, // dark orange
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white shadow hover:shadow-lg transition-shadow rounded-lg p-5 flex justify-between items-center"
            >
              <div>
                <h2 className="text-gray-500 text-sm">{card.title}</h2>
                <p className="text-3xl font-bold">{card.value}</p>
              </div>
              {card.icon}
            </div>
          ))}
        </div>

        {/* ---------------- RECENT TAXI BOOKINGS ---------------- */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CarFront size={20} /> Recent Taxi Bookings
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Taxi</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {taxiBookings
                  .slice(
                    (taxiPage - 1) * rowsPerPageTaxi,
                    taxiPage * rowsPerPageTaxi
                  )
                  .map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        {b.firstName} {b.lastName}
                      </td>
                      <td className="px-4 py-2">{b.taxiId?.name || "—"}</td>
                      <td className="px-4 py-2">
                        {new Date(b.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            b.status
                          )}`}
                        >
                          {b.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => setTaxiPage((prev) => Math.max(prev - 1, 1))}
              disabled={taxiPage === 1}
              className={`px-3 py-1 rounded ${
                taxiPage === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-300"
              }`}
            >
              Prev
            </button>

            {Array.from(
              { length: Math.ceil(taxiBookings.length / rowsPerPageTaxi) },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => setTaxiPage(page)}
                className={`px-3 py-1 rounded ${
                  taxiPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setTaxiPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(taxiBookings.length / rowsPerPageTaxi)
                  )
                )
              }
              disabled={
                taxiPage === Math.ceil(taxiBookings.length / rowsPerPageTaxi)
              }
              className={`px-3 py-1 rounded ${
                taxiPage === Math.ceil(taxiBookings.length / rowsPerPageTaxi)
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
