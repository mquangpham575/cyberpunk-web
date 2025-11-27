// src/components/AuthModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, User, Lock, Mail, AlertTriangle } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../services/firebase"; // Firebase configuration import

const AuthModal = ({ onClose }) => {
  // State for auth mode (Login/Register) and form data
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Execute Login
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
      } else {
        // Execute Registration
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        // Update user profile (Display Name)
        await updateProfile(userCredential.user, {
          displayName: formData.username,
        });
      }
      // Close modal on successful authentication
      onClose();
    } catch (err) {
      console.error(err);
      // Map Firebase error codes to user-friendly messages
      if (err.code === "auth/email-already-in-use")
        setError("LỖI: Email đã được sử dụng.");
      else if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential"
      )
        setError("LỖI: Sai thông tin đăng nhập.");
      else if (err.code === "auth/weak-password")
        setError("LỖI: Mật khẩu quá yếu (tối thiểu 6 ký tự).");
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-md bg-black border border-cyber-blue shadow-[0_0_20px_rgba(0,240,255,0.2)] p-8 overflow-hidden">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#00f0ff12_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff12_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="relative z-10">
          <h2 className="text-2xl font-display text-white mb-1 tracking-widest text-center">
            {isLogin ? "SYSTEM_LOGIN" : "NEW_IDENTITY"}
          </h2>
          <p className="text-xs font-mono text-cyber-blue text-center mb-6">
            {isLogin
              ? "Authenticate to access Mainframe"
              : "Register signature to database"}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-500 text-xs font-mono flex items-center gap-2">
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Render Username field only for Registration */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase">
                  Codename
                </label>
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    name="username"
                    type="text"
                    required
                    placeholder="V. Mercenary"
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 py-2.5 pl-9 pr-4 text-white text-sm font-mono focus:border-cyber-blue focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-400 uppercase">
                Net Link (Email)
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="runner@nightcity.net"
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 py-2.5 pl-9 pr-4 text-white text-sm font-mono focus:border-cyber-blue focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-400 uppercase">
                Passcode
              </label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 py-2.5 pl-9 pr-4 text-white text-sm font-mono focus:border-cyber-blue focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-6 font-bold font-mono uppercase tracking-widest text-sm transition-all ${
                loading
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-cyber-blue text-black hover:bg-white hover:shadow-[0_0_15px_#00f0ff]"
              }`}
            >
              {loading
                ? "PROCESSING..."
                : isLogin
                ? "ACCESS MAINNET"
                : "CREATE SIGNATURE"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-mono text-gray-400 hover:text-cyber-pink underline decoration-dashed underline-offset-4"
            >
              {isLogin
                ? "No ID? Initialize new protocol >"
                : "Already registered? Log in >"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthModal;
