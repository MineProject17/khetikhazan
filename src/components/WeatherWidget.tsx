import React from 'react';
import { Cloud, CloudRain, Sun, Wind, CloudLightning, Droplets } from 'lucide-react';
import { WeatherData } from '../services/weather';

interface WeatherWidgetProps {
  weather: WeatherData | null;
}

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  if (!weather) {
    return (
      <div className="bg-[#1b4332]/50 border border-white/10 rounded-2xl p-4 mb-4 animate-pulse flex items-center justify-center">
        <span className="text-white/50 text-sm">Loading weather data...</span>
      </div>
    );
  }

  const getWeatherIcon = (desc: string, className = "w-5 h-5") => {
    const d = desc.toLowerCase();
    if (d.includes('rain') || d.includes('drizzle')) return <CloudRain className={className} />;
    if (d.includes('thunder')) return <CloudLightning className={className} />;
    if (d.includes('cloud') || d.includes('fog')) return <Cloud className={className} />;
    if (d.includes('snow')) return <Droplets className={className} />;
    return <Sun className={className} />;
  };

  return (
    <div className="bg-[#1b4332]/50 border border-white/10 rounded-2xl p-4 mb-4 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Ludhiana, Punjab</h3>
          <div className="flex items-center gap-2">
            {getWeatherIcon(weather.current.description, "w-6 h-6 text-[#f2c94c]")}
            <span className="text-2xl font-bold text-white">{weather.current.temperature}°C</span>
          </div>
          <span className="text-sm text-white/80">{weather.current.description}</span>
        </div>
        
        {/* Current Conditions Badges */}
        <div className="flex flex-col gap-1 items-end">
          {weather.current.isRaining && (
            <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full border border-blue-500/30 flex items-center gap-1">
              <CloudRain size={10} /> Raining
            </span>
          )}
          {weather.current.isWindy && (
            <span className="bg-gray-500/20 text-gray-300 text-xs px-2 py-0.5 rounded-full border border-gray-500/30 flex items-center gap-1">
              <Wind size={10} /> Windy
            </span>
          )}
        </div>
      </div>

      {/* 3-Day Forecast */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
        {weather.forecast.map((day, idx) => (
          <div key={idx} className="flex flex-col items-center bg-black/20 rounded-lg p-2">
            <span className="text-[10px] text-white/60 font-medium mb-1">{day.date}</span>
            {getWeatherIcon(day.description, "w-4 h-4 text-white/80 mb-1")}
            <div className="flex gap-1 text-xs">
              <span className="text-white font-bold">{day.maxTemp}°</span>
              <span className="text-white/50">{day.minTemp}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
