import React, { useState } from "react";
import { Menu, User, Settings, LogOut } from "lucide-react";

const AdminTopbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="h-16 bg-white shadow-md flex items-center justify-between px-6 py-3 sticky top-0 z-40">
      {/* Left: Mobile Sidebar Toggle */}
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden text-gray-700"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={24} />
        </button>

        <h1 className="text-lg font-semibold text-gray-700 hidden sm:block">
          Admin Dashboard
        </h1>
      </div>

      {/* Right: Profile */}
      <div className="relative">
        <img
          src="/images/profile-user.png"
          alt="Admin"
          className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300"
          onClick={() => setProfileOpen(!profileOpen)}
        />

        {/* Dropdown Menu */}
        {profileOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg overflow-hidden z-50">
            <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition">
              <User size={16} /> Profile
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition">
              <Settings size={16} /> Settings
            </button>
            <a
              href="/admin/login"
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 transition"
            >
              <LogOut size={16} /> Logout
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminTopbar;
