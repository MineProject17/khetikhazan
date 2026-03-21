import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Smartphone, CheckCircle2, Loader2 } from 'lucide-react';

interface UPIModalProps {
  isOpen: boolean;
  amount: number;
  onComplete: () => void;
}

export default function UPIModal({ isOpen, amount, onComplete }: UPIModalProps) {
  const [step, setStep] = useState<'pin' | 'processing' | 'success'>('pin');
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('pin');
      setPin('');
    }
  }, [isOpen]);

  const handlePinEntry = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        setStep('processing');
        setTimeout(() => {
          setStep('success');
          setTimeout(() => {
            onComplete();
          }, 1500);
        }, 2000);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-[#1a0e05] p-6 text-center relative">
              <Smartphone className="absolute top-4 left-4 text-white/40" size={24} />
              <ShieldCheck className="absolute top-4 right-4 text-emerald-400" size={24} />
              <h2 className="text-white font-poppins font-bold text-xl mb-1">BHIM UPI</h2>
              <p className="text-white/60 text-sm">Secure Payment Gateway</p>
            </div>

            {/* Body */}
            <div className="p-6 text-center bg-gray-50">
              <p className="text-gray-500 text-sm mb-2">Paying to KhetiKhazana</p>
              <p className="text-4xl font-mono font-bold text-gray-900 mb-8">₹{Math.abs(amount)}</p>

              {step === 'pin' && (
                <div className="space-y-6">
                  <p className="text-sm font-medium text-gray-600">ENTER 4-DIGIT UPI PIN</p>
                  <div className="flex justify-center gap-4 mb-8">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full border-2 ${
                          i < pin.length ? 'bg-gray-900 border-gray-900' : 'border-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Numpad */}
                  <div className="grid grid-cols-3 gap-4 max-w-[240px] mx-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'x'].map((num, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (num === 'x') setPin(pin.slice(0, -1));
                          else if (num !== '') handlePinEntry(num.toString());
                        }}
                        className={`h-12 rounded-xl text-xl font-medium ${
                          num === '' ? 'invisible' : 'bg-white shadow-sm hover:bg-gray-100 active:bg-gray-200 text-gray-900'
                        }`}
                      >
                        {num === 'x' ? '⌫' : num}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 'processing' && (
                <div className="py-12 flex flex-col items-center">
                  <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
                  <p className="text-gray-600 font-medium">Processing Payment...</p>
                  <p className="text-gray-400 text-sm mt-2">Please do not close this window</p>
                </div>
              )}

              {step === 'success' && (
                <div className="py-12 flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <CheckCircle2 className="text-emerald-500 mb-4" size={64} />
                  </motion.div>
                  <p className="text-gray-900 font-bold text-xl">Payment Successful</p>
                  <p className="text-gray-500 text-sm mt-2">Transaction ID: TXN{Math.floor(Math.random() * 1000000000)}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
