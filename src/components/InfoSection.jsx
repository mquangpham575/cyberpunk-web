import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Wifi, Aperture, RotateCw, ChevronDown } from "lucide-react";

// --- CONSTANTS & CONFIG ---
const TERMINAL_LOGS = [
  "BYPASSING ICE...",
  "ENCRYPTING...",
  "WARNING: SPIKE DETECTED...",
  "REROUTING...",
  "COMPLETE.",
  "IDLE...",
];

const TEXT_CONTENT = {
  alert:
    "SYSTEM ALERT: UNAUTHORIZED ACCESS DETECTED // NETWORK UNSTABLE // ARASAKA SECURITY DEPLOYED // STAY HIDDEN //",
  diagnostics:
    "SYSTEM DIAGNOSTICS: RUNNING // MEMORY: OPTIMIZED // CORE TEMP: NORMAL // CONNECTION: ENCRYPTED // UPLOAD SPEED: 40TB/S //",
};

// --- SUB-COMPONENTS ---

/**
 * Animated Progress Bar with Cyberpunk texture
 */
const StatBar = ({ label, value, color }) => (
  <div className="mb-4">
    <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 w-full bg-gray-800/50 relative overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className={`h-full ${color} relative`}
      >
        {/* Striped Texture Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-30" />
      </motion.div>
    </div>
  </div>
);

/**
 * Simulates a scrolling terminal output
 */
const HackerTerminal = () => {
  const [lines, setLines] = useState(["INITIALIZING..."]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < TERMINAL_LOGS.length) {
        setLines((prev) => [...prev.slice(-5), `> ${TERMINAL_LOGS[i]}`]);
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

/**
 * Infinite scrolling text bar
 */
const MarqueeBar = ({ text, className, reverse = false }) => {
  const contentClass = `animate-marquee whitespace-nowrap font-display font-bold text-lg tracking-widest min-w-full shrink-0 pr-10 ${
    reverse ? "direction-reverse" : ""
  }`;

  return (
    <div
      className={`w-full overflow-hidden py-2 flex flex-nowrap select-none border-y border-black/50 ${className}`}
    >
      <div className={contentClass}>{text}</div>
      <div className={contentClass} aria-hidden="true">
        {text}
      </div>
    </div>
  );
};

/**
 * Right-side telemetry panel layout
 */
const CoreTelemetry = () => (
  <div className="relative h-full flex flex-col justify-between p-6 border-l border-white/10 bg-transparent">
    {/* Header Stats */}
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-cyber-blue">
        <Aperture className="animate-spin-slow" size={24} />
        <h3 className="font-display text-2xl drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]">
          CORE_SYNC
        </h3>
      </div>
      <div className="h-px w-full bg-linear-to-r from-cyber-blue to-transparent" />

      <div className="grid grid-cols-2 gap-4 font-mono text-xs">
        <div className="bg-black/40 p-2 rounded-sm backdrop-blur-sm">
          <span className="text-gray-400 block">FREQUENCY</span>
          <span className="text-white text-lg">54.2 GHz</span>
        </div>
        <div className="bg-black/40 p-2 rounded-sm backdrop-blur-sm">
          <span className="text-gray-400 block">VOLTAGE</span>
          <span className="text-cyber-yellow text-lg">12.8 kV</span>
        </div>
      </div>
    </div>

    {/* Center Radar Animation */}
    <div className="flex-1 flex items-center justify-center my-4 opacity-60">
      <div className="w-full h-48 border border-dashed border-cyber-blue/30 rounded-full relative flex items-center justify-center animate-[spin_30s_linear_infinite]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-cyber-blue shadow-[0_0_10px_#00f0ff]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-cyber-blue shadow-[0_0_10px_#00f0ff]" />
      </div>
    </div>

    {/* Footer Stats */}
    <div className="text-right">
      <div className="flex items-center justify-end gap-2 text-cyber-pink mb-1">
        <h3 className="font-display text-xl drop-shadow-[0_0_5px_rgba(255,0,60,0.8)]">
          STABILITY
        </h3>
        <RotateCw size={20} />
      </div>
      <div className="text-5xl font-mono font-bold text-white tracking-tighter drop-shadow-md">
        98<span className="text-lg text-gray-500">%</span>
      </div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

const InfoSection = () => {
  const handleScrollToMarket = () => {
    document
      .getElementById("black-market")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="system-status"
      className="relative z-10 w-full min-h-screen flex flex-col justify-between border-t border-white/10 bg-linear-to-r from-black/95 via-black/60 to-transparent"
    >
      {/* Top Warning Marquee */}
      <MarqueeBar
        text={TEXT_CONTENT.alert}
        className="bg-cyber-yellow/90 text-black"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex items-center relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* LEFT COLUMN: System Stats */}
            <div className="lg:col-span-7 p-6 md:p-8 border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Performance Bars */}
                <div>
                  <div className="flex items-center gap-2 mb-6 text-cyber-pink">
                    <Activity />
                    <h3 className="font-display text-2xl">NEURAL_LINK</h3>
                  </div>
                  <StatBar label="RAM LOAD" value={84} color="bg-cyber-pink" />
                  <StatBar label="CPU HEAT" value={62} color="bg-cyber-blue" />
                  <StatBar label="SANITY" value={12} color="bg-cyber-yellow" />
                </div>

                {/* Network & Terminal */}
                <div className="flex flex-col gap-6">
                  {/* Net Stat Module */}
                  <div className="p-4 border border-white/10 bg-black/50 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-display text-lg text-white">
                        NET_STAT
                      </h3>
                      <Wifi className="text-cyber-blue" size={18} />
                    </div>
                    <div className="font-mono text-xs text-gray-400 space-y-1">
                      <div className="flex justify-between">
                        <span>PING:</span>{" "}
                        <span className="text-white">1ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>JITTER:</span>{" "}
                        <span className="text-white">0.4</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PKT LOSS:</span>{" "}
                        <span className="text-green-500">0%</span>
                      </div>
                    </div>
                  </div>

                  {/* Terminal Module */}
                  <div className="flex-1 border border-white/10">
                    <HackerTerminal />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Core Telemetry */}
            <div className="lg:col-span-5 relative">
              <CoreTelemetry />
            </div>
          </div>
        </div>

        {/* Scroll Indicator (Synced with App.jsx style) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 0.5, duration: 2, repeat: Infinity }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-cyber-blue flex flex-col items-center gap-2 cursor-pointer z-20"
          onClick={handleScrollToMarket}
        >
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-70 shadow-black drop-shadow-md">
            SCROLL DOWN
          </span>
          <ChevronDown
            size={24}
            className="drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]"
          />
        </motion.div>
      </div>

      {/* Bottom Diagnostics Marquee */}
      <MarqueeBar
        text={TEXT_CONTENT.diagnostics}
        className="bg-black text-cyber-blue border-t border-cyber-blue"
      />
    </section>
  );
};

export default InfoSection;
