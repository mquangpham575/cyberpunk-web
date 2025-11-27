// src/App.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
  useTransform,
} from "framer-motion";
import {
  Volume2,
  VolumeX,
  ShoppingBag,
  Trash2,
  User,
  LogOut,
  Crosshair,
} from "lucide-react";

// Firebase Services
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./services/firebase.js";

// Component Imports
import Scene3D from "./components/Scene3D.jsx";
import AuthModal from "./components/AuthModal";
import AIChat from "./components/AIChat";
import BackToTop from "./components/BackToTop";

// Page Imports (Bạn cần đảm bảo đã tạo các file này)
import HomePage from "./pages/HomePage";
import MissionPage from "./pages/MissionPage";
import CheckoutPage from "./pages/CheckoutPage";

// Data Import
import { INVENTORY_DATA } from "./data/inventoryData";

/* =========================================
   CUSTOM HOOKS (Giữ nguyên)
   ========================================= */

const useCart = (user) => {
  const [cart, setCart] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(0);

  const rehydrateCart = (rawItems) => {
    return rawItems.map((item) => {
      const original = INVENTORY_DATA.find((i) => i.id === item.id);
      return { ...item, icon: original ? original.icon : null };
    });
  };

  useEffect(() => {
    if (user) {
      const cartRef = doc(db, "carts", user.uid);
      const unsubscribe = onSnapshot(cartRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const cloudItems = docSnapshot.data().items || [];
          setCart(rehydrateCart(cloudItems));
        } else {
          const localCart = localStorage.getItem("arasaka_cart_v1");
          if (!localCart) setCart([]);
        }
      });
      return () => unsubscribe();
    } else {
      try {
        const savedCart = localStorage.getItem("arasaka_cart_v1");
        if (savedCart) setCart(rehydrateCart(JSON.parse(savedCart)));
        else setCart([]);
      } catch (error) {
        setCart([]);
      }
    }
  }, [user]);

  const saveCart = async (newCart) => {
    setCart(newCart);
    setLastUpdate(Date.now());
    const sanitizedCart = newCart.map(({ icon, ...rest }) => rest);

    if (user) {
      try {
        await setDoc(doc(db, "carts", user.uid), { items: sanitizedCart });
      } catch (error) {
        console.error("Firestore Save Error:", error);
      }
    } else {
      localStorage.setItem("arasaka_cart_v1", JSON.stringify(sanitizedCart));
    }
  };

  const addToCart = (item) => {
    saveCart([...cart, item]);
  };

  const removeFromCart = (indexToRemove) => {
    saveCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const clearCart = () => {
    saveCart([]);
  };

  const total = useMemo(() => {
    return cart.reduce((acc, item) => {
      if (item.price === "???") return acc;
      const price = parseInt(item.price.replace(/,/g, ""), 10);
      return acc + (isNaN(price) ? 0 : price);
    }, 0);
  }, [cart]);

  return { cart, addToCart, removeFromCart, clearCart, total, lastUpdate };
};

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
      audioRef.current.play().catch((e) => console.warn("Audio blocked:", e));
      setIsMuted(false);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  return { isMuted, toggleAudio };
};

/* =========================================
   HEADER COMPONENT (Updated for Router)
   ========================================= */

const Header = ({
  cart,
  removeFromCart,
  total,
  isMuted,
  toggleAudio,
  lastUpdate,
  user,
  onOpenAuth,
  onLogout,
  // Props điều hướng mới
  onOpenMissions,
  onOpenCheckout,
  onGoHome,
}) => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    setHidden(latest > previous && latest > 150);
  });

  useEffect(() => {
    if (lastUpdate > 0) setHidden(false);
  }, [lastUpdate]);

  return (
    <motion.header
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-full z-50 bg-linear-to-b from-black/90 to-transparent backdrop-blur-sm transition-all duration-300"
    >
      <div className="container mx-auto px-6 md:px-12 py-4 md:py-6 flex justify-between items-center">
        {/* Brand Logo */}
        <div
          onClick={onGoHome}
          className="text-xl md:text-2xl font-display tracking-widest text-cyber-yellow cursor-pointer select-none drop-shadow-[0_0_10px_rgba(252,232,0,0.5)]"
        >
          ARASAKA<span className="text-white">_LABS</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Missions Button */}
          <button
            onClick={onOpenMissions}
            className="hidden md:flex items-center gap-2 text-cyber-yellow hover:text-white transition-colors font-mono text-xs tracking-widest border border-cyber-yellow/30 px-3 py-1 bg-cyber-yellow/5 hover:bg-cyber-yellow/20"
          >
            <Crosshair size={14} />
            CONTRACTS
          </button>

          {/* User Status / Login */}
          {user ? (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 border border-green-500/50 bg-green-500/10 backdrop-blur-md transition-colors">
              <User size={12} className="text-green-500" />
              <span className="text-[10px] font-mono text-green-400 uppercase tracking-wider">
                {user.displayName || "OPERATOR"}
              </span>
              <div className="w-px h-3 bg-green-500/30 mx-1"></div>
              <button
                onClick={onLogout}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Disconnect"
              >
                <LogOut size={12} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="hidden md:block px-4 py-1 border border-cyber-blue text-cyber-blue font-mono text-[10px] hover:bg-cyber-blue hover:text-black transition-colors uppercase tracking-widest"
            >
              Đăng nhập / Đăng kí
            </button>
          )}

          {/* Cart Dropdown System */}
          <div className="group relative">
            <div className="hidden md:flex items-center gap-2 cursor-pointer border border-cyber-blue px-3 py-1 rounded-sm bg-black/50 backdrop-blur-md hover:bg-cyber-blue/10 transition-colors">
              <ShoppingBag size={14} className="text-cyber-blue" />
              {cart.length > 0 && (
                <span className="text-[10px] font-bold text-black bg-cyber-blue px-1 ml-1">
                  {cart.length}
                </span>
              )}
            </div>

            {/* Dropdown Content */}
            <div className="absolute right-0 top-full mt-4 w-72 bg-black/95 border border-cyber-blue backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <div className="absolute -top-4 left-0 w-full h-4 bg-transparent"></div>
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white"></div>

              <div className="p-4">
                <h3 className="text-cyber-blue font-mono text-xs font-bold border-b border-white/10 pb-2 mb-2 flex justify-between">
                  <span> Giỏ hàng </span>
                  <span>[{cart.length}]</span>
                </h3>

                {cart.length === 0 ? (
                  <div className="text-gray-500 font-mono text-xs py-4 text-center italic">
                    Giỏ hàng trống...
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
                      <span>Tổng tiền:</span>
                      <span className="text-cyber-yellow">
                        €$ {total.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={onOpenCheckout}
                      className="w-full bg-cyber-blue text-black font-bold font-mono text-xs py-2 hover:bg-white transition-colors uppercase tracking-widest"
                    >
                      THANH TOÁN
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Audio Toggle */}
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
                <div className="flex gap-0.5 items-end h-3">
                  <span
                    className="w-0.5 h-1.5 bg-cyber-pink animate-bounce"
                    style={{ animationDuration: "0.4s" }}
                  />
                  <span
                    className="w-0.5 h-3 bg-cyber-pink animate-bounce"
                    style={{ animationDuration: "0.6s" }}
                  />
                  <span
                    className="w-0.5 h-2 bg-cyber-pink animate-bounce"
                    style={{ animationDuration: "0.5s" }}
                  />
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

/* =========================================
   ROUTER & ANIMATION WRAPPER
   ========================================= */

// Component này xử lý việc định tuyến và animation
// Nó nhận tất cả props từ App để truyền xuống các Page
const AnimatedRoutes = ({
  cart,
  total,
  addToCart,
  removeFromCart,
  clearCart,
  user,
  scrollY,
  yText,
  opacityText,
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <HomePage
              scrollY={scrollY}
              yText={yText}
              opacityText={opacityText}
              addToCart={addToCart}
            />
          }
        />
        <Route path="/missions" element={<MissionPage />} />
        <Route
          path="/checkout"
          element={
            <CheckoutPage
              cart={cart}
              total={total}
              onClearCart={clearCart}
              user={user}
            />
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

// Wrapper để Header dùng được hooks của Router (useNavigate)
const HeaderWithRouter = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Ẩn Header nếu đang ở trang checkout
  if (location.pathname === "/checkout") return null;

  return (
    <Header
      {...props}
      onOpenCheckout={() => navigate("/checkout")}
      onOpenMissions={() => navigate("/missions")}
      onGoHome={() => navigate("/")}
    />
  );
};

/* =========================================
   MAIN APP COMPONENT
   ========================================= */

function App() {
  // Global hooks
  const { scrollY } = useScroll();
  const { isMuted, toggleAudio } = useAudio("/sounds/bgm.mp3");

  // Auth State
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) setShowAuthModal(false);
    });
    return () => unsubscribe();
  }, []);

  // Cart State
  const { cart, addToCart, removeFromCart, clearCart, total, lastUpdate } =
    useCart(user);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Parallax Values for Home Page
  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <Router>
      <div className="relative min-h-screen w-full bg-cyber-black overflow-x-hidden font-sans">
        {/* Background 3D cố định - không reload khi đổi trang */}
        <Scene3D scrollY={scrollY} />

        {/* Global Modal */}
        <AnimatePresence>
          {showAuthModal && (
            <AuthModal onClose={() => setShowAuthModal(false)} />
          )}
        </AnimatePresence>

        {/* Header (Điều hướng) */}
        <HeaderWithRouter
          cart={cart}
          removeFromCart={removeFromCart}
          total={total}
          isMuted={isMuted}
          toggleAudio={toggleAudio}
          lastUpdate={lastUpdate}
          user={user}
          onOpenAuth={() => setShowAuthModal(true)}
          onLogout={handleLogout}
        />

        {/* Khu vực nội dung thay đổi (Pages) */}
        <AnimatedRoutes
          cart={cart}
          total={total}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          user={user}
          scrollY={scrollY}
          yText={yText}
          opacityText={opacityText}
        />

        {/* Global Widgets */}
        <AIChat />
        <BackToTop />
      </div>
    </Router>
  );
}

export default App;
