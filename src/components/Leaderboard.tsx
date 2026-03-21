import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { LeaderboardEntry } from '../types';
import { Trophy, Medal, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface LeaderboardProps {
  currentScore?: number;
}

export default function Leaderboard({ currentScore }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('score', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LeaderboardEntry[];
      setEntries(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center text-[#f2c94c] animate-pulse">Loading Top Farmers...</div>;
  }

  return (
    <div className="bg-[#1b4332]/40 border border-[#f2c94c]/20 rounded-2xl p-6 shadow-2xl backdrop-blur-sm max-w-md w-full mx-auto">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Trophy className="text-[#f2c94c]" size={28} />
        <h2 className="text-2xl font-bold text-white font-poppins tracking-wide">Kisan Leaderboard</h2>
      </div>

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            key={entry.id || index}
            className={`flex items-center justify-between p-3 rounded-xl border ${
              entry.userId === auth.currentUser?.uid
                ? 'bg-[#f2c94c]/20 border-[#f2c94c]/50'
                : 'bg-black/20 border-white/5'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#1a0e05] flex items-center justify-center font-bold text-[#f2c94c] border border-[#f2c94c]/30">
                {index === 0 ? <Medal size={16} className="text-yellow-400" /> : 
                 index === 1 ? <Medal size={16} className="text-gray-300" /> : 
                 index === 2 ? <Medal size={16} className="text-amber-600" /> : 
                 index + 1}
              </div>
              <div>
                <p className="text-white font-medium truncate max-w-[120px] sm:max-w-[150px]">
                  {entry.displayName || 'Kisan Bhai'}
                </p>
                <p className="text-xs text-white/50">
                  {entry.wiseDecisions} Wise Choices
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#f2c94c] font-bold font-mono">{entry.score} pts</p>
              <p className={`text-xs font-mono ${entry.money < 0 ? 'text-red-400' : 'text-emerald-400'}`}>{entry.money < 0 ? `-₹${Math.abs(entry.money)}` : `₹${entry.money}`}</p>
            </div>
          </motion.div>
        ))}

        {entries.length === 0 && (
          <div className="text-center text-white/50 py-8">
            No scores yet. Be the first!
          </div>
        )}
      </div>
    </div>
  );
}

export const submitScore = async (entry: Omit<LeaderboardEntry, 'timestamp'>) => {
  try {
    await addDoc(collection(db, 'leaderboard'), {
      ...entry,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error submitting score:", error);
  }
};
