import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
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
  Home,
  Mail,
  MessageCircle,
  NotebookPen,
  CalendarCheck,
  LogOut,
  Car,
  FileEdit,
  Clock,
} from "lucide-react";
import { FaTripadvisor, FaStarHalfAlt, FaCarSide } from "react-icons/fa";

import { axiosInstance } from "../../lib/axios";

const SuperAdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const activeClass = "bg-[#487898] text-white";
  const defaultClass = "text-gray-200 hover:bg-[#487898]/20 hover:text-white";
  const [openStoryMenu, setOpenStoryMenu] = useState(false);
  const [openToursMenu, setOpenToursMenu] = useState(false);
  const [openCommentsMenu, setOpenCommentsMenu] = useState(false);
  const [openBookingMenu, setOpenBookingMenu] = useState(false);
  const [openInsightMenu, setOpenInsightMenu] = useState(false);
  const [openTaxiMenu, setOpenTaxiMenu] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/admin/login";
  };

  const [doneCount, setDoneCount] = useState(0);

  // Fetch count of "done" notifications (not read yet)
  // Fetch count of "done" notifications (not read yet)
  const fetchDoneCount = async () => {
    try {
      const res = await axiosInstance.get("/super-admin/notifications");

      // Only count notifications that are "done" and NOT read by Super Admin
      const doneUnread = res.data.notifications?.filter(
        (n) => n.status === "done" && !n.readBySuperAdmin
      );

      setDoneCount(doneUnread?.length || 0);
    } catch (err) {
      console.error("Failed to fetch done notification count:", err);
      setDoneCount(0);
    }
  };

  useEffect(() => {
    fetchDoneCount();
    const interval = setInterval(fetchDoneCount, 30000); // optional refresh
    return () => clearInterval(interval);
  }, []);

  // Expose globally so pages can refresh count after marking notifications read
  useEffect(() => {
    if (window.refreshSuperAdminNotificationCount) {
      window.refreshSuperAdminNotificationCount();
    }
  }, []);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className="fixed lg:static top-0 left-0 h-screen w-64 bg-gray-900 text-gray-200 flex flex-col">
        {/* LOGO - FIXED */}
        <div className="shrink-0 flex items-center justify-center py-4 border-b border-gray-800">
          <img
            src="/images/logo.webp"
            alt="Logo"
            className="w-32 h-auto object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          <NavLink
            to="/super-admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive ? activeClass : defaultClass
              }`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/super-admin/admins"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive ? activeClass : defaultClass
              }`
            }
          >
            <LayoutDashboard size={16} /> Manage Admins
          </NavLink>

          <NavLink
            to="/super-admin/section-request"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive ? activeClass : defaultClass
              }`
            }
          >
            <FileEdit size={16} /> Section Requests
          </NavLink>

          {/* Notifications with badge */}
          <NavLink
            to="/super-admin/section-notifications"
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-2 rounded-lg transition ${
                isActive ? activeClass : defaultClass
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Clock size={16} /> Notifications
            </div>
            {doneCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {doneCount}
              </span>
            )}
          </NavLink>

                    {/* Booking Menu */}
                    <button
            onClick={() => setOpenBookingMenu(!openBookingMenu)}
            className="flex items-center justify-between w-full px-4 py-2 rounded-lg hover:bg-[#487898]/20 transition"
          >
            <span className="flex items-center gap-3">
              <CalendarCheck size={18} />
              Bookings
            </span>
            {openBookingMenu ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          {openBookingMenu && (
            <div className="ml-10 mt-1 flex flex-col space-y-1">
              <NavLink
                to="/super-admin/day-tour-booking"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <Map size={16} /> Day Tour
              </NavLink>

              <NavLink
                to="/super-admin/round-tour-booking"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <Compass size={16} /> Round Tour
              </NavLink>

              <NavLink
                to="/super-admin/customize-tour"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <PenTool size={16} /> Customize Tour
              </NavLink>

              <NavLink
                to="/super-admin/event-tour-booking"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <Compass size={16} /> Event Tour
              </NavLink>
            </div>
          )}

          {/* Home */}
          <NavLink
            to="/super-admin/manage-home"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive ? activeClass : defaultClass
              }`
            }
          >
            <Home size={18} />
            Home Content
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
                to="/super-admin/manage-about"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <Users size={16} /> About Page
              </NavLink>

              <NavLink
                to="/super-admin/manage-community"
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
                to="/super-admin/day-tours"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <Map size={16} /> Day Tours
              </NavLink>

              <NavLink
                to="/super-admin/round-tours"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <Compass size={16} /> Round Tours
              </NavLink>

              <NavLink
                to="/super-admin/tailor-made-tours"
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
            to="/super-admin/destinations"
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
                to="/super-admin/blogs"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <MessageSquare size={16} /> Blogs
              </NavLink>

              <NavLink
                to="/super-admin/events"
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
            to="/super-admin/experiences"
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
                to="/super-admin/taxis"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <FaCarSide size={16} /> Manage Vehicles
              </NavLink>

              <NavLink
                to="/super-admin/quick-taxi-booking"
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
                to="/super-admin/blog-comments"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <NotebookPen size={16} /> Blog Comments
              </NavLink>

              <NavLink
                to="/super-admin/tour-reviews"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <FaStarHalfAlt size={16} /> Tour Reviews
              </NavLink>

              <NavLink
                to="/super-admin/tailor-comments"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <Star size={16} /> Tailor Reviews
              </NavLink>

              <NavLink
                to="/super-admin/tripadvisor-reviews"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-2 rounded transition ${
                    isActive ? activeClass : defaultClass
                  }`
                }
              >
                <FaTripadvisor size={16} /> TripAdvisor
              </NavLink>
            </div>
          )}

          {/* Contact */}
          <NavLink
            to="/super-admin/contacts"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive ? activeClass : defaultClass
              }`
            }
          >
            <Mail size={18} /> Contact
          </NavLink>
        </nav>

        {/* LOGOUT - FIXED BOTTOM */}
        <div className="shrink-0 p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition justify-center"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default SuperAdminSidebar;
