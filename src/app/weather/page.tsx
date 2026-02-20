"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getDetailedWeather, getUserLocation, ForecastData, ForecastDay } from "@/utils/weatherUtils";

const WeatherPage = () => {
  const [weather, setWeather] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(false);

        const location = await getUserLocation();
        if (!location) {
          setError(true);
          setLoading(false);
          return;
        }

        const weatherData = await getDetailedWeather(location.latitude, location.longitude);
        if (weatherData) {
          setWeather(weatherData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getDayName = (dateString: string): string => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-5xl mb-4">⏳</div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading weather...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-neutral-900 dark:to-neutral-800 flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-5xl">❌</div>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">Unable to load weather</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="text-lg">←</span>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const current = weather.current;
  const forecast = weather.forecast;
  const todayForecast = forecast[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 dark:from-neutral-900 dark:via-blue-900/20 dark:to-neutral-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md border-b border-blue-200 dark:border-blue-900/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            <span className="text-xl">←</span>
            <span className="hidden sm:inline">Back</span>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Weather</h1>
          <div className="w-12"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Current Weather Card */}
        <div className="bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 dark:from-blue-600 dark:via-cyan-600 dark:to-blue-700 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 sm:p-12 text-white">
            {/* Location and Day */}
            <div className="mb-8">
              <p className="text-blue-100 text-lg mb-2">{current.location}</p>
              <p className="text-blue-100 text-sm">{getDayName(forecast[0].date)}</p>
            </div>

            {/* Large Temperature Display */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="text-7xl sm:text-8xl font-bold leading-none mb-4">
                  {current.temperature}°C
                </div>
                <p className="text-blue-100 text-xl">{current.condition}</p>
              </div>
            </div>

            {/* Large Weather Emoji */}
            <div className="text-9xl mb-4 inline-block animate-bounce">{current.emoji}</div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-blue-300/50">
              <div className="text-center">
                <div className="text-3xl mb-2">💨</div>
                <p className="text-blue-100 text-sm">Wind Speed</p>
                <p className="text-2xl font-bold">{current.windSpeed}</p>
                <p className="text-blue-100 text-xs">km/h</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💧</div>
                <p className="text-blue-100 text-sm">Humidity</p>
                <p className="text-2xl font-bold">{current.humidity}</p>
                <p className="text-blue-100 text-xs">%</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🌡️</div>
                <p className="text-blue-100 text-sm">Feels Like</p>
                <p className="text-2xl font-bold">{Math.round(current.temperature - 2)}</p>
                <p className="text-blue-100 text-xs">°C</p>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">7-Day Forecast</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
              {forecast.map((day: ForecastDay, index: number) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-neutral-700 dark:to-neutral-700 rounded-2xl p-4 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Day name */}
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                    {getDayName(day.date).substring(0, 3)}
                  </p>

                  {/* Weather emoji */}
                  <p className="text-4xl mb-3">{day.emoji}</p>

                  {/* Temperature range */}
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {day.tempMax}°
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{day.tempMin}°</p>

                  {/* Weather condition - small text */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-2 line-clamp-2">
                    {day.condition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Today's Info */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-lg p-6 sm:p-8">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Today</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-600 dark:text-neutral-400">High</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{todayForecast.tempMax}°C</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-600 dark:text-neutral-400">Low</span>
                <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{todayForecast.tempMin}°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400">Condition</span>
                <span className="text-right">{todayForecast.emoji} {todayForecast.condition}</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-lg p-6 sm:p-8">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Tips</h3>
            <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
              <li className="flex items-start gap-3">
                <span className="text-lg">☀️</span>
                <span>Apply sunscreen if going outdoors</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg">💨</span>
                <span>Wind speed is {current.windSpeed} km/h - secure loose items</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg">💧</span>
                <span>Humidity is at {current.humidity}% - stay hydrated</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-neutral-500 dark:text-neutral-400 pb-8">
          <p>Weather data last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
