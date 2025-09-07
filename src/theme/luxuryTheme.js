import { Platform } from 'react-native';

// Luxury Theme System for Health Tracking App
export const luxuryTheme = {
  // Core Color Palette
  colors: {
    // Primary Background Colors
    primary: '#000000',
    primaryDark: '#0a0a0a',
    secondary: '#1a1a1a',
    surface: '#2a2a2a',
    
    // Electric Blue Accents
    accent: '#00d4ff',
    accentSecondary: '#0099ff',
    accentTertiary: '#007acc',
    
    // Burnt Orange Data Visualization
    dataVisualization: '#ff6b35',
    dataVisualizationDark: '#e55a2b',
    dataVisualizationLight: '#ff8555',
    
    // Green Accent Colors for Positive Metrics
    success: '#32cd32',
    successBright: '#00ff00',
    successDark: '#228b22',
    
    // Text Colors with High Contrast
    text: {
      primary: '#ffffff',
      secondary: '#e0e0e0',
      tertiary: '#b0b0b0',
      disabled: '#808080',
      accent: '#00d4ff',
      success: '#32cd32',
      warning: '#ff6b35',
      error: '#ff4444',
    },
    
    // Glass Morphism Effects
    glass: {
      background: 'rgba(255, 255, 255, 0.05)',
      backgroundDark: 'rgba(0, 0, 0, 0.3)',
      backgroundLight: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.1)',
      borderBright: 'rgba(0, 212, 255, 0.3)',
    },
    
    // Status Colors
    warning: '#ffb347',
    error: '#ff4444',
    info: '#00d4ff',
    
    // Border Colors
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.2)',
    borderAccent: 'rgba(0, 212, 255, 0.5)',
  },
  
  // Premium Gradients
  gradients: {
    primary: ['#000000', '#1a1a1a'],
    accent: ['#00d4ff', '#007acc'],
    dataVisualization: ['#ff6b35', '#e55a2b'],
    success: ['#32cd32', '#228b22'],
    glass: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
    radial: {
      accent: ['#00d4ff', '#007acc', '#000000'],
      warm: ['#ff6b35', '#e55a2b', '#000000'],
      success: ['#32cd32', '#228b22', '#000000'],
    },
  },
  
  // Shadow Definitions
  shadows: {
    small: {
      shadowColor: '#00d4ff',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#00d4ff',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#00d4ff',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    glow: {
      shadowColor: '#00d4ff',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    warm: {
      shadowColor: '#ff6b35',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 5,
    },
    success: {
      shadowColor: '#32cd32',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3,
    },
  },
  
  // Typography Scale
  typography: {
    // Display Text
    display: {
      fontSize: 48,
      fontWeight: '700',
      letterSpacing: -0.5,
      color: '#ffffff',
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto',
      }),
    },
    
    // Headlines
    h1: {
      fontSize: 36,
      fontWeight: '700',
      letterSpacing: -0.3,
      color: '#ffffff',
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto',
      }),
    },
    h2: {
      fontSize: 28,
      fontWeight: '600',
      letterSpacing: -0.2,
      color: '#ffffff',
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto',
      }),
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      letterSpacing: 0,
      color: '#ffffff',
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto',
      }),
    },
    h4: {
      fontSize: 20,
      fontWeight: '500',
      letterSpacing: 0,
      color: '#ffffff',
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto',
      }),
    },
    
    // Body Text
    body1: {
      fontSize: 16,
      fontWeight: '400',
      letterSpacing: 0.1,
      color: '#e0e0e0',
      lineHeight: 24,
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto',
      }),
    },
    body2: {
      fontSize: 14,
      fontWeight: '400',
      letterSpacing: 0.1,
      color: '#e0e0e0',
      lineHeight: 20,
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto',
      }),
    },
    
    // Captions and Labels
    caption: {
      fontSize: 12,
      fontWeight: '400',
      letterSpacing: 0.4,
      color: '#b0b0b0',
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto',
      }),
    },
    label: {
      fontSize: 11,
      fontWeight: '500',
      letterSpacing: 0.5,
      color: '#b0b0b0',
      textTransform: 'uppercase',
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto',
      }),
    },
    
    // Button Text
    button: {
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.5,
      color: '#ffffff',
      textTransform: 'uppercase',
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto',
      }),
    },
    
    // Numbers and Metrics
    metric: {
      fontSize: 32,
      fontWeight: '300',
      letterSpacing: -0.5,
      color: '#00d4ff',
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto',
      }),
    },
    metricLarge: {
      fontSize: 48,
      fontWeight: '200',
      letterSpacing: -1,
      color: '#00d4ff',
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto',
      }),
    },
  },
  
  // Spacing System
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  // Border Radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 50,
  },
  
  // Animation Timing
  animation: {
    timing: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeInOut: 'ease-in-out',
      easeOut: 'ease-out',
      easeIn: 'ease-in',
      linear: 'linear',
    },
  },
  
  // Glass Morphism Presets
  glassPresets: {
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
    },
    cardAccent: {
      backgroundColor: 'rgba(0, 212, 255, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(0, 212, 255, 0.3)',
      backdropFilter: 'blur(20px)',
    },
    modal: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(40px)',
    },
    navigation: {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(30px)',
    },
  },
  
  // Component Variants
  variants: {
    button: {
      primary: {
        backgroundColor: '#00d4ff',
        color: '#000000',
      },
      secondary: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        color: '#ffffff',
      },
      accent: {
        backgroundColor: '#ff6b35',
        color: '#ffffff',
      },
      success: {
        backgroundColor: '#32cd32',
        color: '#000000',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '#00d4ff',
      },
    },
    card: {
      elevated: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      flat: {
        backgroundColor: '#1a1a1a',
      },
      accent: {
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0, 212, 255, 0.3)',
      },
    },
  },
};

// Utility functions for theme usage
export const getThemeColor = (colorPath) => {
  const keys = colorPath.split('.');
  let value = luxuryTheme.colors;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      console.warn(`Theme color not found: ${colorPath}`);
      return '#ffffff';
    }
  }
  
  return value;
};

export const getThemeSpacing = (size) => {
  return luxuryTheme.spacing[size] || luxuryTheme.spacing.md;
};

export const getThemeTypography = (variant) => {
  return luxuryTheme.typography[variant] || luxuryTheme.typography.body1;
};

export default luxuryTheme;