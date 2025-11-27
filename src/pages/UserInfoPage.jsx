// src/pages/UserInfoPage.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import {
  User,
  Mail,
  Shield,
  CreditCard,
  Activity,
  LogOut,
  ArrowLeft,
  Save,
  Loader,
  Phone,
  MapPin,
  Edit3,
} from "lucide-react";

const UserInfoPage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State: Thêm displayName vào đây để quản lý
  const [formData, setFormData] = useState({
    displayName: "", // Thêm trường tên
    phoneNumber: "",
    address: "",
    walletId: "",
  });

  // Auth Check
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Handle ESC Key to go back
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        navigate("/");
      }
    };
    window.addEventListener("keydown", handleEsc);

    // Cleanup listener
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [navigate]);

  // Fetch Data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        // Logic xác định tên hiển thị ban đầu
        const fallbackName =
          user.displayName || user.email?.split("@")[0] || "OPERATOR";

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(data);
          setFormData({
            displayName: data.displayName || fallbackName,
            phoneNumber: data.phoneNumber || "",
            address: data.address || "",
            walletId: data.walletId || "",
          });
        } else {
          // Initialize default profile
          const defaultData = {
            displayName: fallbackName,
            email: user.email,
            level: 1,
            itemsBought: 0,
            missionsCompleted: 0,
            accountStatus: "XÁC THỰC",
            walletId: `0x${Math.floor(Math.random() * 100000000)
              .toString(16)
              .toUpperCase()}-2077`,
            joinedAt: new Date().toISOString(),
            phoneNumber: "",
            address: "",
          };

          try {
            await setDoc(docRef, defaultData);
          } catch (e) {
            console.warn("Lỗi tạo data:", e);
          }

          setProfileData(defaultData);
          setFormData({
            displayName: defaultData.displayName,
            phoneNumber: "",
            address: "",
            walletId: defaultData.walletId,
          });
        }
      } catch (error) {
        console.error("Lỗi fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, "users", user.uid);

      await setDoc(
        docRef,
        {
          displayName: formData.displayName, // Lưu tên mới
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          walletId: formData.walletId,
        },
        { merge: true }
      );

      setProfileData((prev) => ({
        ...prev,
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        walletId: formData.walletId,
      }));
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!user) return null;
  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader className="text-cyber-blue animate-spin" />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center relative z-10"
    >
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-3xl bg-black/80 border border-white/10 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 z-20 flex items-center gap-2 text-gray-500 hover:text-cyber-blue transition-colors group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-mono text-xs uppercase">QUAY LẠI (ESC)</span>
        </button>

        {/* LEFT COLUMN: Avatar & Static Info */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 p-8 flex flex-col items-center justify-center bg-white/5 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-cyber-pink shadow-[0_0_10px_#ff003c]"></div>

          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full border-2 border-cyber-blue p-1 relative z-10 bg-black overflow-hidden">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-gray-500">
                  <User size={48} />
                </div>
              )}
            </div>
          </div>

          {/* HIỂN THỊ TÊN (Lấy trực tiếp từ formData để Preview realtime) */}
          <h2 className="text-xl font-display text-white mb-1 text-center uppercase tracking-wider wrap-break-word w-full px-2">
            {formData.displayName || "OPERATOR"}
          </h2>

          <span className="text-[10px] font-mono text-gray-400 bg-white/10 px-2 py-1 rounded-sm">
            UID: {user.uid.slice(0, 8).toUpperCase()}
          </span>
        </div>

        {/* RIGHT COLUMN: Info Form */}
        <div className="w-full md:w-2/3 p-8 flex flex-col">
          <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-6">
            <h3 className="text-sm font-mono text-cyber-blue flex items-center gap-2">
              <Activity size={14} /> // HỒ SƠ CÁ NHÂN
            </h3>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-3 py-1 bg-cyber-blue/10 border border-cyber-blue text-cyber-blue hover:bg-cyber-blue hover:text-black transition-colors font-mono text-xs font-bold"
            >
              {saving ? (
                <Loader size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              LƯU THAY ĐỔI
            </button>
          </div>

          {/* Stats Grid (Read-only) */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-black/50 border border-white/5 p-3 text-center">
              <div className="text-xl font-display text-cyber-yellow mb-1">
                {profileData?.itemsBought || 0}
              </div>
              <div className="text-[9px] text-gray-500 font-mono tracking-widest">
                ĐÃ MUA
              </div>
            </div>
            <div className="bg-black/50 border border-white/5 p-3 text-center">
              <div className="text-xl font-display text-cyber-blue mb-1 uppercase">
                {profileData?.level || 1}
              </div>
              <div className="text-[9px] text-gray-500 font-mono tracking-widest">
                CẤP ĐỘ
              </div>
            </div>
            <div className="bg-black/50 border border-white/5 p-3 text-center">
              <div className="text-xl font-display text-green-500 mb-1">
                {profileData?.missionsCompleted || 0}
              </div>
              <div className="text-[9px] text-gray-500 font-mono tracking-widest">
                NHIỆM VỤ
              </div>
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-4 mb-8">
            {/* Username Field (NEW) */}
            <div className="group">
              <label className="text-[10px] text-gray-500 font-mono uppercase mb-1 flex justify-between">
                Tên Hiển Thị (Username)
                <Edit3 size={10} className="text-cyber-blue" />
              </label>
              <div className="flex items-center gap-3 text-sm font-mono text-white border-b border-white/20 pb-2 focus-within:border-cyber-blue transition-colors">
                <User size={14} className="text-cyber-blue" />
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="w-full bg-transparent focus:outline-none placeholder-gray-600"
                  placeholder="Nhập tên hiển thị..."
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div className="group">
              <label className="text-[10px] text-gray-500 font-mono uppercase block mb-1">
                Email{" "}
                <span className="text-[9px] text-gray-600 ml-2">[KHÓA]</span>
              </label>
              <div className="flex items-center gap-3 text-sm font-mono text-gray-300 border-b border-white/5 pb-2 cursor-not-allowed">
                <Mail size={14} /> {user.email}
              </div>
            </div>

            {/* Phone Number (Editable) */}
            <div className="group">
              <label className="text-[10px] text-gray-500 font-mono uppercase mb-1 flex justify-between">
                Số Điện Thoại
                <Edit3 size={10} className="text-cyber-blue" />
              </label>
              <div className="flex items-center gap-3 text-sm font-mono text-white border-b border-white/20 pb-2 focus-within:border-cyber-blue transition-colors">
                <Phone size={14} className="text-cyber-blue" />
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full bg-transparent focus:outline-none placeholder-gray-600"
                  placeholder="Nhập số điện thoại..."
                />
              </div>
            </div>

            {/* Address (Editable) */}
            <div className="group">
              <label className="text-[10px] text-gray-500 font-mono uppercase mb-1 flex justify-between">
                Địa Chỉ Giao Hàng
                <Edit3 size={10} className="text-cyber-blue" />
              </label>
              <div className="flex items-center gap-3 text-sm font-mono text-white border-b border-white/20 pb-2 focus-within:border-cyber-blue transition-colors">
                <MapPin size={14} className="text-cyber-blue" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-transparent focus:outline-none placeholder-gray-600"
                  placeholder="Nhập địa chỉ..."
                />
              </div>
            </div>

            {/* Wallet (Editable) */}
            <div className="group">
              <label className="text-[10px] text-gray-500 font-mono uppercase mb-1 flex justify-between">
                Ví Liên Kết / Thẻ Tín Dụng
                <Edit3 size={10} className="text-cyber-yellow" />
              </label>
              <div className="flex items-center gap-3 text-sm font-mono text-white border-b border-white/20 pb-2 focus-within:border-cyber-yellow transition-colors">
                <CreditCard size={14} className="text-cyber-yellow" />
                <input
                  type="text"
                  name="walletId"
                  value={formData.walletId}
                  onChange={handleInputChange}
                  className="w-full bg-transparent focus:outline-none placeholder-gray-600"
                  placeholder="Nhập mã ví hoặc thẻ..."
                />
              </div>
            </div>
          </div>

          <div className="mt-auto flex justify-end">
            <button
              onClick={() => {
                onLogout();
                navigate("/");
              }}
              className="flex items-center gap-2 px-6 py-3 border border-red-500/50 text-red-500 font-mono text-xs hover:bg-red-500 hover:text-black transition-all uppercase tracking-widest"
            >
              <LogOut size={14} /> ĐĂNG XUẤT
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserInfoPage;
