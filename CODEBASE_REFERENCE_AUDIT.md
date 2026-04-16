# MzansiServices Codebase Reference Audit
**Generated:** April 16, 2026  
**Scope:** Complete reference mapping for Namibia/location/color/logo references

---

## 1. NAMIBIA & COUNTRY REFERENCES

### Total Count: 27 references across files

#### Environment Variables & Configuration
| File | Line(s) | Reference | Context |
|------|---------|-----------|---------|
| `.env.neon` | 1 | "Namibia Services" | Comment header |
| `.env.neon` | 54 | `namibia-services` | CLOUDINARY_FOLDER |
| `.env.production` | 1 | "Namibia Services" | Comment header |
| `.env.production` | 9 | "NAMIBIA SERVICES" | Comment |
| `.env.production` | 14-15 | `namibia_services` | DATABASE_URL & DIRECT_URL |
| `.env.production` | 41 | `namibia-services` | CLOUDINARY_FOLDER |
| `.env.production` | 62-63 | `namibia_prod` | DATABASE_URL & DIRECT_URL |
| `.env.production` | 67-68 | `namibiaservices.com` | NEXTAUTH_URL & NEXT_PUBLIC_APP_URL (PRODUCTION DOMAIN) |
| `.env.production` | 227 | `namibiaservices.com` | NEXTAUTH_URL (duplicate) |

#### Documentation Files
| File | Line(s) | Reference | Context |
|------|---------|-----------|---------|
| `ADS_SYSTEM_GUIDE.md` | 1 | "Namibia Services" | Title/Header |
| `AD_NETWORK_SETUP.md` | 19, 38 | `namibiaservices.com` | Website registration instructions (x2) |
| `DEEP_ERROR_ANALYSIS.md` | 195, 210-211, 365 | `namibiaservices.com` | HTTP request/response examples (x4) |
| `FEATURED_HERO_SPACE_GUIDE.md` | 4 | "Namibia Services" | Description header |
| `COMPLETE_STATUS.md` | 120 | "Namibia Services Packages" | Section reference |

#### Email Templates & Components
| File | Line(s) | Reference | Context |
|------|---------|-----------|---------|
| `src/emails/WelcomeEmail.tsx` | 35 | `namibiaservices.com` | Email logo URL fallback |
| `src/emails/MarketingNotificationEmail.tsx` | 37 | `namibiaservices.com` | Email logo URL fallback |

#### Code Context: Default Country
| File | Reference | Context |
|------|-----------|---------|
| `prisma/schema.prisma` | Line ~71 | `@default("Namibia")` | Business model country field default |

---

## 2. CITY & LOCATION REFERENCES

### Total Count: Extensive - 40+ specific cities

#### Windhoek (Primary City - Most Referenced)
- **Count:** 12+ references
- **Files:**
  - [src/utils/locationUtils.ts](src/utils/locationUtils.ts#L21) - Line 21: Coordinates definition
  - [src/utils/locationUtils.ts](src/utils/locationUtils.ts#L90) - Line 90: Default fallback
  - [src/utils/geocoding.ts](src/utils/geocoding.ts#L76) - Line 76: Coordinates mapping (lowercase)
  - [src/utils/geocoding.ts](src/utils/geocoding.ts#L104-L106) - Lines 104-106: Default/fallback logic
  - [src/utils/businessHelpers.ts](src/utils/businessHelpers.ts#L32) - Line 32: Branch naming example
  - [check_branch_data.sql](check_branch_data.sql#L11) - Line 11: SQL query
  - [fix_business_coordinates.sql](fix_business_coordinates.sql#L4) - Line 4: Comment
  - [update_gaborone_to_windhoek.sql](update_gaborone_to_windhoek.sql) - Multiple lines: Migration script

#### Gaborone (Old Default - Deprecated)
- **Count:** 6+ references (legacy references)
- **Files:**
  - [update_gaborone_to_windhoek.sql](update_gaborone_to_windhoek.sql) - Lines 1, 6, 9, 14-15: SQL migration script

#### Other Major Namibian Cities
- **Walvis Bay** - (2 references: locationUtils.ts, namibiaGovernment.ts)
- **Swakopmund** - (namibiaGovernment.ts)
- **Oshakati**, **Rundu**, **Katima Mulilo**, **Gobabis**, **Rehoboth**, **Mariental**, **Keetmanshoop**, **Outjo**, **Otjiwarongo** 
- **Tsumeb**, **Ondangwa**, **Ongwediva**, **Eenhana**, **Okahandja**, **Omaruru**, **Usakos**, **Karibib**, **Okakarara**, **Otavi** 
- **Lüderitz**, **Bethanie**, **Aus**, **Oranjemund**, **Aranos**, **Gibeon**, **Kalkrand**, **Stampriet**, **Aroab**, **Koës**, **Khorixas**, **Opuwo**, **Ruacana**, **Kamanjab**, **Sesfontein**, **Tsumkwe**, **Divundu**, **Bagani**, **Kongola**, **Sibbinda**

**Full List Location:** [src/data/namibiaLocations.ts](src/data/namibiaLocations.ts) - 90+ cities/regions

#### Botswana References (Likely Incorrect)
- **Issue:** [src/data/botswanaLocations.ts](src/data/botswanaLocations.ts) - File contains primarily South African cities AND some Namibian cities
- **Incorrect entries:** Gaborone, Nata, Shakawe, Maun, Kasane, Livingstone, Caprivi, Burao, Dipuo Falls
- **South African cities:** Springbok, Calvinia, Clanwilliam, Hermanus, Mossel Bay, Cape Town regions (extensive list)

---

## 3. LOGO FILE REFERENCES

### Total Count: 20+ references

#### Logo Files & Folder Structure
- **Folder:** `public/images/namibia-logo/`
- **Files:**
  - `fulllogo1.PNG`
  - `logo1.PNG`
  - `squarelogo.PNG` (Most referenced)
  - `textlogo1.PNG`
  - `logo-mobile.png` (Located in parent: `public/images/`)

#### Default Logo References

| File | Lines | Logo Path |
|------|-------|-----------|
| [src/shared/Logo.tsx](src/shared/Logo.tsx#L13-L14) | 13-14 | `/images/namibia-logo/squarelogo.PNG` (default & light) |
| [src/shared/Avatar.tsx](src/shared/Avatar.tsx#L24) | 24 | `/images/namibia-logo/squarelogo.PNG` (fallback) |
| [src/shared/Avatar.tsx](src/shared/Avatar.tsx#L50) | 50 | `/images/namibia-logo/squarelogo.PNG` (comparison) |
| [src/components/CarCard.tsx](src/components/CarCard.tsx#L38) | 38 | `/images/namibia-logo/squarelogo.PNG` (featured image fallback) |
| [src/components/CarCardH.tsx](src/components/CarCardH.tsx#L34) | 34 | `/images/namibia-logo/squarelogo.PNG` (featured image fallback) |
| [src/components/BusinessNav.tsx](src/components/BusinessNav.tsx#L34) | 34 | `/images/namibia-logo/squarelogo.PNG` (first photo fallback) |
| [src/app/(stay-listings)/SectionGridHasMap.tsx](src/app/(stay-listings)/SectionGridHasMap.tsx#L11) | 11 | `/images/namibia-logo/squarelogo.PNG` (logoMobile const) |
| [src/app/layout.tsx](src/app/layout.tsx#L22) | 22 | `/images/namibia-logo/fulllogo1.PNG` (favicon) |

#### Email Templates
- [src/emails/WelcomeEmail.tsx](src/emails/WelcomeEmail.tsx#L35) - Line 35: `/images/namibia-logo/logo-mobile.png`
- [src/emails/MarketingNotificationEmail.tsx](src/emails/MarketingNotificationEmail.tsx#L37) - Line 37: `/images/namibia-logo/logo-mobile.png`

#### Government/Parastatal Logos
- [src/data/namibiaGovernment.ts](src/data/namibiaGovernment.ts#L158) - Line 158: `/images/parastatalslogos/bank-of-namibia-logo.png`
- [src/data/govementdirectory.ts](src/data/govementdirectory.ts#L158) - Line 158: `/images/parastatalslogos/bank-of-namibia-logo.png`

**Import Patterns:**
- [src/shared/Navigation/NavMobile.tsx](src/shared/Navigation/NavMobile.tsx#L5) - Line 5: `import Logo from "@/shared/Logo"`
- [src/shared/LogoSvg.tsx](src/shared/LogoSvg.tsx#L3) - Line 3: `const LogoSvg = ()`
- [src/shared/LogoSvgLight.tsx](src/shared/LogoSvgLight.tsx#L3) - Line 3: `const LogoSvgLight = ()`

---

## 4. COLOR DEFINITIONS

### Color System Architecture
- **System:** CSS Variables + Tailwind Config
- **Files:** 
  - [src/styles/__theme_colors.scss](src/styles/__theme_colors.scss) - Main color definitions
  - [tailwind.config.js](tailwind.config.js) - Tailwind integration

### Primary Color Palette

#### Root Theme (Default - Indigo-CoolGrey)
```
Primary:    Indigo   (6000: 79,70,229)   (700: 67,56,202)
Secondary:  Teal     (600: 13,148,136)   (700: 15,118,110)
Neutral:    Grey     (600: 75,85,99)     (700: 55,65,81)
Burgundy:   Wine     (600: 166,60,80)    (700: 140,45,63) [PRIMARY OVERRIDE]
```

#### Burgundy Color Palette (Active Primary Override)
**Rationale:** Replaces orange for Namibia Services branding
```
--c-burgundy-50:  252, 242, 243   (very light)
--c-burgundy-100: 248, 225, 227
--c-burgundy-200: 240, 195, 200
--c-burgundy-300: 225, 153, 162
--c-burgundy-400: 205, 110, 125
--c-burgundy-500: 184, 78, 92     (medium)
--c-burgundy-600: 166, 60, 80     (PRIMARY: #A63C50)
--c-burgundy-700: 140, 45, 63     (DARK: #8C2D3F)
--c-burgundy-800: 113, 36, 50
--c-burgundy-900: 97, 30, 43      (very dark)
```

### Theme Palette Variants (6 Alternative Themes)

| Palette | Primary 600 | Primary 700 | Secondary | Neutral |
|---------|-------------|------------|-----------|---------|
| 1 (Cyan-BlueGrey) | 8,145,178 | 14,116,144 | Teal 600 | SlateGrey |
| 2 (Blue-BlueGrey) | 37,99,235 | 29,78,216 | Teal 600 | SlateGrey |
| 3 (Purple-BlueGrey) | 147,51,234 | 126,34,206 | Teal 600 | SlateGrey |
| 4 (Teal-BlueGrey) | 13,148,136 | 15,118,110 | Teal 600 | SlateGrey |
| 5 (BlueGrey-BlueGrey) | 71,85,105 | 51,65,85 | Teal 600 | SlateGrey |
| 6 (Red-WarmGrey) | 220,38,38 | 185,28,28 | Teal 600 | WarmGrey |

### Hex Color References in Documentation

| Color | Hex | Usage |
|-------|-----|-------|
| Burgundy 600 | `#6B2C2C` | Primary branded color |
| Burgundy 700 | `#8B3A3A` | Primary hover state |
| Orange 500 | `#F97316` | Premium tier indicator |
| Red 600 | `#DC2626` | Premium alternate |
| Green 600 | `#16A34A` | Success state |
| Grey 900 | `#1F2937` | Text dark |
| Grey 100 | `#F3F4F6` | Text light |

**Documentation Source:** [HOMEPAGE_INTEGRATION_GUIDE.md](HOMEPAGE_INTEGRATION_GUIDE.md#L172-L177)

### CSS Variable Integration

**File:** [tailwind.config.js](tailwind.config.js#L5-L82)

```javascript
// Custom colors use CSS variables
colors: {
  primary: {
    50: customColors("--c-primary-50"),
    6000: customColors("--c-primary-600"),  // Note: Non-standard "6000" value
    700: customColors("--c-primary-700"),
    // ... etc
  },
  burgundy: {
    600: customColors("--c-burgundy-600"),  // PRIMARY BRAND COLOR
    700: customColors("--c-burgundy-700"),
    // etc
  }
}
```

**Note:** Uses non-standard Tailwind naming (600 → 6000) in some places

---

## 5. HARDCODED COUNTRY/LOCATION STRINGS

### Default Country Setting: "Namibia"
- **Location:** [prisma/schema.prisma](prisma/schema.prisma#L71)
- **Field:** `country`
- **Type:** String with default
- **Default Value:** `"Namibia"`

### Payment/Currency Configuration

#### Currency: NAD (Namibian Dollar)
| File | Lines | Context |
|------|-------|---------|
| `HTTP_REQUEST_RESPONSE_ANALYSIS.md` | 102, 120, 134, 450, 459 | PayGate payment examples, currency field |
| `PAYGATE_WAF_FIX_COMPLETE.md` | 96, 329 | PayGate currency mapping, comments |
| `PAYMENT_FLOW_ANALYSIS.md` | 199 | Payment flow documentation |

#### Country Code: ZAF (South African - NOTED ISSUE)
| File | Lines | Context |
|------|-------|---------|
| `HTTP_REQUEST_RESPONSE_ANALYSIS.md` | 106, 134, 454, 461 | PayGate requests use ZAF (should be NA) |
| `PAYGATE_WAF_FIX_COMPLETE.md` | 100, 333 | PayGate country code references |

**⚠️ CRITICAL ISSUE:** Country code uses `ZAF` (South Africa) instead of `NA` (Namibia)

### Alternative Currency Found: BWP (Botswana Pula)
- **Count:** 5 references (appears to be documentation/legacy artifact)
- **Files:** 
  - `SUBSCRIPTION_SYSTEM.md` - Lines 27, 49
  - `IMPLEMENTATION_COMPLETE.md` - Line 41
  - `SUBSCRIPTION_QUICK_START.md` - Lines 41, 55
- **Status:** Likely documentation copy-paste error; not used in active code

### Locale Settings
- **References:** `en-za` (South African English locale in PayGate requests)
- **Files:** `HTTP_REQUEST_RESPONSE_ANALYSIS.md`, `PAYGATE_WAF_FIX_COMPLETE.md`
- **Issue:** Should likely be `en-na` for Namibia

---

## 6. DOMAIN REFERENCES

### Production Domain
- **Domain:** `namibiaservices.com`
- **Count:** 10+ references
- **Locations:**
  - `.env.production` - NEXTAUTH_URL, NEXT_PUBLIC_APP_URL
  - `AD_NETWORK_SETUP.md` - Website registration (x2)
  - `DEEP_ERROR_ANALYSIS.md` - API examples
  - Email templates - Logo URLs
  - Configuration documentation

### Development/Template Domains
- `your-domain.com` - `.env.neon` (template)
- `your-app.herokuapp.com` - `.env.production` (template)
- `https://example.com` - Documentation examples

---

## 7. DATABASE & FOLDER REFERENCES

### Cloudinary Configuration
| Environment | Value | File |
|-------------|-------|------|
| Neon (Dev) | `namibia-services` | `.env.neon` Line 54 |
| Production | `namibia-services` | `.env.production` Line 41 |

### Database Names
| Environment | Name | File |
|-------------|------|------|
| Development | `namibia_services` | `.env.production` Lines 14-15 |
| Production | `namibia_prod` | `.env.production` Lines 62-63 |

---

## 8. ISSUE: BOTSWANA LOCATION FILE

### Critical Finding
**File:** [src/data/botswanaLocations.ts](src/data/botswanaLocations.ts)

**Problem:** File is misnamed and contains mixed content
- **Export Name:** `NAMIBIA_LOCATIONS` (should not exist in botswana file)
- **Actual Content:**
  - Namibian cities (Windhoek, Walvis Bay, Swakopmund, etc.)
  - South African cities (Springbok, Cape Town area, etc.)
  - Some Botswana cities (Gaborone, Maun, Kasane)

**Recommendation:** Either delete this file or clarify its purpose

---

## SUMMARY TABLE

| Category | Count | Key Files | Status |
|----------|-------|-----------|--------|
| **Namibia References** | 27 | `.env.production`, emails, docs | ✅ Consistent |
| **Windhoek References** | 12+ | locationUtils.ts, geocoding.ts | ✅ Correct |
| **Gaborone References** | 6+ | update_gaborone_to_windhoek.sql | ⚠️ Legacy (migration) |
| **Cities/Regions** | 90+ | namibiaLocations.ts | ✅ Comprehensive |
| **Logo References** | 20+ | shared/Logo.tsx, components | ✅ Consistent |
| **Color Definitions** | 10+ themes | __theme_colors.scss, tailwind.config.js | ✅ Complete |
| **Domain References** | 10+ | .env files, docs | ✅ Consistent |
| **Currency (NAD)** | 8+ | PayGate configs | ✅ Namibia correct |
| **Country Code (ZAF)** | 5+ | PayGate requests | ❌ WRONG (should be NA) |
| **Locale (en-za)** | 2+ | PayGate requests | ⚠️ Should be en-na |

---

## RECOMMENDATIONS FOR SCOPE ASSESSMENT

### For Complete Location/Branding Rebrand:
1. ✅ **Namibia references** - Already consistently used
2. ⚠️ **Country code** - Change ZAF → NA in PayGate integration
3. ⚠️ **Locale** - Change en-za → en-na (if needed)
4. 🔄 **Logo folder** - Consider renaming to generic `/images/logo/` if supporting multiple countries
5. 🔄 **Color system** - Already uses burgundy; migrate from namibia-specific to generic if needed
6. ❌ **botswanaLocations.ts** - Requires cleanup/deletion
7. ✅ **City list** - Well-maintained in namibiaLocations.ts

### No Changes Needed (Already Generic/Correct):
- Tailwind color configuration (uses CSS variables)
- Color palette structure
- Logo component architecture
- Email template structure

