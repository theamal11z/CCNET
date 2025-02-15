import { createTheme } from '@shopify/restyle';

// Color palette
const palette = {
  // Base colors from homescreenui.md
  campusBlue: '#1A73E8',
  verifiedGreen: '#34A853',
  alertRed: '#EA4335',
  
  // Light mode
  lightBg: '#F8F9FA',
  lightText: '#202124',
  lightSubtext: '#5F6368',
  lightBorder: '#E0E0E0',
  lightSurface: '#FFFFFF',
  
  // Dark mode
  darkBg: '#202124',
  darkText: '#FFFFFF',
  darkSubtext: '#9AA0A6',
  darkBorder: '#3C4043',
  darkSurface: '#2D2E31',
};

// Typography scale
const typography = {
  headline1: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
  },
  headline2: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  headline3: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  body1: {
    fontFamily: 'System',
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontFamily: 'System',
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: 'System',
    fontSize: 12,
    lineHeight: 16,
  },
};

// Spacing scale
const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
};

// Base theme configuration
const baseTheme = {
  colors: {
    primary: palette.campusBlue,
    secondary: palette.verifiedGreen,
    error: palette.alertRed,
  },
  spacing,
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  textVariants: typography,
};

// Light theme
export const lightTheme = createTheme({
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    background: palette.lightBg,
    foreground: palette.lightText,
    secondaryText: palette.lightSubtext,
    border: palette.lightBorder,
    surface: palette.lightSurface,
  },
});

// Dark theme
export const darkTheme = createTheme({
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    background: palette.darkBg,
    foreground: palette.darkText,
    secondaryText: palette.darkSubtext,
    border: palette.darkBorder,
    surface: palette.darkSurface,
  },
});

// Campus theme generator
export const createCampusTheme = (colors: {
  primary: string;
  secondary: string;
  accent: string;
}, isDark = false) => {
  const baseThemeToUse = isDark ? darkTheme : lightTheme;
  
  return createTheme({
    ...baseThemeToUse,
    colors: {
      ...baseThemeToUse.colors,
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
    },
  });
};

// Type exports
export type Theme = typeof lightTheme;
export type ThemeColors = keyof Theme['colors'];
export type TextVariants = keyof Theme['textVariants'];

// Example campus themes
export const campusThemes = {
  stateUniversity: {
    primary: '#0F4D92',
    secondary: '#FFD700',
    accent: '#DC143C',
  },
  techInstitute: {
    primary: '#800000',
    secondary: '#C0C0C0',
    accent: '#FFD700',
  },
}; 