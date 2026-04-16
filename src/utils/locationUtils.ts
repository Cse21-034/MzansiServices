/**
 * Utility to find the nearest South African city from GPS coordinates
 * Used for the "Use my location" feature in hero search
 */

interface NamibiaCity {
  name: string;
  latitude: number;
  longitude: number;
}

// South Africa approximate boundaries
const NAMIBIA_BOUNDS = {
  minLat: -34.8,
  maxLat: -22.1,
  minLon: 16.5,
  maxLon: 32.9,
};

const NAMIBIA_CITIES: NamibiaCity[] = [
  { name: "Johannesburg", latitude: -26.2023, longitude: 28.0436 },
  { name: "Pretoria", latitude: -25.7479, longitude: 28.2293 },
  { name: "Cape Town", latitude: -33.9249, longitude: 18.4241 },
  { name: "Durban", latitude: -29.8587, longitude: 31.0218 },
  { name: "Bloemfontein", latitude: -29.1186, longitude: 25.5184 },
  { name: "Port Elizabeth", latitude: -33.9841, longitude: 25.6053 },
  { name: "Polokwane", latitude: -23.9001, longitude: 29.4181 },
  { name: "Nelspruit", latitude: -25.4833, longitude: 30.9667 },
  { name: "Kimberley", latitude: -28.7383, longitude: 24.8628 },
  { name: "Mahikeng", latitude: -25.8552, longitude: 25.6406 },
  { name: "East London", latitude: -33.0136, longitude: 27.9111 },
  { name: "Pietermaritzburg", latitude: -29.6084, longitude: 30.3963 },
  { name: "Soweto", latitude: -26.2643, longitude: 27.8537 },
  { name: "Sandton", latitude: -26.1088, longitude: 28.0545 },
  { name: "Stellenbosch", latitude: -33.9364, longitude: 18.8639 },
  { name: "Paarl", latitude: -33.7915, longitude: 18.9693 },
  { name: "Richards Bay", latitude: -28.7832, longitude: 32.0377 },
  { name: "Upington", latitude: -28.4500, longitude: 21.2667 },
  { name: "Rustenburg", latitude: -25.6789, longitude: 27.2500 },
  { name: "Klerksdorp", latitude: -26.8633, longitude: 26.6614 },
];

/**
 * Check if coordinates are within South Africa
 * @param latitude - Geographic latitude
 * @param longitude - Geographic longitude
 * @returns true if coordinates are within South Africa bounds
 */
export function isWithinNamibia(latitude: number, longitude: number): boolean {
  return (
    latitude >= NAMIBIA_BOUNDS.minLat &&
    latitude <= NAMIBIA_BOUNDS.maxLat &&
    longitude >= NAMIBIA_BOUNDS.minLon &&
    longitude <= NAMIBIA_BOUNDS.maxLon
  );
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find the nearest South African city to given coordinates
 * @param latitude - User's latitude
 * @param longitude - User's longitude
 * @returns The name of the nearest South African city, or null if user is outside South Africa
 */
export function findNearestCity(latitude: number, longitude: number): string | null {
  if (!latitude || !longitude) {
    return "Johannesburg"; // Default fallback
  }

  // Check if user is within South Africa bounds
  if (!isWithinNamibia(latitude, longitude)) {
    console.warn(
      `❌ User location (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) is outside South Africa. No service available.`
    );
    return null;
  }

  let nearestCity = NAMIBIA_CITIES[0];
  let minDistance = calculateDistance(
    latitude,
    longitude,
    nearestCity.latitude,
    nearestCity.longitude
  );

  for (let i = 1; i < NAMIBIA_CITIES.length; i++) {
    const city = NAMIBIA_CITIES[i];
    const distance = calculateDistance(
      latitude,
      longitude,
      city.latitude,
      city.longitude
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  }

  console.log(
    `📍 User location matched to: ${nearestCity.name} (${minDistance.toFixed(1)} km away)`
  );
  return nearestCity.name;
}
