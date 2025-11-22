import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Volume2, VolumeX } from "lucide-react";
import OptimizedScene from "./components/OptimizedScene";
import { CyberButton, GlitchTitle } from "./components/UIComponents";
import InfoSection from "./components/InfoSection";
import ArsenalSection from "./components/ArsenalSection";
import AIChat from "./components/AIChat";

function App() {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);

  // --- LOGIC AUDIO ---
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/bgm.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.then(() => setIsMuted(false)).catch(() => setIsMuted(true));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play();
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

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
      <OptimizedScene scrollY={scrollY} />

      <div className="relative z-10 flex flex-col">
        <section className="h-screen flex flex-col relative">
          <header className="w-full container mx-auto px-6 md:px-12 pt-6 md:pt-8 flex justify-between items-center z-50">
            <div className="text-xl md:text-2xl font-display tracking-widest text-cyber-yellow">
              ARASAKA<span className="text-white">_LABS</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block font-mono text-[10px] md:text-xs text-cyber-blue border border-cyber-blue px-2 py-1 rounded-sm bg-black/50 backdrop-blur-md">
                SYS: NORMAL
              </div>

              {/* NÚT BẬT/TẮT NHẠC */}
              <button
                onClick={toggleAudio}
                // SỬA: Đổi gap-1.5 thành gap-1 để các phần tử sát rạt vào nhau
                className={`
                    flex items-center gap-1 px-3 py-1 border rounded-sm transition-all duration-300 group
                    ${
                      !isMuted
                        ? "border-cyber-pink text-cyber-pink bg-cyber-pink/10 shadow-[0_0_10px_rgba(255,0,60,0.3)]"
                        : "border-gray-600 text-gray-500 hover:border-white hover:text-white"
                    }
                  `}
              >
                {!isMuted ? (
                  <>
                    {/* Khối Icon + Sóng nhạc */}
                    <div className="flex items-center gap-1">
                      <Volume2 size={14} />
                      <div className="flex gap-0.5 items-end h-3">
                        <span className="w-0.5 bg-cyber-pink animate-[bounce_0.5s_infinite]" />
                        <span className="w-0.5 bg-cyber-pink animate-[bounce_0.7s_infinite]" />
                        <span className="w-0.5 bg-cyber-pink animate-[bounce_0.6s_infinite]" />
                      </div>
                    </div>

                    {/* Chữ BGM: ON - Nằm ngay sát khối icon */}
                    <span className="font-mono text-[10px] font-bold">
                      BGM: ON
                    </span>
                  </>
                ) : (
                  <>
                    <VolumeX size={14} />
                    <span className="font-mono text-[10px]">BGM: OFF</span>
                  </>
                )}
              </button>
            </div>
          </header>

          <main className="flex-1 flex items-center container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
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
                    ENTER SYSTEM
                  </CyberButton>
                  <CyberButton variant="blue" onClick={handleViewStatus}>
                    VIEW STATUS
                  </CyberButton>
                </div>
              </motion.div>

              <div className="hidden lg:block lg:col-span-5 h-full min-h-[300px]"></div>
            </div>
          </main>

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

        <InfoSection />
        <ArsenalSection />

        <footer className="bg-black border-t border-white/10 py-8 text-center font-mono text-xs text-gray-600">
          <p>© 2077 ARASAKA CORP. ALL RIGHTS RESERVED.</p>
        </footer>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-cyber-blue to-transparent opacity-50 z-50" />
      <AIChat />
    </div>
  );
}

export default App;
