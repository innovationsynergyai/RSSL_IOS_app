/**
 * Elite Health Visualization System
 * 
 * A comprehensive health data visualization system designed for React Native
 * with luxury glass morphism aesthetics and real Oura Ring data integration.
 * 
 * Features:
 * - Luxury black and electric blue glass morphism design
 * - Burnt orange and green undertones for data visualizations
 * - Smooth animations and premium feel
 * - Comprehensive health metrics visualization
 * - Real-time data updates and trends
 * 
 * @author Elite Health Systems
 * @version 1.0.0
 */

// Main Dashboard Component
export { default as EliteHealthDashboard } from './EliteHealthDashboard';

// Individual Visualization Components
export { default as MetricCard } from './MetricCard';
export { default as CircularProgressCard } from './CircularProgressCard';
export { default as PieChartCard } from './PieChartCard';
export { default as LineChartCard } from './LineChartCard';
export { default as HeatMapCard } from './HeatMapCard';

// Default export - Main Dashboard
export { default } from './EliteHealthDashboard';

/**
 * Usage Examples:
 * 
 * // Basic usage with mock data
 * import { EliteHealthDashboard } from './components/HealthVisualization';
 * 
 * <EliteHealthDashboard />
 * 
 * // With real Oura Ring data
 * import { EliteHealthDashboard } from './components/HealthVisualization';
 * 
 * const ouraData = {
 *   readiness: 85,
 *   sleep: 78,
 *   activity: 92,
 *   heartRate: [...], // Array of heart rate data points
 *   sleepStages: [...], // Sleep stages breakdown
 *   temperature: [...], // Body temperature trends
 *   // ... other Oura Ring data
 * };
 * 
 * <EliteHealthDashboard
 *   ouraData={ouraData}
 *   refreshing={isRefreshing}
 *   onRefresh={handleRefresh}
 * />
 * 
 * // Using individual components
 * import { 
 *   CircularProgressCard, 
 *   LineChartCard, 
 *   PieChartCard 
 * } from './components/HealthVisualization';
 * 
 * <CircularProgressCard
 *   title="Readiness Score"
 *   score={85}
 *   maxScore={100}
 *   subtitle="Excellent recovery"
 * />
 * 
 * <LineChartCard
 *   title="Heart Rate Trend"
 *   data={heartRateData}
 *   lineColor="#00D4FF"
 *   showArea={true}
 * />
 * 
 * <PieChartCard
 *   title="Sleep Stages"
 *   data={sleepStagesData}
 *   showLegend={true}
 * />
 */

/**
 * Required Dependencies:
 * 
 * npm install expo-linear-gradient expo-blur react-native-svg
 * 
 * For React Native CLI projects:
 * npm install react-native-linear-gradient @react-native-community/blur react-native-svg
 * 
 * Additional setup may be required for iOS/Android linking.
 */

/**
 * Data Format Examples:
 * 
 * // Line Chart Data Format
 * const heartRateData = [
 *   { label: 'Mon', value: 72, date: '2024-01-01' },
 *   { label: 'Tue', value: 68, date: '2024-01-02' },
 *   // ... more data points
 * ];
 * 
 * // Pie Chart Data Format
 * const sleepStagesData = [
 *   { label: 'Deep Sleep', value: 95, color: '#1E40AF' },
 *   { label: 'Light Sleep', value: 180, color: '#3B82F6' },
 *   { label: 'REM Sleep', value: 85, color: '#8B5CF6' },
 *   { label: 'Awake', value: 12, color: '#EF4444' },
 * ];
 * 
 * // Heat Map Data Format (12 weeks x 7 days)
 * const activityHeatMap = [
 *   [ // Week 1
 *     { date: '2024-01-01', value: 5 },
 *     { date: '2024-01-02', value: 8 },
 *     // ... 7 days
 *   ],
 *   // ... 12 weeks
 * ];
 */

/**
 * Customization Options:
 * 
 * All components support extensive customization through props:
 * - Colors (gradients, lines, fills)
 * - Sizes and dimensions
 * - Animation timing and effects
 * - Data formatting functions
 * - Labels and units
 * - Interactive callbacks
 */

/**
 * Performance Considerations:
 * 
 * - Components use React Native's native driver for animations
 * - SVG rendering for crisp visuals at any scale
 * - Optimized for 60fps performance
 * - Lazy loading and efficient re-rendering
 * - Memory-efficient data processing
 */