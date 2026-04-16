/**
 * Utility functions for formatting addresses
 */

/**
 * Safely convert a value to string, handling objects properly
 */
const safeToString = (value: any): string => {
  if (!value) return '';
  
  // If it's a string, trim and return
  if (typeof value === 'string') {
    const cleaned = value.trim();
    // Clean out any [object Object] strings that might be in the value
    return cleaned.replace(/\[object Object\]/g, '').trim();
  }
  
  // If it's an object with a 'value' property (like from CreatableSelect), use that
  if (typeof value === 'object') {
    if ('value' in value && typeof value.value === 'string') {
      return value.value.toString().trim();
    }
    if ('label' in value && typeof value.label === 'string') {
      return value.label.toString().trim();
    }
    if (value instanceof Date) return value.toLocaleDateString();
    // Otherwise return empty to avoid [object Object]
    return '';
  }
  
  const str = String(value).trim();
  // Clean out any [object Object] strings
  return str.replace(/\[object Object\]/g, '').trim();
};

/**
 * Clean address string by removing [object Object] and normalizing it
 */
const cleanAddress = (address: string): string => {
  if (!address) return '';
  
  // Remove [object Object] strings
  return address
    .replace(/\[object Object\]/g, '')
    .replace(/,\s*,/g, ',') // Remove double commas
    .replace(/,\s*$/g, '') // Remove trailing comma
    .split(',')
    .map(part => part.trim())
    .filter(part => part.length > 0 && !part.match(/^[\s,]*$/))
    .join(', ');
};

/**
 * Format a full address from components
 */
const formatFullAddress = (address?: string, city?: string, country?: string): string => {
  // Extract string values, handling objects
  let addressStr = safeToString(address);
  let cityStr = safeToString(city);
  let countryStr = safeToString(country);
  
  // Clean the address string in case it has [object Object]
  if (addressStr) {
    addressStr = cleanAddress(addressStr);
  }

  // Build parts array, filtering out empty values
  const parts = [addressStr, cityStr, countryStr]
    .filter(part => part && part.length > 0 && !part.includes('[object Object]'));
  
  // Return formatted address or default message
  return parts.length > 0 ? parts.join(', ') : '';
};

/**
 * Format location (city, country) for display
 */
const formatLocation = (city?: string, country?: string): string => {
  let cityStr = safeToString(city);
  let countryStr = safeToString(country);
  
  // If city or country is still "[object Object]", replace with empty
  cityStr = cityStr.replace(/\[object Object\]/g, '').trim() || 'Unknown City';
  countryStr = countryStr.replace(/\[object Object\]/g, '').trim() || 'South Africa';

  return `${cityStr}, ${countryStr}`;
};

/**
 * Format address for display on cards (truncated)
 */
const formatAddressForCard = (address?: string, city?: string, country?: string, maxLength: number = 50): string => {
  const fullAddress = formatFullAddress(address, city, country);
  return fullAddress.length > maxLength ? fullAddress.substring(0, maxLength) + '...' : fullAddress;
};

// Export all functions
export { safeToString, cleanAddress, formatFullAddress, formatLocation, formatAddressForCard };
