import React, { useState } from "react";
import { Lock, Eye, EyeOff, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [forgotMode, setForgotMode] = useState(false); // New state for forgot password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const endpoint = role === "superadmin" ? "/super-admin/login" : "/admin/login";
      const res = await axiosInstance.post(endpoint, { email, password });

      sessionStorage.clear();

      if (role === "admin") {
        sessionStorage.setItem("adminToken", res.data.token);
        sessionStorage.setItem("role", "admin");
        navigate("/admin/dashboard");
      }

      if (role === "superadmin") {
        sessionStorage.setItem("superadminToken", res.data.token);
        sessionStorage.setItem("role", "superadmin");
        navigate("/super-admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotMsg("");
  
    if (!forgotEmail) {
      setForgotError("Please enter your email");
      return;
    }
  
    try {
      setForgotLoading(true);
      const res = await axiosInstance.post("/reset-password/request-reset", {
        email: forgotEmail, // <-- this must match useState
        role,
        useLiveUrl: true    // <-- force live URL
      });
      setForgotMsg(res.data.message);
    } catch (err) {
      setForgotError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setForgotLoading(false);
    }
  };
  

  return (
    <div
      className="w-full h-screen flex items-center justify-center relative bg-gray-900"
      style={{
        backgroundImage: `url('/images/stats.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      {!forgotMode ? (
        <form
          onSubmit={handleLogin}
          className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 
          p-10 rounded-2xl shadow-xl w-[90%] max-w-[400px] text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-2 font-serif-custom">
            Admin Login
          </h2>
          <p className="text-gray-200 mb-6 text-sm">
            Secure access for authorized administrators
          </p>

          {error && (
            <p className="text-red-400 bg-red-900/30 border border-red-400/30 px-3 py-2 rounded-lg mb-4 text-sm">
              {error}
            </p>
          )}

          <div className="flex flex-col space-y-4 text-left">
            <div>
              <label className="text-sm mb-1 block">Login as</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="admin" className="bg-white/20 text-black">
                    Admin
                  </option>
                  <option value="superadmin" className="bg-white/20 text-black">
                    Super Admin
                  </option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown size={18} className="text-white" />
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 cursor-pointer opacity-80 hover:opacity-100"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-300">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-500" />
                Remember me
              </label>
              <button
                type="button"
                className="text-blue-400 hover:underline"
                onClick={() => setForgotMode(true)}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 
                rounded-lg font-medium text-white flex items-center justify-center gap-2
                transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <Lock className="w-4" /> {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleForgotPassword}
          className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 
          p-10 rounded-2xl shadow-xl w-[90%] max-w-[400px] text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Forgot Password</h2>

          {forgotMsg && (
            <p className="text-green-400 bg-green-900/30 px-3 py-2 rounded-lg mb-4 text-sm">
              {forgotMsg}
            </p>
          )}
          {forgotError && (
            <p className="text-red-400 bg-red-900/30 px-3 py-2 rounded-lg mb-4 text-sm">
              {forgotError}
            </p>
          )}

          <input
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              className="text-blue-400 hover:underline"
              onClick={() => setForgotMode(false)}
            >
              Back to Login
            </button>
          </div>

          <button
            type="submit"
            disabled={forgotLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            {forgotLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}
    </div>
  );
}
