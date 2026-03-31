import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]); // <-- store IDs of admins being processed
  const navigate = useNavigate();

  const fetchAdmins = async () => {
    const res = await axiosInstance.get("/super-admin/admins");
    setAdmins(res.data.admins || []); 
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const toggleStatus = async (id, isActive) => {
    if (!window.confirm(`Are you sure you want to ${isActive ? "deactivate" : "activate"} this admin?`)) return;

    setLoadingIds((prev) => [...prev, id]); // mark as loading
    try {
      await axiosInstance.patch(`/super-admin/admins/${id}/status`);
      toast.success(`Admin ${isActive ? "deactivated" : "activated"}`);
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setLoadingIds((prev) => prev.filter((i) => i !== id)); // remove loading
    }
  };

  const deleteAdmin = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete admin "${name}"? This cannot be undone.`)) return;

    setLoadingIds((prev) => [...prev, id]); // mark as loading
    try {
      await axiosInstance.delete(`/super-admin/admins/${id}`);
      toast.success(`Admin "${name}" deleted successfully`);
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setLoadingIds((prev) => prev.filter((i) => i !== id)); // remove loading
    }
  };

  return (
    <div>
      <main>
        <h2 className="text-4xl font-bold text-[#0d203a] mb-4 px-5 mt-4">Manage Admins</h2>

        <div className="flex justify-end mb-8">
          <button
            onClick={() => navigate("/super-admin/add-admin")}
            className="bg-[#2E5B84] text-white px-4 py-2 rounded hover:bg-[#1E3A60]"
          >
            + Add Admin
          </button>
        </div>

        <table className="w-full bg-white border border-[#1a354e] rounded shadow">
          <thead className="bg-[#0d203a] text-white">
            <tr>
              <th className="p-3 border border-[#1a354e]">Name</th>
              <th className="p-3 border border-[#1a354e]">Email</th>
              <th className="p-3 border border-[#1a354e]">Status</th>
              <th className="p-3 border border-[#1a354e] text-center w-36">Action</th>
            </tr>
          </thead>

          <tbody>
            {admins.map((admin) => {
              const isLoading = loadingIds.includes(admin._id);
              return (
                <tr key={admin._id} className="border-b border-[#1a354e] hover:bg-gray-50 transition-colors">
                  <td className="p-3 border border-[#1a354e]">{admin.name}</td>
                  <td className="p-3 border border-[#1a354e]">{admin.email}</td>

                  {/* Status Badge */}
                  <td className="p-3 border border-[#1a354e] text-center">
                    <span className={`px-3 py-1 rounded text-white text-sm ${admin.isActive ? "bg-green-600" : "bg-gray-500"}`}>
                      {admin.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="p-3 border text-center flex justify-center items-center gap-2">
                    <button
                      onClick={() => toggleStatus(admin._id, admin.isActive)}
                      disabled={isLoading}
                      className={`px-4 py-1 rounded text-white text-sm transition ${
                        isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : admin.isActive
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {isLoading ? "Processing..." : admin.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => deleteAdmin(admin._id, admin.name)}
                      disabled={isLoading}
                      className={`px-4 py-1 rounded text-white text-sm transition ${
                        isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-800"
                      }`}
                    >
                      {isLoading ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>

      <ToastContainer />
    </div>
  );
}
