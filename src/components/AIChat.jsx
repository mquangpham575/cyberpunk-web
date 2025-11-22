import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Cpu, Terminal } from "lucide-react";

// --- CONFIGURATION & UTILS ---

const INITIAL_MESSAGE = {
  id: 1,
  text: "Kết nối an toàn. Tôi là AI hỗ trợ Arasaka. Bạn cần tìm thông tin gì?",
  sender: "bot",
};

const CHAT_VARIANTS = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 50, scale: 0.9 },
};

/**
 * Processes user input to generate a bot response.
 * Handles basic math and greetings.
 */
const getBotResponse = (input) => {
  const text = input.toLowerCase().trim();

  // 1. MATH PROTOCOL: Strict whitelist regex for security
  const mathRegex = /^[\d\s\+\-\*\/\(\)\.]+$/;
  const hasOperator = /[\+\-\*\/]/.test(text);

  if (hasOperator && mathRegex.test(text)) {
    try {
      // Function constructor is safer than eval() when input is sanitized
      // eslint-disable-next-line no-new-func
      const result = new Function("return " + text)();

      if (Number.isFinite(result)) {
        const formatted = Number.isInteger(result) ? result : result.toFixed(2);
        return `>>> ĐANG XỬ LÝ DỮ LIỆU SỐ...\n>>> PHÉP TÍNH: [ ${text} ]\n>>> KẾT QUẢ: ${formatted}`;
      }
    } catch (e) {
      // Ignore syntax errors
    }
  }

  // 2. CONVERSATION PROTOCOL
  if (["xin chào", "hi", "hello"].some((greeting) => text.includes(greeting))) {
    return "Chào Netrunner. Hệ thống đang trực tuyến.";
  }

  // 3. FALLBACK
  return "Lệnh không xác định. Vui lòng nhập phép tính hoặc lời chào.";
};

// --- MAIN COMPONENT ---

const AIChat = () => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);

  // Refs
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: "user" };

    // Optimistic UI update
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate Network Delay
    setTimeout(() => {
      const responseText = getBotResponse(userMsg.text);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: responseText, sender: "bot" },
      ]);
      setIsTyping(false);
    }, 1000);
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
            className="mb-4 w-80 md:w-96 bg-black/80 backdrop-blur-xl border border-cyber-blue shadow-[0_0_20px_rgba(0,240,255,0.2)] overflow-hidden rounded-sm flex flex-col"
          >
            {/* --- CHAT HEADER --- */}
            <div className="bg-cyber-blue/10 p-3 border-b border-cyber-blue flex justify-between items-center">
              <div className="flex items-center gap-2 text-cyber-blue">
                <Cpu size={16} className="animate-pulse" />
                <span className="font-display font-bold text-sm tracking-widest">
                  NETRUNNER_AI_V1
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white hover:rotate-90 transition-transform"
              >
                <X size={18} />
              </button>
            </div>

            {/* --- MESSAGE LIST --- */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-grid-pattern custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`
                    max-w-[85%] p-3 text-xs md:text-sm font-mono leading-relaxed relative whitespace-pre-line
                    ${
                      msg.sender === "user"
                        ? "bg-cyber-blue text-black rounded-tl-lg rounded-br-lg rounded-bl-lg"
                        : "bg-gray-900 text-cyber-blue border border-cyber-blue/30 rounded-tr-lg rounded-br-lg rounded-bl-lg"
                    }
                  `}
                  >
                    {/* Decorative Corner triangle */}
                    <div
                      className={`absolute top-0 w-2 h-2 ${
                        msg.sender === "user"
                          ? "-right-1 bg-cyber-blue [clip-path:polygon(0_0,0_100%,100%_0)]"
                          : "-left-1 bg-gray-900 border-l border-t border-cyber-blue/30 [clip-path:polygon(0_0,100%_0,100%_100%)]"
                      }`}
                    />

                    {/* Bot Label */}
                    {msg.sender === "bot" && (
                      <span className="block text-[10px] opacity-50 mb-1 text-cyber-pink">
                        SYSTEM &gt;&gt;
                      </span>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-900 border border-cyber-blue/30 p-3 rounded-tr-lg rounded-br-lg rounded-bl-lg flex gap-1 items-center">
                    {[0, 0.2, 0.4].map((delay) => (
                      <span
                        key={delay}
                        className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* --- INPUT AREA --- */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-black border-t border-white/10 flex gap-2"
            >
              <div className="relative flex-1">
                <Terminal
                  size={14}
                  className="absolute top-3 left-3 text-gray-500"
                />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập lệnh hoặc phép tính..."
                  className="w-full bg-gray-900/50 border border-gray-700 text-white text-xs p-2.5 pl-9 focus:outline-none focus:border-cyber-blue transition-colors font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-cyber-blue text-black p-2 hover:bg-white transition-colors disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- TOGGLE BUTTON --- */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="ml-auto w-14 h-14 bg-cyber-blue text-black rounded-full shadow-[0_0_20px_#00f0ff] border-2 border-white flex items-center justify-center relative group"
      >
        <div className="absolute inset-0 rounded-full border border-dashed border-black/30 animate-[spin_10s_linear_infinite]" />
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}

        {!isOpen && (
          <span className="absolute right-full mr-4 bg-black text-cyber-blue text-xs px-2 py-1 border border-cyber-blue whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            NEED HELP?
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default AIChat;
