import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { luxuryTheme } from '../theme/luxuryTheme';

/**
 * GlassContainer - A reusable glass morphism container component
 * Provides beautiful glass effects with blur backgrounds for luxury UI
 */
const GlassContainer = ({
  children,
  style,
  variant = 'default',
  intensity = 20,
  tint = 'dark',
  borderRadius = luxuryTheme.borderRadius.lg,
  padding = luxuryTheme.spacing.md,
  margin,
  shadowVariant = 'medium',
  glowEffect = false,
  accentBorder = false,
  ...props
}) => {
  // Get variant styles
  const getVariantStyle = () => {
    switch (variant) {
      case 'card':
        return styles.cardVariant;
      case 'modal':
        return styles.modalVariant;
      case 'navigation':
        return styles.navigationVariant;
      case 'accent':
        return styles.accentVariant;
      case 'subtle':
        return styles.subtleVariant;
      case 'prominent':
        return styles.prominentVariant;
      default:
        return styles.defaultVariant;
    }
  };

  // Get shadow style
  const getShadowStyle = () => {
    if (shadowVariant === 'none') return {};
    return luxuryTheme.shadows[shadowVariant] || luxuryTheme.shadows.medium;
  };

  // Get glow effect style
  const getGlowStyle = () => {
    if (!glowEffect) return {};
    return {
      ...luxuryTheme.shadows.glow,
      shadowColor: accentBorder ? luxuryTheme.colors.accent : luxuryTheme.colors.dataVisualization,
    };
  };

  // Determine if we should use BlurView or regular View
  const shouldUseBlur = Platform.OS === 'ios' && variant !== 'solid';

  if (shouldUseBlur) {
    return (
      <BlurView
        intensity={intensity}
        tint={tint}
        style={[
          styles.container,
          getVariantStyle(),
          getShadowStyle(),
          getGlowStyle(),
          {
            borderRadius,
            padding,
            margin,
            borderColor: accentBorder 
              ? luxuryTheme.colors.borderAccent 
              : luxuryTheme.colors.border,
          },
          style,
        ]}
        {...props}
      >
        {children}
      </BlurView>
    );
  }

  // Fallback for Android or when blur is not available
  return (
    <View
      style={[
        styles.container,
        styles.fallbackContainer,
        getVariantStyle(),
        getShadowStyle(),
        getGlowStyle(),
        {
          borderRadius,
          padding,
          margin,
          borderColor: accentBorder 
            ? luxuryTheme.colors.borderAccent 
            : luxuryTheme.colors.border,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  
  // Fallback for when BlurView is not available
  fallbackContainer: {
    backgroundColor: luxuryTheme.colors.glass.background,
    borderWidth: 1,
  },
  
  // Variant Styles
  defaultVariant: {
    backgroundColor: Platform.OS === 'ios' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : luxuryTheme.colors.glass.background,
    borderWidth: 1,
    borderColor: luxuryTheme.colors.glass.border,
  },
  
  cardVariant: {
    backgroundColor: Platform.OS === 'ios' 
      ? 'rgba(255, 255, 255, 0.08)' 
      : luxuryTheme.colors.glass.backgroundLight,
    borderWidth: 1,
    borderColor: luxuryTheme.colors.glass.border,
  },
  
  modalVariant: {
    backgroundColor: Platform.OS === 'ios' 
      ? 'rgba(0, 0, 0, 0.6)' 
      : luxuryTheme.colors.glass.backgroundDark,
    borderWidth: 1,
    borderColor: luxuryTheme.colors.glass.border,
  },
  
  navigationVariant: {
    backgroundColor: Platform.OS === 'ios' 
      ? 'rgba(0, 0, 0, 0.8)' 
      : 'rgba(0, 0, 0, 0.95)',
    borderTopWidth: 1,
    borderTopColor: luxuryTheme.colors.glass.border,
  },
  
  accentVariant: {
    backgroundColor: Platform.OS === 'ios' 
      ? 'rgba(0, 212, 255, 0.1)' 
      : 'rgba(0, 212, 255, 0.15)',
    borderWidth: 1,
    borderColor: luxuryTheme.colors.glass.borderBright,
  },
  
  subtleVariant: {
    backgroundColor: Platform.OS === 'ios' 
      ? 'rgba(255, 255, 255, 0.03)' 
      : 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  prominentVariant: {
    backgroundColor: Platform.OS === 'ios' 
      ? 'rgba(255, 255, 255, 0.12)' 
      : 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

// Higher-order component for easily wrapping components with glass effect
export const withGlassEffect = (WrappedComponent, glassProps = {}) => {
  return React.forwardRef((props, ref) => (
    <GlassContainer {...glassProps}>
      <WrappedComponent ref={ref} {...props} />
    </GlassContainer>
  ));
};

// Specialized glass container variants
export const GlassCard = (props) => (
  <GlassContainer variant="card" {...props} />
);

export const GlassModal = (props) => (
  <GlassContainer 
    variant="modal" 
    borderRadius={luxuryTheme.borderRadius.xl}
    shadowVariant="large"
    {...props} 
  />
);

export const GlassNavigation = (props) => (
  <GlassContainer 
    variant="navigation" 
    borderRadius={0}
    padding={luxuryTheme.spacing.sm}
    {...props} 
  />
);

export const GlassMetricCard = (props) => (
  <GlassContainer
    variant="accent"
    glowEffect={true}
    accentBorder={true}
    borderRadius={luxuryTheme.borderRadius.xl}
    shadowVariant="glow"
    {...props}
  />
);

// Utility function to create glass morphism styles for custom components
export const createGlassStyle = ({
  variant = 'default',
  intensity = 0.05,
  borderRadius = luxuryTheme.borderRadius.lg,
  borderWidth = 1,
  accentBorder = false,
} = {}) => {
  const baseStyle = {
    backgroundColor: `rgba(255, 255, 255, ${intensity})`,
    borderRadius,
    borderWidth,
    borderColor: accentBorder 
      ? luxuryTheme.colors.borderAccent 
      : luxuryTheme.colors.border,
    overflow: 'hidden',
  };

  switch (variant) {
    case 'dark':
      return {
        ...baseStyle,
        backgroundColor: `rgba(0, 0, 0, ${intensity + 0.3})`,
      };
    case 'accent':
      return {
        ...baseStyle,
        backgroundColor: `rgba(0, 212, 255, ${intensity + 0.05})`,
        borderColor: luxuryTheme.colors.borderAccent,
      };
    case 'warm':
      return {
        ...baseStyle,
        backgroundColor: `rgba(255, 107, 53, ${intensity + 0.03})`,
        borderColor: 'rgba(255, 107, 53, 0.3)',
      };
    case 'success':
      return {
        ...baseStyle,
        backgroundColor: `rgba(50, 205, 50, ${intensity + 0.03})`,
        borderColor: 'rgba(50, 205, 50, 0.3)',
      };
    default:
      return baseStyle;
  }
};

export default GlassContainer;