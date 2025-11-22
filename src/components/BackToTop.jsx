import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ChevronsUp } from "lucide-react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      // 1. Logic hiện/ẩn: Scroll qua 300px thì hiện
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // 2. Logic thanh tiến trình (Progress Bar) chạy quanh nút
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, x: 20 }} // Trượt từ phải vào
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          whileHover={{ scale: 1.1, x: -5 }} // Hover thì lồi ra một chút
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          // VỊ TRÍ: fixed right-0 top-1/2 (Dính cạnh phải, giữa màn hình)
          // z-40: Để thấp hơn Chat AI (z-50) một chút nhưng cao hơn content
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 group flex items-center gap-2"
        >
          {/* Label: Chỉ hiện khi hover */}
          <span className="hidden md:block text-[10px] font-mono text-cyber-blue bg-black/80 px-2 py-1 rounded-l-sm border-l border-y border-cyber-blue opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            SCROLL_TOP
          </span>

          {/* NÚT CHÍNH */}
          <div className="relative bg-black/80 backdrop-blur-md border-l-2 border-y border-cyber-blue p-3 rounded-l-md shadow-[0_0_15px_rgba(0,240,255,0.2)] overflow-hidden">
            {/* Progress Bar Background (Mờ) */}
            <div
              className="absolute bottom-0 left-0 w-full bg-cyber-blue/20 transition-all duration-100 ease-out"
              style={{ height: `${scrollProgress}%` }}
            />

            <div className="relative z-10 flex flex-col items-center gap-1">
              <ChevronsUp
                size={20}
                className="text-cyber-blue group-hover:animate-bounce"
              />
              <span className="text-[8px] font-mono text-cyber-blue/70 writing-vertical-lr rotate-180 mt-1">
                {Math.round(scrollProgress)}%
              </span>
            </div>

            {/* Decorative Glow Line */}
            <div className="absolute top-0 left-0 w-0.5 h-full bg-cyber-blue shadow-[0_0_10px_#00f0ff]" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
