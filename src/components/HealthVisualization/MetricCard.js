import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const MetricCard = ({
  title,
  value,
  unit,
  subtitle,
  icon,
  trend,
  trendDirection,
  onPress,
  style,
  valueColor = '#00D4FF',
  gradientColors = ['rgba(0, 0, 0, 0.8)', 'rgba(0, 30, 60, 0.4)'],
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getTrendColor = () => {
    if (trendDirection === 'up') return '#22C55E';
    if (trendDirection === 'down') return '#EF4444';
    return '#94A3B8';
  };

  const getTrendIcon = () => {
    if (trendDirection === 'up') return '↗';
    if (trendDirection === 'down') return '↘';
    return '→';
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={!onPress}
    >
      <Animated.View
        style={[
          styles.container,
          style,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <BlurView intensity={20} style={styles.blurContainer}>
          <LinearGradient
            colors={gradientColors}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.titleContainer}>
                  {icon && <Text style={styles.icon}>{icon}</Text>}
                  <Text style={styles.title}>{title}</Text>
                </View>
                {trend && (
                  <View style={styles.trendContainer}>
                    <Text style={[styles.trendIcon, { color: getTrendColor() }]}>
                      {getTrendIcon()}
                    </Text>
                    <Text style={[styles.trend, { color: getTrendColor() }]}>
                      {trend}
                    </Text>
                  </View>
                )}
              </View>

              {/* Value */}
              <View style={styles.valueContainer}>
                <Text style={[styles.value, { color: valueColor }]}>
                  {value}
                </Text>
                {unit && (
                  <Text style={styles.unit}>{unit}</Text>
                )}
              </View>

              {/* Subtitle */}
              {subtitle && (
                <Text style={styles.subtitle}>{subtitle}</Text>
              )}
            </View>

            {/* Glass reflection effect */}
            <View style={styles.glassReflection} />
          </LinearGradient>
        </BlurView>

        {/* Elite border glow */}
        <View style={styles.borderGlow} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginVertical: 6,
    marginHorizontal: 4,
    shadowColor: '#00D4FF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  blurContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gradient: {
    padding: 20,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
    opacity: 0.8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.5,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  trendIcon: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  trend: {
    fontSize: 12,
    fontWeight: '600',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 8,
  },
  value: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 212, 255, 0.3)',
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 10,
  },
  unit: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  glassReflection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  borderGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 22,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 255, 0.2)',
    zIndex: -1,
  },
});

export default MetricCard;