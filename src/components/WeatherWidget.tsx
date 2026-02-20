"use client";

import React, { useEffect, useState } from "react";
import { getWeather, getUserLocation, WeatherData } from "@/utils/weatherUtils";

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(false);

        // Get user location
        const location = await getUserLocation();

        if (!location) {
          setError(true);
          setLoading(false);
          return;
        }

        // Get weather for that location
        const weatherData = await getWeather(location.latitude, location.longitude);

        if (weatherData) {
          setWeather(weatherData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Weather widget error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center gap-2 text-xs sm:text-sm">
        <span className="animate-pulse">⏳</span>
        <span className="hidden sm:inline">Loading weather...</span>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 flex items-center gap-1 text-xs sm:text-sm cursor-help" title="Unable to load weather. Check location permissions.">
        <span>🌐</span>
        <span className="hidden sm:inline">Location unavailable</span>
      </div>
    );
  }

  return (
    <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2">
        {/* Weather emoji */}
        <span className="text-lg sm:text-2xl flex-shrink-0">{weather.emoji}</span>

        {/* Weather info - responsive layout */}
        <div className="flex flex-col gap-0.5">
          {/* Location name - hidden on very small screens, show abbreviation */}
          <div className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
            <span className="hidden md:inline">{weather.location}</span>
            <span className="md:hidden">
              {weather.location.length > 12 ? weather.location.substring(0, 10) + "..." : weather.location}
            </span>
          </div>

          {/* Temperature and condition */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {weather.temperature}°C
            </span>
            <span className="text-neutral-600 dark:text-neutral-400 hidden sm:inline text-xs">
              {weather.condition}
            </span>
          </div>

          {/* Additional info on desktop */}
          <div className="hidden lg:flex gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span>💨 {weather.windSpeed} km/h</span>
            <span>💧 {weather.humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
