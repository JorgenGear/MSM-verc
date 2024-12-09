/**
 * Theme-related type definitions
 */

// Props for themed components
export interface ThemeProps {
    lightColor?: string;
    darkColor?: string;
  }
  
  // You can add other type definitions here as well
  export type ColorScheme = 'light' | 'dark';
  
  export interface ThemeColors {
    background: string;
    text: string;
    primary: string;
    // ... other color properties
  }