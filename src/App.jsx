import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import {
  ChevronDown,
  Volume2,
  VolumeX,
  ShoppingBag,
  Trash2,
} from "lucide-react";

// --- LOCAL COMPONENTS ---
import OptimizedScene from "./components/OptimizedScene";
import { CyberButton, GlitchTitle } from "./components/UIComponents";
import InfoSection from "./components/InfoSection";
import ArsenalSection from "./components/ArsenalSection";
import AIChat from "./components/AIChat";
import BackToTop from "./components/BackToTop";

// =========================================
// CUSTOM HOOKS
// =========================================

/**
 * Cart Management Hook
 * Cập nhật thêm: trả về 'lastUpdate' để báo hiệu cho UI
 */
const useCart = () => {
  const [cart, setCart] = useState([]);
  // Biến này dùng để kích hoạt hiển thị Header khi có thay đổi
  const [lastUpdate, setLastUpdate] = useState(0);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
    setLastUpdate(Date.now()); // Cập nhật timestamp mỗi khi thêm
  };

  const removeFromCart = (indexToRemove) => {
    setCart((prev) => prev.filter((_, index) => index !== indexToRemove));
    setLastUpdate(Date.now()); // Cập nhật cả khi xóa (để user thấy số lượng giảm)
  };

  const total = useMemo(() => {
    return cart.reduce((acc, item) => {
      if (item.price === "???") return acc;
      const priceNumber = parseInt(item.price.replace(/,/g, ""), 10);
      return acc + (isNaN(priceNumber) ? 0 : priceNumber);
    }, 0);
  }, [cart]);

  return { cart, addToCart, removeFromCart, total, lastUpdate };
};

/**
 * Audio Management Hook
 */
const useAudio = (src) => {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [src]);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current
        .play()
        .catch((e) => console.warn("Audio autoplay blocked:", e));
      setIsMuted(false);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  return { isMuted, toggleAudio };
};

// =========================================
// COMPONENT: HEADER (SMART SCROLL)
// =========================================

const Header = ({
  cart,
  removeFromCart,
  total,
  isMuted,
  toggleAudio,
  lastUpdate, // Nhận prop mới
}) => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  // 1. Logic Scroll: Ẩn khi xuống, Hiện khi lên
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // 2. Logic Cart Update: Luôn hiện Header khi giỏ hàng thay đổi
  useEffect(() => {
    if (lastUpdate > 0) {
      setHidden(false);
    }
  }, [lastUpdate]);

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-full z-50 bg-linear-to-b from-black/90 to-transparent backdrop-blur-sm transition-all duration-300"
    >
      <div className="container mx-auto px-6 md:px-12 py-4 md:py-6 flex justify-between items-center">
        {/* BRANDING */}
        <div className="text-xl md:text-2xl font-display tracking-widest text-cyber-yellow cursor-pointer select-none drop-shadow-[0_0_10px_rgba(252,232,0,0.5)]">
          ARASAKA<span className="text-white">_LABS</span>
        </div>

        <div className="flex items-center gap-4">
          {/* CART SYSTEM */}
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

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-4 w-72 bg-black/95 border border-cyber-blue backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
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
                        className="flex justify-between items-center bg-white/5 p-2 border border-white/5 hover:border-cyber-blue/50 transition-colors"
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
                          />
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
                        €$ {total.toLocaleString()}
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

          {/* AUDIO CONTROLS */}
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1 px-3 py-1 border rounded-sm transition-all duration-300 bg-black/50 backdrop-blur-md ${
              !isMuted
                ? "border-cyber-pink text-cyber-pink shadow-[0_0_10px_rgba(255,0,60,0.3)]"
                : "border-gray-600 text-gray-500 hover:border-white hover:text-white"
            }`}
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
                <span className="font-mono text-[10px] font-bold hidden sm:inline">
                  BGM: ON
                </span>
              </>
            ) : (
              <>
                <VolumeX size={14} />
                <span className="font-mono text-[10px] hidden sm:inline">
                  BGM: OFF
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.header>
  );
};

// =========================================
// MAIN APP COMPONENT
// =========================================

function App() {
  const { scrollY } = useScroll();
  // Lấy thêm lastUpdate từ hook
  const { cart, addToCart, removeFromCart, total, lastUpdate } = useCart();
  const { isMuted, toggleAudio } = useAudio("/sounds/bgm.mp3");

  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);

  const handleScrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen w-full bg-cyber-black overflow-x-hidden font-sans">
      <OptimizedScene scrollY={scrollY} />

      <div className="relative z-10 flex flex-col">
        <section className="h-screen flex flex-col relative">
          {/* Truyền lastUpdate vào Header */}
          <Header
            cart={cart}
            removeFromCart={removeFromCart}
            total={total}
            isMuted={isMuted}
            toggleAudio={toggleAudio}
            lastUpdate={lastUpdate}
          />

          <main className="flex-1 flex items-center container mx-auto px-6 md:px-12 pt-20">
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
                  Truy cập kho dữ liệu nguyên mẫu cấp S. Cung cấp vũ khí thực
                  nghiệm và Cyberware thế hệ mới. Chỉ dành cho nhân sự được ủy
                  quyền hoặc lính đánh thuê cao cấp.
                </p>

                <div className="flex flex-wrap gap-4 pt-6">
                  <CyberButton
                    variant="yellow"
                    onClick={() => handleScrollTo("black-market")}
                  >
                    ENTER MARKET
                  </CyberButton>
                  <CyberButton
                    variant="blue"
                    onClick={() => handleScrollTo("system-status")}
                  >
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
            onClick={() => handleScrollTo("system-status")}
          >
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-70">
              Scroll Down
            </span>
            <ChevronDown size={24} />
          </motion.div>
        </section>

        <InfoSection />
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
