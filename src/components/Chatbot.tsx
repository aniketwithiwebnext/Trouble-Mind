import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Command, Sparkles, MapPin, Phone, HelpCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: "Hey! I'm the Troubled Mind assistant, streaming from Antioch, TN. Need styling hacks, hoodie weights, or discount details?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const testSuggestions = [
    "Resilience hoodie weight?",
    "Promo code?",
    "Where are you based?",
    "How to contact waniis?"
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error('Server issues');
      }

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.text || "Pardon, something dropped. How else can Troubled Mind style you today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      // Fallback response
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "Pardon me! The network from Antioch was slightly delayed but we've got you covered. Quick tip: use discount code **MIND20** for 20% off all distressed apparel!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      
      {/* Floating expanded chat box */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[440px] sm:h-[480px] max-h-[calc(100vh-140px)] bg-black/95 backdrop-blur-md border border-white/5 rounded-none shadow-2xl flex flex-col overflow-hidden mb-4 animate-fade-in text-left">
          
          {/* Header */}
          <div className="p-4 bg-[#0c0c0c] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-none border border-white/10 bg-transparent flex items-center justify-center text-white font-extrabold text-[10px] font-mono shadow-md animate-pulse">
                TM
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans">
                  TROUBLED MIND COURIER
                </h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-none bg-white" />
                  <span className="text-[9px] font-mono text-zinc-400 capitalize">
                    Live from Antioch, TN
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white p-1 rounded-none cursor-pointer focus:outline-none"
              title="Close chat assistance"
            >
              <X size={14} />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-none text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-zinc-200 text-black font-semibold'
                      : 'bg-black/40 text-zinc-300 border border-white/5 font-sans'
                  }`}
                >
                  <span className="whitespace-pre-wrap">{msg.text}</span>
                </div>
                <span className="text-[8px] font-mono text-zinc-650 mt-1 uppercase tracking-widest">
                  {msg.time}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col mr-auto max-w-[85%] items-start animate-pulse">
                <div className="p-3 bg-black/40 border border-white/5 rounded-none text-[10px] text-zinc-550 flex items-center gap-1.5 font-mono uppercase tracking-widest">
                  <div className="flex gap-1">
                    <span className="w-1 h-1 rounded-none bg-zinc-500 animate-bounce" />
                    <span className="w-1 h-1 rounded-none bg-zinc-500 animate-bounce delay-100" />
                    <span className="w-1 h-1 rounded-none bg-zinc-500 animate-bounce delay-200" />
                  </div>
                  <span>SECURE AI PREPARING SPEC DETAILS...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 py-2 border-t border-white/5 bg-transparent">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {testSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug)}
                  className="bg-black/40 hover:bg-white hover:text-black border border-white/5 hover:border-transparent text-zinc-400 text-[9px] font-mono uppercase px-2.5 py-1 rounded-none transition-colors whitespace-nowrap cursor-pointer tracking-wider"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Input field footer */}
          <div className="p-3 bg-[#0c0c0c] border-t border-white/5 flex items-center gap-2">
            <input
              type="text"
              placeholder="Inquire on streetwear/orders..."
              value={inputValue}
              aria-label="Ask streetwear assistant"
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-transparent border border-white/10 rounded-none text-xs text-white px-3 py-2.5 focus:outline-none focus:border-white placeholder-zinc-500 font-mono text-[11px]"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              className="p-2.5 bg-transparent text-white border border-white/10 hover:border-white hover:bg-[#e5e5e5] hover:text-black rounded-none cursor-pointer focus:outline-none flex items-center justify-center transition"
              title="Transmit message"
            >
              <Send size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Primary Floating Action Bubble */}
      <button
        id="chatbot-action-bubble"
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-black hover:bg-zinc-900 border border-white/10 text-white rounded-none flex items-center justify-center shadow-2xl transition-all active:scale-95 duration-200 cursor-pointer"
        title="Open assistance"
      >
        {isOpen ? <X size={15} /> : <MessageSquare size={15} />}
      </button>
    </div>
  );
}
