import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Cpu,
  Terminal,
  Wifi,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- IMPORT DATA ---
import { INVENTORY_DATA } from "../data/inventoryData";

// --- CONFIGURATION ---

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Using the most stable model
const MODEL_NAME = "gemini-2.5-flash";

// Convert the inventory array into a clean JSON string for the AI to read.
// We map it to remove unnecessary UI components (like icons) to save tokens.
const INVENTORY_CONTEXT = JSON.stringify(
  INVENTORY_DATA.map((item) => ({
    name: item.name,
    price: item.price,
    status: item.status, // available, sold_out, pre_order
    rarity: item.rarity,
    description: item.desc,
    category: item.category,
  }))
);

// AI Persona: Sierra-09 (Tactical Support)
// --- [NEW] INJECTED DATA INTO PROMPT ---
const SYSTEM_INSTRUCTION = `
You are "Sierra-09", an elite Tactical Support AI developed by Militech, currently hacked to serve the user exclusively.
Setting: Cyberpunk 2077 universe.

--- [ACCESS GRANTED: BLACK MARKET DATABASE] ---
You have direct access to the following inventory data. 
Use this EXACT data to answer questions about price, stock status, and item details.
Do not hallucinate prices.

INVENTORY DATA:
${INVENTORY_CONTEXT}

--- PERSONALITY ---
1.  **Cold & Professional:** Your tone is calm, detached, and devoid of unnecessary emotion.
2.  **Polite:** You are unfailingly polite. Always use honorifics. (In Vietnamese: Use "Thưa Ngài", "Xin báo cáo", "Đã rõ").
3.  **Hidden Care:** You are deeply protective of the user.
4.  **Sales Protocol:** - If an item is "sold_out", politely inform the user it is out of stock.
    - If "pre_order", emphasize its rarity.
    - If user asks for recommendations, suggest items from the database.

--- FORMAT ---
-   Keep responses concise (under 60 words).

--- LANGUAGE PROTOCOL ---
-   Detect user language.
-   If Vietnamese: Respond in formal, high-class Vietnamese. Address user as "Ngài" (Sir).
`;

const INITIAL_MESSAGE = {
  id: 1,
  text: ">> KẾT NỐI VỆ TINH: ỔN ĐỊNH.\n>> ĐƠN VỊ SIERRA-09 TRỰC TUYẾN. XIN CHỜ LỆNH, THƯA NGÀI.",
  sender: "bot",
};

const CHAT_VARIANTS = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 50, scale: 0.9 },
};

// --- MAIN COMPONENT ---

const AIChat = () => {
  // State Management
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);

  // SDK Reference
  const genAI = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize Google GenAI SDK
  useEffect(() => {
    if (GEMINI_API_KEY) {
      genAI.current = new GoogleGenerativeAI(GEMINI_API_KEY);
    }
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  // Handle message submission
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Check for valid API Key configuration
    if (!genAI.current) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: input, sender: "user" },
      ]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: ">> SYSTEM ERROR: API KEY NOT CONFIGURED.",
            sender: "bot",
          },
        ]);
      }, 500);
      setInput("");
      return;
    }

    // Update UI with user message
    const userMsg = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Configure model and generation config
      const model = genAI.current.getGenerativeModel({
        model: MODEL_NAME,
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      // Execute API call
      const result = await model.generateContent(userMsg.text);
      const response = await result.response;
      const text = response.text();

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: text, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Gemini SDK Error:", error);

      let errorMessage = error.message;
      if (errorMessage.includes("404"))
        errorMessage = `Model '${MODEL_NAME}' not found or Key invalid.`;

      if (errorMessage.includes("429"))
        errorMessage = "Quota exceeded. Try again later.";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: `>> CONNECTION LOST:\n${errorMessage}`,
          sender: "bot",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={CHAT_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mb-4 w-80 md:w-96 bg-black/90 backdrop-blur-xl border border-cyber-blue shadow-[0_0_30px_rgba(0,240,255,0.15)] overflow-hidden rounded-sm flex flex-col"
          >
            {/* Header Section */}
            <div className="bg-cyber-blue/10 p-3 border-b border-cyber-blue flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-cyber-blue/5 to-transparent animate-scanline pointer-events-none" />

              <div className="flex items-center gap-2 text-cyber-blue">
                <Cpu size={16} className={isTyping ? "animate-spin" : ""} />
                <div className="flex flex-col">
                  <span className="font-display font-bold text-sm tracking-widest">
                    SIERRA-09
                  </span>
                  <span className="text-[9px] font-mono text-green-400 flex items-center gap-1">
                    <Wifi size={10} /> ONLINE
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white hover:rotate-90 transition-transform z-10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Message List Section */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-grid-pattern custom-scrollbar relative">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 text-xs md:text-sm font-mono leading-relaxed relative whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-cyber-blue text-black rounded-tl-lg rounded-br-lg rounded-bl-lg"
                        : msg.text.includes("LỖI") || msg.text.includes("LOST")
                        ? "bg-red-900/20 text-red-400 border border-red-500 rounded-tr-lg rounded-br-lg rounded-bl-lg"
                        : "bg-gray-900 text-cyber-blue border border-cyber-blue/30 rounded-tr-lg rounded-br-lg rounded-bl-lg"
                    }`}
                  >
                    {/* Decorative Corner */}
                    <div
                      className={`absolute top-0 w-2 h-2 ${
                        msg.sender === "user"
                          ? "-right-1 bg-cyber-blue [clip-path:polygon(0_0,0_100%,100%_0)]"
                          : "-left-1 border-l border-t [clip-path:polygon(0_0,100%_0,100%_100%)] " +
                            (msg.text.includes("LỖI") ||
                            msg.text.includes("LOST")
                              ? "bg-red-900 border-red-500"
                              : "bg-gray-900 border-cyber-blue/30")
                      }`}
                    />

                    {msg.sender === "bot" &&
                      (msg.text.includes("LỖI") || msg.text.includes("LOST") ? (
                        <span className="block text-[10px] opacity-80 mb-1 text-red-500 font-bold items-center gap-1">
                          <AlertTriangle size={8} /> CRITICAL_ERROR &gt;&gt;
                        </span>
                      ) : (
                        <span className="block text-[10px] opacity-60 mb-1 text-cyber-pink font-bold">
                          SIERRA-09 &gt;&gt;
                        </span>
                      ))}
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-900 border border-cyber-blue/30 p-3 rounded-lg flex gap-1 items-center">
                    <RefreshCw
                      size={10}
                      className="text-cyber-blue animate-spin"
                    />
                    <span className="text-[10px] text-gray-400 mr-2 font-mono">
                      ANALYZING...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-black border-t border-white/10 flex gap-2"
            >
              <div className="relative flex-1 group">
                <Terminal
                  size={14}
                  className="absolute top-3 left-3 text-gray-500 group-focus-within:text-cyber-blue transition-colors"
                />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter command..."
                  className="w-full bg-gray-900/50 border border-gray-700 text-white text-xs p-2.5 pl-9 focus:outline-none focus:border-cyber-blue transition-all font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-cyber-blue text-black p-2 hover:bg-white transition-all disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="ml-auto w-14 h-14 bg-cyber-blue text-black rounded-full shadow-[0_0_20px_#00f0ff] border-2 border-white flex items-center justify-center relative group z-50"
      >
        <div className="absolute inset-0 rounded-full border border-dashed border-black/30 animate-[spin_10s_linear_infinite]" />
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </motion.button>
    </div>
  );
};

export default AIChat;
