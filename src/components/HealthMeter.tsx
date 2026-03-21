import React from 'react';

interface HealthMeterProps {
  value: number;
  label: string;
  color: string;
}

export default function HealthMeter({ value, label, color }: HealthMeterProps) {
  // Calculate SVG stroke dasharray for half circle
  const radius = 40;
  const circumference = radius * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-14 overflow-hidden">
        <svg className="w-24 h-24 transform -rotate-180" viewBox="0 0 100 100">
          {/* Background Track */}
          <path
            d="M 10,50 a 40,40 0 1,1 80,0"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Progress Track */}
          <path
            d="M 10,50 a 40,40 0 1,1 80,0"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute bottom-0 left-0 w-full text-center">
          <span className="text-lg font-bold font-mono" style={{ color }}>{value}%</span>
        </div>
      </div>
      <span className="text-xs font-medium text-white/60 mt-1 uppercase tracking-wider">{label}</span>
    </div>
  );
}
