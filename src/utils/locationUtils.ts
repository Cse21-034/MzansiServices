/**
 * Utility to find the nearest Namibian city from GPS coordinates
 * Used for the "Use my location" feature in hero search
 */

interface NamibiaCity {
  name: string;
  latitude: number;
  longitude: number;
}

// Namibia approximate boundaries
const NAMIBIA_BOUNDS = {
  minLat: -28.5,
  maxLat: -16.5,
  minLon: 11.5,
  maxLon: 25.5,
};

const NAMIBIA_CITIES: NamibiaCity[] = [
  { name: "Windhoek", latitude: -22.5597, longitude: 17.0832 },
  { name: "Walvis Bay", latitude: -22.9881, longitude: 14.5064 },
  { name: "Swakopmund", latitude: -22.6597, longitude: 14.5289 },
  { name: "Oshakati", latitude: -17.7845, longitude: 15.7459 },
  { name: "Rundu", latitude: -17.9345, longitude: 19.7755 },
  { name: "Katima Mulilo", latitude: -17.4969, longitude: 24.8691 },
  { name: "Otjiwarongo", latitude: -20.4668, longitude: 16.6449 },
  { name: "Keetmanshoop", latitude: -26.5819, longitude: 18.2684 },
  { name: "Rehoboth", latitude: -23.3167, longitude: 17.0833 },
  { name: "Gobabis", latitude: -22.3456, longitude: 18.9574 },
  { name: "Mariental", latitude: -24.6333, longitude: 17.95 },
  { name: "Tsumeb", latitude: -19.2333, longitude: 17.7333 },
  { name: "Ondangwa", latitude: -17.9333, longitude: 15.6667 },
  { name: "Ongwediva", latitude: -17.7667, longitude: 15.8167 },
  { name: "Eenhana", latitude: -17.45, longitude: 15.6833 },
  { name: "Okahandja", latitude: -21.9874, longitude: 16.3242 },
  { name: "Omaruru", latitude: -21.4831, longitude: 15.7364 },
  { name: "Usakos", latitude: -21.8547, longitude: 15.6397 },
  { name: "Karibib", latitude: -21.9357, longitude: 15.8305 },
  { name: "Outjo", latitude: -20.1317, longitude: 16.1489 },
  { name: "Otavi", latitude: -19.6043, longitude: 17.2646 },
];

/**
 * Check if coordinates are within Namibia
 * @param latitude - Geographic latitude
 * @param longitude - Geographic longitude
 * @returns true if coordinates are within Namibia bounds
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
 * Find the nearest Namibian city to given coordinates
 * @param latitude - User's latitude
 * @param longitude - User's longitude
 * @returns The name of the nearest Namibian city, or null if user is outside Namibia
 */
export function findNearestCity(latitude: number, longitude: number): string | null {
  if (!latitude || !longitude) {
    return "Windhoek"; // Default fallback
  }

  // Check if user is within Namibia bounds
  if (!isWithinNamibia(latitude, longitude)) {
    console.warn(
      `❌ User location (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) is outside Namibia. No service available.`
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
