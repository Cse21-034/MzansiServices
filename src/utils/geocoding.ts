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
 * Geocode an address in South Africa to get latitude and longitude
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
        const searchQuery = `${address}, ${city}, South Africa`;

        // Use OpenStreetMap Nominatim API (free, no API key needed)
        const url = `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(searchQuery)}` +
            `&format=json` +
            `&limit=1` +
            `&countrycodes=za`; // Restrict to South Africa

        console.log('🌍 Geocoding address:', searchQuery);

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'MzansiServices/1.0' // Required by Nominatim
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
 * Get default coordinates for South Africa cities
 * Fallback if geocoding fails
 */
export function getDefaultCoordinates(city: string): { latitude: number; longitude: number } {
    const coordinates: { [key: string]: { latitude: number; longitude: number } } = {
        // Major cities - South Africa
        'johannesburg': { latitude: -26.2023, longitude: 28.0436 },
        'pretoria': { latitude: -25.7479, longitude: 28.2293 },
        'cape town': { latitude: -33.9249, longitude: 18.4241 },
        'durban': { latitude: -29.8587, longitude: 31.0218 },
        'bloemfontein': { latitude: -29.1186, longitude: 25.5184 },
        'port elizabeth': { latitude: -33.9841, longitude: 25.6053 },
        'polokwane': { latitude: -23.9001, longitude: 29.4181 },
        'nelspruit': { latitude: -25.4833, longitude: 30.9667 },
        'kimberley': { latitude: -28.7383, longitude: 24.8628 },
        'mahikeng': { latitude: -25.8552, longitude: 25.6406 },
        'east london': { latitude: -33.0136, longitude: 27.9111 },
        'pietermaritzburg': { latitude: -29.6084, longitude: 30.3963 },
        'soweto': { latitude: -26.2643, longitude: 27.8537 },
        'sandton': { latitude: -26.1088, longitude: 28.0545 },
        'stellenbosch': { latitude: -33.9364, longitude: 18.8639 },
        'paarl': { latitude: -33.7915, longitude: 18.9693 },
        'richards bay': { latitude: -28.7832, longitude: 32.0377 },
        'upington': { latitude: -28.4500, longitude: 21.2667 },
        'rustenburg': { latitude: -25.6789, longitude: 27.2500 },
        'klerksdorp': { latitude: -26.8633, longitude: 26.6614 },
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
