/**
 * Ad Network Configuration
 * This file contains all ad network integrations with their respective script URLs
 * and configuration parameters. Update these with your actual ad network credentials.
 */

export interface AdNetworkConfig {
  id: string;
  name: string;
  scriptSrc: string;
  description: string;
  requiresSetup: boolean;
  setupUrl: string;
  estimatedEarnings?: string;
}

// ============================================================================
// Popular Ad Networks - Choose and configure based on your needs
// ============================================================================

/**
 * GOOGLE ADSENSE
 * Best for: General content monetization, high CPM rates
 * Setup: https://adsense.google.com
 * 
 * To use:
 * 1. Sign up at https://adsense.google.com
 * 2. Add your website and get approved (2-3 weeks)
 * 3. Replace YOUR_PUBLISHER_ID with your actual Publisher ID (format: pub-xxxxxxxxxxxxxxxxxx)
 * 4. Add ad slots to your pages
 */
export const GOOGLE_ADSENSE: AdNetworkConfig = {
  id: "google-adsense",
  name: "Google AdSense",
  scriptSrc: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxxxx",
  description: "Google's advertising platform with high CPM rates",
  requiresSetup: true,
  setupUrl: "https://adsense.google.com",
  estimatedEarnings: "$5-50 per 1000 views",
};

/**
 * MEDIAVINE
 * Best for: Large publishers (25k+ monthly views), premium content
 * Setup: https://www.mediavine.com
 * 
 * To use:
 * 1. Apply at https://www.mediavine.com/apply
 * 2. Must have 25,000 monthly sessions minimum
 * 3. Get approved and install their script
 * 4. Replace with your actual Mediavine script
 */
export const MEDIAVINE: AdNetworkConfig = {
  id: "mediavine",
  name: "Mediavine",
  scriptSrc: "https://scripts.mediavine.com/tags/js/mvpixel?id=YOUR_MEDIAVINE_ID",
  description: "Premium ad network for established publishers",
  requiresSetup: true,
  setupUrl: "https://www.mediavine.com",
  estimatedEarnings: "$25-100+ per 1000 views",
};

/**
 * PROPELLER ADS
 * Best for: All traffic types, global reach, popunder ads
 * Setup: https://www.propellerads.com
 * 
 * To use:
 * 1. Sign up at https://www.propellerads.com/sign-up
 * 2. Get approved instantly
 * 3. Create ad placements and copy the script
 * 4. Replace YOUR_PROPELLER_ID with your Zone ID
 */
export const PROPELLER_ADS: AdNetworkConfig = {
  id: "propeller-ads",
  name: "Propeller Ads",
  scriptSrc: "https://js.propellerads.com/js/pa.js?zoneid=YOUR_PROPELLER_ID",
  description: "Fast approval, popunder and banner ads, global audience",
  requiresSetup: true,
  setupUrl: "https://www.propellerads.com",
  estimatedEarnings: "$1-15 per 1000 views",
};

/**
 * SOVRN (formerly VigLink)
 * Best for: Content publishers, context-aware ads
 * Setup: https://www.sovrn.com
 * 
 * To use:
 * 1. Sign up at https://www.sovrn.com
 * 2. Get approved
 * 3. Install Sovrn Commerce script
 * 4. Replace YOUR_SOVRN_ID with your actual ID
 */
export const SOVRN: AdNetworkConfig = {
  id: "sovrn",
  name: "Sovrn",
  scriptSrc: "https://ap.lijit.com/www/delivery/fpi.js?r=YOUR_SOVRN_ID",
  description: "Context-aware advertising network",
  requiresSetup: true,
  setupUrl: "https://www.sovrn.com",
  estimatedEarnings: "$3-20 per 1000 views",
};

/**
 * BIDVERTISER
 * Best for: New publishers, instant approval
 * Setup: https://www.bidvertiser.com
 * 
 * To use:
 * 1. Sign up at https://www.bidvertiser.com
 * 2. Get instant approval
 * 3. Create ad slots
 * 4. Copy and replace the script with your Zone ID
 */
export const BIDVERTISER: AdNetworkConfig = {
  id: "bidvertiser",
  name: "BidVertiser",
  scriptSrc: "https://ajax.bidvertiser.com/bidvertiser.js?zoneid=YOUR_BIDVERTISER_ZONEID",
  description: "Instant approval, flexible ad formats",
  requiresSetup: true,
  setupUrl: "https://www.bidvertiser.com",
  estimatedEarnings: "$1-8 per 1000 views",
};

/**
 * ADTHRIVE
 * Best for: Premium publishers, fashion/lifestyle/food content
 * Setup: https://www.adthrive.com
 * 
 * To use:
 * 1. Apply at https://www.adthrive.com/apply
 * 2. Must have 100,000+ monthly views
 * 3. Get approved and receive script
 * 4. Install their header script
 */
export const ADTHRIVE: AdNetworkConfig = {
  id: "adthrive",
  name: "AdThrive",
  scriptSrc: "https://www.googletagmanager.com/gtag/js?id=YOUR_ADTHRIVE_ID",
  description: "Premium network for established publishers",
  requiresSetup: true,
  setupUrl: "https://www.adthrive.com",
  estimatedEarnings: "$30-100+ per 1000 views",
};

/**
 * CONVERSANT / POINT (Ad Exchange)
 * Best for: Direct advertiser relationships, business-focused content
 * Setup: https://www.conversantmedia.com
 * 
 * To use:
 * 1. Sign up at https://www.conversantmedia.com
 * 2. Get approved
 * 3. Create ad tags
 * 4. Replace with your actual tag
 */
export const CONVERSANT: AdNetworkConfig = {
  id: "conversant",
  name: "Conversant",
  scriptSrc: "https://ad.doubleclick.net/ddm/adj/YOUR_CONVERSANT_ID/ad",
  description: "Ad exchange with real-time bidding",
  requiresSetup: true,
  setupUrl: "https://www.conversantmedia.com",
  estimatedEarnings: "$2-15 per 1000 views",
};

/**
 * EZOIC
 * Best for: Publishers wanting AI-optimized ads
 * Setup: https://www.ezoic.com
 * 
 * To use:
 * 1. Sign up at https://www.ezoic.com
 * 2. Verify domain
 * 3. Point nameservers to Ezoic
 * 4. They'll inject their script automatically
 */
export const EZOIC: AdNetworkConfig = {
  id: "ezoic",
  name: "Ezoic",
  scriptSrc: "https://static.ezoic.net/ezoic/YOUR_EZOIC_ID.js",
  description: "AI-powered ad optimization",
  requiresSetup: true,
  setupUrl: "https://www.ezoic.com",
  estimatedEarnings: "$10-50+ per 1000 views",
};

// ============================================================================
// All Available Ad Networks
// ============================================================================
export const AD_NETWORKS: Record<string, AdNetworkConfig> = {
  [GOOGLE_ADSENSE.id]: GOOGLE_ADSENSE,
  [MEDIAVINE.id]: MEDIAVINE,
  [PROPELLER_ADS.id]: PROPELLER_ADS,
  [SOVRN.id]: SOVRN,
  [BIDVERTISER.id]: BIDVERTISER,
  [ADTHRIVE.id]: ADTHRIVE,
  [CONVERSANT.id]: CONVERSANT,
  [EZOIC.id]: EZOIC,
};

// ============================================================================
// Current Active Ad Networks (Configure these with your real IDs)
// ============================================================================

/**
 * Homepage Ad Networks
 * Used across the main home page
 */
export const HOMEPAGE_AD_NETWORKS = {
  header: PROPELLER_ADS.id,
  sidebar: BIDVERTISER.id,
  footer: SOVRN.id,
};

/**
 * Listings Page Ad Networks
 */
export const LISTINGS_AD_NETWORKS = {
  featured: PROPELLER_ADS.id,
  inline: BIDVERTISER.id,
  sidebar: SOVRN.id,
};

/**
 * Promotions Page Ad Networks
 */
export const PROMOTIONS_AD_NETWORKS = {
  featured: PROPELLER_ADS.id,
  inline: BIDVERTISER.id,
  partnership: SOVRN.id,
};

/**
 * Promotion Detail Page Ad Networks
 */
export const PROMOTION_DETAIL_AD_NETWORKS = {
  featured: PROPELLER_ADS.id,
  bottom: SOVRN.id,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the script URL for a given ad network and your credentials
 * 
 * @example
 * const scriptUrl = getAdNetworkScript('google-adsense', { 
 *   publisherId: 'pub-1234567890123456' 
 * });
 */
export function getAdNetworkScript(
  networkId: string,
  credentials: Record<string, string>
): string {
  const network = AD_NETWORKS[networkId];
  if (!network) {
    console.warn(`Ad network ${networkId} not found`);
    return "";
  }

  let script = network.scriptSrc;

  // Replace placeholders with actual credentials
  Object.entries(credentials).forEach(([key, value]) => {
    const placeholder = `YOUR_${key.toUpperCase()}`;
    script = script.replace(placeholder, value);
  });

  return script;
}

// ============================================================================
// Quick Setup Instructions
// ============================================================================

export const SETUP_INSTRUCTIONS = {
  "google-adsense": `
    1. Visit https://adsense.google.com
    2. Click "Sign up" and sign in with Google account
    3. Add your website and wait for approval (2-3 weeks)
    4. Get your Publisher ID (format: pub-xxxxxxxxxxxxxxxxxx)
    5. Replace it in config: scriptSrc="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
    6. Add ad unit codes to your pages where you want ads
  `,
  "propeller-ads": `
    1. Visit https://www.propellerads.com/sign-up
    2. Sign up and verify your email
    3. Add your website
    4. Create ad placements and get your Zone ID
    5. Replace in config: scriptSrc="https://js.propellerads.com/js/pa.js?zoneid=YOUR_ZONE_ID"
    6. Ads appear automatically
  `,
  "bidvertiser": `
    1. Visit https://www.bidvertiser.com
    2. Sign up and add your website
    3. Create ad units/zones
    4. Get your Zone ID
    5. Replace in config: scriptSrc="https://ajax.bidvertiser.com/bidvertiser.js?zoneid=YOUR_ZONE_ID"
  `,
  "sovrn": `
    1. Visit https://www.sovrn.com and sign up
    2. Add your website
    3. Get your Sovrn ID
    4. Replace in config: scriptSrc="https://ap.lijit.com/www/delivery/fpi.js?r=YOUR_SOVRN_ID"
  `,
};
