import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react"; // Thêm icon mũi tên
import OptimizedScene from "./components/OptimizedScene";
import { CyberButton, GlitchTitle } from "./components/UIComponents";
import InfoSection from "./components/InfoSection";
import ArsenalSection from "./components/ArsenalSection";
import AIChat from "./components/AIChat";

function App() {
  const { scrollY } = useScroll();
  // Parallax cho chữ: Trôi nhẹ khi cuộn
  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]); // Mờ dần khi cuộn đi

  const playClick = () => {};
  const playHover = () => {};

  const handleEnterSystem = () => {
    playClick();
    document
      .getElementById("black-market")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleViewStatus = () => {
    playClick();
    document
      .getElementById("system-status")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen w-full bg-cyber-black overflow-x-hidden font-sans">
      {/* 3D Background (Fixed) */}
      <OptimizedScene scrollY={scrollY} />

      <div className="relative z-10 flex flex-col">
        {/* --- TRANG 1: HERO SECTION (FULL SCREEN) --- */}
        <section className="h-screen flex flex-col relative">
          {/* 1. Header */}
          <header className="w-full container mx-auto px-6 md:px-12 pt-6 md:pt-8 flex justify-between items-center z-50">
            <div className="text-xl md:text-2xl font-display tracking-widest text-cyber-yellow">
              ARASAKA<span className="text-white">_LABS</span>
            </div>
            <div className="font-mono text-[10px] md:text-xs text-cyber-blue border border-cyber-blue px-2 py-1 rounded-sm bg-black/50 backdrop-blur-md">
              SYS: NORMAL
            </div>
          </header>

          {/* 2. Main Content (Căn giữa hoàn hảo) */}
          <main className="flex-1 flex items-center container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
              {/* Text Content */}
              <motion.div
                style={{ y: yText, opacity: opacityText }}
                className="lg:col-span-7 space-y-6 pl-2 md:pl-4"
              >
                <div className="flex items-center gap-2 text-cyber-pink font-mono text-xs md:text-sm tracking-widest mb-2">
                  <span className="w-1.5 h-1.5 bg-cyber-pink rounded-full animate-pulse" />
                  SECURE CONNECTION
                </div>

                <div>
                  <GlitchTitle text="DIGITAL" />
                  <GlitchTitle text="HORIZON" />
                </div>

                <p className="text-gray-400 text-base md:text-lg max-w-lg font-sans border-l-2 border-cyber-blue pl-4 leading-relaxed backdrop-blur-sm bg-black/20 p-2 rounded-r-lg">
                  Trải nghiệm không gian số thế hệ mới. Giao diện được tối ưu
                  hóa cho độ phân giải cao, sử dụng công nghệ WebGL thuần khiết.
                </p>

                <div
                  className="flex flex-wrap gap-4 pt-6"
                  onMouseEnter={playHover}
                >
                  <CyberButton variant="yellow" onClick={handleEnterSystem}>
                    ENTER MARKET
                  </CyberButton>
                  <CyberButton variant="blue" onClick={handleViewStatus}>
                    VIEW STATUS
                  </CyberButton>
                </div>
              </motion.div>

              {/* Khoảng trống cho 3D Model bên phải */}
              <div className="hidden lg:block lg:col-span-5 h-full min-h-[300px]"></div>
            </div>
          </main>

          {/* 3. Scroll Down Indicator (Mũi tên chỉ xuống) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 1, duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cyber-blue flex flex-col items-center gap-2 cursor-pointer"
            onClick={handleViewStatus}
          >
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-70">
              Scroll Down
            </span>
            <ChevronDown size={24} />
          </motion.div>
        </section>

        {/* --- TRANG 2: INFO SECTION (FULL SCREEN) --- */}
        <InfoSection />

        {/* --- TRANG 3: ARSENAL SECTION --- */}
        <ArsenalSection />

        {/* Footer */}
        <footer className="bg-black border-t border-white/10 py-8 text-center font-mono text-xs text-gray-600">
          <p>© 2077 ARASAKA CORP. ALL RIGHTS RESERVED.</p>
        </footer>
      </div>

      {/* Bottom Line Decoration (Fixed) */}
      <div className="fixed bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-cyber-blue to-transparent opacity-50 z-50" />

      <AIChat />
    </div>
  );
}

export default App;
