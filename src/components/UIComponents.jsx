import { motion } from "framer-motion";

// --- CONSTANTS & CONFIG ---
const CLIP_PATH = "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)";

const OUTLINE_VARIANTS = {
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

/**
 * CyberButton Component
 * Supports 'outline' style (blue/yellow) and 'solid' style (pink/default).
 */
export const CyberButton = ({ children, onClick, variant = "yellow" }) => {
  const config = OUTLINE_VARIANTS[variant];
  const isOutline = !!config;

  // Shared Framer Motion props
  const motionProps = {
    whileHover: { scale: 1.05, x: 2 },
    whileTap: { scale: 0.98 },
    onClick: onClick,
    style: { clipPath: CLIP_PATH },
  };

  // --- RENDER: OUTLINE VARIANT (Blue/Yellow) ---
  if (isOutline) {
    return (
      <motion.button
        {...motionProps}
        className={`relative group p-0.5 font-display text-base md:text-lg font-bold uppercase tracking-wider transition-all duration-150 ${config.borderColor}`}
      >
        <div
          style={{ clipPath: CLIP_PATH }}
          className={`
            relative h-full w-full px-6 py-2 md:px-8 md:py-3 flex items-center justify-center transition-colors duration-150
            bg-cyber-black ${config.hoverBg}
            ${config.textColor} group-hover:text-cyber-black
          `}
        >
          {children}
        </div>
        {/* Shine Effect */}
        <div className="absolute top-0 -left-full w-full h-full bg-white/40 skew-x-12 group-hover:left-full transition-all duration-300 ease-in-out z-50 pointer-events-none" />
      </motion.button>
    );
  }

  // --- RENDER: SOLID VARIANT (Pink/Default) ---
  return (
    <motion.button
      {...motionProps}
      className={`
        bg-cyber-pink text-white hover:shadow-[0_0_15px_rgba(255,0,60,0.5)]
        px-6 py-2 md:px-8 md:py-3 font-display text-base md:text-lg font-bold uppercase tracking-wider border-2 border-transparent
        relative overflow-hidden group transition-all duration-150
      `}
    >
      {/* Shine Effect */}
      <div className="absolute top-0 -left-full w-full h-full bg-white/20 skew-x-12 group-hover:left-full transition-all duration-300 ease-in-out" />
      {children}
    </motion.button>
  );
};

/**
 * GlitchTitle Component
 * Creates a chromatic aberration effect using 3 layers of text.
 */
export const GlitchTitle = ({ text }) => {
  const baseClasses =
    "text-4xl md:text-6xl font-display font-black uppercase tracking-tighter leading-none";

  return (
    <div className="relative inline-block mb-4 md:mb-6 animate-flicker">
      {/* Main Layer (White) */}
      <h1 className={`${baseClasses} text-white relative z-10`}>{text}</h1>

      {/* Glitch Layer 1 (Pink Offset) */}
      <div
        className={`${baseClasses} absolute top-0 left-0 text-cyber-pink opacity-70 translate-x-0.5 -z-10 mix-blend-screen`}
      >
        {text}
      </div>

      {/* Glitch Layer 2 (Blue Offset) */}
      <div
        className={`${baseClasses} absolute top-0 left-0 text-cyber-blue opacity-70 -translate-x-0.5 -z-10 mix-blend-screen`}
      >
        {text}
      </div>
    </div>
  );
};
