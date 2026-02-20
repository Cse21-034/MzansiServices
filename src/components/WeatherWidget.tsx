"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
          // Store in localStorage for detail page
          localStorage.setItem(
            "userWeatherData",
            JSON.stringify({
              ...weatherData,
              latitude: location.latitude,
              longitude: location.longitude,
              fetchedAt: new Date().toISOString(),
            })
          );
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
      <div className="flex items-center gap-1 px-2 py-1">
        <span className="text-lg animate-pulse">🌤️</span>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex items-center gap-1 px-2 py-1">
        <span className="text-lg">🌐</span>
      </div>
    );
  }

  return (
    <Link href="/weather" className="block group hover:opacity-80 transition-opacity">
      <div className="flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer">
        {/* Weather emoji */}
        <div className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
          {weather.emoji}
        </div>

        {/* Temperature and location in one line */}
        <div className="flex items-baseline gap-1 flex-grow min-w-0">
          {/* Temperature */}
          <div className="text-sm font-bold text-neutral-900 dark:text-white whitespace-nowrap">
            {weather.temperature}°
          </div>

          {/* Location - small text */}
          <div className="text-xs text-neutral-600 dark:text-neutral-300 truncate">
            {weather.location}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WeatherWidget;
