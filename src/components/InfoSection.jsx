import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Cpu, Wifi, ShieldAlert } from "lucide-react"; // Bỏ import Database

// Component con: Thanh chỉ số (Giữ nguyên)
const StatBar = ({ label, value, color }) => (
  <div className="mb-4">
    <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 w-full bg-gray-800/50 relative overflow-hidden">
      {" "}
      {/* Giảm opacity bg */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className={`h-full ${color} relative`}
      >
        <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-30" />
      </motion.div>
    </div>
  </div>
);

// Component con: Terminal (Giữ nguyên)
const HackerTerminal = () => {
  const [lines, setLines] = useState(["INITIALIZING SYSTEM..."]);

  useEffect(() => {
    const logs = [
      "CONNECTING TO ARASAKA NET...",
      "BYPASSING FIREWALL LAYER 1...",
      "ENCRYPTING DATA STREAM...",
      "WARNING: ICE DETECTED...",
      "REROUTING PROXY SERVER...",
      "UPLOAD COMPLETE.",
      "WAITING FOR INPUT...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setLines((prev) => [...prev.slice(-4), `> ${logs[i]}`]);
        i++;
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-xs text-green-500 bg-black/60 p-4 border border-green-900/50 h-full min-h-[150px] flex flex-col justify-end backdrop-blur-sm">
      {lines.map((line, index) => (
        <p key={index} className="mb-1">
          {line}
        </p>
      ))}
      <span className="animate-pulse">_</span>
    </div>
  );
};

const InfoSection = () => {
  const marqueeText =
    "SYSTEM ALERT: UNAUTHORIZED ACCESS DETECTED // NETWORK UNSTABLE // ARASAKA SECURITY DEPLOYED // STAY HIDDEN // SYSTEM ALERT: UNAUTHORIZED ACCESS DETECTED //";

  return (
    // THAY ĐỔI 1: Xóa background màu đặc, dùng gradient mờ dần từ dưới lên để dễ đọc chữ hơn nhưng vẫn thấy 3D
    // border-t border-white/10: Giữ lại viền trên để ngăn cách
    <section className="relative z-10 w-full mt-20 border-t border-white/10 bg-gradient-to-b from-transparent via-black/40 to-black/80">
      {/* Marquee: Giảm opacity xuống 90% để hơi trong suốt */}
      <div className="w-full bg-cyber-yellow/90 text-black overflow-hidden py-2 border-y border-black flex flex-nowrap select-none backdrop-blur-sm">
        <div className="animate-marquee whitespace-nowrap font-display font-bold text-lg tracking-widest min-w-full shrink-0 pr-10">
          {marqueeText}
        </div>
        <div
          className="animate-marquee whitespace-nowrap font-display font-bold text-lg tracking-widest min-w-full shrink-0 pr-10"
          aria-hidden="true"
        >
          {marqueeText}
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        {/* THAY ĐỔI 2: Grid vẫn chia 3 cột, nhưng ta chỉ điền 2 cột đầu */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT 1: NEURAL STATUS */}
          {/* bg-black/40 + backdrop-blur: Làm kính mờ để thấy lờ mờ phía sau */}
          <div className="border border-white/10 p-6 bg-black/40 backdrop-blur-md hover:border-cyber-pink transition-colors group">
            <div className="flex items-center gap-2 mb-6 text-cyber-pink">
              <Activity />
              <h3 className="font-display text-2xl">NEURAL_STATUS</h3>
            </div>
            <StatBar label="RAM USAGE" value={84} color="bg-cyber-pink" />
            <StatBar label="CPU TEMP" value={45} color="bg-cyber-blue" />
            <StatBar label="SANITY LEVEL" value={12} color="bg-cyber-yellow" />

            <p className="mt-6 text-xs text-gray-500 font-mono leading-relaxed">
              Cảnh báo: Mức độ ổn định thần kinh đang ở mức thấp. Vui lòng ngắt
              kết nối hoặc nâng cấp Cyberware.
            </p>
          </div>

          {/* CỘT 2: DATA LOGS */}
          <div className="grid grid-rows-2 gap-8">
            <div className="border border-white/10 p-6 bg-black/40 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <Wifi className="text-cyber-blue" />
              </div>
              <h3 className="font-display text-xl mb-2 text-white">NETWORK</h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-400">
                <div>UP: 40TB/s</div>
                <div>PING: 1ms</div>
                <div>LOC: NIGHT CITY</div>
                <div className="text-green-500">SECURE</div>
              </div>
            </div>

            <div className="border border-white/10 bg-black/40 backdrop-blur-md relative group">
              <div className="absolute top-2 right-2 z-20">
                <ShieldAlert size={16} className="text-red-500 animate-pulse" />
              </div>
              <HackerTerminal />
            </div>
          </div>

          {/* CỘT 3 (MISSION): ĐÃ XÓA */}
          {/* Khoảng trống này sẽ để lộ Core Model phía sau */}
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
