import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CyberButton, GlitchTitle } from "../components/UIComponents";
import InfoSection from "../components/InfoSection";
import ArsenalSection from "../components/ArsenalSection";

const HomePage = ({ scrollY, yText, opacityText, addToCart }) => {
  const handleScrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col"
    >
      <section className="h-screen flex flex-col relative">
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
          onClick={() => handleScrollTo("black-market")}
        >
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-70">
            Scroll Down
          </span>
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* ID này dùng để scroll xuống */}
      <div id="black-market">
        <ArsenalSection addToCart={addToCart} />
      </div>

      <div id="system-status">
        <InfoSection />
      </div>
    </motion.div>
  );
};

export default HomePage;
