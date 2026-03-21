import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PRICES = [
  { crop: 'Wheat (Rabi)', price: 2125, trend: 'up' },
  { crop: 'Rice (Kharif)', price: 2930, trend: 'down' },
  { crop: 'Maize', price: 1850, trend: 'up' },
  { crop: 'Soybean', price: 4600, trend: 'up' },
  { crop: 'Cotton', price: 5800, trend: 'down' },
  { crop: 'Mustard', price: 5450, trend: 'up' },
  { crop: 'Gram (Chana)', price: 5335, trend: 'down' },
];

export default function MandiTicker() {
  return (
    <div className="bg-[#1a0e05] border-b border-white/10 text-xs py-1.5 overflow-hidden flex items-center relative z-50">
      <div className="bg-[#f2c94c] text-[#1a0e05] font-bold px-3 py-1 z-10 shadow-[5px_0_10px_rgba(26,14,5,1)]">
        LIVE MANDI
      </div>
      <div className="flex-1 overflow-hidden relative h-6 flex items-center">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex whitespace-nowrap absolute left-0"
        >
          {/* Double the array for seamless looping */}
          {[...PRICES, ...PRICES].map((p, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-1.5">
              <span className="text-white/60 font-medium">{p.crop}:</span>
              <span className="font-mono text-white font-bold">₹{p.price}/qtl</span>
              {p.trend === 'up' ? (
                <TrendingUp size={14} className="text-emerald-400" />
              ) : (
                <TrendingDown size={14} className="text-red-400" />
              )}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
