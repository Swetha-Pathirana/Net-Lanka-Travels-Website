import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import {
  LayoutDashboard,
  Plane,
  Map,
  Users,
  Star,
  MapPin,
  FileText,
  Calendar,
  Mail,
  Compass,
  CarFront,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import AdminNotificationDropdown from "../../components/AdminNotificationDropdown";
import TomorrowBookingsTable from "../../components/TomorrowBookingsTable";

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
    totalAdmins: 0,
  });
  const [bookings, setBookings] = useState([]);
  const [taxiBookings, setTaxiBookings] = useState([]);
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [, setShowNotifications] = useState(false);
  const [allDayBookings, setAllDayBookings] = useState([]);
  const [allRoundBookings, setAllRoundBookings] = useState([]);
  const [allEventBookings, setAllEventBookings] = useState([]);
  const [allTailorMade, setAllTailorMade] = useState([]);
  const itemsPerPage = 10;
  const [taxiPage, setTaxiPage] = useState(1);
  const rowsPerPageTaxi = 5;

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

  const getTypeColor = (type) => {
    switch (type) {
      case "Round Tour":
        return "text-green-600";
      case "Day Tour":
        return "text-blue-600";
      case "Event Tour":
        return "text-yellow-600";
      case "Tailor Made":
        return "text-purple-600";
      default:
        return "text-gray-800";
    }
  };

  const loadStats = async () => {
    try {
      const [
        dayToursRes,
        roundToursRes,
        eventsRes,
        eventBookingsRes,
        dayTourBookingsRes,
        roundTourBookingsRes,
        tailorMadeRes,
        blogRes,
        inquiriesRes,
        adminStatsRes,
        destinationsRes,
        experiencesRes,
        taxiRes,
        taxiBookingRes,
        commonBookingRes,
      ] = await Promise.all([
        axiosInstance.get("/day-tours"),
        axiosInstance.get("/round-tours"),
        axiosInstance.get("/events"),
        axiosInstance.get("/event-tour-booking"),
        axiosInstance.get("/day-tour-booking"),
        axiosInstance.get("/round-tour-booking"),
        axiosInstance.get("/tailor-made-tours/inquiries"),
        axiosInstance.get("/blog"),
        axiosInstance.get("/contact-form"),
        axiosInstance.get("/super-admin/admin-stats"),
        axiosInstance.get("/destination"),
        axiosInstance.get("/experience"),
        axiosInstance.get("/quick-taxi/taxis"),
        axiosInstance.get("/quick-taxi/bookings"),
        axiosInstance.get("/book-tour"),
      ]);

      // Stats by count (not bookings)
      setStats({
        dayTours: dayToursRes.data.tours?.length || 0,
        roundTours: roundToursRes.data.tours?.length || 0,
        events: eventsRes.data.events?.length || 0,
        tailorMade: tailorMadeRes.data?.length || 0,
        blog: blogRes.data?.blogs?.length || 0,
        inquiries: inquiriesRes.data?.forms?.length || 0,
        totalAdmins: adminStatsRes.data.totalAdmins,
        destinations: destinationsRes.data?.destinations?.length || 0,
        experiences: experiencesRes.data?.length || 0,
        taxis: taxiRes.data.taxis?.length || 0,
        taxiBookings: taxiBookingRes.data.bookings?.length || 0,
      });

      const commonBookings = commonBookingRes.data.success
        ? commonBookingRes.data.bookings
        : [];

      // Combine tour bookings
      const dayBookings = [
        ...(dayTourBookingsRes.data.bookings || []).map((b) => ({
          ...b,
          type: "Day Tour",
          source: "day",
        })),
        ...commonBookings
          .filter((b) => b.tourType === "day")
          .map((b) => ({
            ...b,
            type: "Day Tour",
            source: "common",
          })),
      ];

      const roundBookings = [
        ...(roundTourBookingsRes.data.bookings || []).map((b) => ({
          ...b,
          type: "Round Tour",
          source: "round",
        })),
        ...commonBookings
          .filter((b) => b.tourType === "round")
          .map((b) => ({
            ...b,
            type: "Round Tour",
            source: "common",
          })),
      ];

      const eventBookings = [
        ...(eventBookingsRes.data.bookings || []).map((b) => ({
          ...b,
          type: "Event Tour",
        })),
      ];

      const tailorBookings = (tailorMadeRes.data || []).map((b) => ({
        ...b,
        type: "Tailor Made",
        fullName: b.fullName,
        title: "Tailor Made Tour",
        startDate: b.startDate,
        status: b.status,
      }));

      const allBookingsCombined = [
        ...dayBookings,
        ...roundBookings,
        ...eventBookings,
        ...tailorBookings,
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Update states
      setAllDayBookings(dayBookings);
      setAllRoundBookings(roundBookings);
      setAllEventBookings(eventBookings);
      setAllTailorMade(tailorBookings);
      setBookings(allBookingsCombined);
      setTaxiBookings(taxiBookingRes.data.bookings || []);

      // Monthly bookings chart
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const dayCounts = Array(12).fill(0);
      const roundCounts = Array(12).fill(0);
      const eventCounts = Array(12).fill(0);
      const tailorCounts = Array(12).fill(0);
      const taxiCounts = Array(12).fill(0);

      dayBookings.forEach(
        (b) => dayCounts[new Date(b.startDate || b.createdAt).getMonth()]++
      );
      roundBookings.forEach(
        (b) => roundCounts[new Date(b.startDate || b.createdAt).getMonth()]++
      );
      eventBookings.forEach(
        (b) => eventCounts[new Date(b.startDate || b.createdAt).getMonth()]++
      );
      tailorBookings.forEach(
        (b) => tailorCounts[new Date(b.startDate || b.startDate).getMonth()]++
      );
      (taxiBookingRes.data.bookings || []).forEach(
        (b) => taxiCounts[new Date(b.createdAt).getMonth()]++
      );

      setMonthlyBookings(
        months.map((m, i) => ({
          month: m,
          day: dayCounts[i],
          round: roundCounts[i],
          event: eventCounts[i],
          tailor: tailorCounts[i],
          taxi: taxiCounts[i],
        }))
      );
    } catch (err) {
      console.error("Dashboard loading error:", err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const pieColors = ["#16a34a", "#2563eb", "#f59e0b", "#a855f7"];
  const pieData = [
    { name: "Day Tours", value: allDayBookings.length },
    { name: "Round Tours", value: allRoundBookings.length },
    { name: "Event Tours", value: allEventBookings.length },
    { name: "Custom Tours", value: allTailorMade.length },
  ];

  const filteredBookings = bookings.filter((b) =>
    b.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  return (
    <div>
      <main>
        <main className="p-6">
          {/* Page Header with Bell */}
          <div className="flex items-center justify-between mb-6">
            {/* Title */}
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <LayoutDashboard size={28} /> Super Admin Dashboard
            </h1>

            {/* Notification Bell */}
            <AdminNotificationDropdown
              closeDropdown={() => setShowNotifications(false)}
              scrollToTomorrowTable={() =>
                document
                  .getElementById("tomorrow-bookings")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            />
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
                title: "Custom Tours",
                value: stats.tailorMade,
                icon: <Star size={36} className="text-purple-700" />,
              }, // dark purple
              {
                title: "Blogs",
                value: stats.blog,
                icon: <FileText size={36} className="text-pink-700" />,
              }, // dark pink
              {
                title: "Admins",
                value: stats.totalAdmins,
                icon: <Users size={36} className="text-blue-700" />,
              },
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
              {
                title: "Inquiries",
                value: stats.inquiries,
                icon: <Mail size={36} className="text-rose-700" />,
              }, // dark rose/red
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

          {/* ---------------- CHARTS ---------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Line Chart */}
            <div className="bg-white p-5 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plane size={20} /> Monthly Bookings
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyBookings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line dataKey="day" stroke="#2563eb" name="Day Tours" />
                  <Line dataKey="round" stroke="#16a34a" name="Round Tours" />
                  <Line dataKey="event" stroke="#f59e0b" name="Event Tours" />
                  <Line dataKey="tailor" stroke="#a855f7" name="Tailor Made" />
                  <Line
                    dataKey="taxi"
                    stroke="#f87171"
                    name="Taxi Bookings"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-5 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Map size={20} /> Tours Breakdown
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={100} label>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={pieColors[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ---------------- RECENT BOOKINGS TABLE ---------------- */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users size={20} /> Recent Bookings
            </h2>
            <input
              type="text"
              placeholder="Search by tour type..."
              className="border p-2 rounded w-full mb-4 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Tour</th>
                    <th className="px-4 py-2 text-left">Customer</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50">
                      <td
                        className={`px-4 py-2 font-semibold ${getTypeColor(
                          b.type
                        )}`}
                      >
                        {b.type}
                      </td>
                      <td className="px-4 py-2">
                        {b.type === "Tailor Made"
                          ? b.title
                          : b.tourId?.title || b.eventId?.title || "—"}
                      </td>
                      <td className="px-4 py-2">
                        {b.type === "Tailor Made" ? b.fullName : b.name || "—"}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(
                          b.startDate || b.createdAt
                        ).toLocaleDateString("en-GB")}
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
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-300"
                }`}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-300"
                }`}
              >
                Next
              </button>
            </div>
          </div>
          <TomorrowBookingsTable />

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
      </main>
    </div>
  );
}
