import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Skull,
  Wifi,
  Briefcase,
  AlertTriangle,
  ChevronRight,
  X,
  ArrowLeft,
} from "lucide-react";

// Data import
import { MISSION_DATA } from "../data/missionData";

const MissionPage = () => {
  const navigate = useNavigate();
  const [selectedMission, setSelectedMission] = useState(null);
  const [filter, setFilter] = useState("all");

  // Handle Escape key navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (selectedMission) {
          setSelectedMission(null);
        } else {
          navigate("/"); // Return to home route
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMission, navigate]);

  // Helper: Resolve color class based on risk level
  const getRiskColor = (risk) => {
    switch (risk) {
      case "Low":
        return "text-green-400 border-green-400";
      case "Medium":
        return "text-cyber-blue border-cyber-blue";
      case "High":
        return "text-cyber-yellow border-cyber-yellow";
      case "Extreme":
        return "text-cyber-pink border-cyber-pink";
      default:
        return "text-white border-white";
    }
  };

  // Helper: Map mission type to icon component
  const getIcon = (type) => {
    switch (type) {
      case "Theft":
        return <Wifi />;
      case "Assassination":
        return <Skull />;
      case "Sabotage":
        return <AlertTriangle />;
      default:
        return <Briefcase />;
    }
  };

  // Helper: Translate filter state to display label
  const getFilterLabel = (f) => {
    switch (f) {
      case "all":
        return "TẤT CẢ";
      case "available":
        return "KHẢ DỤNG";
      case "locked":
        return "ĐÃ KHÓA";
      default:
        return f;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-black/95 text-white flex flex-col pt-20"
    >
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      {/* Header Section */}
      <header className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/80 backdrop-blur z-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-cyber-blue transition-colors group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-mono text-sm uppercase tracking-widest">
            QUAY LẠI (ESC)
          </span>
        </button>
        <h1 className="text-3xl font-display tracking-widest text-cyber-blue text-shadow-glow">
          NHIỆM VỤ
        </h1>
        <div className="flex gap-2">
          <div className="px-3 py-1 border border-cyber-pink/50 bg-cyber-pink/10 text-xs font-mono text-cyber-pink animate-pulse">
            TRỰC TUYẾN
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Sidebar: Filter controls */}
        <aside className="w-64 border-r border-white/10 p-6 hidden md:block">
          <h3 className="text-sm font-mono text-gray-500 mb-6">BỘ LỌC</h3>
          <ul className="space-y-4 font-mono text-sm">
            {["all", "available", "locked"].map((f) => (
              <li
                key={f}
                onClick={() => setFilter(f)}
                className={`cursor-pointer flex items-center justify-between group ${
                  filter === f
                    ? "text-cyber-yellow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="uppercase">{getFilterLabel(f)}</span>
                <ChevronRight
                  size={14}
                  className={`transition-transform ${
                    filter === f
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 group-hover:opacity-50"
                  }`}
                />
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content: Mission Grid */}
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {MISSION_DATA.filter(
              (m) => filter === "all" || m.status === filter
            ).map((mission, idx) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedMission(mission)}
                className={`relative group bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all cursor-pointer overflow-hidden ${
                  mission.status === "locked" ? "opacity-50 grayscale" : ""
                }`}
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine" />
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`p-3 bg-black border ${getRiskColor(
                      mission.risk
                    )}`}
                  >
                    {getIcon(mission.type)}
                  </div>
                  <span
                    className={`text-xs font-mono px-2 py-1 border ${getRiskColor(
                      mission.risk
                    )}`}
                  >
                    ĐỘ KHÓ: {mission.risk.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-display text-lg mb-2 group-hover:text-cyber-blue transition-colors">
                  {mission.title}
                </h3>
                <p className="text-gray-400 text-xs font-mono line-clamp-2 mb-4">
                  {mission.desc}
                </p>
                <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-auto">
                  <span className="text-cyber-yellow font-mono font-bold">
                    €$ {mission.reward.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                    {mission.status === "locked" ? "ĐÃ KHÓA" : "KHẢ DỤNG"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>

      {/* Modal: Mission Details */}
      <AnimatePresence>
        {selectedMission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-70 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedMission(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-black border border-cyber-blue relative shadow-[0_0_50px_rgba(0,240,255,0.15)]"
            >
              <div className="bg-cyber-blue/10 p-6 border-b border-cyber-blue flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-display text-white mb-1">
                    {selectedMission.title}
                  </h2>
                  <div className="flex gap-4 text-xs font-mono text-cyber-blue">
                    <span>ID: {selectedMission.id}</span>
                    <span>// {selectedMission.location.toUpperCase()}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMission(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-gray-500 font-mono text-xs uppercase mb-2">
                      Khách Hàng
                    </h4>
                    <p className="text-white font-mono">
                      {selectedMission.client}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-gray-500 font-mono text-xs uppercase mb-2">
                      Loại Nhiệm Vụ
                    </h4>
                    <p className="text-white font-mono">
                      {selectedMission.type}
                    </p>
                  </div>
                </div>
                <div className="bg-white/5 p-4 border-l-2 border-cyber-yellow">
                  <h4 className="text-cyber-yellow font-mono text-xs uppercase mb-2">
                    Chi Tiết Nhiệm Vụ
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedMission.desc} <br />
                    <br />
                    <span className="italic text-gray-500">
                      "Thông tin tình báo cho thấy mục tiêu được bảo vệ nghiêm
                      ngặt. Khuyến nghị sử dụng Cyberware tàng hình hoặc vũ khí
                      hạng nặng."
                    </span>
                  </p>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <div className="text-2xl text-cyber-yellow font-display">
                    THÙ LAO: €$ {selectedMission.reward.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-white/10 flex gap-4">
                <button
                  onClick={() => setSelectedMission(null)}
                  className="flex-1 py-3 border border-gray-600 text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all font-mono uppercase"
                >
                  Từ Chối
                </button>
                {selectedMission.status === "available" ? (
                  <button className="flex-2 py-3 bg-cyber-blue text-black font-bold font-mono uppercase hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all clip-path-polygon">
                    CHẤP NHẬN HỢP ĐỒNG
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-2 py-3 bg-gray-800 text-gray-500 font-mono uppercase cursor-not-allowed"
                  >
                    CHƯA MỞ KHÓA
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MissionPage;
