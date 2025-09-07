/**
 * React Hook for Oura Ring Data
 * Provides easy access to all Oura Ring data with loading states and error handling
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import ouraAPI, { OuraDataTypes, OuraErrorTypes } from '../services/ouraAPI';

/**
 * Main hook for fetching Oura Ring data
 */
export const useOuraData = (dataType, options = {}) => {
  const {
    startDate = null,
    endDate = null,
    useCache = true,
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000, // 5 minutes
    onError = null,
    onSuccess = null,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const refreshIntervalRef = useRef(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!mountedRef.current) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let result;
      const actualUseCache = forceRefresh ? false : useCache;
      
      switch (dataType) {
        case OuraDataTypes.ACTIVITY:
          result = await ouraAPI.getDailyActivity(startDate, endDate, actualUseCache);
          break;
        case OuraDataTypes.SLEEP:
          result = await ouraAPI.getSleepData(startDate, endDate, actualUseCache);
          break;
        case OuraDataTypes.READINESS:
          result = await ouraAPI.getReadinessData(startDate, endDate, actualUseCache);
          break;
        case OuraDataTypes.HEART_RATE:
          result = await ouraAPI.getHeartRateVariability(startDate, endDate, actualUseCache);
          break;
        case OuraDataTypes.TEMPERATURE:
          result = await ouraAPI.getTemperatureData(startDate, endDate, actualUseCache);
          break;
        case OuraDataTypes.PERSONAL_INFO:
          result = await ouraAPI.getPersonalInfo(actualUseCache);
          break;
        case 'health_summary':
          result = await ouraAPI.getHealthSummary(startDate, endDate, actualUseCache);
          break;
        case 'recovery':
          result = await ouraAPI.getRecoveryData(startDate, endDate, actualUseCache);
          break;
        default:
          throw new Error(`Unknown data type: ${dataType}`);
      }
      
      if (mountedRef.current) {
        setData(result);
        setLastUpdated(new Date());
        onSuccess?.(result);
      }
      
    } catch (err) {
      if (mountedRef.current) {
        const errorType = err.message.includes('Rate limit') 
          ? OuraErrorTypes.RATE_LIMITED
          : err.message.includes('401') || err.message.includes('403')
          ? OuraErrorTypes.AUTH_ERROR
          : err.message.includes('fetch')
          ? OuraErrorTypes.NETWORK_ERROR
          : OuraErrorTypes.API_ERROR;
        
        const errorObj = {
          type: errorType,
          message: err.message,
          timestamp: new Date(),
        };
        
        setError(errorObj);
        onError?.(errorObj);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [dataType, startDate, endDate, useCache, onError, onSuccess]);

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        fetchData(true);
      }, refreshInterval);
      
      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, fetchData]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    isStale: lastUpdated && Date.now() - lastUpdated.getTime() > refreshInterval,
  };
};

/**
 * Hook for daily activity data
 */
export const useOuraActivity = (options = {}) => {
  return useOuraData(OuraDataTypes.ACTIVITY, options);
};

/**
 * Hook for sleep data
 */
export const useOuraSleep = (options = {}) => {
  return useOuraData(OuraDataTypes.SLEEP, options);
};

/**
 * Hook for readiness data
 */
export const useOuraReadiness = (options = {}) => {
  return useOuraData(OuraDataTypes.READINESS, options);
};

/**
 * Hook for heart rate variability data
 */
export const useOuraHRV = (options = {}) => {
  return useOuraData(OuraDataTypes.HEART_RATE, options);
};

/**
 * Hook for temperature data
 */
export const useOuraTemperature = (options = {}) => {
  return useOuraData(OuraDataTypes.TEMPERATURE, options);
};

/**
 * Hook for personal info
 */
export const useOuraPersonalInfo = (options = {}) => {
  return useOuraData(OuraDataTypes.PERSONAL_INFO, { ...options, startDate: null, endDate: null });
};

/**
 * Hook for comprehensive health summary
 */
export const useOuraHealthSummary = (options = {}) => {
  return useOuraData('health_summary', options);
};

/**
 * Hook for recovery metrics
 */
export const useOuraRecovery = (options = {}) => {
  return useOuraData('recovery', options);
};

/**
 * Hook for multiple data types
 */
export const useOuraMultipleData = (dataTypes = [], options = {}) => {
  const [combinedData, setCombinedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMultipleData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const promises = dataTypes.map(async (type) => {
        const actualUseCache = forceRefresh ? false : options.useCache;
        
        switch (type) {
          case OuraDataTypes.ACTIVITY:
            return { type, data: await ouraAPI.getDailyActivity(options.startDate, options.endDate, actualUseCache) };
          case OuraDataTypes.SLEEP:
            return { type, data: await ouraAPI.getSleepData(options.startDate, options.endDate, actualUseCache) };
          case OuraDataTypes.READINESS:
            return { type, data: await ouraAPI.getReadinessData(options.startDate, options.endDate, actualUseCache) };
          case OuraDataTypes.HEART_RATE:
            return { type, data: await ouraAPI.getHeartRateVariability(options.startDate, options.endDate, actualUseCache) };
          case OuraDataTypes.TEMPERATURE:
            return { type, data: await ouraAPI.getTemperatureData(options.startDate, options.endDate, actualUseCache) };
          case OuraDataTypes.PERSONAL_INFO:
            return { type, data: await ouraAPI.getPersonalInfo(actualUseCache) };
          default:
            throw new Error(`Unknown data type: ${type}`);
        }
      });
      
      const results = await Promise.allSettled(promises);
      const newData = {};
      
      results.forEach((result, index) => {
        const dataType = dataTypes[index];
        if (result.status === 'fulfilled') {
          newData[dataType] = result.value.data;
        } else {
          newData[dataType] = { error: result.reason?.message };
        }
      });
      
      setCombinedData(newData);
      setLastUpdated(new Date());
      
    } catch (err) {
      setError({
        type: OuraErrorTypes.API_ERROR,
        message: err.message,
        timestamp: new Date(),
      });
    } finally {
      setLoading(false);
    }
  }, [dataTypes, options]);

  const refresh = useCallback(() => {
    fetchMultipleData(true);
  }, [fetchMultipleData]);

  useEffect(() => {
    if (dataTypes.length > 0) {
      fetchMultipleData();
    }
  }, [fetchMultipleData]);

  return {
    data: combinedData,
    loading,
    error,
    lastUpdated,
    refresh,
  };
};

/**
 * Hook for API connection status and validation
 */
export const useOuraConnection = () => {
  const [isConnected, setIsConnected] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [usageStats, setUsageStats] = useState(null);

  const validateConnection = useCallback(async () => {
    setIsValidating(true);
    setConnectionError(null);
    
    try {
      const result = await ouraAPI.validateConnection();
      setIsConnected(result.valid);
      
      if (!result.valid) {
        setConnectionError(result.message);
      }
    } catch (error) {
      setIsConnected(false);
      setConnectionError(error.message);
    } finally {
      setIsValidating(false);
    }
  }, []);

  const updateUsageStats = useCallback(() => {
    setUsageStats(ouraAPI.getUsageStats());
  }, []);

  const clearCache = useCallback(async () => {
    try {
      await ouraAPI.clearCache();
      return true;
    } catch (error) {
      console.error('Failed to clear cache:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    validateConnection();
    updateUsageStats();
  }, [validateConnection, updateUsageStats]);

  return {
    isConnected,
    connectionError,
    isValidating,
    usageStats,
    validateConnection,
    updateUsageStats,
    clearCache,
  };
};

/**
 * Hook for real-time data with automatic updates
 */
export const useOuraRealTime = (dataTypes = [], updateInterval = 60000) => {
  const [realtimeData, setRealtimeData] = useState({});
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);

  const startRealTime = useCallback(() => {
    if (dataTypes.length === 0) return;
    
    setIsActive(true);
    
    const fetchRealTimeData = async () => {
      try {
        const promises = dataTypes.map(async (type) => {
          switch (type) {
            case OuraDataTypes.ACTIVITY:
              return { type, data: await ouraAPI.getDailyActivity(null, null, false) };
            case OuraDataTypes.READINESS:
              return { type, data: await ouraAPI.getReadinessData(null, null, false) };
            default:
              return null;
          }
        });
        
        const results = await Promise.allSettled(promises);
        const newData = {};
        
        results.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            newData[result.value.type] = {
              data: result.value.data,
              timestamp: new Date(),
            };
          }
        });
        
        setRealtimeData(prev => ({ ...prev, ...newData }));
        
      } catch (error) {
        console.error('Real-time update error:', error);
      }
    };

    // Initial fetch
    fetchRealTimeData();
    
    // Set up interval
    intervalRef.current = setInterval(fetchRealTimeData, updateInterval);
  }, [dataTypes, updateInterval]);

  const stopRealTime = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    realtimeData,
    isActive,
    startRealTime,
    stopRealTime,
  };
};

/**
 * Utility hook for formatting Oura data
 */
export const useOuraDataFormatter = () => {
  const formatActivity = useCallback((activityData) => {
    if (!activityData?.data) return null;
    
    return activityData.data.map(day => ({
      date: day.day,
      steps: day.steps,
      calories: day.active_calories,
      distance: day.distance / 1000, // Convert to km
      activeMinutes: day.active_minutes,
      goals: {
        steps: day.target_steps,
        calories: day.target_calories,
      },
      completion: {
        steps: (day.steps / day.target_steps) * 100,
        calories: (day.active_calories / day.target_calories) * 100,
      },
    }));
  }, []);

  const formatSleep = useCallback((sleepData) => {
    if (!sleepData?.data) return null;
    
    return sleepData.data.map(night => ({
      date: night.day,
      duration: Math.round(night.total_sleep_duration / 60), // Convert to minutes
      efficiency: night.sleep_efficiency,
      stages: {
        deep: Math.round(night.deep_sleep_duration / 60),
        light: Math.round(night.light_sleep_duration / 60),
        rem: Math.round(night.rem_sleep_duration / 60),
        awake: Math.round(night.awake_time / 60),
      },
      heartRate: {
        lowest: night.lowest_heart_rate,
        average: Math.round(night.average_heart_rate),
      },
      temperature: {
        deviation: night.body_temperature_delta,
      },
      score: night.sleep_score,
    }));
  }, []);

  const formatReadiness = useCallback((readinessData) => {
    if (!readinessData?.data) return null;
    
    return readinessData.data.map(day => ({
      date: day.day,
      score: day.score,
      temperature: day.temperature_deviation,
      recoveryIndex: day.recovery_index,
      contributors: {
        activity: day.activity_balance,
        sleep: day.sleep_balance,
        hrv: day.hrv_balance,
      },
    }));
  }, []);

  return {
    formatActivity,
    formatSleep,
    formatReadiness,
  };
};

// Export all hooks
export default useOuraData;