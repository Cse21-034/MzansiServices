/**
 * Utility functions for formatting addresses
 */

/**
 * Safely convert a value to string, handling objects properly
 */
export const safeToString = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object') {
    // If it's an object with a 'name' property, use that
    if ('name' in value) return value.name.toString().trim();
    // If it's a date object, format it  
    if (value instanceof Date) return value.toLocaleDateString();
    // Otherwise return empty to avoid [object Object]
    return '';
  }
  return String(value).trim();
};

/**
 * Format a full address from components
 */
export const formatFullAddress = (address?: string, city?: string, country?: string): string => {
  const addressStr = safeToString(address);
  const cityStr = safeToString(city);
  const countryStr = safeToString(country);

  const parts = [addressStr, cityStr, countryStr].filter(part => part.length > 0);
  
  return parts.length > 0 ? parts.join(', ') : 'Location not specified';
};

/**
 * Format address for display on cards (truncated)
 */
export const formatAddressForCard = (address?: string, city?: string, country?: string, maxLength: number = 50): string => {
  const fullAddress = formatFullAddress(address, city, country);
  return fullAddress.length > maxLength ? fullAddress.substring(0, maxLength) + '...' : fullAddress;
};

/**
 * Format location (city, country) for display
 */
export const formatLocation = (city?: string, country?: string): string => {
  const cityStr = safeToString(city);
  const countryStr = safeToString(country);

  const parts = [cityStr, countryStr].filter(part => part.length > 0);
  
  return parts.length > 0 ? parts.join(', ') : 'Location not specified';
};
