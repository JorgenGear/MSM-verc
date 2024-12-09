/**
 * Color scheme for MainStreet Markets - Logan, Utah
 */

// Primary color - A deep, trustworthy green representing Cache Valley's natural beauty
const PRIMARY_GREEN = '#1A4D2E';  // Darker green for trust and stability

// Secondary colors
const MOUNTAIN_SAGE = '#9EB384';  // Sage green representing local flora
const CACHE_BLUE = '#435585';     // Deep blue for mountain skies
const SUNSET_GOLD = '#FFB000';    // Warm gold for Utah sunsets
const BRICK_RED = '#9E2A2B';      // Historic downtown brick color

// UI Colors
const OFF_WHITE = '#F9F9F9';      // Clean, crisp background
const LIGHT_SAGE = '#F3F8F3';     // Very light sage for cards
const NEUTRAL_GRAY = '#6B7280';   // Balanced gray for text

export const Colors = {
  light: {
    // Core UI
    text: '#1F2937',            // Dark gray for readable text
    background: '#FFFFFF',       // Clean white background
    tint: PRIMARY_GREEN,        // Primary color tint
    primary: PRIMARY_GREEN,     // Main brand color
    secondary: SUNSET_GOLD,     // CTA and highlights
    accent: MOUNTAIN_SAGE,      // Secondary elements

    // UI Elements
    icon: NEUTRAL_GRAY,
    tabIconDefault: NEUTRAL_GRAY,
    tabIconSelected: PRIMARY_GREEN,
    
    // Status Colors
    success: '#0A8554',         // Success green
    warning: SUNSET_GOLD,       // Warning color
    error: BRICK_RED,           // Error state
    
    // Interactive Elements
    link: PRIMARY_GREEN,
    buttonPrimary: PRIMARY_GREEN,
    buttonSecondary: SUNSET_GOLD,
    
    // Surfaces
    cardBackground: LIGHT_SAGE,
    surfaceBackground: '#FFFFFF',
    productCardBackground: LIGHT_SAGE,
    categoryButtonBackground: LIGHT_SAGE,
    searchBar: '#FFFFFF',
    
    // Borders and Dividers
    border: '#E5E7EB',
    divider: '#E5E7EB',
    
    // Special Elements
    headerBackground: PRIMARY_GREEN,
    footerBackground: PRIMARY_GREEN,
    ratingStars: SUNSET_GOLD,
    priceRed: BRICK_RED,
    dealGreen: PRIMARY_GREEN,
    saveBadge: BRICK_RED,

    // Text Variations
    textSecondary: NEUTRAL_GRAY,
    textMuted: '#9CA3AF',
    categoryButtonText: '#1F2937',
    
    // Backgrounds
    lightBackground: OFF_WHITE,
    inputBackground: '#FFFFFF',
    tagBackground: LIGHT_SAGE,
    navBackground: OFF_WHITE,

    // Interactive States
    buttonHover: '#FFD814',
    linkHover: MOUNTAIN_SAGE,
  },
  dark: {
    // For now, using light theme colors as specified in the original code
    // We can implement dark theme later if needed
    text: '#1F2937',
    background: '#FFFFFF',
    tint: PRIMARY_GREEN,
    primary: PRIMARY_GREEN,
    secondary: SUNSET_GOLD,
    accent: MOUNTAIN_SAGE,
    icon: NEUTRAL_GRAY,
    tabIconDefault: NEUTRAL_GRAY,
    tabIconSelected: PRIMARY_GREEN,
    success: '#0A8554',
    warning: SUNSET_GOLD,
    error: BRICK_RED,
    border: '#E5E7EB',
    searchBar: '#FFFFFF',
    cardBackground: LIGHT_SAGE,
    link: PRIMARY_GREEN,
    ratingStars: SUNSET_GOLD,
    priceRed: BRICK_RED,
    dealGreen: PRIMARY_GREEN,
    saveBadge: BRICK_RED,
    lightBackground: OFF_WHITE,
    headerBackground: PRIMARY_GREEN,
    footerBackground: PRIMARY_GREEN,
    surfaceBackground: '#FFFFFF',
    divider: '#E5E7EB',
    inputBackground: '#FFFFFF',
    buttonHover: '#FFD814',
    navBackground: OFF_WHITE,
    tagBackground: LIGHT_SAGE,
    productCardBackground: LIGHT_SAGE,
    categoryButtonBackground: LIGHT_SAGE,
    categoryButtonText: '#1F2937',
  },
};