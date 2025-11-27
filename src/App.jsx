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
  ShoppingBag,
  Trash2,
  User,
  LogOut,
  Crosshair,
  Home,
  Store,
  LogIn,
} from "lucide-react";

// Firebase Services
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./services/firebase.js";

// Component Imports
import Scene3D from "./components/Scene3D.jsx";
import AIChat from "./components/AIChat";
import BackToTop from "./components/BackToTop";

// Page Imports
import HomePage from "./pages/HomePage";
import MissionPage from "./pages/MissionPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import ArsenalPage from "./pages/ArsenalPage";

// Data Import
import { INVENTORY_DATA } from "./data/inventoryData";

/* =========================================
   CUSTOM HOOKS
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
   HEADER COMPONENT
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
  onOpenMissions,
  onOpenCheckout,
  onGoHome,
  onOpenMarket,
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

  const iconBtnStyle =
    "p-2 text-gray-400 hover:text-cyber-blue transition-colors relative group hover:bg-white/5 rounded-sm";

  return (
    <motion.header
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-full z-50 bg-linear-to-b from-black/90 to-transparent backdrop-blur-sm transition-all duration-300"
    >
      {/* Inject Keyframes for Music Bar Animation */}
      <style>{`
        @keyframes music-bar {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
      `}</style>

      <div className="container mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        {/* --- LEFT GROUP --- */}
        <div className="flex items-center gap-1 md:gap-4 bg-black/40 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
          {/* 1. BGM Visualizer Button */}
          <button
            onClick={toggleAudio}
            className="flex items-end justify-center gap-[3px] w-8 h-6 px-1 pb-1 cursor-pointer hover:opacity-80 transition-opacity mr-4 border-r border-white/10 pr-4 overflow-hidden"
            title={isMuted ? "Play Music" : "Mute Music"}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[3px] bg-cyber-pink rounded-t-sm"
                style={{
                  height: !isMuted ? "100%" : "20%",
                  animation: !isMuted
                    ? `music-bar ${
                        0.4 + i * 0.15
                      }s ease-in-out infinite alternate`
                    : "none",
                }}
              />
            ))}
          </button>

          {/* 2. Home */}
          <button onClick={onGoHome} className={iconBtnStyle} title="Home">
            <Home size={20} />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-cyber-blue group-hover:w-full transition-all duration-300"></span>
          </button>

          {/* 3. Market */}
          <button
            onClick={onOpenMarket}
            className={iconBtnStyle}
            title="Black Market"
          >
            <Store size={20} />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-cyber-blue group-hover:w-full transition-all duration-300"></span>
          </button>

          {/* 4. Cart */}
          <div className="group/cart relative">
            <div className={`${iconBtnStyle} cursor-pointer`}>
              <div className="relative">
                <ShoppingBag size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-cyber-blue text-black text-[9px] font-bold flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </div>
            </div>
            {/* Cart Dropdown */}
            <div className="absolute left-0 top-full mt-4 w-72 bg-black/95 border border-cyber-blue backdrop-blur-xl opacity-0 invisible group-hover/cart:opacity-100 group-hover/cart:visible transition-all duration-300 transform translate-y-2 group-hover/cart:translate-y-0 z-50 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <div className="absolute -top-4 left-0 w-full h-4 bg-transparent"></div>
              <div className="p-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
                  <span className="text-cyber-blue font-mono text-xs">
                    CART
                  </span>
                  <span className="text-white font-mono text-xs">
                    Total: €$ {total.toLocaleString()}
                  </span>
                </div>
                {cart.length === 0 ? (
                  <div className="text-gray-500 font-mono text-xs py-4 text-center italic">
                    [EMPTY]
                  </div>
                ) : (
                  <>
                    <div className="max-h-60 overflow-y-auto space-y-2 mb-3 custom-scrollbar">
                      {cart.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-white/5 p-2"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div
                              className={`w-1 h-6 ${
                                item.rarity === "legendary"
                                  ? "bg-cyber-yellow"
                                  : "bg-cyber-blue"
                              }`}
                            />
                            <span className="text-white font-mono text-[10px] truncate w-24">
                              {item.name}
                            </span>
                          </div>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-gray-600 hover:text-red-500"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={onOpenCheckout}
                      className="w-full bg-cyber-blue text-black font-bold font-mono text-xs py-2 hover:bg-white transition-colors uppercase"
                    >
                      CHECKOUT
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 5. Mission */}
          <button
            onClick={onOpenMissions}
            className={iconBtnStyle}
            title="Missions"
          >
            <Crosshair size={20} />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-cyber-blue group-hover:w-full transition-all duration-300"></span>
          </button>
        </div>

        {/* --- RIGHT GROUP: USER --- */}
        <div>
          {user ? (
            <div className="flex items-center gap-4 group relative">
              {/* User Name & Status */}
              <div className="hidden md:flex flex-col items-end">
                <span className="text-white font-mono text-xs font-bold uppercase tracking-widest text-shadow-glow">
                  {user.displayName ||
                    user.email?.split("@")[0] ||
                    "OPERATOR_ID"}
                </span>
                <span className="text-[10px] text-green-500 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  [CONNECTED]
                </span>
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full border border-green-500/50 bg-green-500/10 flex items-center justify-center cursor-pointer hover:bg-green-500/20 transition-colors relative z-10">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User"
                    className="w-full h-full rounded-full object-cover p-0.5"
                  />
                ) : (
                  <User size={18} className="text-green-500" />
                )}
              </div>

              {/* Logout Button (Hidden behind avatar, shows on hover) */}
              <button
                onClick={onLogout}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-x-14 transition-all duration-300 text-red-500 bg-black/80 p-2 rounded-full border border-red-500/30 hover:bg-red-500/10 hover:border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.2)]"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-10 h-10 rounded-full border border-cyber-blue/50 flex items-center justify-center text-cyber-blue hover:bg-cyber-blue hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
              title="Login"
            >
              <LogIn size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

/* =========================================
   ROUTER HELPERS
   ========================================= */

const AnimatedRoutes = ({
  cart,
  total,
  addToCart,
  removeFromCart,
  clearCart,
  user,
  setUser,
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
        <Route path="/market" element={<ArsenalPage addToCart={addToCart} />} />
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
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
      </Routes>
    </AnimatePresence>
  );
};

// Wrapper cho Header
const HeaderWithRouter = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  if (location.pathname === "/checkout" || location.pathname === "/login")
    return null;

  return (
    <Header
      {...props}
      onGoHome={() => navigate("/")}
      onOpenMarket={() => navigate("/market")}
      onOpenCheckout={() => navigate("/checkout")}
      onOpenMissions={() => navigate("/missions")}
      onOpenAuth={() => navigate("/login")}
    />
  );
};

// Wrapper cho Footer
const FooterWithRouter = () => {
  const location = useLocation();
  if (location.pathname === "/checkout" || location.pathname === "/login")
    return null;

  return (
    <footer className="bg-black border-t border-white/10 py-8 text-center font-mono text-xs text-gray-600 relative z-50">
      <p>© 2077 ARASAKA CORP. ALL RIGHTS RESERVED.</p>
    </footer>
  );
};

/* =========================================
   MAIN APP COMPONENT
   ========================================= */

function App() {
  const { scrollY } = useScroll();
  const { isMuted, toggleAudio } = useAudio("/sounds/bgm.mp3");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const { cart, addToCart, removeFromCart, clearCart, total, lastUpdate } =
    useCart(user);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <Router>
      <div className="relative min-h-screen w-full bg-cyber-black overflow-x-hidden font-sans flex flex-col">
        {/* Background 3D */}
        <Scene3D scrollY={scrollY} />

        {/* Header */}
        <HeaderWithRouter
          cart={cart}
          removeFromCart={removeFromCart}
          total={total}
          isMuted={isMuted}
          toggleAudio={toggleAudio}
          lastUpdate={lastUpdate}
          user={user}
          onLogout={handleLogout}
        />

        {/* Nội dung chính (đẩy Footer xuống) */}
        <main className="flex-1 relative z-10">
          <AnimatedRoutes
            cart={cart}
            total={total}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            user={user}
            setUser={setUser}
            scrollY={scrollY}
            yText={yText}
            opacityText={opacityText}
          />
        </main>

        {/* Global Widgets & Footer */}
        <AIChat />
        <BackToTop />
        <FooterWithRouter />
      </div>
    </Router>
  );
}

export default App;
