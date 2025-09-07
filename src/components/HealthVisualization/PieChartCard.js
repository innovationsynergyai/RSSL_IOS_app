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
import Svg, { Path, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const PieChartCard = ({
  title,
  data = [],
  size = 140,
  onPress,
  style,
  gradientColors = ['rgba(0, 0, 0, 0.9)', 'rgba(0, 30, 60, 0.5)'],
  showLegend = true,
  centerContent,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 20;
  const centerX = size / 2;
  const centerY = size / 2;

  // Default sleep stage colors
  const defaultColors = {
    'Deep Sleep': '#1E40AF', // Deep blue
    'Light Sleep': '#3B82F6', // Blue
    'REM Sleep': '#8B5CF6', // Purple
    'Awake': '#EF4444', // Red
  };

  useEffect(() => {
    // Animate pie chart
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Gentle rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 60000,
        useNativeDriver: true,
      })
    ).start();
  }, [data]);

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

  const createPath = (startAngle, endAngle, radius, centerX, centerY) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M', centerX, centerY,
      'L', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      'Z'
    ].join(' ');
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const renderPieSlices = () => {
    let currentAngle = 0;
    
    return data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const sliceAngle = (item.value / total) * 360;
      const nextAngle = currentAngle + sliceAngle;
      
      const path = createPath(currentAngle, nextAngle, radius, centerX, centerY);
      const color = item.color || defaultColors[item.label] || `hsl(${index * 60}, 70%, 60%)`;
      
      const pathElement = (
        <Animated.Path
          key={index}
          d={path}
          fill={color}
          opacity={animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.8],
          })}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="2"
          style={{
            filter: `drop-shadow(0 0 8px ${color}60)`,
          }}
        />
      );
      
      currentAngle = nextAngle;
      return pathElement;
    });
  };

  const renderLegend = () => {
    if (!showLegend) return null;

    return (
      <View style={styles.legend}>
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          const color = item.color || defaultColors[item.label] || `hsl(${index * 60}, 70%, 60%)`;
          
          return (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: color }]} />
              <View style={styles.legendText}>
                <Text style={styles.legendLabel}>{item.label}</Text>
                <Text style={styles.legendValue}>
                  {item.value} {item.unit || 'min'} ({percentage}%)
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderCenterContent = () => {
    if (centerContent) {
      return (
        <View style={styles.centerContent}>
          {centerContent}
        </View>
      );
    }

    return (
      <View style={styles.centerContent}>
        <Text style={styles.centerTitle}>Total</Text>
        <Text style={styles.centerValue}>
          {Math.round(total / 60)}h {total % 60}m
        </Text>
      </View>
    );
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
              {/* Title */}
              <Text style={styles.title}>{title}</Text>

              {/* Pie Chart */}
              <View style={styles.chartContainer}>
                <Animated.View
                  style={[
                    styles.pieContainer,
                    {
                      transform: [
                        {
                          rotate: rotateAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '360deg'],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Svg width={size} height={size} style={styles.svg}>
                    <Defs>
                      <RadialGradient id="centerGlow" cx="50%" cy="50%" r="30%">
                        <Stop offset="0%" stopColor="rgba(0, 212, 255, 0.4)" stopOpacity="0.8" />
                        <Stop offset="100%" stopColor="rgba(0, 212, 255, 0.1)" stopOpacity="0.2" />
                      </RadialGradient>
                    </Defs>

                    {/* Background circle */}
                    <Circle
                      cx={centerX}
                      cy={centerY}
                      r={radius + 5}
                      fill="rgba(255, 255, 255, 0.03)"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="1"
                    />

                    {/* Pie slices */}
                    {renderPieSlices()}

                    {/* Center glow */}
                    <Circle
                      cx={centerX}
                      cy={centerY}
                      r={40}
                      fill="url(#centerGlow)"
                    />

                    {/* Center circle */}
                    <Circle
                      cx={centerX}
                      cy={centerY}
                      r={35}
                      fill="rgba(0, 0, 0, 0.7)"
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="2"
                    />
                  </Svg>
                </Animated.View>

                {/* Center Content */}
                {renderCenterContent()}
              </View>

              {/* Legend */}
              {renderLegend()}
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 20,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  pieContainer: {
    shadowColor: '#00D4FF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  svg: {
    // Additional SVG styling can go here
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
  },
  centerTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  centerValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#00D4FF',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  legend: {
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  legendText: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
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
    borderColor: 'rgba(0, 212, 255, 0.3)',
    zIndex: -1,
  },
});

export default PieChartCard;