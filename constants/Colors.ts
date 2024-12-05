/**
 * Color scheme inspired by Amazon's design, adapted for local business marketplace
 */

const tintColorLight = '#232f3e'; // Dark blue (primary)
const tintColorDark = '#ff9900'; // Orange accent

export const Colors = {
  light: {
    text: '#111111',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#555555',
    tabIconDefault: '#687076',
    tabIconSelected: '#ff9900',
    primary: '#232f3e',     // Dark blue
    secondary: '#ff9900',   // Orange
    accent: '#37475a',      // Lighter blue
    success: '#168342',     // Green for success states
    warning: '#ff9900',     // Orange for warnings
    error: '#d41f1f',       // Red for errors
    border: '#dddddd',      // Light gray for borders
    searchBar: '#febd69',   // Light orange for search
  },
  dark: {
    text: '#ffffff',
    background: '#191919',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#ff9900',
    primary: '#232f3e',     // Dark blue
    secondary: '#ff9900',   // Orange
    accent: '#37475a',      // Lighter blue
    success: '#168342',     // Green for success states
    warning: '#ff9900',     // Orange for warnings
    error: '#d41f1f',       // Red for errors
    border: '#2d2d2d',      // Dark gray for borders
    searchBar: '#37475a',   // Dark blue for search
  },
};
