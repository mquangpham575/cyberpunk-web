import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  Crosshair,
  Cpu,
  Eye,
  Activity,
  Skull,
  Flame,
  Radio,
  Search,
  X,
} from "lucide-react"; // Thêm icon X

// --- DỮ LIỆU (Giữ nguyên) ---
const ITEMS = [
  {
    id: 1,
    name: "MALORIAN_ARMS_3516",
    category: "WEAPONS",
    rarity: "legendary",
    price: "???",
    icon: Flame,
    status: "pre_order",
    desc: "Súng lục cá nhân của Johnny Silverhand. Hỏa lực hủy diệt.",
  },
  {
    id: 2,
    name: "GUTS_SHOTGUN",
    category: "WEAPONS",
    rarity: "epic",
    price: "25,000",
    icon: Skull,
    status: "available",
    desc: "Shotgun hạng nặng của Rebecca. Độ giật cực cao.",
  },
  {
    id: 3,
    name: "MONOWIRE",
    category: "WEAPONS",
    rarity: "legendary",
    price: "32,000",
    icon: Activity,
    status: "available",
    desc: "Dây roi đơn phân tử. Cắt nát kẻ thù trong im lặng.",
  },
  {
    id: 4,
    name: "ERATA_KATANA",
    category: "WEAPONS",
    rarity: "epic",
    price: "18,500",
    icon: Crosshair,
    status: "available",
    desc: "Thanh kiếm nhiệt. Gây sát thương lửa lên mục tiêu.",
  },
  {
    id: 5,
    name: "PROJECTILE_LAUNCHER",
    category: "WEAPONS",
    rarity: "rare",
    price: "15,000",
    icon: Crosshair,
    status: "sold_out",
    desc: "Phóng lựu đạn từ cổ tay. Hết hàng do lệnh cấm vận.",
  },
  {
    id: 6,
    name: "SKI_PPY",
    category: "WEAPONS",
    rarity: "epic",
    price: "50,000",
    icon: Radio,
    status: "sold_out",
    desc: "Súng thông minh có AI. (Lưu ý: AI hơi lải nhải).",
  },
  {
    id: 7,
    name: "SANDY_MK5_WARP",
    category: "CYBERWARE",
    rarity: "legendary",
    price: "85,000",
    icon: Zap,
    status: "pre_order",
    desc: "Phiên bản thử nghiệm. Làm chậm thời gian 90%.",
  },
  {
    id: 8,
    name: "GORILLA_ARMS",
    category: "CYBERWARE",
    rarity: "epic",
    price: "12,500",
    icon: Activity,
    status: "available",
    desc: "Tăng sức mạnh cận chiến và khả năng phá cửa.",
  },
  {
    id: 9,
    name: "KIROSHI_OPTICS_V3",
    category: "CYBERWARE",
    rarity: "rare",
    price: "5,200",
    icon: Eye,
    status: "available",
    desc: "Quét kẻ địch, nhìn xuyên tường, zoom 10x.",
  },
  {
    id: 10,
    name: "SUBDERMAL_ARMOR",
    category: "CYBERWARE",
    rarity: "rare",
    price: "4,000",
    icon: Shield,
    status: "available",
    desc: "Giáp dưới da. Tăng 200 Armor.",
  },
  {
    id: 11,
    name: "NETWATCH_DRIVER",
    category: "CYBERWARE",
    rarity: "legendary",
    price: "45,000",
    icon: Cpu,
    status: "available",
    desc: "Hack nhanh hơn 60%. Tự động lây lan virus.",
  },
  {
    id: 12,
    name: "TITANIUM_BONES",
    category: "CYBERWARE",
    rarity: "rare",
    price: "3,000",
    icon: Shield,
    status: "sold_out",
    desc: "Tăng khả năng chịu tải trọng thêm 60%.",
  },
];

const RARITY_COLORS = {
  legendary: "border-cyber-yellow text-cyber-yellow shadow-[0_0_15px_#fce800]",
  epic: "border-cyber-pink text-cyber-pink shadow-[0_0_10px_#ff003c]",
  rare: "border-cyber-blue text-cyber-blue shadow-[0_0_10px_#00f0ff]",
};

// Cấu hình Animation (Giữ nguyên)
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

// Component Item Card (Giữ nguyên)
const ItemCard = ({ item }) => {
  const isSoldOut = item.status === "sold_out";
  const isPreOrder = item.status === "pre_order";
  const cardOpacity = isSoldOut
    ? "opacity-50 grayscale pointer-events-none"
    : "opacity-100";

  return (
    <motion.div
      variants={itemVariants}
      className={`
        relative bg-black/40 backdrop-blur-md border p-6 flex flex-col gap-4 group hover:-translate-y-1 transition-transform duration-200
        ${RARITY_COLORS[item.rarity].split(" ")[0]} 
        ${cardOpacity}
      `}
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 bg-black/50 border ${RARITY_COLORS[item.rarity]}`}>
          <item.icon size={24} />
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-xs text-gray-400 border border-gray-700 px-2 py-1">
            €$ {item.price}
          </span>
          {isSoldOut && (
            <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-1">
              OUT_OF_STOCK
            </span>
          )}
          {isPreOrder && (
            <span className="text-[10px] font-bold text-cyber-yellow bg-cyber-yellow/10 px-1 animate-pulse">
              PRE_ORDER
            </span>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-display text-2xl text-white mb-2 group-hover:text-cyber-blue transition-colors break-words leading-none min-h-[3rem] flex items-end">
          {item.name.replace(/_/g, " ")}
        </h3>
        <span
          className={`text-[10px] font-bold uppercase tracking-widest ${
            RARITY_COLORS[item.rarity].split(" ")[1]
          }`}
        >
          // {item.rarity} CLASS
        </span>
        <p className="mt-3 text-xs text-gray-400 font-mono leading-relaxed h-10 line-clamp-2">
          {item.desc}
        </p>
      </div>

      <button
        disabled={isSoldOut}
        className={`
          mt-4 w-full py-2 border text-xs font-bold uppercase tracking-widest transition-all relative overflow-hidden group/btn duration-150
          ${
            isSoldOut
              ? "border-gray-700 text-gray-600 cursor-not-allowed"
              : "border-white/20 hover:bg-white hover:text-black"
          }
          ${
            isPreOrder
              ? "border-cyber-yellow text-cyber-yellow hover:bg-cyber-yellow hover:text-black"
              : ""
          }
        `}
      >
        <span className="relative z-10">
          {isSoldOut ? "UNAVAILABLE" : isPreOrder ? "RESERVE NOW" : "PURCHASE"}
        </span>
        {!isSoldOut && (
          <div
            className={`absolute inset-0 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-150
            ${isPreOrder ? "bg-cyber-yellow" : "bg-white"}
          `}
          />
        )}
      </button>

      {!isSoldOut && (
        <div
          className={`absolute top-0 right-0 w-0 h-0 border-l-5 border-b-5 border-l-transparent border-b-transparent group-hover:border-b-${
            RARITY_COLORS[item.rarity].split("-")[2]
          } transition-all`}
        />
      )}
    </motion.div>
  );
};

// --- MAIN SECTION ---
const ArsenalSection = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = ITEMS.filter((item) => {
    const matchesCategory =
      activeFilter === "ALL" || item.category === activeFilter;
    const normalizedName = item.name.replace(/_/g, " ").toLowerCase();
    const normalizedQuery = searchQuery.toLowerCase();
    const matchesSearch = normalizedName.includes(normalizedQuery);
    return matchesCategory && matchesSearch;
  });

  const FilterButton = ({ label, filterKey }) => (
    <button
      onClick={() => setActiveFilter(filterKey)}
      className={`
        px-4 py-2.5 text-xs font-bold font-mono border transition-all duration-200
        ${
          activeFilter === filterKey
            ? "bg-cyber-blue text-black border-cyber-blue shadow-[0_0_10px_#00f0ff]"
            : "border-white/20 text-gray-400 hover:border-cyber-blue hover:text-white bg-transparent"
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <section
      id="black-market"
      className="relative z-10 w-full py-24 border-t border-white/10 bg-black/20"
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row justify-between items-end mb-12 gap-8">
          <div className="w-full xl:w-auto">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-2">
              BLACK<span className="text-cyber-pink">_MARKET</span>
            </h2>
            <p className="text-gray-400 font-mono text-sm border-l-2 border-cyber-yellow pl-4 max-w-md">
              Kho vũ khí ngầm lớn nhất Night City. Không hỏi nguồn gốc, không
              hoàn tiền.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-end w-full xl:w-auto">
            {/* --- FIX LỖI CLICK SEARCH BAR TẠI ĐÂY --- */}
            <div className="relative group w-full md:w-64">
              {/* 1. Lớp Glow: Thêm pointer-events-none để click xuyên qua */}
              <div className="absolute inset-0 bg-cyber-blue/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />

              {/* 2. Icon Search: Thêm pointer-events-none để click xuyên qua */}
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyber-blue transition-colors pointer-events-none"
                size={16}
              />

              {/* 3. Input: Thêm relative z-10 để nó nổi lên trên cùng, đảm bảo nhận được click */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH PROTOCOL..."
                className="w-full bg-black/50 border border-white/20 py-2.5 pl-10 pr-8 text-xs font-mono text-white focus:outline-none focus:border-cyber-blue transition-colors uppercase placeholder:text-gray-700 relative z-10"
              />

              {/* 4. Nút Xóa (Clear): Chỉ hiện khi có text */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white z-20"
                >
                  <X size={14} />
                </button>
              )}

              <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-gray-500 group-focus-within:border-cyber-blue transition-colors pointer-events-none" />
            </div>

            <div className="flex gap-2 flex-wrap">
              <FilterButton label="ALL" filterKey="ALL" />
              <FilterButton label="WEAPONS" filterKey="WEAPONS" />
              <FilterButton label="CYBERWARE" filterKey="CYBERWARE" />
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        {filteredItems.length > 0 ? (
          <motion.div
            key={activeFilter + searchQuery}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </motion.div>
        ) : (
          <div className="w-full py-20 text-center border border-dashed border-white/10 bg-black/20">
            <p className="text-cyber-pink font-mono text-sm animate-pulse">
              &gt;&gt; NO_DATA_FOUND: 0 RESULTS MATCHING "
              {searchQuery.toUpperCase()}"
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArsenalSection;
