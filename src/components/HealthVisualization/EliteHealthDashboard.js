import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Animated,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Dimensions,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import MetricCard from './MetricCard';
import CircularProgressCard from './CircularProgressCard';
import PieChartCard from './PieChartCard';
import LineChartCard from './LineChartCard';
import HeatMapCard from './HeatMapCard';

const { width, height } = Dimensions.get('window');

const EliteHealthDashboard = ({
  ouraData = {},
  refreshing = false,
  onRefresh,
  style,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);
  }, [ouraData]);

  // Mock data generation for demonstration
  const generateMockData = () => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return {
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        value: Math.floor(Math.random() * 20) + 60, // 60-80 range
        date: date.toISOString(),
      };
    }).reverse();

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return {
        label: date.getDate().toString(),
        value: Math.floor(Math.random() * 3000) + 5000, // 5000-8000 steps
        date: date.toISOString(),
      };
    }).reverse();

    // Generate heat map data (12 weeks x 7 days)
    const heatMapData = Array.from({ length: 12 }, (_, weekIndex) => {
      return Array.from({ length: 7 }, (_, dayIndex) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (weekIndex * 7 + dayIndex));
        return {
          date: date.toISOString(),
          value: Math.floor(Math.random() * 10) + 1, // 1-10 activity level
        };
      });
    });

    return {
      readiness: ouraData.readiness || 78,
      sleep: ouraData.sleep || 82,
      activity: ouraData.activity || 65,
      heartRate: last7Days.map(day => ({ ...day, value: Math.floor(Math.random() * 20) + 65 })),
      steps: last30Days,
      sleepStages: [
        { label: 'Deep Sleep', value: 95, color: '#1E40AF' },
        { label: 'Light Sleep', value: 180, color: '#3B82F6' },
        { label: 'REM Sleep', value: 85, color: '#8B5CF6' },
        { label: 'Awake', value: 12, color: '#EF4444' },
      ],
      temperature: last7Days.map(day => ({ ...day, value: (Math.random() * 2 + 98).toFixed(1) })),
      hrv: last7Days.map(day => ({ ...day, value: Math.floor(Math.random() * 20) + 30 })),
      activityHeatMap: heatMapData,
      metrics: {
        restingHeartRate: 58,
        vo2Max: 45.2,
        bodyTemperature: 98.6,
        calories: 2340,
        activeMinutes: 67,
        distanceWalked: 4.2,
      }
    };
  };

  const mockData = generateMockData();

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <BlurView intensity={30} style={styles.headerBlur}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 30, 60, 0.6)']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Elite Health</Text>
            <Text style={styles.headerSubtitle}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <View style={styles.headerGlow} />
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );

  const renderScoreCards = () => (
    <Animated.View
      style={[
        styles.sectionContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.sectionTitle}>Health Scores</Text>
      <View style={styles.scoreGrid}>
        <CircularProgressCard
          title="Readiness"
          score={mockData.readiness}
          subtitle="Recovery & preparedness"
          icon="⚡"
          style={styles.scoreCard}
        />
        <CircularProgressCard
          title="Sleep Quality"
          score={mockData.sleep}
          subtitle="Restorative sleep"
          icon="🌙"
          style={styles.scoreCard}
        />
        <CircularProgressCard
          title="Activity"
          score={mockData.activity}
          subtitle="Daily movement"
          icon="🏃"
          style={styles.scoreCard}
        />
      </View>
    </Animated.View>
  );

  const renderMetricCards = () => (
    <Animated.View
      style={[
        styles.sectionContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.sectionTitle}>Key Metrics</Text>
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Resting HR"
          value={mockData.metrics.restingHeartRate}
          unit="bpm"
          icon="❤️"
          trend="-2"
          trendDirection="down"
          valueColor="#22C55E"
          style={styles.metricCard}
        />
        <MetricCard
          title="VO₂ Max"
          value={mockData.metrics.vo2Max}
          unit="ml/kg/min"
          icon="🫁"
          trend="+0.8"
          trendDirection="up"
          valueColor="#00D4FF"
          style={styles.metricCard}
        />
        <MetricCard
          title="Body Temp"
          value={mockData.metrics.bodyTemperature}
          unit="°F"
          icon="🌡️"
          trend="+0.2"
          trendDirection="up"
          valueColor="#F59E0B"
          style={styles.metricCard}
        />
        <MetricCard
          title="Calories"
          value={mockData.metrics.calories}
          unit="kcal"
          icon="🔥"
          trend="+120"
          trendDirection="up"
          valueColor="#EF4444"
          style={styles.metricCard}
        />
      </View>
    </Animated.View>
  );

  const renderCharts = () => (
    <Animated.View
      style={[
        styles.sectionContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.sectionTitle}>Trends & Analysis</Text>
      
      {/* Sleep Stages */}
      <PieChartCard
        title="Sleep Stages Breakdown"
        data={mockData.sleepStages}
        style={styles.chartCard}
      />

      {/* Heart Rate Trend */}
      <LineChartCard
        title="Heart Rate Variability"
        data={mockData.hrv}
        unit="ms"
        lineColor="#8B5CF6"
        areaColor="#8B5CF6"
        style={styles.chartCard}
        yAxisFormat={(value) => `${value}ms`}
      />

      {/* Temperature Trend */}
      <LineChartCard
        title="Body Temperature"
        data={mockData.temperature}
        unit="°F"
        lineColor="#F59E0B"
        areaColor="#F59E0B"
        style={styles.chartCard}
        yAxisFormat={(value) => `${value}°F`}
      />

      {/* Activity Heat Map */}
      <HeatMapCard
        title="Activity Pattern"
        data={mockData.activityHeatMap}
        style={styles.chartCard}
      />
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#000000', '#001122', '#000000']}
          style={styles.loadingGradient}
        >
          <Animated.View
            style={[
              styles.loadingContent,
              {
                transform: [
                  {
                    rotate: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.loadingText}>⚡</Text>
          </Animated.View>
          <Text style={styles.loadingSubtext}>Loading Health Data</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#000000', '#001122', '#002244', '#000000']}
        style={styles.backgroundGradient}
      >
        {renderHeader()}
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#00D4FF"
              colors={['#00D4FF']}
            />
          }
        >
          {renderScoreCards()}
          {renderMetricCards()}
          {renderCharts()}
          
          {/* Bottom padding for safe area */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundGradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 32,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
  },
  headerContainer: {
    paddingTop: StatusBar.currentHeight || 44,
    marginBottom: 20,
  },
  headerBlur: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    position: 'relative',
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 212, 255, 0.4)',
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  headerGlow: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    bottom: -10,
    background: 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 16,
    marginLeft: 8,
    letterSpacing: 0.8,
  },
  scoreGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  scoreCard: {
    width: (width - 48) / 3 - 8,
    marginHorizontal: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 48) / 2 - 8,
    marginBottom: 16,
  },
  chartCard: {
    width: '100%',
    marginBottom: 16,
  },
  bottomPadding: {
    height: 40,
  },
});

export default EliteHealthDashboard;