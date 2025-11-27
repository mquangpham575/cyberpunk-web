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
  const navigate = useNavigate(); // Sử dụng hook điều hướng
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit");

  // Xử lý Escape để quay lại
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        navigate(-1); // Quay lại trang trước
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
      className="fixed inset-0 z-100 bg-black text-white overflow-y-auto"
    >
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[32px_32px]"></div>

      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col relative z-10">
        <header className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
          <button
            onClick={() => navigate(-1)} // Quay lại trang trước
            className="flex items-center gap-2 text-gray-400 hover:text-cyber-blue transition-colors group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-mono text-sm uppercase tracking-widest">
              QUAY LẠI (ESC)
            </span>
          </button>
          <div className="text-2xl font-display tracking-widest text-white">
            CỔNG<span className="text-cyber-blue"> THANH TOÁN</span>
          </div>
          <div className="flex items-center gap-2 text-green-500 font-mono text-xs">
            <ShieldCheck size={16} />
            ĐÃ MÃ HÓA
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cột Trái: Form Thanh Toán */}
          <div className="lg:col-span-7 space-y-8">
            {!isSuccess ? (
              <form onSubmit={handlePayment} className="space-y-8">
                {/* Phần địa chỉ */}
                <div className="bg-white/5 border border-white/10 p-6 relative overflow-hidden group hover:border-cyber-blue/50 transition-colors">
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
                        className="w-full bg-black border border-white/20 p-3 text-white focus:border-cyber-blue outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-400 uppercase">
                        SĐT
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="09xx-xxx-xxx"
                        className="w-full bg-black border border-white/20 p-3 text-white focus:border-cyber-blue outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-mono text-gray-400 uppercase">
                        Địa Chỉ
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Night City..."
                        className="w-full bg-black border border-white/20 p-3 text-white focus:border-cyber-blue outline-none transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Phần thanh toán */}
                <div className="bg-white/5 border border-white/10 p-6 relative overflow-hidden group hover:border-cyber-pink/50 transition-colors">
                  <h3 className="text-xl font-display text-cyber-pink mb-6 flex items-center gap-2">
                    <CreditCard className="text-cyber-pink" /> PHƯƠNG THỨC THANH
                    TOÁN
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("credit")}
                      className={`flex flex-col items-center justify-center p-4 border transition-all ${
                        paymentMethod === "credit"
                          ? "border-cyber-pink bg-cyber-pink/10 text-white"
                          : "border-white/10 text-gray-500 hover:border-white/30"
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
                          : "border-white/10 text-gray-500 hover:border-white/30"
                      }`}
                    >
                      <Banknote size={24} className="mb-2" />
                      <span className="text-xs font-mono font-bold">
                        TIỀN MẶT (COD)
                      </span>
                    </button>
                  </div>

                  {/* Logic render form thẻ hoặc COD */}
                  <div className="space-y-4 animate-fade-in">
                    {paymentMethod === "credit" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-mono text-gray-400 uppercase">
                            Mã Số Chip
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="**** ****"
                            className="w-full bg-black border border-white/20 p-3 text-white focus:border-cyber-pink outline-none transition-all font-mono"
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
                            className="w-full bg-black border border-white/20 p-3 text-white focus:border-cyber-pink outline-none transition-all font-mono"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="border border-green-500/30 bg-green-500/5 p-6 flex flex-col items-center text-center space-y-3">
                        <Banknote className="text-green-500" size={32} />
                        <h4 className="text-white font-display text-lg">
                          THANH TOÁN KHI NHẬN HÀNG
                        </h4>
                        <p className="text-gray-400 text-xs font-mono max-w-sm">
                          Vui lòng chuẩn bị{" "}
                          <span className="text-green-400">
                            €$ {(total * 1.1).toLocaleString()}
                          </span>{" "}
                          khi nhận hàng.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  disabled={isProcessing || cart.length === 0}
                  className={`w-full py-4 text-xl font-bold font-display uppercase tracking-widest transition-all clip-path-polygon ${
                    isProcessing
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : paymentMethod === "cod"
                      ? "bg-green-500 text-black hover:bg-white"
                      : "bg-cyber-blue text-black hover:bg-white"
                  }`}
                >
                  {isProcessing
                    ? "ĐANG XỬ LÝ..."
                    : `XÁC NHẬN ${
                        paymentMethod === "cod" ? "ĐẶT HÀNG" : "THANH TOÁN"
                      } • €$ ${total.toLocaleString()}`}
                </button>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-white/5 border border-green-500/30 p-10 text-center animate-pulse-slow">
                <CheckCircle size={48} className="text-green-400 mb-6" />
                <h2 className="text-4xl font-display text-white mb-2">
                  ĐƠN HÀNG THÀNH CÔNG
                </h2>
                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-3 border border-green-500 text-green-500 font-mono hover:bg-green-500 hover:text-black transition-colors mt-8"
                >
                  VỀ MENU CHÍNH
                </button>
              </div>
            )}
          </div>

          {/* Cột Phải: Tóm tắt */}
          <div className="lg:col-span-5">
            {/* Copy lại phần tóm tắt đơn hàng từ code cũ vào đây, không cần thay đổi logic */}
            <div className="sticky top-8 bg-black/50 backdrop-blur-md border border-white/10 p-6">
              <h3 className="text-sm font-mono text-gray-500 border-b border-white/10 pb-4 mb-4">
                // CHI_TIẾT_ĐƠN_HÀNG
              </h3>
              {/* ... Render cart items ... */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-2 font-mono text-sm">
                <div className="flex justify-between text-white text-lg font-bold pt-4">
                  <span>TỔNG CỘNG</span>
                  <span className="text-cyber-yellow">
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
