import { motion } from "framer-motion";

export const CyberButton = ({ children, onClick, variant = "yellow" }) => {
  const outlineConfig = {
    blue: {
      borderColor: "bg-cyber-blue",
      textColor: "text-cyber-blue",
      hoverBg: "group-hover:bg-cyber-blue",
    },
    yellow: {
      borderColor: "bg-cyber-yellow",
      textColor: "text-cyber-yellow",
      hoverBg: "group-hover:bg-cyber-yellow",
    },
  };

  const config = outlineConfig[variant];
  const isOutline = !!config;
  const commonClipPath = "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)";

  // --- RENDER CHO NÚT DẠNG OUTLINE ---
  if (isOutline) {
    return (
      <motion.button
        whileHover={{ scale: 1.05, x: 2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        // GIẢM CỠ CHỮ: text-lg md:text-xl -> text-base md:text-lg
        className={`relative group p-[2px] font-display text-base md:text-lg font-bold uppercase tracking-wider transition-all duration-150 ${config.borderColor}`}
        style={{ clipPath: commonClipPath }}
      >
        <div
          className={`
            relative h-full w-full px-6 py-2 md:px-8 md:py-3 flex items-center justify-center transition-colors duration-150
            bg-cyber-black ${config.hoverBg}
            ${config.textColor} group-hover:text-cyber-black
          `}
          style={{ clipPath: commonClipPath }}
        >
          {children}
        </div>
        <div className="absolute top-0 -left-full w-full h-full bg-white/40 skew-x-12 group-hover:left-full transition-all duration-300 ease-in-out z-50 pointer-events-none" />
      </motion.button>
    );
  }

  // --- RENDER CHO NÚT SOLID (Fallback) ---
  return (
    <motion.button
      whileHover={{ scale: 1.05, x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      // GIẢM CỠ CHỮ: text-lg md:text-xl -> text-base md:text-lg
      className={`
        bg-cyber-pink text-white hover:shadow-[0_0_15px_rgba(255,0,60,0.5)]
        px-6 py-2 md:px-8 md:py-3 font-display text-base md:text-lg font-bold uppercase tracking-wider border-2 border-transparent
        relative overflow-hidden group transition-all duration-150
      `}
      style={{ clipPath: commonClipPath }}
    >
      <div className="absolute top-0 -left-full w-full h-full bg-white/20 skew-x-12 group-hover:left-full transition-all duration-300 ease-in-out" />
      {children}
    </motion.button>
  );
};

// Component Title
export const GlitchTitle = ({ text }) => (
  <div className="relative inline-block mb-4 md:mb-6 animate-flicker">
    {/* GIẢM CỠ CHỮ: text-5xl md:text-7xl -> text-4xl md:text-6xl */}
    <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter leading-none relative z-10">
      {text}
    </h1>
    {/* Áp dụng tương tự cho các lớp bóng */}
    <div className="absolute top-0 left-0 text-4xl md:text-6xl font-display font-black text-cyber-pink opacity-70 translate-x-0.5 -z-10 mix-blend-screen">
      {text}
    </div>
    <div className="absolute top-0 left-0 text-4xl md:text-6xl font-display font-black text-cyber-blue opacity-70 -translate-x-0.5 -z-10 mix-blend-screen">
      {text}
    </div>
  </div>
);
