import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  CreditCard,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  Banknote,
} from "lucide-react";

const CheckoutPage = ({ cart, total, onClearCart, user }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit");

  // Handle 'Escape' key navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        navigate("/");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onClearCart();
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="relative min-h-screen z-40 bg-black/80 backdrop-blur-md text-white overflow-y-auto pt-28 pb-20"
    >
      {/* Decorative background grid */}
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[32px_32px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Title của trang Checkout */}
        <header className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
          <button
            onClick={() => navigate("")}
            className="flex items-center gap-2 text-gray-400 hover:text-cyber-blue transition-colors group bg-black/50 px-3 py-2 rounded-sm border border-transparent hover:border-cyber-blue/30"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-mono text-sm uppercase tracking-widest hidden sm:inline">
              QUAY LẠI (ESC)
            </span>
          </button>
          <div className="text-2xl font-display tracking-widest text-white text-shadow-glow">
            CỔNG<span className="text-cyber-blue"> THANH TOÁN</span>
          </div>
          <div className="flex items-center gap-2 text-green-500 font-mono text-xs bg-green-500/10 px-3 py-1 border border-green-500/30">
            <ShieldCheck size={16} />
            <span className="hidden sm:inline">KẾT NỐI AN TOÀN</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-7 space-y-8">
            {!isSuccess ? (
              <form onSubmit={handlePayment} className="space-y-8">
                {/* Section: Delivery Info */}
                <div className="bg-black/60 border border-white/10 p-6 relative overflow-hidden group hover:border-cyber-blue/50 transition-colors backdrop-blur-sm">
                  <h3 className="text-xl font-display text-cyber-yellow mb-6 flex items-center gap-2">
                    <MapPin className="text-cyber-yellow" /> ĐIỂM GIAO HÀNG
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-400 uppercase">
                        Tên Người Nhận
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="NGUYEN VAN A"
                        defaultValue={user?.displayName || ""}
                        className="w-full bg-white/5 border border-white/20 p-3 text-white focus:border-cyber-blue outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-400 uppercase">
                        Kênh Liên Lạc / SĐT
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="09xx-xxx-xxx"
                        className="w-full bg-white/5 border border-white/20 p-3 text-white focus:border-cyber-blue outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-mono text-gray-400 uppercase">
                        Địa Chỉ Nhận Hàng
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Night City, Quận Watson, Tòa nhà H10"
                        className="w-full bg-white/5 border border-white/20 p-3 text-white focus:border-cyber-blue outline-none transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Payment Info */}
                <div className="bg-black/60 border border-white/10 p-6 relative overflow-hidden group hover:border-cyber-pink/50 transition-colors backdrop-blur-sm">
                  <h3 className="text-xl font-display text-cyber-pink mb-6 flex items-center gap-2">
                    <CreditCard className="text-cyber-pink" />
                    PHƯƠNG THỨC THANH TOÁN
                  </h3>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("credit")}
                      className={`flex flex-col items-center justify-center p-4 border transition-all ${
                        paymentMethod === "credit"
                          ? "border-cyber-pink bg-cyber-pink/10 text-white"
                          : "border-white/10 text-gray-500 hover:border-white/30 hover:bg-white/5"
                      }`}
                    >
                      <CreditCard size={24} className="mb-2" />
                      <span className="text-xs font-mono font-bold">
                        CHIP TÍN DỤNG
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`flex flex-col items-center justify-center p-4 border transition-all ${
                        paymentMethod === "cod"
                          ? "border-green-500 bg-green-500/10 text-white"
                          : "border-white/10 text-gray-500 hover:border-white/30 hover:bg-white/5"
                      }`}
                    >
                      <Banknote size={24} className="mb-2" />
                      <span className="text-xs font-mono font-bold">
                        TIỀN MẶT (COD)
                      </span>
                    </button>
                  </div>

                  {/* Dynamic Form Content */}
                  <div className="space-y-4 animate-fade-in">
                    {paymentMethod === "credit" ? (
                      <>
                        <div className="flex items-center gap-4 border border-cyber-pink/50 bg-cyber-pink/10 p-4">
                          <div className="w-4 h-4 rounded-full bg-cyber-pink shadow-[0_0_10px_#ff003c]"></div>
                          <span className="font-mono text-sm">
                            KẾT NỐI MẠNG AN TOÀN (TỨC THÌ)
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-400 uppercase">
                              Mã Số Chip
                            </label>
                            <input
                              required
                              type="text"
                              placeholder="**** **** **** 2077"
                              className="w-full bg-white/5 border border-white/20 p-3 text-white focus:border-cyber-pink outline-none transition-all font-mono"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-400 uppercase">
                              Mã Bảo Mật
                            </label>
                            <input
                              required
                              type="password"
                              placeholder="***"
                              className="w-full bg-white/5 border border-white/20 p-3 text-white focus:border-cyber-pink outline-none transition-all font-mono"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      // COD Info View
                      <div className="border border-green-500/30 bg-green-500/5 p-6 flex flex-col items-center text-center space-y-3">
                        <Banknote className="text-green-500" size={32} />
                        <h4 className="text-white font-display text-lg">
                          THANH TOÁN KHI NHẬN HÀNG
                        </h4>
                        <p className="text-gray-400 text-xs font-mono max-w-sm">
                          Hệ thống sẽ ủy quyền cho đơn vị vận chuyển thu tiền
                          mặt. Vui lòng chuẩn bị đúng số tiền{" "}
                          <span className="text-green-400">
                            €$ {(total * 1.1).toLocaleString()}
                          </span>{" "}
                          khi nhận hàng.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  disabled={isProcessing || cart.length === 0}
                  className={`w-full py-4 text-xl font-bold font-display uppercase tracking-widest transition-all clip-path-polygon shadow-lg
                      ${
                        isProcessing
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                          : paymentMethod === "cod"
                          ? "bg-green-500 text-black hover:bg-white hover:shadow-[0_0_20px_#22c55e]"
                          : "bg-cyber-blue text-black hover:bg-white hover:shadow-[0_0_20px_white]"
                      }
                    `}
                >
                  {isProcessing
                    ? "ĐANG XỬ LÝ GIAO DỊCH..."
                    : `XÁC NHẬN ${
                        paymentMethod === "cod" ? "ĐẶT HÀNG" : "THANH TOÁN"
                      } • €$ ${total.toLocaleString()}`}
                </button>
              </form>
            ) : (
              // Success State
              <div className="h-full flex flex-col items-center justify-center bg-black/60 border border-green-500/30 p-10 text-center animate-pulse-slow backdrop-blur-sm">
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)] mb-6">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-4xl font-display text-white mb-2">
                  ĐƠN HÀNG ĐÃ XÁC NHẬN
                </h2>
                <p className="text-gray-400 font-mono text-sm mb-8">
                  Mã Giao Dịch: #TX-{Math.floor(Math.random() * 999999)} <br />
                  Drone giao hàng đang di chuyển đến vị trí của bạn.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-3 border border-green-500 text-green-500 font-mono hover:bg-green-500 hover:text-black transition-colors"
                >
                  VỀ MENU CHÍNH
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-black/60 backdrop-blur-md border border-white/10 p-6">
              <h3 className="text-sm font-mono text-gray-500 border-b border-white/10 pb-4 mb-4">
                // CHI_TIẾT_ĐƠN_HÀNG_V1.0
              </h3>

              <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-4 pr-2">
                {cart.length === 0 ? (
                  <p className="text-gray-600 italic font-mono text-sm">
                    Không có vật phẩm trong danh sách...
                  </p>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 items-start animate-fade-in"
                    >
                      <div className="w-12 h-12 shrink-0 bg-white/5 border border-white/10 flex items-center justify-center">
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
                            {item.rarity || "THƯỜNG"}
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

              {/* Totals Section */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-2 font-mono text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>TẠM TÍNH</span>
                  <span>€$ {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>PHÍ DỊCH VỤ (10%)</span>
                  <span>€$ {(total * 0.1).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white text-lg font-bold pt-4 border-t border-dashed border-white/20 mt-4">
                  <span>TỔNG THANH TOÁN</span>
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
