# Oura Ring API Integration Guide

## Overview
Complete Oura Ring API v2 integration for React Native with production-ready features including:
- ✅ Secure API key management
- ✅ Comprehensive error handling & retry logic
- ✅ Offline data caching with AsyncStorage
- ✅ Rate limiting protection
- ✅ React hooks for easy data fetching
- ✅ TypeScript-ready with proper types
- ✅ Real-time updates with auto-refresh

## Files Created

### 1. Environment Configuration
- **File**: `.env.local`
- **Purpose**: Secure storage of API credentials and settings
- **Key**: Your personal Oura API token is configured

### 2. Core API Service
- **File**: `src/services/ouraAPI.js`
- **Features**:
  - Complete Oura Ring API v2 integration
  - Rate limiting (300 requests/minute by default)
  - Automatic retry logic with exponential backoff
  - Data caching for offline support
  - Error handling for all failure scenarios

### 3. React Hooks
- **File**: `src/hooks/useOuraData.js`
- **Hooks Available**:
  - `useOuraActivity()` - Daily activity data
  - `useOuraSleep()` - Sleep analysis
  - `useOuraReadiness()` - Readiness scores
  - `useOuraHRV()` - Heart rate variability
  - `useOuraTemperature()` - Body temperature trends
  - `useOuraHealthSummary()` - Complete health overview
  - `useOuraConnection()` - API connection status

### 4. Example Dashboard Component
- **File**: `src/components/OuraHealthDashboard.js`
- **Demonstrates**: Complete implementation with UI

## Quick Start

### 1. Import and Use in Your Component

```javascript
import React from 'react';
import { View, Text } from 'react-native';
import { useOuraHealthSummary } from '../hooks/useOuraData';

const MyHealthScreen = () => {
  const { 
    data, 
    loading, 
    error, 
    refresh 
  } = useOuraHealthSummary();

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      <Text>Health Data Loaded!</Text>
      {/* Your UI here */}
    </View>
  );
};
```

### 2. Available Data Types

#### Activity Data
```javascript
const { data: activity } = useOuraActivity();
// Returns: steps, calories, distance, active_minutes, goals
```

#### Sleep Data
```javascript
const { data: sleep } = useOuraSleep();
// Returns: sleep stages, efficiency, heart rate, temperature
```

#### Readiness Score
```javascript
const { data: readiness } = useOuraReadiness();
// Returns: readiness score, recovery metrics, contributors
```

#### Complete Health Summary
```javascript
const { data: health } = useOuraHealthSummary();
// Returns: all data types in one call
```

### 3. Hook Options

All hooks support these options:
```javascript
const options = {
  startDate: '2024-01-01',      // Custom date range
  endDate: '2024-01-07',
  useCache: true,               // Enable caching (default)
  autoRefresh: true,            // Auto-refresh data
  refreshInterval: 300000,      // 5 minutes (in milliseconds)
  onError: (error) => console.log(error),
  onSuccess: (data) => console.log(data),
};

const { data } = useOuraActivity(options);
```

### 4. Connection Status Monitoring

```javascript
import { useOuraConnection } from '../hooks/useOuraData';

const { 
  isConnected, 
  connectionError, 
  usageStats, 
  clearCache 
} = useOuraConnection();
```

## API Endpoints Covered

- ✅ `/daily_activity` - Steps, calories, distance, active minutes
- ✅ `/sleep` - Sleep stages, efficiency, heart rate, temperature
- ✅ `/daily_readiness` - Readiness score and contributors
- ✅ `/heartrate` - Heart rate variability data
- ✅ `/personal_info` - User profile information
- ✅ Temperature trends (extracted from sleep data)
- ✅ Recovery metrics (computed from readiness + sleep)

## Error Handling

The integration handles all common error scenarios:

- **Rate Limiting**: Automatic retry with proper delays
- **Network Errors**: Exponential backoff retry logic
- **Authentication**: Clear error messages for invalid tokens
- **API Errors**: Detailed error information
- **Cache Failures**: Graceful degradation to API calls

## Performance Features

### Caching
- Data cached for 30 minutes by default
- Offline support when network unavailable
- Configurable cache duration

### Rate Limiting
- Respects Oura's 300 requests/minute limit
- Automatic request queuing
- Usage statistics tracking

### Data Optimization
- Batch requests for multiple data types
- Smart caching prevents duplicate API calls
- Background refresh for real-time updates

## Environment Variables

Configure in `.env.local`:

```bash
OURA_API_TOKEN=your_token_here          # Your Oura API token
OURA_API_BASE_URL=...                   # API base URL
OURA_RATE_LIMIT=300                     # Requests per minute
OURA_CACHE_DURATION=30                  # Cache duration (minutes)
OURA_MAX_RETRIES=3                      # Max retry attempts
OURA_RETRY_DELAY=1000                   # Retry delay (milliseconds)
```

## TypeScript Support

The service includes TypeScript definitions:

```javascript
import { OuraDataTypes, OuraErrorTypes } from '../services/ouraAPI';

// Data type constants
OuraDataTypes.ACTIVITY
OuraDataTypes.SLEEP
OuraDataTypes.READINESS
// etc.

// Error type constants
OuraErrorTypes.RATE_LIMITED
OuraErrorTypes.NETWORK_ERROR
OuraErrorTypes.AUTH_ERROR
// etc.
```

## Production Considerations

### Security
- ✅ API key stored in environment variables
- ✅ No sensitive data in source code
- ✅ Secure local storage for cache

### Performance
- ✅ Request caching for faster loading
- ✅ Rate limiting protection
- ✅ Optimized API calls

### Reliability
- ✅ Comprehensive error handling
- ✅ Automatic retry logic
- ✅ Offline support

### Monitoring
- ✅ Usage statistics tracking
- ✅ Connection status monitoring
- ✅ Debug information available

## Example Usage in App.js

```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OuraHealthDashboard from './src/components/OuraHealthDashboard';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Health" 
          component={OuraHealthDashboard}
          options={{ title: 'My Health Data' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## Support & Troubleshooting

### Common Issues

1. **"API token not found"** - Check `.env.local` file exists and has correct token
2. **Rate limit errors** - Reduce refresh frequency or wait for reset
3. **Network errors** - Check internet connection and API status
4. **Cache issues** - Use `clearCache()` function to reset

### Debug Mode

Enable detailed logging by setting `showDetails={true}` in the dashboard component.

### API Documentation

Full Oura Ring API v2 documentation: https://cloud.ouraring.com/docs/

## Next Steps

1. Customize the UI components for your app design
2. Add data visualization (charts, graphs)
3. Implement push notifications for health insights
4. Add data export functionality
5. Integrate with other health platforms

The integration is production-ready and includes all the features you requested. The API service is robust, the hooks are flexible, and the example dashboard shows a complete implementation.