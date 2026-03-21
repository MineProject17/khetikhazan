import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, TrendingUp, AlertTriangle, ShieldCheck, Sprout, Landmark, ArrowRight, RefreshCw, LogOut, Trophy, Award, Volume2, Wifi, WifiOff, Globe, ShieldAlert, Scan } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { GameState, Choice } from '../types';
import { INITIAL_STATE, MONTHS, RANDOM_EVENTS } from '../constants';
import BankSakhi from './BankSakhi';
import Leaderboard, { submitScore } from './Leaderboard';
import LoginScreen from './LoginScreen';
import HealthMeter from './HealthMeter';
import FarmVisual from './FarmVisual';
import UPIModal from './UPIModal';
import VoiceInput from './VoiceInput';
import MandiTicker from './MandiTicker';
import WeatherWidget from './WeatherWidget';
import SoilScanner from './SoilScanner';
import { fetchWeather, WeatherData } from '../services/weather';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { translations, Language } from '../i18n';

export default function Game() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [gameOver, setGameOver] = useState(false);
  const [eventMessage, setEventMessage] = useState<string | null>(null);
  const [consequence, setConsequence] = useState<string | null>(null);
  const [user, setUser] = useState(auth.currentUser);
  
  // New states for UPI
  const [showUPI, setShowUPI] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<Choice | null>(null);
  const [upiAmount, setUpiAmount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [showScanner, setShowScanner] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const loadWeather = async () => {
      const data = await fetchWeather();
      setWeather(data);
    };
    loadWeather();

    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleChoiceClick = (choice: Choice) => {
    if (choice.isUPI && choice.effect.money && choice.effect.money < 0) {
      setUpiAmount(choice.effect.money);
      setPendingChoice(choice);
      setShowUPI(true);
    } else {
      applyChoice(choice);
    }
  };

  const handleUPIComplete = () => {
    setShowUPI(false);
    if (pendingChoice) {
      applyChoice(pendingChoice);
      setPendingChoice(null);
    }
  };

  const handleVoiceCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    const currentMonthData = MONTHS[state.month];
    
    // Simple matching logic: check if spoken text contains keywords from choices
    const matchedChoice = currentMonthData.choices.find(choice => {
      const keywords = choice.text.toLowerCase().split(' ').filter(w => w.length > 3);
      return keywords.some(kw => lowerText.includes(kw));
    });

    if (matchedChoice) {
      handleChoiceClick(matchedChoice);
    } else {
      // If no match, maybe Bank Sakhi can handle it (simulated by just showing a toast or letting the user know)
      alert(`Bank Sakhi heard: "${text}". Please tap a choice or try saying it more clearly.`);
    }
  };

  const applyChoice = (choice: Choice) => {
    let newState = { ...state };
    
    // Apply choice effects
    for (const [key, value] of Object.entries(choice.effect)) {
      if (typeof value === 'number') {
        (newState as any)[key] += value;
      } else {
        (newState as any)[key] = value;
      }
    }

    if (choice.isWise) {
      newState.wiseDecisions += 1;
      newState.score += 10;
    } else {
      newState.score -= 5;
    }

    // Random Event Logic (30% chance after month 0)
    let eventMsg = null;
    if (newState.month > 0 && Math.random() < 0.3) {
      const possibleEvents = RANDOM_EVENTS.filter(e => e.trigger(newState));
      if (possibleEvents.length > 0) {
        const event = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
        eventMsg = event.message;
        
        for (const [key, value] of Object.entries(event.effect)) {
          if (typeof value === 'number') {
            (newState as any)[key] += value;
          } else {
            (newState as any)[key] = value;
          }
        }
      }
    }

    setConsequence(choice.consequence);
    if (eventMsg) setEventMessage(eventMsg);

    // Advance month
    newState.month += 1;

    if (newState.month >= 12) {
      setGameOver(true);
      if (user) {
        submitScore({
          userId: user.uid,
          displayName: user.displayName || user.email?.split('@')[0] || 'Kisan Bhai',
          score: newState.score,
          money: newState.money,
          wiseDecisions: newState.wiseDecisions
        });
      }
    }

    setState(newState);
  };

  const nextTurn = () => {
    setConsequence(null);
    setEventMessage(null);
  };

  const restartGame = () => {
    setState(INITIAL_STATE);
    setGameOver(false);
    setConsequence(null);
    setEventMessage(null);
  };

  if (!user) {
    return <LoginScreen />;
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-[#1a0e05] p-4 sm:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="text-white/60 hover:text-white flex items-center gap-2 text-sm transition-colors"
          >
            <LogOut size={16} />
            {t.signOut}
          </button>
        </div>
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1b4332] rounded-3xl p-8 border border-[#f2c94c]/30 text-center flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#f2c94c] via-yellow-200 to-[#f2c94c]" />
            <Award size={64} className="text-[#f2c94c] mb-4" />
            <h2 className="text-3xl font-bold font-poppins text-white mb-2">{t.gameOver}</h2>
            <p className="text-[#f2c94c] text-xl mb-6">Certificate of Financial Literacy</p>
            
            <div className="grid grid-cols-2 gap-4 w-full mb-6">
              <div className="bg-black/20 p-4 rounded-2xl">
                <p className="text-white/60 text-sm mb-1">Final Balance</p>
                <p className={`text-2xl font-mono ${state.money < 0 ? 'text-red-400' : 'text-emerald-400'}`}>{state.money < 0 ? `-₹${Math.abs(state.money)}` : `₹${state.money}`}</p>
              </div>
              <div className="bg-black/20 p-4 rounded-2xl">
                <p className="text-white/60 text-sm mb-1">FinScore</p>
                <p className="text-2xl font-mono text-[#f2c94c]">{state.score}</p>
              </div>
            </div>

            {/* Impact Analytics Dashboard */}
            <div className="w-full bg-black/20 p-5 rounded-2xl mb-6 text-left space-y-4">
              <h3 className="text-white font-bold mb-2">Impact Analytics</h3>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/70">
                  <span>Risk Management</span>
                  <span>{state.insured ? 'Excellent' : 'Poor'}</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className={`h-full ${state.insured ? 'bg-emerald-400 w-full' : 'bg-red-400 w-1/4'}`} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/70">
                  <span>Credit Health</span>
                  <span>{state.kcc ? 'Excellent' : (state.debt > 10000 ? 'Poor' : 'Fair')}</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className={`h-full ${state.kcc ? 'bg-emerald-400 w-full' : (state.debt > 10000 ? 'bg-red-400 w-1/4' : 'bg-yellow-400 w-1/2')}`} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/70">
                  <span>Savings Habit</span>
                  <span>{state.savings > 0 ? 'Good' : 'Needs Work'}</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className={`h-full ${state.savings > 0 ? 'bg-emerald-400 w-full' : 'bg-red-400 w-1/4'}`} />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl mb-8 flex flex-col items-center">
              <QRCodeSVG value={`https://khetikhazana.in/cert/${user.uid}`} size={100} />
              <p className="text-gray-500 text-xs mt-2 font-medium">{t.scanToVerify}</p>
            </div>

            <button
              onClick={restartGame}
              className="bg-[#f2c94c] text-[#1a0e05] px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors w-full justify-center"
            >
              <RefreshCw size={20} />
              {t.playAgain}
            </button>
          </motion.div>

          <Leaderboard currentScore={state.score} />
        </div>
      </div>
    );
  }

  const currentMonth = MONTHS[state.month];

  return (
    <div className="min-h-screen bg-[#1a0e05] text-white font-mukta pb-24">
      <MandiTicker />
      
      {/* Top Bar / HUD */}
      <div className="sticky top-0 z-40 bg-[#1a0e05]/90 backdrop-blur-md border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="text-[#f2c94c]" />
            <span className="font-poppins font-bold text-lg tracking-wide hidden sm:inline">{t.appTitle}</span>
          </div>
          
          <div className="flex gap-3 sm:gap-6 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar flex-1 justify-center">
            <div className="flex items-center gap-2 bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-500/30">
              <Coins size={16} className="text-emerald-400" />
              <span className={`font-mono font-bold ${state.money < 0 ? 'text-red-400' : 'text-emerald-400'}`}>{state.money < 0 ? `-₹${Math.abs(state.money)}` : `₹${state.money}`}</span>
            </div>
            <div className="flex items-center gap-2 bg-red-900/30 px-3 py-1.5 rounded-full border border-red-500/30">
              <TrendingUp size={16} className="text-red-400 rotate-180" />
              <span className="font-mono font-bold text-red-400">{state.debt < 0 ? `-₹${Math.abs(state.debt)}` : `₹${state.debt}`}</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-900/30 px-3 py-1.5 rounded-full border border-yellow-500/30">
              <Trophy size={16} className="text-[#f2c94c]" />
              <span className="font-mono font-bold text-[#f2c94c]">{state.score}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
              <Globe size={14} className="text-white/60 ml-1" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-xs text-white/80 outline-none cursor-pointer appearance-none pr-2"
              >
                <option value="en" className="bg-[#1a0e05]">EN</option>
                <option value="hi" className="bg-[#1a0e05]">HI</option>
                <option value="pa" className="bg-[#1a0e05]">PA</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-white/5 border border-white/10">
              {isOnline ? (
                <><Wifi size={12} className="text-emerald-400" /> <span className="hidden sm:inline text-emerald-400/80">{t.online}</span></>
              ) : (
                <><WifiOff size={12} className="text-red-400" /> <span className="hidden sm:inline text-red-400/80">{t.offlineSync}</span></>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="text-white/60 hover:text-white flex items-center gap-2 text-sm transition-colors"
            >
              <LogOut size={16} className="sm:hidden" />
              <span className="hidden sm:inline">{t.signOut}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto p-4 sm:p-6 mt-4 relative">
        <UPIModal isOpen={showUPI} amount={upiAmount} onComplete={handleUPIComplete} />
        
        {/* Weather Widget */}
        <WeatherWidget weather={weather} />

        {/* Health Meters */}
        <div className="flex justify-between items-center mb-2 px-4">
          <HealthMeter value={Math.max(0, state.cropHealth)} label={t.cropHealth} color="#34d399" />
          <HealthMeter value={Math.max(0, Math.min(100, Math.floor((state.money / 15000) * 100)))} label={t.finHealth} color="#facc15" />
        </div>

        {/* Farm Visual */}
        <div className="relative">
          <FarmVisual 
            month={state.month} 
            cropHealth={state.cropHealth} 
            isRaining={weather?.current.isRaining}
            isWindy={weather?.current.isWindy}
          />
          {/* Insurance Badge */}
          <div className="absolute top-4 left-4 z-20">
            {state.insured ? (
              <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                <ShieldCheck size={12} /> {t.insured}
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                <ShieldAlert size={12} /> {t.notInsured}
              </div>
            )}
          </div>
          
          {/* Soil Scanner Button */}
          <button
            onClick={() => setShowScanner(true)}
            className="absolute bottom-4 right-4 z-20 bg-emerald-600/80 hover:bg-emerald-500 text-white p-2 rounded-full backdrop-blur-sm border border-emerald-400/30 transition-colors shadow-lg"
            title="Scan Soil Health"
          >
            <Scan size={20} />
          </button>
        </div>

        <SoilScanner 
          isOpen={showScanner} 
          onClose={() => setShowScanner(false)} 
          onComplete={(health) => {
            setState(prev => ({ ...prev, cropHealth: Math.min(100, prev.cropHealth + 10) }));
          }} 
        />

        <AnimatePresence mode="wait">
          {consequence ? (
            <motion.div
              key="consequence"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1b4332] rounded-3xl p-6 sm:p-8 border border-[#f2c94c]/30 shadow-2xl"
            >
              <h3 className="text-2xl font-poppins font-bold mb-4 text-[#f2c94c]">{t.result}</h3>
              <p className="text-lg mb-6 leading-relaxed">{consequence}</p>
              
              {eventMessage && (
                <div className="bg-red-900/40 border border-red-500/50 rounded-2xl p-4 mb-6 flex items-start gap-3">
                  <AlertTriangle className="text-red-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-red-400 mb-1">{t.randomEvent}</h4>
                    <p className="text-red-200 text-sm">{eventMessage}</p>
                  </div>
                </div>
              )}

              <button
                onClick={nextTurn}
                className="w-full bg-[#f2c94c] text-[#1a0e05] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors"
              >
                {t.nextMonth}
                <ArrowRight size={20} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="decision"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-poppins font-bold text-[#f2c94c]">{currentMonth.name}</h2>
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                  {currentMonth.season}
                </span>
              </div>

              <div className="bg-[#1b4332]/50 rounded-3xl p-6 border border-white/10 backdrop-blur-sm relative">
                <button 
                  onClick={() => speakText(currentMonth.description)}
                  className="absolute top-4 right-4 text-white/40 hover:text-[#f2c94c] transition-colors bg-black/20 p-2 rounded-full"
                  title={t.readAloud}
                >
                  <Volume2 size={18} />
                </button>
                <p className="text-lg leading-relaxed pr-8">{currentMonth.description}</p>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-4 flex items-start gap-3">
                <Landmark className="text-blue-400 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-blue-400 mb-1">Bank Sakhi Tip</h4>
                  <p className="text-blue-200 text-sm leading-relaxed">{currentMonth.tip}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                {currentMonth.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChoiceClick(choice)}
                    className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#f2c94c]/50 p-4 rounded-2xl transition-all group flex items-center justify-between"
                  >
                    <span className="font-medium group-hover:text-[#f2c94c] transition-colors">
                      {choice.text}
                    </span>
                    <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 text-[#f2c94c] transition-opacity" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <VoiceInput onCommand={handleVoiceCommand} />
      <BankSakhi context={`Month: ${currentMonth?.name}, Money: ${state.money}, Debt: ${state.debt}, Situation: ${currentMonth?.description}`} lang={lang} />
    </div>
  );
}
