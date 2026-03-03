/**
 * EXAMPLE: How to Use Ad Network Configuration
 * 
 * This file shows you how to integrate your ad networks using
 * the centralized configuration system in src/data/adNetworks.ts
 */

// ============================================================================
// Example 1: Simple Direct Implementation
// ============================================================================
/*
// In src/app/promotions/page.tsx

import ExternalAdScript from "@/components/ExternalAdScript";

export default function PromotionsPage() {
  return (
    <div>
      {/* Using direct script URLs */}
      <ExternalAdScript 
        scriptSrc="https://js.propellerads.com/js/pa.js?zoneid=YOUR_ZONE_ID"
      />
      
      <ExternalAdScript 
        scriptSrc="https://ajax.bidvertiser.com/bidvertiser.js?zoneid=YOUR_ZONE_ID"
      />
    </div>
  );
}
*/

// ============================================================================
// Example 2: Using Configuration System
// ============================================================================
/*
// In src/app/promotions/page.tsx

import ExternalAdScript from "@/components/ExternalAdScript";
import { getAdNetworkScript } from "@/data/adNetworks";

export default function PromotionsPage() {
  // Method 1: Using getAdNetworkScript helper
  const propellerScript = getAdNetworkScript("propeller-ads", {
    zoneid: "YOUR_PROPELLER_ZONE_ID"
  });
  
  const bidvertiserScript = getAdNetworkScript("bidvertiser", {
    zoneid: "YOUR_BIDVERTISER_ZONE_ID"
  });
  
  return (
    <div>
      <ExternalAdScript scriptSrc={propellerScript} />
      <ExternalAdScript scriptSrc={bidvertiserScript} />
    </div>
  );
}
*/

// ============================================================================
// Example 3: Creating Your Own Ad Configuration File
// ============================================================================
/*
// Create NEW FILE: src/config/myAdNetworks.ts

export const MY_AD_NETWORKS = {
  promotionsPageTop1: "https://js.propellerads.com/js/pa.js?zoneid=1234567",
  promotionsPageTop2: "https://ajax.bidvertiser.com/bidvertiser.js?zoneid=7654321",
  promotionsPageFeatured: "https://ap.lijit.com/www/delivery/fpi.js?r=9999999",
  
  promotionDetailFeatured: "https://js.propellerads.com/js/pa.js?zoneid=1234568",
  promotionDetailMoreOffers: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456",
};

// Then use in your pages:
// import { MY_AD_NETWORKS } from "@/config/myAdNetworks";
// <ExternalAdScript scriptSrc={MY_AD_NETWORKS.promotionsPageTop1} />
*/

// ============================================================================
// Example 4: Step-by-Step Update Guide
// ============================================================================

export const SETUP_STEPS = {
  step1_choose_network: {
    name: "Choose Your Ad Network",
    options: [
      "Google AdSense (Best for quality earnings)",
      "Propeller Ads (Fastest approval - instant)",
      "BidVertiser (Instant approval, good CPM)",
      "Sovrn (Context-aware ads)",
      "Mix of multiple networks (Recommended)"
    ],
    link: "See AD_NETWORK_SETUP.md for detailed info"
  },
  
  step2_signup_network: {
    name: "Sign Up & Get Your ID",
    google_adsense: {
      go_to: "https://adsense.google.com",
      get: "Publisher ID (format: ca-pub-1234567890123456)",
      wait: "2-3 weeks for approval"
    },
    propeller_ads: {
      go_to: "https://www.propellerads.com/sign-up",
      get: "Zone ID (format: 1234567)",
      wait: "Instant approval"
    },
    bidvertiser: {
      go_to: "https://www.bidvertiser.com",
      get: "Zone ID (format: 1234567)",
      wait: "Instant approval"
    }
  },
  
  step3_option_a_direct_urls: {
    name: "Option A: Use Direct Script URLs (Simple)",
    
    for_promotions_page: {
      file: "src/app/promotions/page.tsx",
      find_and_replace: [
        {
          find: 'scriptSrc="https://js.partnershipsprogram.com/javascript.php?prefix=-1DpJjc-4UjzqbYFgbz_omNd7ZgqdRLk&media=2910&campaign=1"',
          replace: 'scriptSrc="https://js.propellerads.com/js/pa.js?zoneid=YOUR_ZONE_ID"'
        },
        {
          find: 'scriptSrc="https://js.example-ad-network.com/ads?channel=promotions&format=rectangle"',
          replace: 'scriptSrc="https://ajax.bidvertiser.com/bidvertiser.js?zoneid=YOUR_ZONE_ID"'
        },
        {
          find: 'scriptSrc="https://js.partnershipsprogram.com/javascript.php?prefix=-1DpJjc-4UjzqbYFgbz_omNd7ZgqdRLk&media=2911&campaign=2"',
          replace: 'scriptSrc="https://ap.lijit.com/www/delivery/fpi.js?r=YOUR_SOVRN_ID"'
        }
      ]
    },
    
    for_promotion_detail_page: {
      file: "src/app/promotions/[id]/page.tsx",
      find_and_replace: [
        {
          find: 'scriptSrc="https://js.partnershipsprogram.com/javascript.php?prefix=-1DpJjc-4UjzqbYFgbz_omNd7ZgqdRLk&media=2912&campaign=3"',
          replace: 'scriptSrc="https://ajax.bidvertiser.com/bidvertiser.js?zoneid=YOUR_ZONE_ID"'
        },
        {
          find: 'scriptSrc="https://js.partnershipsprogram.com/javascript.php?prefix=-1DpJjc-4UjzqbYFgbz_omNd7ZgqdRLk&media=2913&campaign=4"',
          replace: 'scriptSrc="https://js.propellerads.com/js/pa.js?zoneid=YOUR_ZONE_ID"'
        }
      ]
    }
  },
  
  step3_option_b_config_file: {
    name: "Option B: Use Configuration File (Recommended)",
    
    file_to_create: "src/config/adNetworkConfig.ts",
    
    content: `
// Define all your ad network scripts in one place
export const AD_SCRIPTS = {
  // Propeller Ads
  propeller_zone_1: "https://js.propellerads.com/js/pa.js?zoneid=YOUR_PROPELLER_ZONE_ID",
  propeller_zone_2: "https://js.propellerads.com/js/pa.js?zoneid=YOUR_PROPELLER_ZONE_ID_2",
  
  // BidVertiser
  bidvertiser_zone_1: "https://ajax.bidvertiser.com/bidvertiser.js?zoneid=YOUR_BIDVERTISER_ZONE_ID",
  bidvertiser_zone_2: "https://ajax.bidvertiser.com/bidvertiser.js?zoneid=YOUR_BIDVERTISER_ZONE_ID_2",
  
  // Sovrn
  sovrn_id: "https://ap.lijit.com/www/delivery/fpi.js?r=YOUR_SOVRN_ID",
  
  // Google AdSense
  google_adsense: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID",
};

// Then use in pages:
// import { AD_SCRIPTS } from "@/config/adNetworkConfig";
// <ExternalAdScript scriptSrc={AD_SCRIPTS.propeller_zone_1} />
    `,
    
    usage_in_promotions_page: {
      file: "src/app/promotions/page.tsx",
      add_import: 'import { AD_SCRIPTS } from "@/config/adNetworkConfig";',
      replace: [
        {
          old: 'scriptSrc="https://js.partnershipsprogram.com/..."',
          new: 'scriptSrc={AD_SCRIPTS.propeller_zone_1}'
        },
        {
          old: 'scriptSrc="https://js.example-ad-network.com/..."',
          new: 'scriptSrc={AD_SCRIPTS.bidvertiser_zone_1}'
        },
        {
          old: 'scriptSrc="https://js.partnershipsprogram.com/...media=2911..."',
          new: 'scriptSrc={AD_SCRIPTS.sovrn_id}'
        }
      ]
    }
  },
  
  step4_test: {
    name: "Test Your Setup",
    tests: [
      "1. Open page in incognito/private browser (bypasses ad blockers)",
      "2. Press F12 to open Developer Tools",
      "3. Go to Console tab",
      "4. Look for success message: 'Ad script loaded successfully'",
      "5. Check Network tab to see if script downloaded",
      "6. Verify ads appear on page"
    ]
  },
  
  step5_monitor: {
    name: "Monitor Performance",
    monitor: [
      "Check ad network dashboard daily",
      "Track impressions and earnings",
      "Note which placements get most traffic",
      "Adjust or add more networks based on earnings"
    ]
  }
};

// ============================================================================
// Real-World Examples
// ============================================================================

export const EXAMPLE_CONFIGS = {
  // Example 1: Using only Propeller Ads
  propeller_only: {
    description: "Simple setup using just Propeller Ads everywhere",
    scripts: [
      "https://js.propellerads.com/js/pa.js?zoneid=1234567",
      "https://js.propellerads.com/js/pa.js?zoneid=1234568",
      "https://js.propellerads.com/js/pa.js?zoneid=1234569",
      "https://js.propellerads.com/js/pa.js?zoneid=1234570"
    ],
    pros: "Simple to manage, instant approval, consistent earnings",
    cons: "Single point of failure, may have lower CPM",
    best_for: "Getting started quickly"
  },
  
  // Example 2: Mixed networks
  mixed_networks: {
    description: "Using multiple networks for maximum earnings",
    location_1: "Promotions page top",
    script_1_a: "https://js.propellerads.com/js/pa.js?zoneid=1234567",
    script_1_b: "https://ajax.bidvertiser.com/bidvertiser.js?zoneid=7654321",
    
    location_2: "Promotions featured",
    script_2: "https://ap.lijit.com/www/delivery/fpi.js?r=9999999",
    
    location_3: "Promotion detail featured",
    script_3: "https://ajax.bidvertiser.com/bidvertiser.js?zoneid=7654322",
    
    location_4: "Promotion detail offers",
    script_4: "https://js.propellerads.com/js/pa.js?zoneid=1234568",
    
    pros: "Maximize revenue, better fallback options",
    cons: "More complex management",
    best_for: "Optimizing earnings"
  },
  
  // Example 3: Google AdSense focused
  adsense_heavy: {
    description: "Using Google AdSense as primary (premium option)",
    all_locations: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456",
    backup_networks: [
      "https://js.propellerads.com/js/pa.js?zoneid=1234567",
      "https://ajax.bidvertiser.com/bidvertiser.js?zoneid=7654321"
    ],
    pros: "Google AdSense usually has highest CPM",
    cons: "Slow approval (2-3 weeks)",
    best_for: "Established sites with good traffic"
  }
};

// ============================================================================
// Quick Copy-Paste Sections
// ============================================================================

export const COPY_PASTE_READY = {
  "Update Promotions Page - Propeller Ads": {
    file: "src/app/promotions/page.tsx",
    code: `
<ExternalAdScript 
  scriptSrc="https://js.propellerads.com/js/pa.js?zoneid=YOUR_ZONE_1"
/>
<ExternalAdScript 
  scriptSrc="https://js.propellerads.com/js/pa.js?zoneid=YOUR_ZONE_2"
/>
<ExternalAdScript 
  scriptSrc="https://js.propellerads.com/js/pa.js?zoneid=YOUR_ZONE_3"
/>
    `
  },
  
  "Update Promotion Detail - Mixed Networks": {
    file: "src/app/promotions/[id]/page.tsx",
    code: `
<ExternalAdScript 
  scriptSrc="https://ajax.bidvertiser.com/bidvertiser.js?zoneid=YOUR_ZONE_1"
/>
<ExternalAdScript 
  scriptSrc="https://js.propellerads.com/js/pa.js?zoneid=YOUR_ZONE_2"
/>
    `
  }
};

export default SETUP_STEPS;
