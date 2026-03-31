import AdminSidebar from "../admin/AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex">
      { /* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64">
      <AdminSidebar />
      </div>
      {/* Main content */}
      <main className="ml-64 flex-1 bg-gray-100 min-h-screen p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
