import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Check, Cpu, Shield, Zap, Target } from "lucide-react"; // Thêm icon cho bảng stats

// Import Data (Giả định)
import { INVENTORY_DATA } from "../data/inventoryData";

// --- CONFIGURATION ---

const RARITY_CONFIG = {
  legendary: {
    color: "text-cyber-yellow",
    border: "border-cyber-yellow",
    shadow: "shadow-[0_0_15px_#fce800]",
    bg: "bg-cyber-yellow",
  },
  epic: {
    color: "text-cyber-pink",
    border: "border-cyber-pink",
    shadow: "shadow-[0_0_10px_#ff003c]",
    bg: "bg-cyber-pink",
  },
  rare: {
    color: "text-cyber-blue",
    border: "border-cyber-blue",
    shadow: "shadow-[0_0_10px_#00f0ff]",
    bg: "bg-cyber-blue",
  },
};

const ANIMATIONS = {
  container: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  },
  item: {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  },
  // Animation cho trang chi tiết
  detailOverlay: {
    hidden: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
    show: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)",
      transition: { duration: 0.2 },
    },
  },
};

// --- SUB-COMPONENTS ---

const FilterButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2.5 text-xs font-bold font-mono border transition-all duration-200
      ${
        active
          ? "bg-cyber-blue text-black border-cyber-blue shadow-[0_0_10px_#00f0ff]"
          : "border-white/20 text-gray-400 hover:border-cyber-blue hover:text-white bg-transparent"
      }
    `}
  >
    {label}
  </button>
);

const SearchBar = ({ value, onChange, onClear }) => (
  <div className="relative group w-full md:w-64">
    <div className="absolute inset-0 bg-cyber-blue/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
    <Search
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyber-blue transition-colors pointer-events-none"
      size={16}
    />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="TÌM KIẾM DỮ LIỆU..."
      className="w-full bg-black/50 border border-white/20 py-2.5 pl-10 pr-8 text-xs font-mono text-white focus:outline-none focus:border-cyber-blue transition-colors uppercase placeholder:text-gray-700 relative z-10"
    />
    {value && (
      <button
        onClick={onClear}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white z-20"
      >
        <X size={14} />
      </button>
    )}
    <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-gray-500 group-focus-within:border-cyber-blue transition-colors pointer-events-none" />
  </div>
);

/**
 * NEW: Component hiển thị chi tiết vật phẩm (Detail View)
 */
const ItemDetailView = ({ item, onClose, addToCart }) => {
  const theme = RARITY_CONFIG[item.rarity];
  const isSoldOut = item.status === "sold_out";

  // Mock stats data nếu trong data gốc chưa có
  const stats = item.stats || [
    { label: "SÁT THƯƠNG", value: 85, icon: Target },
    { label: "TỐC ĐỘ", value: 60, icon: Zap },
    { label: "ĐỘ BỀN", value: 92, icon: Shield },
    { label: "TECH", value: 75, icon: Cpu },
  ];

  return (
    <motion.div
      variants={ANIMATIONS.detailOverlay}
      initial="hidden"
      animate="show"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-md"
      onClick={onClose} // Click ra ngoài để đóng
    >
      <div
        className={`
          relative w-full max-w-4xl bg-black border border-white/10 flex flex-col md:flex-row overflow-hidden
          ${theme.shadow}
        `}
        onClick={(e) => e.stopPropagation()} // Ngăn click đóng khi click vào nội dung
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 border border-white/20 hover:bg-white hover:text-black transition-colors text-white"
        >
          <X size={20} />
        </button>

        {/* Cột trái: Hình ảnh / Visual */}
        <div
          className={`w-full md:w-2/5 p-8 flex items-center justify-center bg-linear-to-br from-black to-gray-900 border-b md:border-b-0 md:border-r ${theme.border} relative overflow-hidden`}
        >
          {/* Background Grid Decoration */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

          <div
            className={`relative z-10 p-10 rounded-full border-2 border-dashed ${theme.border} bg-black/30`}
          >
            <item.icon size={120} className={theme.color} />
          </div>

          <div
            className={`absolute bottom-4 left-4 text-xs font-mono ${theme.color}`}
          >
            ID: {item.id || "UNK-001"}
          </div>
        </div>

        {/* Cột phải: Thông tin */}
        <div className="w-full md:w-3/5 p-8 flex flex-col h-full bg-black/90">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <span
                className={`text-xs font-bold uppercase tracking-widest px-2 py-1 border ${theme.border} ${theme.color}`}
              >
                {item.rarity} CLASS
              </span>
              <span className="text-2xl font-mono text-white">
                €$ {item.price}
              </span>
            </div>

            <h2 className="text-4xl font-display text-white mb-4 leading-none uppercase">
              {item.name}
            </h2>

            <p className="text-gray-400 font-mono text-sm leading-relaxed mb-8 border-l-2 border-white/20 pl-4">
              {item.desc}
              <br />
              <br />
              <span className="text-gray-500 italic">
                "Hàng nhập khẩu trực tiếp từ Arasaka Tower. Không bảo hành nếu
                bị hack."
              </span>
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 p-3 border border-white/5 flex items-center gap-3"
                >
                  <stat.icon size={18} className="text-gray-500" />
                  <div className="w-full">
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono mb-1">
                      <span>{stat.label}</span>
                      <span>{stat.value}%</span>
                    </div>
                    <div className="h-1 w-full bg-gray-800">
                      <div
                        className={`h-full ${theme.bg}`}
                        style={{ width: `${stat.value}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4 mt-auto pt-6 border-t border-white/10">
            <button
              onClick={() => {
                if (!isSoldOut) {
                  addToCart(item);
                  onClose(); // Tùy chọn: Có đóng modal sau khi mua không?
                }
              }}
              disabled={isSoldOut}
              className={`
                  flex-1 py-3 px-6 text-sm font-bold uppercase tracking-widest transition-all
                  ${
                    isSoldOut
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : `bg-white text-black hover:bg-${
                          theme.color.split("-")[1]
                        }-500 hover:text-white`
                  }
                `}
            >
              {isSoldOut ? "ĐÃ BÁN HẾT" : "XÁC NHẬN MUA"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ItemCard = ({ item, addToCart, onSelect }) => {
  const [isAdded, setIsAdded] = useState(false);
  const theme = RARITY_CONFIG[item.rarity];
  const isSoldOut = item.status === "sold_out";
  const isPreOrder = item.status === "pre_order";

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Quan trọng: Ngăn không cho click xuyên qua nút để mở modal
    if (isSoldOut) return;
    addToCart(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  const cardStateClass = isSoldOut
    ? "opacity-50 grayscale pointer-events-none"
    : "opacity-100";

  const renderButtonContent = () => {
    if (isSoldOut) return "HẾT HÀNG";
    if (isAdded)
      return (
        <>
          <Check size={14} /> ĐÃ THÊM
        </>
      );
    if (isPreOrder) return "ĐẶT TRƯỚC";
    return "MUA NGAY";
  };

  return (
    <motion.div
      variants={ANIMATIONS.item}
      onClick={() => onSelect(item)} // Kích hoạt mở modal khi click vào card
      className={`
        relative bg-black/40 backdrop-blur-md border p-6 flex flex-col gap-4 group hover:-translate-y-1 transition-transform duration-200 cursor-pointer
        ${theme.border} ${theme.shadow} ${theme.color} ${cardStateClass}
      `}
    >
      {/* ... (Giữ nguyên phần Header & Info cũ) ... */}
      <div className="flex justify-between items-start">
        <div className={`p-3 bg-black/50 border ${theme.border}`}>
          <item.icon size={24} />
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-xs text-gray-400 border border-gray-700 px-2 py-1">
            €$ {item.price}
          </span>
          {isSoldOut && (
            <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-1">
              HẾT HÀNG
            </span>
          )}
          {isPreOrder && (
            <span className="text-[10px] font-bold text-cyber-yellow bg-cyber-yellow/10 px-1 animate-pulse">
              ĐẶT TRƯỚC
            </span>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-display text-2xl text-white mb-2 group-hover:text-cyber-blue transition-colors wrap-break-word leading-none min-h-12 flex items-end">
          {item.name}
        </h3>
        <span
          className={`text-[10px] font-bold uppercase tracking-widest ${theme.color}`}
        >
          // CẤP ĐỘ {item.rarity}
        </span>
        <p className="mt-3 text-xs text-gray-400 font-mono leading-relaxed h-10 line-clamp-2">
          {item.desc}
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={handleAddToCart}
        disabled={isSoldOut}
        className={`
          mt-4 w-full py-2 border text-xs font-bold uppercase tracking-widest transition-all relative overflow-hidden group/btn duration-150
          ${
            isSoldOut
              ? "border-gray-700 text-gray-600 cursor-not-allowed"
              : isAdded
              ? "border-green-500 text-green-500 bg-green-500/10"
              : "border-white/20 hover:bg-white hover:text-black"
          }
          ${
            !isAdded && isPreOrder
              ? "border-cyber-yellow text-cyber-yellow hover:bg-cyber-yellow hover:text-black"
              : ""
          }
        `}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {renderButtonContent()}
        </span>
        {!isSoldOut && !isAdded && (
          <div
            className={`absolute inset-0 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-150 ${
              isPreOrder ? "bg-cyber-yellow" : "bg-white"
            }`}
          />
        )}
      </button>

      {/* Decorative Corner Triangle */}
      {!isSoldOut && (
        <div
          className={`absolute top-0 right-0 w-0 h-0 border-l-5 border-b-5 border-l-transparent border-b-transparent transition-all group-hover:border-b-${
            theme.color.split("-")[1]
          }-${theme.color.split("-")[2]}`}
          style={{ borderBottomColor: "inherit" }}
        />
      )}
    </motion.div>
  );
};

// --- MAIN COMPONENT ---

const ArsenalSection = ({ addToCart }) => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null); // State lưu item đang xem chi tiết

  const FILTER_LABELS = {
    ALL: "TẤT CẢ",
    WEAPONS: "VŨ KHÍ",
    CYBERWARE: "CYBERWARE",
  };

  const filteredItems = useMemo(() => {
    return INVENTORY_DATA.filter((item) => {
      const matchesCategory =
        activeFilter === "ALL" || item.category === activeFilter;
      const normalizedName = item.name.replace(/_/g, " ").toLowerCase();
      const matchesSearch = normalizedName.includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <>
      <section
        id="black-market"
        className="relative z-10 w-full py-24 border-t border-white/10 bg-black/20"
      >
        <div className="container mx-auto px-6 md:px-12">
          {/* ... (Header & Controls giữ nguyên) ... */}
          <div className="flex flex-col xl:flex-row justify-between items-end mb-12 gap-8">
            <div className="w-full xl:w-auto">
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-2">
                CHỢ<span className="text-cyber-pink"> ĐEN</span>
              </h2>
              <p className="text-gray-400 font-mono text-sm border-l-2 border-cyber-yellow pl-4 max-w-md">
                Kho vũ khí ngầm lớn nhất Night City. Không hỏi han. Không hoàn
                tiền.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-end w-full xl:w-auto">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery("")}
              />
              <div className="flex gap-2 flex-wrap">
                {["ALL", "WEAPONS", "CYBERWARE"].map((key) => (
                  <FilterButton
                    key={key}
                    label={FILTER_LABELS[key]}
                    active={activeFilter === key}
                    onClick={() => setActiveFilter(key)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* GRID DISPLAY */}
          <AnimatePresence mode="wait">
            {filteredItems.length > 0 ? (
              <motion.div
                key={activeFilter + searchQuery}
                variants={ANIMATIONS.container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    addToCart={addToCart}
                    onSelect={setSelectedItem} // Truyền hàm mở chi tiết
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full py-20 text-center border border-dashed border-white/10 bg-black/20"
              >
                <p className="text-cyber-pink font-mono text-sm animate-pulse">
                  &gt;&gt; LỖI: KHÔNG TÌM THẤY DỮ LIỆU KHỚP VỚI "
                  {searchQuery.toUpperCase()}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* DETAIL OVERLAY */}
      <AnimatePresence>
        {selectedItem && (
          <ItemDetailView
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            addToCart={addToCart}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ArsenalSection;
