import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scan, X, CheckCircle2 } from 'lucide-react';

interface SoilScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (health: number) => void;
}

export default function SoilScanner({ isOpen, onClose, onComplete }: SoilScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setScanning(false);
      setProgress(0);
      setResult(null);
    }
  }, [isOpen]);

  const startScan = () => {
    setScanning(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setScanning(false);
        // Generate random result
        const health = Math.floor(Math.random() * 40) + 60; // 60-100
        setResult({
          health,
          nitrogen: Math.floor(Math.random() * 30) + 40,
          phosphorus: Math.floor(Math.random() * 30) + 40,
          potassium: Math.floor(Math.random() * 30) + 40,
          ph: (Math.random() * 2 + 5.5).toFixed(1),
          moisture: Math.floor(Math.random() * 40) + 30,
        });
      }
    }, 100);
  };

  const handleApply = () => {
    if (result) {
      onComplete(result.health);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-[#1b4332] rounded-3xl w-full max-w-md overflow-hidden border border-[#f2c94c]/30 shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
              <div className="flex items-center gap-2">
                <Scan className="text-[#f2c94c]" />
                <h2 className="text-xl font-bold text-white font-poppins">AI Soil Scanner</h2>
              </div>
              <button onClick={onClose} className="text-white/60 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[300px]">
              {!scanning && !result && (
                <div className="text-center">
                  <div className="w-32 h-32 border-4 border-dashed border-emerald-500/50 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-black/20 relative overflow-hidden">
                    <Scan size={48} className="text-emerald-400/50" />
                  </div>
                  <p className="text-emerald-100 mb-6">Point your camera at the soil to analyze its health and nutrient levels.</p>
                  <button
                    onClick={startScan}
                    className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-500 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Scan size={20} />
                    Start Scan
                  </button>
                </div>
              )}

              {scanning && (
                <div className="text-center w-full">
                  <div className="w-48 h-48 border-4 border-emerald-500 rounded-2xl mx-auto mb-6 relative overflow-hidden bg-[#5c3a21]">
                    {/* Simulated camera view of soil */}
                    <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#3e2723 20%, transparent 20%)', backgroundSize: '10px 10px' }} />
                    
                    {/* Scanning laser */}
                    <motion.div
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] z-10"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 animate-pulse">Analyzing Soil...</h3>
                  <div className="w-full bg-black/40 rounded-full h-2 mb-2 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-emerald-400 font-mono">{progress}%</p>
                </div>
              )}

              {result && (
                <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 mb-6">
                    <CheckCircle2 size={32} />
                    <h3 className="text-2xl font-bold">Scan Complete</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                      <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Overall Health</p>
                      <p className="text-3xl font-bold text-[#f2c94c]">{result.health}%</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                      <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Moisture</p>
                      <p className="text-3xl font-bold text-blue-400">{result.moisture}%</p>
                    </div>
                  </div>

                  <div className="bg-black/20 p-4 rounded-2xl border border-white/5 mb-6">
                    <h4 className="text-white/80 font-medium mb-3 text-sm">Nutrient Levels (NPK)</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/60">Nitrogen (N)</span>
                          <span className="text-emerald-400">{result.nitrogen} mg/kg</span>
                        </div>
                        <div className="w-full bg-black/40 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${result.nitrogen}%` }} /></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/60">Phosphorus (P)</span>
                          <span className="text-blue-400">{result.phosphorus} mg/kg</span>
                        </div>
                        <div className="w-full bg-black/40 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${result.phosphorus}%` }} /></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/60">Potassium (K)</span>
                          <span className="text-purple-400">{result.potassium} mg/kg</span>
                        </div>
                        <div className="w-full bg-black/40 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${result.potassium}%` }} /></div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleApply}
                    className="w-full bg-[#f2c94c] text-[#1a0e05] py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
                  >
                    Apply Recommendations (+10 Health)
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
