import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Cpu, Wifi, ShieldAlert, Database } from "lucide-react";

// Component con: Thanh chỉ số (Progress Bar)
const StatBar = ({ label, value, color }) => (
  <div className="mb-4">
    <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 w-full bg-gray-800 relative overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className={`h-full ${color} relative`}
      >
        {/* Hiệu ứng sọc chéo trên thanh */}
        <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-30" />
      </motion.div>
    </div>
  </div>
);

// Component con: Terminal giả lập
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
        setLines((prev) => [...prev.slice(-4), `> ${logs[i]}`]); // Giữ lại 5 dòng cuối
        i++;
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-xs text-green-500 bg-black/80 p-4 border border-green-900/50 h-full min-h-[150px] flex flex-col justify-end">
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
  return (
    <section className="relative z-10 w-full bg-cyber-black/90 backdrop-blur-md border-t border-white/10 mt-20">
      {/* 1. MARQUEE: Dòng chữ chạy ngang */}
      <div className="w-full bg-cyber-yellow text-black overflow-hidden py-2 border-y border-black">
        <div className="animate-marquee whitespace-nowrap font-display font-bold text-lg tracking-widest">
          SYSTEM ALERT: UNAUTHORIZED ACCESS DETECTED // NETWORK UNSTABLE //
          ARASAKA SECURITY DEPLOYED // STAY HIDDEN // SYSTEM ALERT: UNAUTHORIZED
          ACCESS DETECTED
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT 1: NEURAL STATUS (Stats) */}
          <div className="border border-white/10 p-6 bg-black/40 hover:border-cyber-pink transition-colors group">
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

          {/* CỘT 2: DATA LOGS (Grid nhỏ) */}
          <div className="grid grid-rows-2 gap-8">
            {/* Box trên */}
            <div className="border border-white/10 p-6 bg-black/40 relative overflow-hidden group">
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

            {/* Box dưới (Terminal) */}
            <div className="border border-white/10 bg-black/40 relative group">
              <div className="absolute top-2 right-2 z-20">
                <ShieldAlert size={16} className="text-red-500 animate-pulse" />
              </div>
              <HackerTerminal />
            </div>
          </div>

          {/* CỘT 3: MISSION BRIEF (Text) */}
          <div className="border border-white/10 p-6 bg-black/40 hover:border-cyber-yellow transition-colors relative">
            {/* Góc trang trí */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-cyber-yellow border-r-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center gap-2 mb-6 text-cyber-yellow">
              <Database />
              <h3 className="font-display text-2xl">MISSION_01</h3>
            </div>

            <ul className="space-y-4 font-mono text-sm text-gray-300">
              <li className="flex gap-3">
                <span className="text-cyber-yellow">[01]</span>
                <span>Thâm nhập tháp Arasaka tầng 40.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyber-yellow">[02]</span>
                <span>Tải virus "SoulKiller" vào mainframe.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyber-gray">[03]</span>
                <span className="line-through text-gray-600">
                  Thoát ra an toàn.
                </span>{" "}
                (FAILED)
              </li>
            </ul>

            <button className="mt-8 w-full border border-white/20 py-3 text-xs font-bold tracking-widest hover:bg-white hover:text-black transition-colors uppercase">
              Download Data
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
