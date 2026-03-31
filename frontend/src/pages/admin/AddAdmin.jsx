import React, { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddAdmin() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false); // <-- Loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true); // Start loading

    try {
      await axiosInstance.post("/super-admin/admins", form);
      toast.success("Admin created successfully!");

      // Auto redirect after 1.5s
      setTimeout(() => {
        navigate("/super-admin/admins");
      }, 1500);

      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <main>
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#2E5B84] p-10 rounded-2xl shadow-xl 
                     w-full max-w-2xl mx-auto mt-10"
        >
          <h2 className="text-3xl font-bold text-[#0d203a] mb-2 text-center">
            Add New Admin
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Create a new admin with system access
          </p>

          {/* Name */}
          <div className="mb-4">
            <label className="block font-semibold text-[#2E5B84] mb-2">
              Admin Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter admin name"
              value={form.name}
              onChange={handleChange}
              className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#2E5B84]"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block font-semibold text-[#2E5B84] mb-2">
              Admin Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter admin email"
              value={form.email}
              onChange={handleChange}
              className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#2E5B84]"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block font-semibold text-[#2E5B84] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#2E5B84]"
              />
              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading} // disable while loading
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0d203a] hover:bg-[#143a5e]"
            }`}
          >
            {loading ? "Creating..." : "Create Admin"} {/* Show loading text */}
          </button>
        </form>
      </main>

      <ToastContainer />
    </div>
  );
}
