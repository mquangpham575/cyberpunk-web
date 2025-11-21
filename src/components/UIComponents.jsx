import { motion } from "framer-motion";

export const CyberButton = ({ children, onClick, variant = "yellow" }) => {
  // 1. Định nghĩa cấu hình màu cho các nút dạng Outline (Viền)
  const outlineConfig = {
    blue: {
      borderColor: "bg-cyber-blue", // Màu viền ngoài
      textColor: "text-cyber-blue", // Màu chữ ban đầu
      hoverBg: "group-hover:bg-cyber-blue", // Màu nền khi hover
    },
    yellow: {
      borderColor: "bg-cyber-yellow",
      textColor: "text-cyber-yellow",
      hoverBg: "group-hover:bg-cyber-yellow",
    },
  };

  // Lấy cấu hình màu dựa trên variant hiện tại (blue hoặc yellow)
  const config = outlineConfig[variant];

  // Kiểm tra nếu variant hợp lệ để render dạng outline
  const isOutline = !!config;

  const commonClipPath = "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)";

  // --- RENDER CHO NÚT DẠNG OUTLINE (Áp dụng cho cả BLUE và YELLOW) ---
  if (isOutline) {
    return (
      <motion.button
        whileHover={{ scale: 1.05, x: 2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        // LỚP NGOÀI (Đóng vai trò là viền): Sử dụng borderColor từ config
        className={`relative group p-[2px] font-display text-lg md:text-xl font-bold uppercase tracking-wider transition-all duration-150 ${config.borderColor}`}
        style={{ clipPath: commonClipPath }}
      >
        {/* LỚP TRONG (Nội dung chính) */}
        <div
          className={`
            relative h-full w-full px-6 py-2 md:px-8 md:py-3 flex items-center justify-center transition-colors duration-150
            bg-cyber-black ${config.hoverBg}         /* Bình thường: Nền Đen -> Hover: Nền Màu đặc */
            ${config.textColor} group-hover:text-cyber-black     /* Bình thường: Chữ Màu -> Hover: Chữ Đen */
          `}
          style={{ clipPath: commonClipPath }}
        >
          {children}
        </div>

        {/* Hiệu ứng vệt sáng lướt qua nhanh */}
        <div className="absolute top-0 -left-full w-full h-full bg-white/40 skew-x-12 group-hover:left-full transition-all duration-300 ease-in-out z-50 pointer-events-none" />
      </motion.button>
    );
  }

  // --- RENDER CHO CÁC NÚT SOLID KHÁC (VD: Nút Pink nếu dùng sau này) ---
  // Hiện tại trên UI chính không dùng, nhưng giữ lại làm fallback
  return (
    <motion.button
      whileHover={{ scale: 1.05, x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        bg-cyber-pink text-white hover:shadow-[0_0_15px_rgba(255,0,60,0.5)]
        px-6 py-2 md:px-8 md:py-3 font-display text-lg md:text-xl font-bold uppercase tracking-wider border-2 border-transparent
        relative overflow-hidden group transition-all duration-150
      `}
      style={{ clipPath: commonClipPath }}
    >
      <div className="absolute top-0 -left-full w-full h-full bg-white/20 skew-x-12 group-hover:left-full transition-all duration-300 ease-in-out" />
      {children}
    </motion.button>
  );
};

// Component Title giữ nguyên
export const GlitchTitle = ({ text }) => (
  <div className="relative inline-block mb-4 md:mb-6 animate-flicker">
    <h1 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none relative z-10">
      {text}
    </h1>
    <div className="absolute top-0 left-0 text-5xl md:text-7xl font-display font-black text-cyber-pink opacity-70 translate-x-0.5 -z-10 mix-blend-screen">
      {text}
    </div>
    <div className="absolute top-0 left-0 text-5xl md:text-7xl font-display font-black text-cyber-blue opacity-70 -translate-x-0.5 -z-10 mix-blend-screen">
      {text}
    </div>
  </div>
);
