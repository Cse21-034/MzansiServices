/**
 * Weather utility functions
 * Uses Open-Meteo API (free, no API key required)
 */

export interface WeatherData {
  temperature: number;
  condition: string;
  emoji: string;
  icon: string;
  location: string;
  windSpeed: number;
  humidity: number;
}

export interface ForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  emoji: string;
  icon: string;
  weatherCode: number;
}

export interface ForecastData {
  current: WeatherData;
  forecast: ForecastDay[];
}

// Map WMO weather codes to condition and emoji
const WMO_CODE_MAP: { [key: number]: { condition: string; emoji: string; icon: string } } = {
  0: { condition: "Sunny", emoji: "☀️", icon: "sunny" },
  1: { condition: "Mostly Sunny", emoji: "🌤️", icon: "partly-cloudy" },
  2: { condition: "Partly Cloudy", emoji: "⛅", icon: "cloudy" },
  3: { condition: "Cloudy", emoji: "☁️", icon: "cloudy" },
  45: { condition: "Foggy", emoji: "🌫️", icon: "fog" },
  48: { condition: "Foggy", emoji: "🌫️", icon: "fog" },
  51: { condition: "Light Drizzle", emoji: "🌧️", icon: "rain" },
  53: { condition: "Drizzle", emoji: "🌧️", icon: "rain" },
  55: { condition: "Heavy Drizzle", emoji: "🌧️", icon: "rain" },
  61: { condition: "Light Rain", emoji: "🌧️", icon: "rain" },
  63: { condition: "Rain", emoji: "🌧️", icon: "rain" },
  65: { condition: "Heavy Rain", emoji: "⛈️", icon: "thunderstorm" },
  71: { condition: "Light Snow", emoji: "❄️", icon: "snow" },
  73: { condition: "Snow", emoji: "❄️", icon: "snow" },
  75: { condition: "Heavy Snow", emoji: "❄️", icon: "snow" },
  77: { condition: "Snow Grains", emoji: "❄️", icon: "snow" },
  80: { condition: "Light Showers", emoji: "🌧️", icon: "rain" },
  81: { condition: "Showers", emoji: "🌧️", icon: "rain" },
  82: { condition: "Heavy Showers", emoji: "⛈️", icon: "thunderstorm" },
  85: { condition: "Light Snow Showers", emoji: "❄️", icon: "snow" },
  86: { condition: "Snow Showers", emoji: "❄️", icon: "snow" },
  95: { condition: "Thunderstorm", emoji: "⛈️", icon: "thunderstorm" },
  96: { condition: "Thunderstorm", emoji: "⛈️", icon: "thunderstorm" },
  99: { condition: "Thunderstorm", emoji: "⛈️", icon: "thunderstorm" },
};

const getWeatherCondition = (wmoCode: number) => {
  return WMO_CODE_MAP[wmoCode] || { condition: "Unknown", emoji: "🌡️", icon: "unknown" };
};

interface GeocodingResult {
  name: string;
  country: string;
}

/**
 * Reverse geocode coordinates to get location name
 */
async function reverseGeocode(lat: number, lon: number): Promise<GeocodingResult> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          "User-Agent": "NamibiaServices-Weather/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Geocoding failed");
    }

    const data = await response.json();
    const city = data.address?.city || data.address?.town || data.address?.village || "Unknown Location";
    const country = data.address?.country || "Unknown";

    return { name: city, country };
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return { name: "Unknown Location", country: "Unknown" };
  }
}

/**
 * Fetch weather data for given coordinates
 */
export async function getWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
  try {
    // Get location name
    const location = await reverseGeocode(latitude, longitude);
    
    // Fetch weather from Open-Meteo
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&temperature_unit=celsius&wind_speed_unit=kmh`
    );

    if (!weatherResponse.ok) {
      throw new Error("Weather API failed");
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    if (!current) {
      throw new Error("No weather data available");
    }

    const weatherCondition = getWeatherCondition(current.weather_code);

    return {
      temperature: Math.round(current.temperature_2m),
      condition: weatherCondition.condition,
      emoji: weatherCondition.emoji,
      icon: weatherCondition.icon,
      location: location.name,
      windSpeed: Math.round(current.wind_speed_10m),
      humidity: current.relative_humidity_2m,
    };
  } catch (error) {
    console.error("Weather fetch error:", error);
    return null;
  }
}

/**
 * Fetch detailed weather data including forecast
 */
export async function getDetailedWeather(
  latitude: number,
  longitude: number
): Promise<ForecastData | null> {
  try {
    // Get location name
    const location = await reverseGeocode(latitude, longitude);

    // Fetch weather and forecast from Open-Meteo
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&wind_speed_unit=kmh&forecast_days=7`
    );

    if (!weatherResponse.ok) {
      throw new Error("Weather API failed");
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;
    const daily = weatherData.daily;

    if (!current || !daily) {
      throw new Error("No weather data available");
    }

    const weatherCondition = getWeatherCondition(current.weather_code);

    const currentWeather: WeatherData = {
      temperature: Math.round(current.temperature_2m),
      condition: weatherCondition.condition,
      emoji: weatherCondition.emoji,
      icon: weatherCondition.icon,
      location: location.name,
      windSpeed: Math.round(current.wind_speed_10m),
      humidity: current.relative_humidity_2m,
    };

    // Build forecast for next 7 days
    const forecast: ForecastDay[] = daily.time.map((date: string, index: number) => {
      const code = daily.weather_code[index];
      const condition = getWeatherCondition(code);
      return {
        date,
        tempMax: Math.round(daily.temperature_2m_max[index]),
        tempMin: Math.round(daily.temperature_2m_min[index]),
        condition: condition.condition,
        emoji: condition.emoji,
        icon: condition.icon,
        weatherCode: code,
      };
    });

    return {
      current: currentWeather,
      forecast,
    };
  } catch (error) {
    console.error("Detailed weather fetch error:", error);
    return null;
  }
}

/**
 * Get user's geolocation
 */
export function getUserLocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Geolocation error:", error);
        resolve(null);
      },
      {
        timeout: 5000,
        enableHighAccuracy: false,
      }
    );
  });
}
