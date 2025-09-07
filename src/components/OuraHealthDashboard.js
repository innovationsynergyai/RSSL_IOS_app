/**
 * Oura Health Dashboard Component
 * Example implementation showing how to use the Oura API integration
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';

// Import our custom hooks
import {
  useOuraHealthSummary,
  useOuraActivity,
  useOuraSleep,
  useOuraReadiness,
  useOuraConnection,
  useOuraDataFormatter,
} from '../hooks/useOuraData';

const { width } = Dimensions.get('window');

const OuraHealthDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(7); // Days
  const [showDetails, setShowDetails] = useState(false);

  // Connection status
  const {
    isConnected,
    connectionError,
    isValidating,
    usageStats,
    validateConnection,
    clearCache,
  } = useOuraConnection();

  // Health data with 7-day range
  const {
    data: healthSummary,
    loading: summaryLoading,
    error: summaryError,
    refresh: refreshSummary,
    lastUpdated,
  } = useOuraHealthSummary({
    useCache: true,
    autoRefresh: true,
    refreshInterval: 10 * 60 * 1000, // 10 minutes
  });

  // Individual data hooks for detailed views
  const { data: activityData, loading: activityLoading } = useOuraActivity({
    useCache: true,
  });

  const { data: sleepData, loading: sleepLoading } = useOuraSleep({
    useCache: true,
  });

  const { data: readinessData, loading: readinessLoading } = useOuraReadiness({
    useCache: true,
  });

  // Data formatter
  const { formatActivity, formatSleep, formatReadiness } = useOuraDataFormatter();

  // Handle refresh
  const handleRefresh = async () => {
    await refreshSummary();
    await validateConnection();
  };

  // Handle cache clear
  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all cached Oura data and force fresh API calls.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            const success = await clearCache();
            Alert.alert(
              success ? 'Success' : 'Error',
              success ? 'Cache cleared successfully' : 'Failed to clear cache'
            );
            if (success) {
              refreshSummary();
            }
          },
        },
      ]
    );
  };

  // Render connection status
  const renderConnectionStatus = () => (
    <View style={styles.statusContainer}>
      <Text style={styles.statusTitle}>Connection Status</Text>
      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: isConnected ? '#4CAF50' : '#F44336' },
          ]}
        />
        <Text style={styles.statusText}>
          {isValidating ? 'Validating...' : isConnected ? 'Connected' : 'Disconnected'}
        </Text>
      </View>
      {connectionError && (
        <Text style={styles.errorText}>{connectionError}</Text>
      )}
      {usageStats && (
        <Text style={styles.usageText}>
          API Usage: {usageStats.requestsInCurrentWindow}/{usageStats.rateLimit}
        </Text>
      )}
    </View>
  );

  // Render metric card
  const renderMetricCard = (title, value, unit, subtitle, color = '#007AFF') => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <Text style={styles.metricTitle}>{title}</Text>
      <View style={styles.metricValue}>
        <Text style={[styles.metricNumber, { color }]}>{value}</Text>
        <Text style={styles.metricUnit}>{unit}</Text>
      </View>
      {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
    </View>
  );

  // Render activity summary
  const renderActivitySummary = () => {
    if (activityLoading) return <ActivityIndicator />;
    if (!activityData?.data) return null;

    const formattedActivity = formatActivity(activityData);
    if (!formattedActivity?.length) return null;

    const latest = formattedActivity[formattedActivity.length - 1];
    const avgSteps = Math.round(
      formattedActivity.reduce((sum, day) => sum + day.steps, 0) / formattedActivity.length
    );

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Daily Activity</Text>
        <View style={styles.metricsGrid}>
          {renderMetricCard('Steps Today', latest.steps.toLocaleString(), '', `Avg: ${avgSteps.toLocaleString()}`, '#FF9500')}
          {renderMetricCard('Calories', latest.calories, 'kcal', `${latest.completion.calories.toFixed(0)}% of goal`, '#FF3B30')}
          {renderMetricCard('Distance', latest.distance.toFixed(1), 'km', 'Today', '#34C759')}
          {renderMetricCard('Active Minutes', latest.activeMinutes, 'min', 'Today', '#5856D6')}
        </View>
      </View>
    );
  };

  // Render sleep summary
  const renderSleepSummary = () => {
    if (sleepLoading) return <ActivityIndicator />;
    if (!sleepData?.data) return null;

    const formattedSleep = formatSleep(sleepData);
    if (!formattedSleep?.length) return null;

    const latest = formattedSleep[formattedSleep.length - 1];
    const avgEfficiency = Math.round(
      formattedSleep.reduce((sum, night) => sum + night.efficiency, 0) / formattedSleep.length
    );

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Sleep Analysis</Text>
        <View style={styles.metricsGrid}>
          {renderMetricCard('Sleep Duration', `${Math.floor(latest.duration / 60)}h ${latest.duration % 60}m`, '', `Score: ${latest.score}`, '#5856D6')}
          {renderMetricCard('Sleep Efficiency', latest.efficiency, '%', `Avg: ${avgEfficiency}%`, '#34C759')}
          {renderMetricCard('Deep Sleep', `${Math.floor(latest.stages.deep / 60)}h ${latest.stages.deep % 60}m`, '', 'Last night', '#007AFF')}
          {renderMetricCard('Heart Rate', latest.heartRate.average, 'bpm', `Low: ${latest.heartRate.lowest}`, '#FF3B30')}
        </View>
      </View>
    );
  };

  // Render readiness summary
  const renderReadinessSummary = () => {
    if (readinessLoading) return <ActivityIndicator />;
    if (!readinessData?.data) return null;

    const formattedReadiness = formatReadiness(readinessData);
    if (!formattedReadiness?.length) return null;

    const latest = formattedReadiness[formattedReadiness.length - 1];

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Readiness Score</Text>
        <View style={styles.readinessContainer}>
          <View style={styles.readinessScore}>
            <Text style={styles.readinessNumber}>{latest.score}</Text>
            <Text style={styles.readinessLabel}>Readiness</Text>
          </View>
          <View style={styles.contributorsContainer}>
            <Text style={styles.contributorsTitle}>Contributors:</Text>
            <Text style={styles.contributor}>Activity Balance: {latest.contributors.activity}%</Text>
            <Text style={styles.contributor}>Sleep Balance: {latest.contributors.sleep}%</Text>
            <Text style={styles.contributor}>HRV Balance: {latest.contributors.hrv}%</Text>
          </View>
        </View>
      </View>
    );
  };

  // Render debug info
  const renderDebugInfo = () => {
    if (!showDetails) return null;

    return (
      <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>Debug Information</Text>
        <Text style={styles.debugText}>
          Last Updated: {lastUpdated ? lastUpdated.toLocaleString() : 'Never'}
        </Text>
        <Text style={styles.debugText}>
          Cache Enabled: Yes
        </Text>
        <Text style={styles.debugText}>
          Auto Refresh: 10 minutes
        </Text>
        {summaryError && (
          <Text style={styles.errorText}>
            Error: {summaryError.message}
          </Text>
        )}
      </View>
    );
  };

  if (summaryLoading && !healthSummary) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Oura Ring data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={summaryLoading}
          onRefresh={handleRefresh}
          tintColor="#007AFF"
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Oura Health Dashboard</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowDetails(!showDetails)}
          >
            <Text style={styles.buttonText}>
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={handleClearCache}
          >
            <Text style={[styles.buttonText, styles.clearButtonText]}>
              Clear Cache
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderConnectionStatus()}

      {summaryError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Loading Data</Text>
          <Text style={styles.errorText}>{summaryError.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {renderActivitySummary()}
          {renderSleepSummary()}
          {renderReadinessSummary()}
        </>
      )}

      {renderDebugInfo()}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Data provided by Oura Ring API v2
        </Text>
        <Text style={styles.footerText}>
          Pull down to refresh • Cached for better performance
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  clearButtonText: {
    color: 'white',
  },
  statusContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  usageText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  sectionContainer: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  metricCard: {
    width: (width - 64) / 2,
    backgroundColor: '#f8f8f8',
    margin: 8,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  metricTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  metricValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  metricNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  metricUnit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  metricSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  readinessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readinessScore: {
    alignItems: 'center',
    marginRight: 32,
  },
  readinessNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  readinessLabel: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
  },
  contributorsContainer: {
    flex: 1,
  },
  contributorsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  contributor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  debugContainer: {
    backgroundColor: '#f0f0f0',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default OuraHealthDashboard;