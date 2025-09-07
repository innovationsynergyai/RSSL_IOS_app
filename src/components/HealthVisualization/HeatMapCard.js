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
import Svg, { Rect, Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const HeatMapCard = ({
  title,
  data = [],
  chartWidth = width - 80,
  chartHeight = 200,
  onPress,
  style,
  gradientColors = ['rgba(0, 0, 0, 0.9)', 'rgba(0, 30, 60, 0.5)'],
  colorScale = ['#1E3A8A', '#3B82F6', '#00D4FF', '#F59E0B', '#EF4444'],
  showLabels = true,
  cellSize = 12,
  gap = 2,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  useEffect(() => {
    // Animate cells appearance
    Animated.stagger(50, [
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]).start();

    // Subtle pulse for high-activity cells
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
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
    const values = data.flat().map(cell => cell.value);
    return {
      min: Math.min(...values, 0),
      max: Math.max(...values, 1),
    };
  };

  const { min, max } = getMinMax();

  const getColorFromValue = (value) => {
    const normalizedValue = (value - min) / (max - min);
    const colorIndex = Math.floor(normalizedValue * (colorScale.length - 1));
    
    if (normalizedValue === 0) return colorScale[0];
    if (normalizedValue === 1) return colorScale[colorScale.length - 1];
    
    // Interpolate between colors
    const lowerColor = colorScale[colorIndex];
    const upperColor = colorScale[Math.min(colorIndex + 1, colorScale.length - 1)];
    
    return upperColor; // Simplified - return upper color
  };

  const getIntensityFromValue = (value) => {
    const normalizedValue = (value - min) / (max - min);
    return Math.max(0.1, normalizedValue);
  };

  const renderHeatMapCells = () => {
    const cells = [];
    let cellIndex = 0;

    data.forEach((week, weekIndex) => {
      week.forEach((day, dayIndex) => {
        const x = weekIndex * (cellSize + gap);
        const y = dayIndex * (cellSize + gap);
        const color = getColorFromValue(day.value);
        const intensity = getIntensityFromValue(day.value);
        
        const shouldPulse = day.value >= max * 0.8;

        cells.push(
          <Animated.Rect
            key={`${weekIndex}-${dayIndex}`}
            x={x}
            y={y}
            width={cellSize}
            height={cellSize}
            rx={2}
            fill={color}
            opacity={animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, intensity],
            })}
            style={{
              transform: shouldPulse ? [{ scale: pulseAnim }] : [],
            }}
          />
        );

        cellIndex++;
      });
    });

    return cells;
  };

  const renderLabels = () => {
    if (!showLabels) return null;

    const labels = [];

    // Day labels
    daysOfWeek.forEach((day, index) => {
      labels.push(
        <SvgText
          key={`day-${index}`}
          x={-25}
          y={index * (cellSize + gap) + cellSize / 2 + 4}
          fontSize="10"
          fill="rgba(255, 255, 255, 0.6)"
          textAnchor="middle"
        >
          {day}
        </SvgText>
      );
    });

    // Month labels (simplified - show every few weeks)
    const step = Math.max(1, Math.floor(data.length / 6));
    for (let i = 0; i < data.length; i += step) {
      if (data[i] && data[i][0] && data[i][0].date) {
        const date = new Date(data[i][0].date);
        const monthName = months[date.getMonth()];
        
        labels.push(
          <SvgText
            key={`month-${i}`}
            x={i * (cellSize + gap) + cellSize / 2}
            y={-10}
            fontSize="10"
            fill="rgba(255, 255, 255, 0.6)"
            textAnchor="middle"
          >
            {monthName}
          </SvgText>
        );
      }
    }

    return labels;
  };

  const renderColorLegend = () => {
    const legendWidth = 120;
    const legendHeight = 8;
    const legendSteps = 5;

    return (
      <View style={styles.legendContainer}>
        <Text style={styles.legendLabel}>Less</Text>
        <Svg width={legendWidth} height={legendHeight} style={styles.legendSvg}>
          <Defs>
            <SvgLinearGradient id="legendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {colorScale.map((color, index) => (
                <Stop
                  key={index}
                  offset={`${(index / (colorScale.length - 1)) * 100}%`}
                  stopColor={color}
                  stopOpacity="0.8"
                />
              ))}
            </SvgLinearGradient>
          </Defs>
          <Rect
            x={0}
            y={0}
            width={legendWidth}
            height={legendHeight}
            rx={4}
            fill="url(#legendGradient)"
          />
        </Svg>
        <Text style={styles.legendLabel}>More</Text>
      </View>
    );
  };

  const getStats = () => {
    const allValues = data.flat().map(cell => cell.value);
    const total = allValues.reduce((sum, val) => sum + val, 0);
    const avg = total / allValues.length;
    const maxDay = allValues.reduce((max, val) => Math.max(max, val), 0);
    
    return { avg, maxDay, total };
  };

  const { avg, maxDay, total } = getStats();

  const mapWidth = data.length * (cellSize + gap) - gap;
  const mapHeight = 7 * (cellSize + gap) - gap;
  const totalWidth = mapWidth + 60;
  const totalHeight = mapHeight + 40;

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
                  <Text style={styles.statText}>
                    Avg: {avg.toFixed(1)}
                  </Text>
                  <Text style={styles.statText}>
                    Peak: {maxDay.toFixed(1)}
                  </Text>
                </View>
              </View>

              {/* Heat Map */}
              <View style={styles.chartContainer}>
                <Svg 
                  width={totalWidth} 
                  height={totalHeight} 
                  style={styles.svg}
                  viewBox={`-30 -20 ${totalWidth} ${totalHeight}`}
                >
                  {/* Labels */}
                  {renderLabels()}

                  {/* Heat map cells */}
                  <Animated.G opacity={animatedValue}>
                    {renderHeatMapCells()}
                  </Animated.G>
                </Svg>
              </View>

              {/* Legend */}
              {renderColorLegend()}

              {/* Summary */}
              <View style={styles.summary}>
                <Text style={styles.summaryText}>
                  Total activity over {data.length} weeks
                </Text>
                <Text style={styles.summaryValue}>
                  {Math.round(total)} total sessions
                </Text>
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
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    padding: 16,
  },
  svg: {
    backgroundColor: 'transparent',
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  legendLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 8,
  },
  legendSvg: {
    marginHorizontal: 8,
  },
  summary: {
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00D4FF',
    letterSpacing: 0.5,
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

export default HeatMapCard;