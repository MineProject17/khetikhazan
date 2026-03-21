import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, MessageSquare, Volume2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { translations, Language } from '../i18n';

interface BankSakhiProps {
  context: string;
  lang: Language;
}

export default function BankSakhi({ context, lang }: BankSakhiProps) {
  const t = translations[lang];
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([
    { text: "Namaste kisan bhai/behan! Main aapki Bank Sakhi hoon. Aaj main aapki kya madad kar sakti hoon?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are Bank Sakhi, a friendly and knowledgeable financial advisor for Indian farmers. 
      You speak in ${lang === 'hi' ? 'Hindi' : lang === 'pa' ? 'Punjabi' : 'Hinglish (a mix of Hindi and English written in English script)'}.
      Keep your answers short, practical, and encouraging.
      Current Game Context: ${context}
      User Question: ${userMessage}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-preview',
        contents: prompt,
      });

      setMessages(prev => [...prev, { text: response.text || "Main abhi samajh nahi paayi. Kripya dobara poochein.", isBot: true }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { text: "Network samasya hai. Kripya thodi der baad koshish karein.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-[#f2c94c] text-[#1a0e05] p-4 rounded-full shadow-lg hover:bg-yellow-400 transition-colors z-50 flex items-center justify-center gap-2"
      >
        <MessageSquare size={24} />
        <span className="font-bold hidden sm:inline">{t.bankSakhi}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 right-4 w-80 sm:w-96 bg-[#1a0e05] border border-[#f2c94c]/30 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
            style={{ maxHeight: '60vh' }}
          >
            <div className="bg-[#1b4332] p-4 flex justify-between items-center border-b border-[#f2c94c]/20">
              <div className="flex items-center gap-2 text-white">
                <Bot size={20} className="text-[#f2c94c]" />
                <h3 className="font-semibold font-poppins">{t.bankSakhi}</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1a0e05]/95">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.isBot
                        ? 'bg-[#1b4332] text-white rounded-tl-none'
                        : 'bg-[#f2c94c] text-[#1a0e05] rounded-tr-none font-medium'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#1b4332] text-white p-3 rounded-2xl rounded-tl-none text-sm animate-pulse">
                    Soch rahi hoon...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-[#1a0e05] border-t border-[#f2c94c]/20 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t.askQuestion}
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-[#f2c94c]/50"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-[#f2c94c] text-[#1a0e05] p-2 rounded-full disabled:opacity-50 hover:bg-yellow-400 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
