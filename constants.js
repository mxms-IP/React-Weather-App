// ============================================
// API CONFIGURATION
// ============================================

export const API = {
  // Base URLs
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  GEO_BASE_URL: 'http://api.openweathermap.org/geo/1.0',
  ICON_BASE_URL: 'http://openweathermap.org/img/wn',
  
  // Endpoints
  ENDPOINTS: {
    CURRENT_WEATHER: '/weather',
    FORECAST_5DAY: '/forecast',
    GEO_ZIP: '/zip',
    ONE_CALL: '/onecall', // Deprecated, kept for reference
  },
  
  // Parameters
  PARAMS: {
    UNITS: 'metric',
    EXCLUDE: 'hourly,minutely',
  },
  
  // Icon Sizes
  ICON_SIZES: {
    SMALL: '@2x.png',
    LARGE: '@4x.png',
  }
};

// ============================================
// LAYOUT CONFIGURATION
// ============================================

export const LAYOUT = {
  // Container
  MAX_WIDTH: 600,
  HORIZONTAL_PADDING: 20,
  VERTICAL_PADDING: 20,
  
  // Spacing
  CARD_SPACING: 8,
  SECTION_SPACING: 10,
  ELEMENT_SPACING: 15,
  
  // Border Radius
  BORDER_RADIUS: {
    SMALL: 12,
    MEDIUM: 16,
    LARGE: 25,
  },
  
  // Shadows
  SHADOW: {
    LIGHT: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    MEDIUM: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
  }
};

// ============================================
// COLOR PALETTE
// ============================================

export const COLORS = {
  // Primary Colors
  PRIMARY: '#4a90e2',
  SUCCESS: '#27ae60',
  BACKGROUND: 'dodgerblue',
  
  // Card Backgrounds
  CARD_BG: 'rgba(255, 255, 255, 0.85)',
  CARD_BG_LIGHT: 'rgba(255, 255, 255, 0.95)',
  TOGGLE_BG: 'rgba(255, 255, 255, 0.25)',
  
  // Text Colors
  TEXT: {
    PRIMARY: '#2c3e50',
    SECONDARY: '#7f8c8d',
    TERTIARY: '#95a5a6',
    LIGHT: '#34495e',
    WHITE: '#ffffff',
  },
  
  // Input Colors
  PLACEHOLDER: 'rgba(0, 0, 0, 0.4)',
};

// ============================================
// DEFAULT VALUES
// ============================================

export const DEFAULTS = {
  LOCATION: {
    CITY: 'Islamabad',
    POSTAL_CODE: '44000',
    LATITUDE: 33.6996,
    LONGITUDE: 73.0362,
  },
  
  SEARCH_MODE: 'city', // or 'postal'
};

// ============================================
// POSTAL CODE PATTERNS
// ============================================

/**
 * Postal code patterns for different countries
 * Pattern order matters - more specific patterns should come first
 */
export const POSTAL_PATTERNS = {
  // Canada - Format: A1A 1A1 or A1A1A1 (letter-digit alternating)
  CA: /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/,
  
  // UK - Format: Various (A1, A11, AA1, AA11, A1A, AA1A, etc.)
  UK: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/,
  
  // India - Format: 6 digits (e.g., 110001)
  IN: /^\d{6}$/,
  
  // Pakistan - Format: 5 digits (e.g., 44000, 54000)
  PK: /^\d{5}$/,
  
  // Australia - Format: 4 digits (e.g., 2000, 3000)
  AU: /^\d{4}$/,
  
  // USA - Format: 5 digits (e.g., 10001) or 5+4 (e.g., 10001-1234)
  US: /^\d{5}(-\d{4})?$/,
  
  // Germany - Format: 5 digits (e.g., 10115)
  DE: /^\d{5}$/,
  
  // France - Format: 5 digits (e.g., 75001)
  FR: /^\d{5}$/,
  
  // Spain - Format: 5 digits (e.g., 28001)
  ES: /^\d{5}$/,
  
  // Italy - Format: 5 digits (e.g., 00100)
  IT: /^\d{5}$/,
  
  // Netherlands - Format: 4 digits + 2 letters (e.g., 1012 AB)
  NL: /^\d{4}\s?[A-Z]{2}$/,
  
  // Brazil - Format: 5 digits + hyphen + 3 digits (e.g., 01310-100)
  BR: /^\d{5}-\d{3}$/,
  
  // China - Format: 6 digits (e.g., 100000)
  CN: /^\d{6}$/,
  
  // Japan - Format: 7 digits with hyphen (e.g., 100-0001)
  JP: /^\d{3}-\d{4}$/,
  
  // South Korea - Format: 5 digits (e.g., 03051)
  KR: /^\d{5}$/,
};

/**
 * Country codes for major cities (helps with ambiguous 5-digit codes)
 * Used when postal code pattern matches multiple countries
 */
export const CITY_COUNTRY_HINTS = {
  // Pakistan major cities (5-digit postal codes starting with specific ranges)
  '44': 'PK', // Islamabad area (44000)
  '45': 'PK', // Rawalpindi area
  '46': 'PK', // Rawalpindi area
  '54': 'PK', // Lahore area
  '74': 'PK', // Karachi area
  '75': 'PK', // Karachi area
  
  // India major cities (6-digit postal codes)
  '110': 'IN', // Delhi
  '400': 'IN', // Mumbai
  '560': 'IN', // Bangalore
  '600': 'IN', // Chennai
  
  // US major cities (5-digit)
  '100': 'US', // New York area
  '900': 'US', // California area
  '600': 'US', // Chicago area (conflicts with Chennai - need length check)
};

// ============================================
// TYPOGRAPHY
// ============================================

export const TYPOGRAPHY = {
  SIZES: {
    HERO: 72,
    TITLE: 24,
    HEADING: 20,
    SUBHEADING: 18,
    BODY: 16,
    LABEL: 14,
    CAPTION: 13,
    SMALL: 12,
  },
  
  WEIGHTS: {
    LIGHT: '300',
    REGULAR: '400',
    MEDIUM: '500',
    SEMIBOLD: '600',
    BOLD: '700',
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Builds complete API URL
 * @param {string} endpoint - API endpoint
 * @param {object} params - Query parameters
 * @returns {string} Complete URL
 */
export const buildApiUrl = (endpoint, params = {}) => {
  const base = endpoint.startsWith('/geo') ? API.GEO_BASE_URL : API.BASE_URL;
  const url = new URL(endpoint, base);
  
  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });
  
  return url.toString();
};

/**
 * Gets weather icon URL
 * @param {string} iconCode - Weather icon code
 * @param {string} size - Icon size ('SMALL' or 'LARGE')
 * @returns {string} Complete icon URL
 */
export const getIconUrl = (iconCode, size = 'SMALL') => {
  return `${API.ICON_BASE_URL}/${iconCode}${API.ICON_SIZES[size]}`;
};

/**
 * Detects country from postal code format
 * Uses pattern matching and city hints for ambiguous codes
 * 
 * @param {string} postalCode - Postal code to check
 * @returns {string} Country code (e.g., 'PK', 'US', 'IN')
 * 
 * Examples:
 * - '44000' → 'PK' (Pakistan - Islamabad)
 * - '110001' → 'IN' (India - 6 digits)
 * - '10001' → 'US' (USA - no city hint match)
 * - 'M5H 2N2' → 'CA' (Canada - letter-digit pattern)
 */
export const detectCountryFromPostal = (postalCode) => {
  const clean = postalCode.replace(/\s/g, '').toUpperCase();
  
  // Check unique patterns first (most specific)
  
  // Canada - Unique letter-digit pattern
  if (POSTAL_PATTERNS.CA.test(clean)) return 'CA';
  
  // UK - Alphanumeric pattern
  if (POSTAL_PATTERNS.UK.test(postalCode.toUpperCase())) return 'GB';
  
  // Netherlands - 4 digits + 2 letters
  if (POSTAL_PATTERNS.NL.test(clean)) return 'NL';
  
  // Brazil - Format with hyphen
  if (POSTAL_PATTERNS.BR.test(clean)) return 'BR';
  
  // Japan - 7 digits with hyphen
  if (POSTAL_PATTERNS.JP.test(clean)) return 'JP';
  
  // 6-digit codes (India vs China)
  if (/^\d{6}$/.test(clean)) {
    // Check city hints for India
    const prefix = clean.substring(0, 3);
    if (CITY_COUNTRY_HINTS[prefix] === 'IN') return 'IN';
    
    // Default 6-digit to India (more common in OpenWeather)
    return 'IN';
  }
  
  // 4-digit codes (Australia)
  if (POSTAL_PATTERNS.AU.test(clean)) return 'AU';
  
  // 5-digit codes (USA, Pakistan, Germany, France, Spain, Italy, South Korea)
  // This is the most ambiguous - need to use city hints
  if (/^\d{5}(-\d{4})?$/.test(clean)) {
    const prefix2 = clean.substring(0, 2);
    
    // Check Pakistan city hints first (44xxx, 54xxx, 74xxx, etc.)
    if (CITY_COUNTRY_HINTS[prefix2] === 'PK') {
      return 'PK';
    }
    
    // Check US city hints
    const prefix3 = clean.substring(0, 3);
    if (CITY_COUNTRY_HINTS[prefix3] === 'US') {
      return 'US';
    }
    
    // Check for extended ZIP+4 format (uniquely US)
    if (clean.includes('-')) {
      return 'US';
    }
    
    // Check digit patterns for specific countries
    
    // Germany - often starts with 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    // But overlaps with others, so hard to distinguish
    
    // Pakistan postal codes often start with: 1-9 (no leading zero typically)
    // US postal codes can start with 0
    const firstDigit = clean[0];
    if (firstDigit === '0' && clean.length === 5) {
      // Likely US (many US codes start with 0, Pakistan codes don't)
      return 'US';
    }
    
    // For now, default 5-digit to US
    // But Pakistan codes will be caught by city hints above
    return 'US';
  }
  
  // Default fallback to US
  return 'US';
};

/**
 * Gets a user-friendly country name from country code
 * @param {string} countryCode - ISO country code
 * @returns {string} Country name
 */
export const getCountryName = (countryCode) => {
  const countryNames = {
    'US': 'United States',
    'CA': 'Canada',
    'GB': 'United Kingdom',
    'PK': 'Pakistan',
    'IN': 'India',
    'AU': 'Australia',
    'DE': 'Germany',
    'FR': 'France',
    'ES': 'Spain',
    'IT': 'Italy',
    'NL': 'Netherlands',
    'BR': 'Brazil',
    'CN': 'China',
    'JP': 'Japan',
    'KR': 'South Korea',
  };
  
  return countryNames[countryCode] || countryCode;
};