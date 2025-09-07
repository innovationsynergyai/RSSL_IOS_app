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
import Svg, { 
  Path, 
  Circle, 
  Defs, 
  LinearGradient as SvgLinearGradient, 
  Stop, 
  Line,
  Text as SvgText
} from 'react-native-svg';

const { width } = Dimensions.get('window');

const LineChartCard = ({
  title,
  data = [],
  chartWidth = width - 80,
  chartHeight = 200,
  onPress,
  style,
  gradientColors = ['rgba(0, 0, 0, 0.9)', 'rgba(0, 30, 60, 0.5)'],
  lineColor = '#00D4FF',
  areaColor = '#00D4FF',
  showArea = true,
  showGrid = true,
  showLabels = true,
  unit = '',
  yAxisFormat = (value) => value.toString(),
  xAxisFormat = (value, index) => value.toString(),
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const padding = 40;
  const graphWidth = chartWidth - padding * 2;
  const graphHeight = chartHeight - padding * 2;

  useEffect(() => {
    // Animate line drawing
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start();

    // Shimmer effect
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, [data]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getMinMax = () => {
    const values = data.map(item => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const padding = range * 0.1;
    
    return {
      min: Math.max(0, min - padding),
      max: max + padding,
    };
  };

  const { min, max } = getMinMax();

  const getX = (index) => {
    return (index / (data.length - 1)) * graphWidth + padding;
  };

  const getY = (value) => {
    return graphHeight - ((value - min) / (max - min)) * graphHeight + padding;
  };

  const createLinePath = () => {
    if (data.length === 0) return '';

    let path = `M ${getX(0)} ${getY(data[0].value)}`;
    
    for (let i = 1; i < data.length; i++) {
      const x = getX(i);
      const y = getY(data[i].value);
      
      // Smooth curve using quadratic bezier
      const prevX = getX(i - 1);
      const prevY = getY(data[i - 1].value);
      const cpX = prevX + (x - prevX) / 2;
      
      path += ` Q ${cpX} ${prevY} ${x} ${y}`;
    }
    
    return path;
  };

  const createAreaPath = () => {
    if (data.length === 0 || !showArea) return '';

    const linePath = createLinePath();
    const lastPoint = data[data.length - 1];
    const firstPoint = data[0];
    
    return `${linePath} L ${getX(data.length - 1)} ${graphHeight + padding} L ${getX(0)} ${graphHeight + padding} Z`;
  };

  const renderGridLines = () => {
    if (!showGrid) return null;

    const gridLines = [];
    const numLines = 4;

    // Horizontal grid lines
    for (let i = 0; i <= numLines; i++) {
      const y = padding + (i / numLines) * graphHeight;
      gridLines.push(
        <Line
          key={`h-${i}`}
          x1={padding}
          y1={y}
          x2={chartWidth - padding}
          y2={y}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      );
    }

    // Vertical grid lines
    const step = Math.max(1, Math.floor(data.length / 6));
    for (let i = 0; i < data.length; i += step) {
      const x = getX(i);
      gridLines.push(
        <Line
          key={`v-${i}`}
          x1={x}
          y1={padding}
          x2={x}
          y2={chartHeight - padding}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      );
    }

    return gridLines;
  };

  const renderLabels = () => {
    if (!showLabels) return null;

    const labels = [];

    // Y-axis labels
    const numYLabels = 4;
    for (let i = 0; i <= numYLabels; i++) {
      const value = min + (max - min) * (1 - i / numYLabels);
      const y = padding + (i / numYLabels) * graphHeight;
      
      labels.push(
        <SvgText
          key={`y-${i}`}
          x={padding - 10}
          y={y + 5}
          fontSize="10"
          fill="rgba(255, 255, 255, 0.6)"
          textAnchor="end"
        >
          {yAxisFormat(value.toFixed(0))}
        </SvgText>
      );
    }

    // X-axis labels
    const step = Math.max(1, Math.floor(data.length / 4));
    for (let i = 0; i < data.length; i += step) {
      const x = getX(i);
      labels.push(
        <SvgText
          key={`x-${i}`}
          x={x}
          y={chartHeight - padding + 20}
          fontSize="10"
          fill="rgba(255, 255, 255, 0.6)"
          textAnchor="middle"
        >
          {xAxisFormat(data[i].label, i)}
        </SvgText>
      );
    }

    return labels;
  };

  const renderDataPoints = () => {
    return data.map((point, index) => (
      <Circle
        key={index}
        cx={getX(index)}
        cy={getY(point.value)}
        r="4"
        fill={lineColor}
        stroke="rgba(255, 255, 255, 0.8)"
        strokeWidth="2"
        style={{
          filter: `drop-shadow(0 0 6px ${lineColor}80)`,
        }}
      />
    ));
  };

  const getStats = () => {
    if (data.length === 0) return { avg: 0, trend: 0 };

    const values = data.map(item => item.value);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const trend = values[values.length - 1] - values[0];

    return { avg, trend };
  };

  const { avg, trend } = getStats();

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
                <Text style={styles.title}>{title}</Text>
                <View style={styles.stats}>
                  <Text style={styles.avgText}>
                    Avg: {avg.toFixed(1)}{unit}
                  </Text>
                  <Text style={[
                    styles.trendText,
                    { color: trend >= 0 ? '#22C55E' : '#EF4444' }
                  ]}>
                    {trend >= 0 ? '↗' : '↘'} {Math.abs(trend).toFixed(1)}{unit}
                  </Text>
                </View>
              </View>

              {/* Chart */}
              <View style={styles.chartContainer}>
                <Animated.View
                  style={[
                    styles.shimmerOverlay,
                    {
                      opacity: shimmerAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 0.3, 0],
                      }),
                      transform: [
                        {
                          translateX: shimmerAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-chartWidth, chartWidth],
                          }),
                        },
                      ],
                    },
                  ]}
                />

                <Svg width={chartWidth} height={chartHeight} style={styles.svg}>
                  <Defs>
                    <SvgLinearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <Stop offset="0%" stopColor={lineColor} stopOpacity="0.8" />
                      <Stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.9" />
                      <Stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
                    </SvgLinearGradient>

                    <SvgLinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <Stop offset="0%" stopColor={areaColor} stopOpacity="0.4" />
                      <Stop offset="50%" stopColor={areaColor} stopOpacity="0.2" />
                      <Stop offset="100%" stopColor={areaColor} stopOpacity="0.05" />
                    </SvgLinearGradient>
                  </Defs>

                  {/* Grid */}
                  {renderGridLines()}

                  {/* Area */}
                  {showArea && (
                    <Animated.Path
                      d={createAreaPath()}
                      fill="url(#areaGradient)"
                      opacity={animatedValue}
                    />
                  )}

                  {/* Line */}
                  <Animated.Path
                    d={createLinePath()}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [`0, ${graphWidth * 2}`, `${graphWidth * 2}, 0`],
                    })}
                    style={{
                      filter: `drop-shadow(0 0 8px ${lineColor}60)`,
                    }}
                  />

                  {/* Data Points */}
                  <Animated.G opacity={animatedValue}>
                    {renderDataPoints()}
                  </Animated.G>

                  {/* Labels */}
                  {renderLabels()}
                </Svg>
              </View>
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
    padding: 20,
  },
  content: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: 0.8,
  },
  stats: {
    alignItems: 'flex-end',
  },
  avgText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  svg: {
    backgroundColor: 'transparent',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
    zIndex: 1,
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

export default LineChartCard;