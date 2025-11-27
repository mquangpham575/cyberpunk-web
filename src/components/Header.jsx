// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
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

const Header = ({
  cart,
  removeFromCart,
  total,
  isMuted,
  toggleAudio,
  user,
  onLogout,
}) => {
  const navigate = useNavigate();
  // const location = useLocation(); // Not needed for hiding anymore

  const iconBtnStyle =
    "p-2 text-gray-400 hover:text-cyber-blue transition-colors relative group hover:bg-white/5 rounded-sm";

  return (
    <motion.header
      // Always visible (Pinned)
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 w-full z-50 bg-linear-to-b from-black/90 to-transparent backdrop-blur-sm transition-all duration-300"
    >
      <style>{`
        @keyframes music-bar { 0%, 100% { height: 20%; } 50% { height: 100%; } }
      `}</style>

      <div className="container mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        {/* LEFT GROUP */}
        <div className="flex items-center gap-1 md:gap-4 bg-black/40 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
          {/* BGM Button */}
          <button
            onClick={toggleAudio}
            className="flex items-end justify-center gap-[3px] w-8 h-6 px-1 pb-1 cursor-pointer hover:opacity-80 transition-opacity mr-4 border-r border-white/10 pr-4 overflow-hidden"
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

          {/* Navigation Buttons */}
          <button
            onClick={() => navigate("/")}
            className={iconBtnStyle}
            title="Home"
          >
            <Home size={20} />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-cyber-blue group-hover:w-full transition-all duration-300"></span>
          </button>

          <button
            onClick={() => navigate("/market")}
            className={iconBtnStyle}
            title="Black Market"
          >
            <Store size={20} />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-cyber-blue group-hover:w-full transition-all duration-300"></span>
          </button>

          {/* Cart Dropdown */}
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
            {/* Dropdown Content */}
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
                      onClick={() => navigate("/checkout")}
                      className="w-full bg-cyber-blue text-black font-bold font-mono text-xs py-2 hover:bg-white transition-colors uppercase"
                    >
                      CHECKOUT
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/missions")}
            className={iconBtnStyle}
            title="Missions"
          >
            <Crosshair size={20} />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-cyber-blue group-hover:w-full transition-all duration-300"></span>
          </button>
        </div>

        {/* RIGHT GROUP */}
        <div>
          {user ? (
            <div className="flex items-center gap-4 group relative">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-white font-mono text-xs font-bold uppercase tracking-widest text-shadow-glow">
                  {user.displayName || user.email?.split("@")[0] || "OPERATOR"}
                </span>
                <span className="text-[10px] text-green-500 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  [CONNECTED]
                </span>
              </div>
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
              <button
                onClick={onLogout}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-x-14 transition-all duration-300 text-red-500 bg-black/80 p-2 rounded-full border border-red-500/30 hover:bg-red-500/10"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="w-10 h-10 rounded-full border border-cyber-blue/50 flex items-center justify-center text-cyber-blue hover:bg-cyber-blue hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
            >
              <LogIn size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
