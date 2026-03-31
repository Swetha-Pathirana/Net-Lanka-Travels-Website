import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = searchParams.get("id");
  const token = searchParams.get("token");
  const role = searchParams.get("role");

  if (!role) {
    setError("Invalid reset link");
    return;
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId || !token) {
      setError("Invalid or expired link");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/reset-password/reset-password", {
        userId,
        token,
        newPassword: password,
        role,
      });
      alert("Password updated successfully. Please login again.");
      navigate(`/admin/login`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 p-8 rounded-2xl w-[90%] max-w-[400px] text-white"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Change Password</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded bg-white/20 outline-none mb-4"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-3 rounded bg-white/20 outline-none mb-4"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 rounded-lg"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
