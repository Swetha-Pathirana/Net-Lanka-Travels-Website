import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Users,
  Compass,
  Star,
  Plane,
  Map,
  PenTool,
  MessageSquare,
  MessageCircle,
  NotebookPen,
  CalendarCheck,
  LogOut,
  Car,
  Bell,
} from "lucide-react";
import { FaStarHalfAlt, FaCarSide } from "react-icons/fa";
import { axiosInstance } from "../../lib/axios";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [openStoryMenu, setOpenStoryMenu] = useState(false);
  const [openToursMenu, setOpenToursMenu] = useState(false);
  const [openCommentsMenu, setOpenCommentsMenu] = useState(false);
  const [openInsightMenu, setOpenInsightMenu] = useState(false);
  const [openTaxiMenu, setOpenTaxiMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const activeClass = "bg-[#487898] text-white";
  const defaultClass = "text-gray-200 hover:bg-[#487898]/20 hover:text-white";

  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/admin/login";
  };

  // Fetch unread notifications
  const fetchUnreadNotifications = async () => {
    try {
      const res = await axiosInstance.get("/admin/notifications", {
        params: { status: "pending", page: 1, limit: 1000 }, // fetch all pending
      });

      const notifications = res.data.notifications;

      // Group by message + action + priority to count unique notifications
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
    fetchUnreadNotifications();
  }, [location.pathname]);

  useEffect(() => {
    fetchUnreadNotifications();
    const interval = setInterval(fetchUnreadNotifications, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className="fixed lg:static top-0 left-0 h-full w-64 bg-gray-900 text-gray-200 flex flex-col">
        {/* Logo */}
        <div className="h-auto flex items-center justify-center shadow-md border-b border-gray-800">
          <img
            src="/images/logo.webp"
            alt="Logo"
            className="w-32 h-auto object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 mt-4 flex-1 overflow-y-auto">
          {/* Dashboard */}
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive ? activeClass : defaultClass
              }`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          {/* Notifications */}
          {/* Notifications */}
          <NavLink
            to="/admin/notifications"
            className={({ isActive }) =>
              `flex items-center justify-between gap-3 px-4 py-2 rounded-lg transition ${
                isActive ? activeClass : defaultClass
              }`
            }
          >
            <span className="flex items-center gap-3">
              <Bell size={18} />
              Tasks
            </span>

            {/* 🔴 Notification Badge */}
            {unreadCount > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount} {/* number of unique messages */}
              </span>
            )}
          </NavLink>

          {/* Our Story Menu */}
          <button
            onClick={() => setOpenStoryMenu(!openStoryMenu)}
            className="flex items-center justify-between w-full px-4 py-2 rounded-lg hover:bg-[#487898]/20 transition"
          >
            <span className="flex items-center gap-3">
              <BookOpen size={18} />
              Our Story
            </span>
            {openStoryMenu ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          {openStoryMenu && (
            <div className="ml-10 mt-1 flex flex-col space-y-1">
              <NavLink
                to="/admin/manage-about"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <Users size={16} /> About Page
              </NavLink>

              <NavLink
                to="/admin/manage-community"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <Star size={16} /> Community Impact
              </NavLink>
            </div>
          )}

          {/* Tours Menu */}
          <button
            onClick={() => setOpenToursMenu(!openToursMenu)}
            className="flex items-center justify-between w-full px-4 py-2 rounded-lg hover:bg-[#487898]/20 transition"
          >
            <span className="flex items-center gap-3">
              <Plane size={18} />
              Tours
            </span>
            {openToursMenu ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          {openToursMenu && (
            <div className="ml-10 mt-1 flex flex-col space-y-1">
              <NavLink
                to="/admin/day-tours"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <Map size={16} /> Day Tours
              </NavLink>

              <NavLink
                to="/admin/round-tours"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <Compass size={16} /> Round Tours
              </NavLink>

              <NavLink
                to="/admin/tailor-made-tours"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <Star size={16} /> Tailor-Made Tours
              </NavLink>
            </div>
          )}

          {/* Destinations */}
          <NavLink
            to="/admin/destinations"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive ? activeClass : defaultClass
              }`
            }
          >
            <Map size={18} /> Destinations
          </NavLink>

          {/* Insight Menu */}
          <button
            onClick={() => setOpenInsightMenu(!openInsightMenu)}
            className="flex items-center justify-between w-full px-4 py-2 rounded-lg hover:bg-[#487898]/20 transition"
          >
            <span className="flex items-center gap-3">
              <NotebookPen size={18} />
              Insight
            </span>
            {openInsightMenu ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          {openInsightMenu && (
            <div className="ml-10 mt-1 flex flex-col space-y-1">
              <NavLink
                to="/admin/blogs"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <MessageSquare size={16} /> Blogs
              </NavLink>

              <NavLink
                to="/admin/events"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <Map size={16} /> Events
              </NavLink>
            </div>
          )}

          {/* Experiences */}
          <NavLink
            to="/admin/experiences"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive ? activeClass : defaultClass
              }`
            }
          >
            <PenTool size={18} /> Experiences
          </NavLink>

          {/* Quick Taxi */}
          <button
            onClick={() => setOpenTaxiMenu(!openTaxiMenu)}
            className="flex items-center justify-between w-full px-4 py-2 rounded-lg hover:bg-[#487898]/20"
          >
            <span className="flex items-center gap-3">
              <Car size={18} />
              Quick Taxi
            </span>
            {openTaxiMenu ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          {openTaxiMenu && (
            <div className="ml-10 mt-1 space-y-1">
              <NavLink
                to="/admin/taxis"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <FaCarSide size={16} /> Manage Vehicles
              </NavLink>

              <NavLink
                to="/admin/quick-taxi-booking"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <CalendarCheck size={16} /> Taxi Bookings
              </NavLink>
            </div>
          )}

          {/* Comments Menu */}
          <button
            onClick={() => setOpenCommentsMenu(!openCommentsMenu)}
            className="flex items-center justify-between w-full px-4 py-2 rounded-lg hover:bg-[#487898]/20 transition"
          >
            <span className="flex items-center gap-3">
              <MessageCircle size={18} />
              Comments
            </span>
            {openCommentsMenu ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          {openCommentsMenu && (
            <div className="ml-10 mt-1 flex flex-col space-y-1">
              <NavLink
                to="/admin/blog-comments"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <NotebookPen size={16} /> Blog Comments
              </NavLink>

              <NavLink
                to="/admin/tour-reviews"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <FaStarHalfAlt size={16} /> Tour Reviews
              </NavLink>

              <NavLink
                to="/admin/tailor-comments"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <Star size={16} /> Tailor Reviews
              </NavLink>
            </div>
          )}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-6 py-3 m-4 rounded-lg bg-red-600 hover:bg-red-700 text-white transition justify-center"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
    </>
  );
};

export default AdminSidebar;
