import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import OptimizedScene from "./components/OptimizedScene";
import { CyberButton, GlitchTitle } from "./components/UIComponents";
import InfoSection from "./components/InfoSection";
import ArsenalSection from "./components/ArsenalSection"; // <--- IMPORT MỚI

function App() {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 80]);

  const playHover = () => {};
  const playClick = () => {};

  return (
    <div className="relative min-h-screen w-full bg-cyber-black overflow-x-hidden font-sans">
      <OptimizedScene scrollY={scrollY} />

      <div className="relative z-10 flex flex-col">
        {/* Header */}
        <header className="w-full container mx-auto px-6 md:px-12 pt-6 md:pt-8 pb-4 flex justify-between items-center border-b border-white/10 backdrop-blur-sm z-50">
          <div className="text-xl md:text-2xl font-display tracking-widest text-cyber-yellow">
            ARASAKA<span className="text-white">_LABS</span>
          </div>
          <div className="font-mono text-[10px] md:text-xs text-cyber-blue border border-cyber-blue px-2 py-1 rounded-sm bg-cyber-black/50">
            SYS: NORMAL
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-6 md:px-12 min-h-[80vh] flex items-center pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            <motion.div
              style={{ y: yText }}
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
                Trải nghiệm không gian số thế hệ mới. Giao diện được tối ưu hóa
                cho độ phân giải cao, sử dụng công nghệ WebGL thuần khiết.
              </p>

              <div
                className="flex flex-wrap gap-4 pt-6"
                onMouseEnter={playHover}
              >
                <CyberButton variant="yellow" onClick={playClick}>
                  ENTER SYSTEM
                </CyberButton>
                <CyberButton variant="blue" onClick={playClick}>
                  VIEW DOCS
                </CyberButton>
              </div>
            </motion.div>

            <div className="hidden lg:block lg:col-span-5 h-full min-h-[300px]"></div>
          </div>
        </main>

        {/* Info Dashboard */}
        <InfoSection />

        {/* --- PHẦN MỚI: KHO VŨ KHÍ / CHỢ ĐEN --- */}
        <ArsenalSection />

        {/* Footer */}
        <footer className="bg-black border-t border-white/10 py-8 text-center font-mono text-xs text-gray-600">
          <p>© 2077 ARASAKA CORP. ALL RIGHTS RESERVED.</p>
        </footer>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-cyber-blue to-transparent opacity-50 z-50" />
    </div>
  );
}

export default App;
