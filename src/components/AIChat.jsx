import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Cpu, Terminal } from "lucide-react";

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Kết nối an toàn. Tôi là AI hỗ trợ Arasaka. Bạn cần tìm thông tin gì?",
      sender: "bot",
    },
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- LOGIC TRẢ LỜI ĐÃ ĐƯỢC TỐI GIẢN ---
  const generateResponse = (text) => {
    const lowerText = text.toLowerCase().trim();

    // 1. KIỂM TRA TOÁN HỌC (Giữ nguyên logic tính toán)
    const mathChars = /^[\d\s\+\-\*\/\(\)\.]+$/;
    // Phải có ít nhất 1 toán tử để tránh nhận nhầm năm "2077" là phép tính
    const hasOperator = /[\+\-\*\/]/.test(lowerText);

    if (hasOperator && mathChars.test(lowerText)) {
      try {
        // Sử dụng 'new Function' an toàn hơn 'eval'
        const result = new Function("return " + lowerText)();

        if (Number.isFinite(result)) {
          const formattedResult = Number.isInteger(result)
            ? result
            : result.toFixed(2);
          return `>>> ĐANG XỬ LÝ DỮ LIỆU SỐ...\n>>> PHÉP TÍNH: [ ${lowerText} ]\n>>> KẾT QUẢ: ${formattedResult}`;
        }
      } catch (error) {
        // Lỗi cú pháp toán học -> bỏ qua
      }
    }

    // 2. HỘI THOẠI: CHỈ GIỮ LẠI CHÀO HỎI
    if (
      lowerText.includes("xin chào") ||
      lowerText.includes("hi") ||
      lowerText.includes("hello")
    ) {
      return "Chào Netrunner. Hệ thống đang trực tuyến.";
    }

    // 3. MẶC ĐỊNH (Khi không phải toán hay chào hỏi)
    return "Lệnh không xác định. Vui lòng nhập phép tính hoặc lời chào.";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateResponse(userMsg.text);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: botResponse, sender: "bot" },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="mb-4 w-80 md:w-96 bg-black/80 backdrop-blur-xl border border-cyber-blue shadow-[0_0_20px_rgba(0,240,255,0.2)] overflow-hidden rounded-sm"
          >
            {/* Header */}
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

            {/* Message List */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-grid-pattern">
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
                    <div
                      className={`absolute top-0 w-2 h-2 ${
                        msg.sender === "user"
                          ? "-right-1 bg-cyber-blue [clip-path:polygon(0_0,0_100%,100%_0)]"
                          : "-left-1 bg-gray-900 border-l border-t border-cyber-blue/30 [clip-path:polygon(0_0,100%_0,100%_100%)]"
                      }`}
                    />

                    {msg.sender === "bot" && (
                      <span className="block text-[10px] opacity-50 mb-1 text-cyber-pink">
                        SYSTEM &gt;&gt;
                      </span>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-900 border border-cyber-blue/30 p-3 rounded-tr-lg rounded-br-lg rounded-bl-lg flex gap-1 items-center">
                    <span
                      className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce"
                      style={{ animationDelay: "0s" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
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
                className="bg-cyber-blue text-black p-2 hover:bg-white transition-colors disabled:opacity-50"
                disabled={!input.trim()}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="ml-auto w-14 h-14 bg-cyber-blue text-black rounded-full shadow-[0_0_20px_#00f0ff] border-2 border-white flex items-center justify-center relative group"
      >
        <div className="absolute inset-0 rounded-full border border-dashed border-black/30 animate-[spin_10s_linear_infinite]" />
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && (
          <span className="absolute right-full mr-4 bg-black text-cyber-blue text-xs px-2 py-1 border border-cyber-blue whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            NEED HELP?
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default AIChat;
