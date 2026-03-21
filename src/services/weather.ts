export interface WeatherData {
  current: {
    temperature: number;
    weatherCode: number;
    description: string;
    isRaining: boolean;
    isWindy: boolean;
  };
  forecast: {
    date: string;
    maxTemp: number;
    minTemp: number;
    weatherCode: number;
    description: string;
  }[];
}

// WMO Weather interpretation codes (https://open-meteo.com/en/docs)
const getWeatherDescription = (code: number): { desc: string, isRaining: boolean, isWindy: boolean } => {
  if (code === 0) return { desc: 'Clear sky', isRaining: false, isWindy: false };
  if (code === 1 || code === 2 || code === 3) return { desc: 'Partly cloudy', isRaining: false, isWindy: false };
  if (code === 45 || code === 48) return { desc: 'Fog', isRaining: false, isWindy: false };
  if (code >= 51 && code <= 55) return { desc: 'Drizzle', isRaining: true, isWindy: false };
  if (code >= 61 && code <= 65) return { desc: 'Rain', isRaining: true, isWindy: false };
  if (code >= 71 && code <= 77) return { desc: 'Snow', isRaining: false, isWindy: false };
  if (code >= 80 && code <= 82) return { desc: 'Rain showers', isRaining: true, isWindy: true };
  if (code >= 95 && code <= 99) return { desc: 'Thunderstorm', isRaining: true, isWindy: true };
  return { desc: 'Unknown', isRaining: false, isWindy: false };
};

export async function fetchWeather(): Promise<WeatherData | null> {
  try {
    // Coordinates for Ludhiana, Punjab (a major agricultural hub in India)
    const lat = 30.9010;
    const lon = 75.8573;
    
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    
    const currentInfo = getWeatherDescription(data.current.weather_code);
    // Add wind logic based on wind speed (e.g., > 15 km/h is windy)
    const isWindy = currentInfo.isWindy || data.current.wind_speed_10m > 15;

    const forecast = data.daily.time.slice(1, 4).map((time: string, index: number) => {
      // index + 1 because we skip today (index 0)
      const dailyIndex = index + 1;
      return {
        date: new Date(time).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
        maxTemp: Math.round(data.daily.temperature_2m_max[dailyIndex]),
        minTemp: Math.round(data.daily.temperature_2m_min[dailyIndex]),
        weatherCode: data.daily.weather_code[dailyIndex],
        description: getWeatherDescription(data.daily.weather_code[dailyIndex]).desc
      };
    });

    return {
      current: {
        temperature: Math.round(data.current.temperature_2m),
        weatherCode: data.current.weather_code,
        description: currentInfo.desc,
        isRaining: currentInfo.isRaining,
        isWindy: isWindy
      },
      forecast
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}
