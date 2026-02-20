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
      <div className="px-4 py-2 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 border border-blue-200 dark:border-blue-800 animate-pulse">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌤️</span>
          <div className="flex flex-col gap-1">
            <div className="h-4 w-20 bg-blue-300 dark:bg-blue-700 rounded"></div>
            <div className="h-3 w-16 bg-blue-200 dark:bg-blue-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="px-4 py-2 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-100 dark:from-neutral-800 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
          <span className="text-2xl">🌐</span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold">Location unavailable</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">Check permissions</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href="/weather" className="block group">
      <div className="px-4 py-3 rounded-2xl bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-100 dark:from-blue-900/50 dark:via-cyan-900/50 dark:to-blue-900/50 border border-blue-200 dark:border-blue-800 hover:shadow-lg hover:shadow-blue-300/50 dark:hover:shadow-blue-900/50 transition-all duration-300 cursor-pointer transform group-hover:scale-105">
        <div className="flex items-center gap-4">
          {/* Large weather emoji */}
          <div className="text-5xl flex-shrink-0 group-hover:animate-bounce">
            {weather.emoji}
          </div>

          {/* Weather info */}
          <div className="flex flex-col gap-1 flex-grow">
            {/* Temperature - main highlight */}
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 leading-tight">
              {weather.temperature}°C
            </div>

            {/* Location name */}
            <div className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              {weather.location}
            </div>

            {/* Weather condition - hidden on mobile, show on tablet+ */}
            <div className="text-xs text-blue-700 dark:text-blue-300 hidden sm:block">
              {weather.condition}
            </div>
          </div>

          {/* Click indicator - desktop only */}
          <div className="hidden md:flex flex-col items-center gap-1 text-xs text-blue-600 dark:text-blue-400 opacity-70 group-hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>View</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WeatherWidget;
