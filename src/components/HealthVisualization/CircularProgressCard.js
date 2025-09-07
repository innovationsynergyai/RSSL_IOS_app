import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const CircularProgressCard = ({
  title,
  score,
  maxScore = 100,
  subtitle,
  icon,
  size = 120,
  strokeWidth = 8,
  onPress,
  style,
  scoreColor = '#00D4FF',
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  gradientColors = ['rgba(0, 0, 0, 0.9)', 'rgba(0, 30, 60, 0.5)'],
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (score / maxScore) * 100;

  useEffect(() => {
    // Animate progress
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Pulse animation for high scores
    if (score >= maxScore * 0.8) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [score, maxScore]);

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

  const getScoreColor = () => {
    const percent = percentage;
    if (percent >= 85) return '#22C55E'; // Green
    if (percent >= 70) return '#00D4FF'; // Electric blue
    if (percent >= 50) return '#F59E0B'; // Burnt orange
    return '#EF4444'; // Red
  };

  const getScoreLabel = () => {
    const percent = percentage;
    if (percent >= 85) return 'Excellent';
    if (percent >= 70) return 'Good';
    if (percent >= 50) return 'Fair';
    return 'Needs Attention';
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
        <BlurView intensity={25} style={styles.blurContainer}>
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
              </View>

              {/* Circular Progress */}
              <Animated.View
                style={[
                  styles.progressContainer,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                <Svg width={size} height={size} style={styles.svg}>
                  <Defs>
                    <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
                      <Stop offset="0%" stopColor={getScoreColor()} stopOpacity="0.8" />
                      <Stop offset="70%" stopColor={getScoreColor()} stopOpacity="0.4" />
                      <Stop offset="100%" stopColor={getScoreColor()} stopOpacity="0.1" />
                    </RadialGradient>
                  </Defs>

                  {/* Background Circle */}
                  <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                  />

                  {/* Progress Circle */}
                  <Animated.Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={getScoreColor()}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={animatedValue.interpolate({
                      inputRange: [0, 100],
                      outputRange: [circumference, 0],
                    })}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    style={{
                      filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.6))',
                    }}
                  />

                  {/* Glow Effect */}
                  <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius + 15}
                    fill="url(#glow)"
                    opacity="0.3"
                  />
                </Svg>

                {/* Score Display */}
                <View style={styles.scoreContainer}>
                  <Text style={[styles.score, { color: getScoreColor() }]}>
                    {Math.round(score)}
                  </Text>
                  <Text style={styles.maxScore}>/{maxScore}</Text>
                </View>
              </Animated.View>

              {/* Score Label */}
              <View style={styles.labelContainer}>
                <Text style={[styles.scoreLabel, { color: getScoreColor() }]}>
                  {getScoreLabel()}
                </Text>
                {subtitle && (
                  <Text style={styles.subtitle}>{subtitle}</Text>
                )}
              </View>

              {/* Progress Percentage */}
              <View style={styles.percentageContainer}>
                <View
                  style={[
                    styles.percentageBar,
                    {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.percentageFill,
                      {
                        backgroundColor: getScoreColor(),
                        width: animatedValue.interpolate({
                          inputRange: [0, 100],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.percentageText}>
                  {Math.round(percentage)}%
                </Text>
              </View>
            </View>

            {/* Glass reflection effect */}
            <View style={styles.glassReflection} />
          </LinearGradient>
        </BlurView>

        {/* Elite border glow */}
        <View style={[styles.borderGlow, { borderColor: `${getScoreColor()}40` }]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: '#00D4FF',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  blurContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  gradient: {
    padding: 24,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  header: {
    width: '100%',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
    opacity: 0.9,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  progressContainer: {
    position: 'relative',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  scoreContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 212, 255, 0.4)',
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 12,
  },
  maxScore: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: -4,
  },
  labelContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    textAlign: 'center',
  },
  percentageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  percentageBar: {
    width: '80%',
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  percentageFill: {
    height: '100%',
    borderRadius: 3,
    shadowColor: '#00D4FF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.3,
  },
  glassReflection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  borderGlow: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 27,
    backgroundColor: 'transparent',
    borderWidth: 2,
    zIndex: -1,
  },
});

export default CircularProgressCard;