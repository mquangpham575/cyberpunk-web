import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Check } from "lucide-react";

// Import Data
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
};

// --- SUB-COMPONENTS ---

/**
 * Filter Toggle Button
 */
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

/**
 * Search Input Field with Clear functionality
 */
const SearchBar = ({ value, onChange, onClear }) => (
  <div className="relative group w-full md:w-64">
    {/* Focus Glow Effect */}
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

    {/* Decorative Corner */}
    <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-gray-500 group-focus-within:border-cyber-blue transition-colors pointer-events-none" />
  </div>
);

/**
 * Individual Item Card with interaction logic
 */
const ItemCard = ({ item, addToCart }) => {
  const [isAdded, setIsAdded] = useState(false);
  const theme = RARITY_CONFIG[item.rarity];

  const isSoldOut = item.status === "sold_out";
  const isPreOrder = item.status === "pre_order";

  const handleAddToCart = () => {
    if (isSoldOut) return;
    addToCart(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000); // Reset feedback after 1s
  };

  const cardStateClass = isSoldOut
    ? "opacity-50 grayscale pointer-events-none"
    : "opacity-100";

  // Hàm render trạng thái nút mua
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
      className={`
        relative bg-black/40 backdrop-blur-md border p-6 flex flex-col gap-4 group hover:-translate-y-1 transition-transform duration-200
        ${theme.border} ${theme.shadow} ${theme.color} ${cardStateClass}
      `}
    >
      {/* Card Header: Icon & Price */}
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

      {/* Card Body: Info */}
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

        {/* Fill Animation */}
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
          className={`
          absolute top-0 right-0 w-0 h-0 border-l-5 border-b-5 border-l-transparent border-b-transparent transition-all
          ${`group-hover:border-b-${theme.color.split("-")[1]}-${
            theme.color.split("-")[2]
          }`}
        `}
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

  // Map key filter sang tiếng Việt để hiển thị
  const FILTER_LABELS = {
    ALL: "TẤT CẢ",
    WEAPONS: "VŨ KHÍ",
    CYBERWARE: "CYBERWARE",
  };

  // Filter Logic
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
    <section
      id="black-market"
      className="relative z-10 w-full py-24 border-t border-white/10 bg-black/20"
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* --- HEADER & CONTROLS --- */}
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
                  label={FILTER_LABELS[key]} // Hiển thị tên tiếng Việt
                  active={activeFilter === key}
                  onClick={() => setActiveFilter(key)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* --- GRID DISPLAY --- */}
        <AnimatePresence mode="wait">
          {filteredItems.length > 0 ? (
            <motion.div
              key={activeFilter + searchQuery} // Triggers re-animation
              variants={ANIMATIONS.container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} addToCart={addToCart} />
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
  );
};

export default ArsenalSection;
