import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsUp } from "lucide-react";

// --- CONSTANTS & CONFIG ---
const SCROLL_THRESHOLD = 300;

const BUTTON_VARIANTS = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  hover: { scale: 1.1, x: -5 },
  tap: { scale: 0.9 },
};

// --- CUSTOM HOOK: SCROLL LOGIC ---
/**
 * Tracks scroll position and calculates percentage.
 * @returns { isVisible: boolean, progress: number }
 */
const useScrollProgress = (threshold) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Visibility Logic
      const currentScroll = window.scrollY;
      setIsVisible(currentScroll > threshold);

      // 2. Progress Calculation
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      if (height > 0) {
        const scrolled = (winScroll / height) * 100;
        setProgress(scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { isVisible, progress };
};

// --- MAIN COMPONENT ---

const BackToTop = () => {
  const { isVisible, progress } = useScrollProgress(SCROLL_THRESHOLD);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          variants={BUTTON_VARIANTS}
          initial="initial"
          animate="animate"
          exit="exit"
          whileHover="hover"
          whileTap="tap"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          // Position: Fixed Right-Middle
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 group flex items-center gap-2"
        >
          {/* Hover Label */}
          <span className="hidden md:block text-[10px] font-mono text-cyber-blue bg-black/80 px-2 py-1 rounded-l-sm border-l border-y border-cyber-blue opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
            SCROLL_TOP
          </span>

          {/* Main Button Body */}
          <div className="relative bg-black/80 backdrop-blur-md border-l-2 border-y border-cyber-blue p-3 rounded-l-md shadow-[0_0_15px_rgba(0,240,255,0.2)] overflow-hidden">
            {/* Vertical Progress Bar Fill */}
            <div
              className="absolute bottom-0 left-0 w-full bg-cyber-blue/20 transition-all duration-100 ease-out"
              style={{ height: `${progress}%` }}
            />

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <ChevronsUp
                size={20}
                className="text-cyber-blue group-hover:animate-bounce"
              />
              {/* Vertical Percentage Text */}
              <span className="text-[8px] font-mono text-cyber-blue/70 writing-vertical-lr rotate-180 mt-1 select-none">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Decorative Left Glow Line */}
            <div className="absolute top-0 left-0 w-0.5 h-full bg-cyber-blue shadow-[0_0_10px_#00f0ff]" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
