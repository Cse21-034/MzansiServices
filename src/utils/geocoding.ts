/**
 * Geocoding utility for converting addresses to coordinates
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 */

interface GeocodingResult {
    latitude: number;
    longitude: number;
    displayName: string;
}

/**
 * Geocode an address in Namibia to get latitude and longitude
 * @param address Full address string
 * @param city City/town name
 * @returns Coordinates or null if geocoding fails
 */
export async function geocodeAddress(
    address: string,
    city: string
): Promise<GeocodingResult | null> {
    try {
        // Build search query with address, city, and country
        const searchQuery = `${address}, ${city}, Namibia`;

        // Use OpenStreetMap Nominatim API (free, no API key needed)
        const url = `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(searchQuery)}` +
            `&format=json` +
            `&limit=1` +
            `&countrycodes=na`; // Restrict to Namibia

        console.log('🌍 Geocoding address:', searchQuery);

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'NamibiaServices/1.0' // Required by Nominatim
            }
        });

        if (!response.ok) {
            console.error('Geocoding API error:', response.status);
            return null;
        }

        const data = await response.json();

        if (data && data.length > 0) {
            const result = data[0];
            const coords = {
                latitude: parseFloat(result.lat),
                longitude: parseFloat(result.lon),
                displayName: result.display_name
            };

            console.log('✅ Geocoding successful:', coords);
            return coords;
        }

        console.warn('⚠️ No geocoding results found for:', searchQuery);
        return null;

    } catch (error) {
        console.error('❌ Geocoding error:', error);
        return null;
    }
}

/**
 * Get default coordinates for Namibia cities
 * Fallback if geocoding fails
 */
export function getDefaultCoordinates(city: string): { latitude: number; longitude: number } {
    const coordinates: { [key: string]: { latitude: number; longitude: number } } = {
        // Major cities
        'windhoek': { latitude: -22.5597, longitude: 17.0832 },
        'francistown': { latitude: -21.1700, longitude: 27.5086 },
        'maun': { latitude: -19.9833, longitude: 23.4167 },
        'kasane': { latitude: -17.8167, longitude: 25.1500 },
        'serowe': { latitude: -22.3833, longitude: 26.7167 },
        'selibe phikwe': { latitude: -21.9667, longitude: 27.8333 },
        'lobatse': { latitude: -25.2167, longitude: 25.6833 },
        'palapye': { latitude: -22.5500, longitude: 27.1333 },
        'molepolole': { latitude: -24.4000, longitude: 25.4833 },
        'kanye': { latitude: -24.9833, longitude: 25.3333 },
        'mochudi': { latitude: -24.4167, longitude: 25.9833 },
        'mahalapye': { latitude: -23.1000, longitude: 26.8167 },
        'mogoditshane': { latitude: -24.6167, longitude: 25.8667 },
        'jwaneng': { latitude: -24.6000, longitude: 24.7000 },
        'orapa': { latitude: -21.3000, longitude: 25.3667 },
        'letlhakane': { latitude: -21.4167, longitude: 25.5833 },
        'tonota': { latitude: -21.4333, longitude: 27.0667 },
        'tutume': { latitude: -20.9833, longitude: 27.1500 },
        'ramotswa': { latitude: -24.8667, longitude: 25.8667 },
        'tlokweng': { latitude: -24.6500, longitude: 25.9833 },
    };

    const cityKey = city.toLowerCase().trim();

    if (coordinates[cityKey]) {
        return coordinates[cityKey];
    }

    // Default to Windhoek if city not found
    console.warn(`⚠️ No coordinates found for "${city}", defaulting to Windhoek`);
    return coordinates['windhoek'];
}

/**
 * Geocode with fallback to default coordinates
 */
export async function geocodeWithFallback(
    address: string,
    city: string
): Promise<{ latitude: number; longitude: number }> {
    // Try geocoding first
    const geocoded = await geocodeAddress(address, city);

    if (geocoded) {
        return {
            latitude: geocoded.latitude,
            longitude: geocoded.longitude
        };
    }

    // Fallback to default city coordinates
    return getDefaultCoordinates(city);
}
