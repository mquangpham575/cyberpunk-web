import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ChevronDown,
  Volume2,
  VolumeX,
  ShoppingBag,
  Trash2,
} from "lucide-react"; // Thêm icon ShoppingBag, Trash2
import OptimizedScene from "./components/OptimizedScene";
import { CyberButton, GlitchTitle } from "./components/UIComponents";
import InfoSection from "./components/InfoSection";
import ArsenalSection from "./components/ArsenalSection";
import AIChat from "./components/AIChat";
import BackToTop from "./components/BackToTop";

function App() {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);

  // --- LOGIC GIỎ HÀNG ---
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    // Thêm item vào giỏ hàng
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (indexToRemove) => {
    setCart((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      // Xử lý giá tiền: loại bỏ dấu phẩy, xử lý "???"
      if (item.price === "???") return total;
      const priceNumber = parseInt(item.price.replace(/,/g, ""), 10);
      return total + (isNaN(priceNumber) ? 0 : priceNumber);
    }, 0);
  };

  // --- LOGIC AUDIO (Giữ nguyên) ---
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/bgm.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    // Autoplay policy có thể chặn, cần user interaction
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current
          .play()
          .catch((e) => console.log("Audio play failed:", e));
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

  const playClick = () => {};
  const playHover = () => {};

  const handleEnterMarket = () => {
    // Đổi tên hàm
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
          {/* HEADER */}
          <header className="w-full container mx-auto px-6 md:px-12 pt-6 md:pt-8 flex justify-between items-center z-50">
            <div className="text-xl md:text-2xl font-display tracking-widest text-cyber-yellow">
              ARASAKA<span className="text-white">_LABS</span>
            </div>

            <div className="flex items-center gap-4">
              {/* --- SHOPPING LIST ICON HOVER --- */}
              <div className="group relative">
                <div className="hidden md:flex items-center gap-2 cursor-pointer border border-cyber-blue px-2 py-1 rounded-sm bg-black/50 backdrop-blur-md hover:bg-cyber-blue/10 transition-colors">
                  <span className="font-mono text-[10px] md:text-xs text-cyber-blue">
                    SYS: NORMAL
                  </span>
                  <div className="w-px h-3 bg-cyber-blue/50"></div>
                  <ShoppingBag size={14} className="text-cyber-blue" />
                  {cart.length > 0 && (
                    <span className="text-[10px] font-bold text-black bg-cyber-blue px-1 -ml-1">
                      {cart.length}
                    </span>
                  )}
                </div>

                {/* --- DROPDOWN CART --- */}
                <div className="absolute right-0 top-full mt-2 w-72 bg-black/90 border border-cyber-blue backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                  {/* Decorative corners */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white"></div>

                  <div className="p-4">
                    <h3 className="text-cyber-blue font-mono text-xs font-bold border-b border-white/10 pb-2 mb-2 flex justify-between">
                      <span>// SHOPPING_LIST</span>
                      <span>[{cart.length}]</span>
                    </h3>

                    {cart.length === 0 ? (
                      <div className="text-gray-500 font-mono text-xs py-4 text-center italic">
                        Empty...
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto space-y-2 mb-3 custom-scrollbar">
                        {cart.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-white/5 p-2 border border-white/5 hover:border-cyber-blue/50 transition-colors group/item"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <div
                                className={`w-1 h-8 ${
                                  item.rarity === "legendary"
                                    ? "bg-cyber-yellow"
                                    : item.rarity === "epic"
                                    ? "bg-cyber-pink"
                                    : "bg-cyber-blue"
                                }`}
                              ></div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-white font-mono text-[10px] truncate w-32">
                                  {item.name}
                                </span>
                                <span className="text-gray-400 font-mono text-[9px]">
                                  €$ {item.price}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(index)}
                              className="text-gray-600 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {cart.length > 0 && (
                      <div className="border-t border-white/10 pt-2">
                        <div className="flex justify-between items-center font-mono text-xs text-white mb-3">
                          <span>TOTAL:</span>
                          <span className="text-cyber-yellow">
                            €$ {calculateTotal().toLocaleString()}
                          </span>
                        </div>
                        <button className="w-full bg-cyber-blue text-black font-bold font-mono text-xs py-2 hover:bg-white transition-colors uppercase tracking-widest">
                          CHECKOUT
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* --- END SHOPPING LIST --- */}

              <button
                onClick={toggleAudio}
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
                    <div className="flex items-center gap-1">
                      <Volume2 size={14} />
                      <div className="flex gap-0.5 items-end h-3">
                        <span className="w-0.5 bg-cyber-pink animate-[bounce_0.5s_infinite]" />
                        <span className="w-0.5 bg-cyber-pink animate-[bounce_0.7s_infinite]" />
                        <span className="w-0.5 bg-cyber-pink animate-[bounce_0.6s_infinite]" />
                      </div>
                    </div>
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
                  {/* UPDATE: Đổi tên thành ENTER MARKET */}
                  <CyberButton variant="yellow" onClick={handleEnterMarket}>
                    ENTER MARKET
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

        {/* Truyền addToCart vào ArsenalSection */}
        <ArsenalSection addToCart={addToCart} />

        <footer className="bg-black border-t border-white/10 py-8 text-center font-mono text-xs text-gray-600">
          <p>© 2077 ARASAKA CORP. ALL RIGHTS RESERVED.</p>
        </footer>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-cyber-blue to-transparent opacity-50 z-50" />
      <AIChat />
      <BackToTop />
    </div>
  );
}

export default App;
