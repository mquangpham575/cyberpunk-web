import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  X,
  User,
  Lock,
  Mail,
  AlertTriangle,
  Image as ImageIcon,
  ArrowLeft,
} from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  // --- THÊM MỚI: Import Google Provider ---
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../services/firebase";

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();

  // Form state management
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    photoURL: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle 'Escape' key navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") navigate("/");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // --- THÊM MỚI: Xử lý đăng nhập Google ---
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Cập nhật state user local nếu có
      if (setUser) {
        setUser(user);
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("LỖI: Đăng nhập Google thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Authentication: Sign In
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
      } else {
        // Authentication: Sign Up
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        const finalPhotoURL =
          formData.photoURL ||
          "https://api.dicebear.com/9.x/shapes/svg?seed=" + formData.username;

        await updateProfile(userCredential.user, {
          displayName: formData.username,
          photoURL: finalPhotoURL,
        });

        // Update local user state
        if (setUser) {
          setUser({
            ...userCredential.user,
            displayName: formData.username,
            photoURL: finalPhotoURL,
          });
        }
      }

      // Redirect to home on success
      navigate("/");
    } catch (err) {
      console.error(err);
      // Error handling logic
      if (err.code === "auth/email-already-in-use")
        setError("LỖI: Email đã được sử dụng.");
      else if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential"
      )
        setError("LỖI: Sai thông tin đăng nhập.");
      else if (err.code === "auth/weak-password")
        setError("LỖI: Mật khẩu quá yếu.");
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="min-h-screen flex items-center justify-center relative z-50 p-4 pt-20"
    >
      {/* Navigation: Back button */}
      <div className="absolute top-24 left-6 md:left-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-cyber-blue transition-colors group bg-black/50 p-2 border border-white/10"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-mono text-sm uppercase tracking-widest hidden md:inline">
            QUAY LẠI (ESC)
          </span>
        </button>
      </div>

      <div className="relative w-full max-w-md bg-black border border-cyber-blue shadow-[0_0_40px_rgba(0,240,255,0.15)] p-8 overflow-hidden">
        {/* Background grid effect */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#00f0ff12_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff12_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-display text-white mb-2 tracking-widest text-center text-shadow-glow">
            {isLogin ? "ĐĂNG NHẬP HỆ THỐNG" : "TẠO DANH TÍNH MỚI"}
          </h2>
          <p className="text-xs font-mono text-cyber-blue text-center mb-8 border-b border-cyber-blue/30 pb-4">
            {isLogin ? "XÁC THỰC ĐỂ TRUY CẬP MÁY CHỦ" : ""}
          </p>

          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mb-6 p-3 bg-red-500/10 border border-red-500 text-red-500 text-xs font-mono flex items-center gap-2"
            >
              <AlertTriangle size={14} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">
                    Biệt Danh (Codename)
                  </label>
                  <div className="relative group">
                    <User
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyber-blue transition-colors"
                    />
                    <input
                      name="username"
                      type="text"
                      required
                      placeholder="V. Mercenary"
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 py-3 pl-9 pr-4 text-white text-sm font-mono focus:border-cyber-blue focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">
                    URL Ảnh Đại Diện (Tùy chọn)
                  </label>
                  <div className="relative group">
                    <ImageIcon
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyber-blue transition-colors"
                    />
                    <input
                      name="photoURL"
                      type="url"
                      placeholder="https://..."
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 py-3 pl-9 pr-4 text-white text-sm font-mono focus:border-cyber-blue focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-400 uppercase">
                Net Link (Email)
              </label>
              <div className="relative group">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyber-blue transition-colors"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="runner@nightcity.net"
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 py-3 pl-9 pr-4 text-white text-sm font-mono focus:border-cyber-blue focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-400 uppercase">
                Mã Khóa (Mật Khẩu)
              </label>
              <div className="relative group">
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyber-blue transition-colors"
                />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 py-3 pl-9 pr-4 text-white text-sm font-mono focus:border-cyber-blue focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 font-bold font-mono uppercase tracking-widest text-sm transition-all clip-path-polygon ${
                loading
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-cyber-blue text-black hover:bg-white hover:shadow-[0_0_20px_#00f0ff]"
              }`}
            >
              {loading
                ? "ĐANG XỬ LÝ..."
                : isLogin
                ? "TRUY CẬP MAINNET"
                : "KHỞI TẠO DANH TÍNH"}
            </button>
          </form>

          {/* --- THÊM MỚI: Phần Google Login --- */}
          <div className="my-6 flex items-center justify-between gap-4">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-[10px] font-mono text-gray-500 uppercase">
              HOẶC
            </span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 flex items-center justify-center gap-3 border border-white/20 bg-white/5 hover:bg-white/10 hover:border-cyber-blue/50 transition-all group"
          >
            {/* Google Icon SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M24 12.276c0-.816-.073-1.636-.21-2.428H12.273v4.61h6.613c-.286 1.543-1.127 2.822-2.39 3.665v3.01h3.843c2.25-2.07 3.56-5.118 3.56-8.857z"
              />
              <path
                fill="#34A853"
                d="M12.273 24c3.3 0 6.082-1.09 8.106-2.955l-3.844-3.01c-1.092.738-2.505 1.185-4.262 1.185-3.21 0-5.93-2.17-6.906-5.09H1.29v3.21C3.33 21.393 7.502 24 12.273 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.367 14.13c-.244-.738-.38-1.528-.38-2.346s.138-1.608.38-2.346v-3.21H1.29C.466 7.915 0 9.9 0 12.217c0 2.316.466 4.302 1.29 5.95l4.077-3.21z"
              />
              <path
                fill="#4285F4"
                d="M12.273 4.783c1.76 0 3.36.608 4.63 1.79l3.435-3.468C18.354 1.127 15.57 0 12.273 0 7.502 0 3.33 2.607 1.29 6.31l4.076 3.21c.976-2.92 3.696-5.09 6.906-5.09z"
              />
            </svg>
            <span className="text-xs font-mono text-white group-hover:text-cyber-blue transition-colors tracking-wider">
              GOOGLE ACCESS
            </span>
          </button>
          {/* --- KẾT THÚC: Phần Google Login --- */}

          <div className="mt-8 text-center border-t border-white/10 pt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-mono text-gray-400 hover:text-cyber-pink transition-colors"
            >
              {isLogin
                ? "[ CHƯA CÓ ID? ĐĂNG KÍ MỚI ]"
                : "[ ĐÃ CÓ TÀI KHOẢN? ĐĂNG NHẬP ]"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
