import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface VoiceInputProps {
  onCommand: (text: string) => void;
}

export default function VoiceInput({ onCommand }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-IN'; // English India (could be hi-IN for Hindi)

      rec.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      rec.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript;
        setTranscript(result);
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
        // If we have a final transcript, send it
        if (transcript) {
          onCommand(transcript);
        }
      };

      setRecognition(rec);
    }
  }, [onCommand, transcript]);

  const toggleListening = () => {
    if (!recognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-2">
      {isListening && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-[#1b4332] border border-emerald-500/50 text-white px-4 py-2 rounded-2xl shadow-lg backdrop-blur-md max-w-[200px]"
        >
          <p className="text-xs text-emerald-400 font-bold mb-1 flex items-center gap-2">
            <Loader2 size={12} className="animate-spin" /> Bhashini Listening...
          </p>
          <p className="text-sm truncate">{transcript || "Speak now..."}</p>
        </motion.div>
      )}

      <button
        onClick={toggleListening}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-emerald-600 text-white hover:bg-emerald-500'
        }`}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </button>
    </div>
  );
}
