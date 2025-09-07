/**
 * Luxury Color Palette for Health Tracking App
 * Organized color system with semantic naming and accessibility considerations
 */

// Base Color Palette
export const colors = {
  // Primary Black Palette
  black: {
    pure: '#000000',
    soft: '#0a0a0a',
    charcoal: '#1a1a1a',
    slate: '#2a2a2a',
  },

  // Electric Blue Palette
  blue: {
    electric: '#00d4ff',
    bright: '#0099ff',
    deep: '#007acc',
    steel: '#005c99',
    powder: '#33ddff',
    ice: '#66e6ff',
    glow: 'rgba(0, 212, 255, 0.8)',
  },

  // Burnt Orange Palette
  orange: {
    burnt: '#ff6b35',
    fire: '#e55a2b',
    ember: '#ff8555',
    coral: '#ff9970',
    sunset: '#cc4420',
    peach: '#ffaa88',
  },

  // Green Success Palette
  green: {
    lime: '#32cd32',
    electric: '#00ff00',
    forest: '#228b22',
    mint: '#66ff66',
    sage: '#90ee90',
    emerald: '#00cc66',
  },

  // White/Gray Scale
  white: {
    pure: '#ffffff',
    snow: '#fefefe',
    pearl: '#f8f8f8',
    silver: '#e0e0e0',
    platinum: '#d0d0d0',
    steel: '#c0c0c0',
    ash: '#b0b0b0',
    smoke: '#a0a0a0',
    graphite: '#808080',
    charcoal: '#606060',
    shadow: '#404040',
  },

  // Utility Colors
  warning: {
    primary: '#ffb347',
    secondary: '#ff9933',
    light: '#ffcc80',
  },
  
  error: {
    primary: '#ff4444',
    secondary: '#e53e3e',
    light: '#ff8080',
  },

  // Transparent Overlays
  overlay: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    heavy: 'rgba(255, 255, 255, 0.3)',
    dark: 'rgba(0, 0, 0, 0.3)',
    darker: 'rgba(0, 0, 0, 0.5)',
    darkest: 'rgba(0, 0, 0, 0.8)',
  },
};

// Semantic Color Mappings
export const semanticColors = {
  // Background Colors
  background: {
    primary: colors.black.pure,
    secondary: colors.black.soft,
    surface: colors.black.charcoal,
    elevated: colors.black.slate,
  },

  // Text Colors
  text: {
    primary: colors.white.pure,
    secondary: colors.white.silver,
    tertiary: colors.white.ash,
    disabled: colors.white.graphite,
    inverse: colors.black.pure,
  },

  // Interactive Colors
  interactive: {
    primary: colors.blue.electric,
    secondary: colors.blue.bright,
    tertiary: colors.blue.deep,
    hover: colors.blue.ice,
    pressed: colors.blue.steel,
    disabled: colors.white.graphite,
  },

  // Status Colors
  status: {
    success: colors.green.lime,
    successLight: colors.green.mint,
    warning: colors.warning.primary,
    warningLight: colors.warning.light,
    error: colors.error.primary,
    errorLight: colors.error.light,
    info: colors.blue.electric,
    infoLight: colors.blue.powder,
  },

  // Data Visualization Colors
  data: {
    primary: colors.orange.burnt,
    secondary: colors.orange.fire,
    tertiary: colors.orange.ember,
    quaternary: colors.orange.coral,
    accent: colors.blue.electric,
    success: colors.green.lime,
  },

  // Border Colors
  border: {
    default: 'rgba(255, 255, 255, 0.1)',
    light: 'rgba(255, 255, 255, 0.2)',
    accent: 'rgba(0, 212, 255, 0.5)',
    success: 'rgba(50, 205, 50, 0.5)',
    warning: 'rgba(255, 179, 71, 0.5)',
    error: 'rgba(255, 68, 68, 0.5)',
  },

  // Glass Morphism Colors
  glass: {
    background: colors.overlay.light,
    backgroundDark: colors.overlay.dark,
    backgroundHeavy: colors.overlay.heavy,
    border: 'rgba(255, 255, 255, 0.1)',
    borderBright: 'rgba(0, 212, 255, 0.3)',
  },
};

// Health Metrics Color Coding
export const healthColors = {
  heartRate: {
    zones: {
      resting: colors.blue.electric,
      fat_burn: colors.green.lime,
      cardio: colors.orange.burnt,
      peak: colors.error.primary,
    },
  },
  
  steps: {
    low: colors.white.ash,
    moderate: colors.blue.bright,
    high: colors.green.lime,
    excellent: colors.green.electric,
  },
  
  sleep: {
    awake: colors.orange.fire,
    light: colors.blue.powder,
    deep: colors.blue.deep,
    rem: colors.blue.electric,
  },
  
  activity: {
    sedentary: colors.white.graphite,
    light: colors.blue.ice,
    moderate: colors.orange.ember,
    vigorous: colors.orange.burnt,
  },
  
  nutrition: {
    calories: colors.orange.burnt,
    protein: colors.blue.electric,
    carbs: colors.green.lime,
    fat: colors.orange.fire,
  },
};

// Gradient Definitions
export const gradients = {
  primary: [colors.black.pure, colors.black.charcoal],
  accent: [colors.blue.electric, colors.blue.deep],
  warm: [colors.orange.burnt, colors.orange.fire],
  success: [colors.green.lime, colors.green.forest],
  
  // Radial Gradients
  radial: {
    accent: [colors.blue.electric, colors.blue.deep, colors.black.pure],
    warm: [colors.orange.burnt, colors.orange.fire, colors.black.pure],
    success: [colors.green.lime, colors.green.forest, colors.black.pure],
  },
  
  // Glass Effect Gradients
  glass: {
    light: [colors.overlay.light, colors.overlay.medium],
    dark: [colors.overlay.dark, colors.overlay.darker],
    accent: ['rgba(0, 212, 255, 0.1)', 'rgba(0, 212, 255, 0.05)'],
  },
};

// Color Utility Functions
export const colorUtils = {
  /**
   * Convert hex color to rgba
   */
  hexToRgba: (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  /**
   * Get contrast color (black or white) based on background
   */
  getContrastColor: (backgroundColor) => {
    // Simple luminance calculation
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? colors.black.pure : colors.white.pure;
  },

  /**
   * Create a color with specified opacity
   */
  withOpacity: (color, opacity) => {
    if (color.startsWith('rgba')) {
      return color.replace(/[\d\.]+\)$/g, `${opacity})`);
    }
    return colorUtils.hexToRgba(color, opacity);
  },

  /**
   * Get health metric color based on value and type
   */
  getHealthColor: (type, value, ranges) => {
    switch (type) {
      case 'heartRate':
        if (value < ranges.resting) return healthColors.heartRate.zones.resting;
        if (value < ranges.fatBurn) return healthColors.heartRate.zones.fat_burn;
        if (value < ranges.cardio) return healthColors.heartRate.zones.cardio;
        return healthColors.heartRate.zones.peak;
      
      case 'steps':
        if (value < 5000) return healthColors.steps.low;
        if (value < 8000) return healthColors.steps.moderate;
        if (value < 10000) return healthColors.steps.high;
        return healthColors.steps.excellent;
      
      default:
        return colors.blue.electric;
    }
  },

  /**
   * Create glass morphism background color
   */
  createGlassBackground: (baseColor = colors.white.pure, opacity = 0.1) => {
    return colorUtils.withOpacity(baseColor, opacity);
  },
};

// Accessibility Colors (WCAG AA compliant)
export const accessibleColors = {
  text: {
    primary: colors.white.pure, // 21:1 contrast on black
    secondary: colors.white.silver, // 15:1 contrast on black
    tertiary: colors.white.ash, // 7:1 contrast on black
  },
  interactive: {
    primary: colors.blue.electric, // 8.2:1 contrast on black
    focus: colors.blue.ice, // 10:1 contrast on black
  },
};

// Export everything
export default {
  colors,
  semanticColors,
  healthColors,
  gradients,
  colorUtils,
  accessibleColors,
};