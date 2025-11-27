import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle,
  CreditCard,
  MapPin,
  User,
  ShieldCheck,
  ArrowLeft,
  Truck,
} from "lucide-react";

const CheckoutPage = ({ cart, total, onBack, onClearCart, user }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Giả lập quá trình thanh toán (3 giây)
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onClearCart(); // Xóa giỏ hàng sau khi thành công
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-100 bg-black text-white overflow-y-auto"
    >
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[32px_32px]"></div>

      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* HEADER CỦA TRANG CHECKOUT */}
        <header className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-cyber-blue transition-colors group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-mono text-sm uppercase tracking-widest">
              Back to Market
            </span>
          </button>
          <div className="text-2xl font-display tracking-widest text-white">
            SECURE<span className="text-cyber-blue">_GATEWAY</span>
          </div>
          <div className="flex items-center gap-2 text-green-500 font-mono text-xs">
            <ShieldCheck size={16} />
            ENCRYPTED
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG & THANH TOÁN */}
          <div className="lg:col-span-7 space-y-8">
            {!isSuccess ? (
              <form onSubmit={handlePayment} className="space-y-8">
                {/* Section: Delivery */}
                <div className="bg-white/5 border border-white/10 p-6 relative overflow-hidden group hover:border-cyber-blue/50 transition-colors">
                  <h3 className="text-xl font-display text-cyber-yellow mb-6 flex items-center gap-2">
                    <MapPin className="text-cyber-yellow" /> SHIPPING_NODE
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-400 uppercase">
                        Receiver Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="V. MERCENARY"
                        defaultValue={user ? user.displayName : ""}
                        className="w-full bg-black border border-white/20 p-3 text-white focus:border-cyber-blue outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-400 uppercase">
                        Contact Frequency
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="NET-LINK ID"
                        className="w-full bg-black border border-white/20 p-3 text-white focus:border-cyber-blue outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-mono text-gray-400 uppercase">
                        Drop Point Address
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Night City, Watson District, Megabuilding H10"
                        className="w-full bg-black border border-white/20 p-3 text-white focus:border-cyber-blue outline-none transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Payment */}
                <div className="bg-white/5 border border-white/10 p-6 relative overflow-hidden group hover:border-cyber-pink/50 transition-colors">
                  <h3 className="text-xl font-display text-cyber-pink mb-6 flex items-center gap-2">
                    <CreditCard className="text-cyber-pink" /> PAYMENT_METHOD
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 border border-cyber-pink/50 bg-cyber-pink/10 p-4">
                      <div className="w-4 h-4 rounded-full bg-cyber-pink shadow-[0_0_10px_#ff003c]"></div>
                      <span className="font-mono text-sm">
                        CREDIT CHIP (INSTANT)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-gray-400 uppercase">
                          Chip ID Number
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="**** **** **** 2077"
                          className="w-full bg-black border border-white/20 p-3 text-white focus:border-cyber-pink outline-none transition-all font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-gray-400 uppercase">
                          Security Code
                        </label>
                        <input
                          required
                          type="password"
                          placeholder="***"
                          className="w-full bg-black border border-white/20 p-3 text-white focus:border-cyber-pink outline-none transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  disabled={isProcessing || cart.length === 0}
                  className={`w-full py-4 text-xl font-bold font-display uppercase tracking-widest transition-all clip-path-polygon 
                      ${
                        isProcessing
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                          : "bg-cyber-blue text-black hover:bg-white hover:shadow-[0_0_20px_white]"
                      }
                    `}
                >
                  {isProcessing
                    ? "PROCESSING TRANSACTION..."
                    : `CONFIRM PAYMENT • €$ ${total.toLocaleString()}`}
                </button>
              </form>
            ) : (
              // SUCCESS STATE
              <div className="h-full flex flex-col items-center justify-center bg-white/5 border border-green-500/30 p-10 text-center animate-pulse-slow">
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)] mb-6">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-4xl font-display text-white mb-2">
                  ORDER CONFIRMED
                </h2>
                <p className="text-gray-400 font-mono text-sm mb-8">
                  Transaction ID: #TX-{Math.floor(Math.random() * 999999)}{" "}
                  <br />
                  Drone delivery is en route to your location.
                </p>
                <button
                  onClick={onBack}
                  className="px-8 py-3 border border-green-500 text-green-500 font-mono hover:bg-green-500 hover:text-black transition-colors"
                >
                  RETURN TO MAIN MENU
                </button>
              </div>
            )}
          </div>

          {/* CỘT PHẢI: ORDER SUMMARY */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 bg-black/50 backdrop-blur-md border border-white/10 p-6">
              <h3 className="text-sm font-mono text-gray-500 border-b border-white/10 pb-4 mb-4">
                // ORDER_MANIFEST_V1.0
              </h3>

              <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-4 pr-2">
                {cart.length === 0 ? (
                  <p className="text-gray-600 italic font-mono text-sm">
                    No items in manifest...
                  </p>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 items-start animate-fade-in"
                    >
                      <div
                        className={`w-12 h-12 shrink-0 bg-white/5 border border-white/10 flex items-center justify-center`}
                      >
                        {/* Nếu item có icon, render icon. Nếu không, dùng box rỗng */}
                        {item.icon ? (
                          <item.icon size={20} className="text-gray-400" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-bold text-sm line-clamp-1">
                          {item.name}
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span
                            className={`text-[10px] uppercase px-1 border ${
                              item.rarity === "legendary"
                                ? "border-cyber-yellow text-cyber-yellow"
                                : "border-cyber-blue text-cyber-blue"
                            }`}
                          >
                            {item.rarity || "COMMON"}
                          </span>
                          <span className="text-gray-400 font-mono text-xs">
                            €$ {item.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-2 font-mono text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>SUBTOTAL</span>
                  <span>€$ {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>SERVICE FEE (10%)</span>
                  <span>€$ {(total * 0.1).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white text-lg font-bold pt-4 border-t border-dashed border-white/20 mt-4">
                  <span>TOTAL DUE</span>
                  <span className="text-cyber-yellow text-xl">
                    €$ {(total * 1.1).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
