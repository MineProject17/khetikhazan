import React from 'react';
import { motion } from 'motion/react';

interface FarmVisualProps {
  month: number;
  cropHealth: number;
  isRaining?: boolean;
  isWindy?: boolean;
}

export default function FarmVisual({ month, cropHealth, isRaining = false, isWindy = false }: FarmVisualProps) {
  // Determine season based on month
  let seasonColor = '#8b5a2b'; // Default dirt
  let cropOpacity = 0;
  
  if (month >= 1 && month <= 3) {
    // Growing
    seasonColor = '#4ade80'; // Green
    cropOpacity = 0.5;
  } else if (month >= 4 && month <= 5) {
    // Harvest
    seasonColor = '#facc15'; // Yellow
    cropOpacity = 1;
  } else if (month >= 6 && month <= 9) {
    // Monsoon growing
    seasonColor = '#22c55e'; // Darker green
    cropOpacity = 0.8;
  } else if (month >= 10 && month <= 11) {
    // Autumn harvest
    seasonColor = '#eab308'; // Darker yellow
    cropOpacity = 1;
  }

  // Adjust based on health
  const healthFilter = cropHealth < 50 ? 'grayscale(50%) sepia(30%)' : 'none';

  // Crop growth scale based on month
  const getCropScale = () => {
    if (month === 0) return 0;
    if (month >= 1 && month <= 3) return 0.4 + (month * 0.2); // Growing
    if (month >= 4 && month <= 5) return 1.2; // Harvest
    if (month >= 6 && month <= 9) return 0.4 + ((month - 5) * 0.2); // Growing again
    if (month >= 10 && month <= 11) return 1.2; // Harvest again
    return 0;
  };

  const baseScale = getCropScale();
  const finalScale = baseScale * (cropHealth / 100);

  return (
    <div className="relative w-full h-48 sm:h-64 my-6 flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-blue-900/20 to-transparent border border-white/5">
      {/* Rain Effect */}
      {isRaining && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={`rain-${i}`}
              className="absolute w-[1px] h-4 bg-blue-300/60"
              style={{
                left: `${Math.random() * 100}%`,
                top: -20,
              }}
              animate={{
                y: [0, 300],
                x: isWindy ? [0, 50] : 0,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.5,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}

      <motion.div 
        className="relative w-48 h-48 sm:w-64 sm:h-64 z-0"
        style={{ filter: healthFilter }}
        animate={{ rotateX: 60, rotateZ: -45 }}
        transition={{ duration: 1 }}
      >
        {/* Base Land */}
        <div 
          className="absolute inset-0 rounded-2xl shadow-2xl transition-colors duration-1000"
          style={{ backgroundColor: '#5c3a21', border: '4px solid #3e2723' }}
        >
          {/* Grid lines for farm */}
          <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1 p-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <div 
                key={i} 
                className="rounded-sm transition-all duration-1000"
                style={{ 
                  backgroundColor: seasonColor,
                  opacity: cropOpacity > 0 ? cropOpacity : 0.2
                }}
              >
                {/* Crops */}
                {cropOpacity > 0 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: finalScale,
                      rotateZ: isWindy ? [-5, 5, -5] : 0,
                      skewX: isWindy ? [-2, 2, -2] : 0
                    }}
                    transition={{
                      rotateZ: { repeat: Infinity, duration: 1.5 + Math.random(), ease: "easeInOut" },
                      skewX: { repeat: Infinity, duration: 1.5 + Math.random(), ease: "easeInOut" },
                      scale: { duration: 1 }
                    }}
                    className="w-full h-full flex items-center justify-center origin-bottom"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* House / Hut */}
        <div className="absolute top-2 right-2 w-12 h-12 bg-amber-800 rounded-sm shadow-xl transform -rotate-x-90 translate-z-6 origin-bottom">
          <div className="absolute -top-6 -left-2 w-16 h-8 bg-orange-900 rounded-t-lg transform rotate-x-45 origin-bottom" />
        </div>
      </motion.div>

      {/* Weather/Status Overlays */}
      {cropHealth < 40 && (
        <div className="absolute inset-0 bg-red-900/20 pointer-events-none flex items-center justify-center z-20">
          <div className="bg-red-500/80 text-white px-4 py-1 rounded-full text-sm font-bold backdrop-blur-sm animate-pulse">
            POOR CROP HEALTH
          </div>
        </div>
      )}
    </div>
  );
}
