/**
 * Oura Ring API Service
 * Complete integration with Oura Ring API v2
 * Features: Error handling, retry logic, rate limiting, offline caching
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

class OuraAPIService {
  constructor() {
    this.baseURL = process.env.OURA_API_BASE_URL || 'https://api.ouraring.com/v2/usercollection';
    this.apiToken = process.env.OURA_API_TOKEN;
    this.rateLimit = parseInt(process.env.OURA_RATE_LIMIT) || 300; // requests per minute
    this.cacheDuration = parseInt(process.env.OURA_CACHE_DURATION) || 30; // minutes
    this.maxRetries = parseInt(process.env.OURA_MAX_RETRIES) || 3;
    this.retryDelay = parseInt(process.env.OURA_RETRY_DELAY) || 1000; // milliseconds
    
    // Rate limiting tracking
    this.requestCount = 0;
    this.rateLimitWindow = Date.now();
    
    if (!this.apiToken) {
      console.error('Oura API token not found. Please set OURA_API_TOKEN in environment variables.');
    }
  }

  /**
   * Rate limiting check
   */
  async checkRateLimit() {
    const now = Date.now();
    const windowDuration = 60000; // 1 minute in milliseconds
    
    if (now - this.rateLimitWindow > windowDuration) {
      this.requestCount = 0;
      this.rateLimitWindow = now;
    }
    
    if (this.requestCount >= this.rateLimit) {
      const waitTime = windowDuration - (now - this.rateLimitWindow);
      throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
    }
    
    this.requestCount++;
  }

  /**
   * Generic API request with retry logic and error handling
   */
  async makeRequest(endpoint, options = {}) {
    await this.checkRateLimit();
    
    const url = `${this.baseURL}${endpoint}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    let lastError;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(url, requestOptions);
        
        if (response.status === 429) {
          // Rate limited by server
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : this.retryDelay * attempt;
          await this.delay(waitTime);
          continue;
        }
        
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorData}`);
        }
        
        const data = await response.json();
        return data;
        
      } catch (error) {
        lastError = error;
        console.warn(`Oura API request attempt ${attempt} failed:`, error.message);
        
        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }
    
    throw new Error(`Failed after ${this.maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * Delay utility for retry logic
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cache management
   */
  async getCachedData(key) {
    try {
      const cached = await AsyncStorage.getItem(`oura_${key}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > (this.cacheDuration * 60 * 1000);
        
        if (!isExpired) {
          return data;
        }
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }
    return null;
  }

  async setCachedData(key, data) {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(`oura_${key}`, JSON.stringify(cacheEntry));
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  }

  /**
   * Format date for API requests
   */
  formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  /**
   * Get date range (default: last 7 days)
   */
  getDateRange(days = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return {
      start_date: this.formatDate(startDate),
      end_date: this.formatDate(endDate),
    };
  }

  /**
   * DAILY ACTIVITY DATA
   * Get steps, calories, distance, active minutes
   */
  async getDailyActivity(startDate = null, endDate = null, useCache = true) {
    const dateRange = startDate && endDate 
      ? { start_date: startDate, end_date: endDate }
      : this.getDateRange();
    
    const cacheKey = `activity_${dateRange.start_date}_${dateRange.end_date}`;
    
    if (useCache) {
      const cached = await this.getCachedData(cacheKey);
      if (cached) return cached;
    }
    
    const params = new URLSearchParams(dateRange);
    const data = await this.makeRequest(`/daily_activity?${params}`);
    
    if (useCache) {
      await this.setCachedData(cacheKey, data);
    }
    
    return data;
  }

  /**
   * SLEEP DATA
   * Get sleep stages, efficiency, heart rate, temperature
   */
  async getSleepData(startDate = null, endDate = null, useCache = true) {
    const dateRange = startDate && endDate 
      ? { start_date: startDate, end_date: endDate }
      : this.getDateRange();
    
    const cacheKey = `sleep_${dateRange.start_date}_${dateRange.end_date}`;
    
    if (useCache) {
      const cached = await this.getCachedData(cacheKey);
      if (cached) return cached;
    }
    
    const params = new URLSearchParams(dateRange);
    const data = await this.makeRequest(`/sleep?${params}`);
    
    if (useCache) {
      await this.setCachedData(cacheKey, data);
    }
    
    return data;
  }

  /**
   * HEART RATE VARIABILITY (HRV)
   */
  async getHeartRateVariability(startDate = null, endDate = null, useCache = true) {
    const dateRange = startDate && endDate 
      ? { start_date: startDate, end_date: endDate }
      : this.getDateRange();
    
    const cacheKey = `hrv_${dateRange.start_date}_${dateRange.end_date}`;
    
    if (useCache) {
      const cached = await this.getCachedData(cacheKey);
      if (cached) return cached;
    }
    
    const params = new URLSearchParams(dateRange);
    const data = await this.makeRequest(`/heartrate?${params}`);
    
    if (useCache) {
      await this.setCachedData(cacheKey, data);
    }
    
    return data;
  }

  /**
   * READINESS SCORE
   */
  async getReadinessData(startDate = null, endDate = null, useCache = true) {
    const dateRange = startDate && endDate 
      ? { start_date: startDate, end_date: endDate }
      : this.getDateRange();
    
    const cacheKey = `readiness_${dateRange.start_date}_${dateRange.end_date}`;
    
    if (useCache) {
      const cached = await this.getCachedData(cacheKey);
      if (cached) return cached;
    }
    
    const params = new URLSearchParams(dateRange);
    const data = await this.makeRequest(`/daily_readiness?${params}`);
    
    if (useCache) {
      await this.setCachedData(cacheKey, data);
    }
    
    return data;
  }

  /**
   * RECOVERY METRICS
   */
  async getRecoveryData(startDate = null, endDate = null, useCache = true) {
    const dateRange = startDate && endDate 
      ? { start_date: startDate, end_date: endDate }
      : this.getDateRange();
    
    const cacheKey = `recovery_${dateRange.start_date}_${dateRange.end_date}`;
    
    if (useCache) {
      const cached = await this.getCachedData(cacheKey);
      if (cached) return cached;
    }
    
    // Recovery data is typically included in readiness and sleep data
    const [readiness, sleep] = await Promise.all([
      this.getReadinessData(dateRange.start_date, dateRange.end_date, useCache),
      this.getSleepData(dateRange.start_date, dateRange.end_date, useCache)
    ]);
    
    const recoveryData = {
      readiness: readiness.data,
      sleep_recovery: sleep.data?.map(day => ({
        day: day.day,
        recovery_index: day.recovery_index,
        resting_heart_rate: day.resting_heart_rate,
        hrv: day.hrv,
      })),
    };
    
    if (useCache) {
      await this.setCachedData(cacheKey, recoveryData);
    }
    
    return recoveryData;
  }

  /**
   * BODY TEMPERATURE TRENDS
   */
  async getTemperatureData(startDate = null, endDate = null, useCache = true) {
    const dateRange = startDate && endDate 
      ? { start_date: startDate, end_date: endDate }
      : this.getDateRange();
    
    const cacheKey = `temperature_${dateRange.start_date}_${dateRange.end_date}`;
    
    if (useCache) {
      const cached = await this.getCachedData(cacheKey);
      if (cached) return cached;
    }
    
    // Temperature data is included in sleep data
    const sleepData = await this.getSleepData(dateRange.start_date, dateRange.end_date, useCache);
    
    const temperatureData = {
      data: sleepData.data?.map(day => ({
        day: day.day,
        body_temperature_delta: day.body_temperature_delta,
        skin_temperature_delta: day.skin_temperature_delta,
      })).filter(day => day.body_temperature_delta !== null || day.skin_temperature_delta !== null),
    };
    
    if (useCache) {
      await this.setCachedData(cacheKey, temperatureData);
    }
    
    return temperatureData;
  }

  /**
   * COMPREHENSIVE HEALTH SUMMARY
   * Get all data types in a single call
   */
  async getHealthSummary(startDate = null, endDate = null, useCache = true) {
    const dateRange = startDate && endDate 
      ? { start_date: startDate, end_date: endDate }
      : this.getDateRange();
    
    const cacheKey = `health_summary_${dateRange.start_date}_${dateRange.end_date}`;
    
    if (useCache) {
      const cached = await this.getCachedData(cacheKey);
      if (cached) return cached;
    }
    
    try {
      const [activity, sleep, readiness, hrv, temperature] = await Promise.allSettled([
        this.getDailyActivity(dateRange.start_date, dateRange.end_date, useCache),
        this.getSleepData(dateRange.start_date, dateRange.end_date, useCache),
        this.getReadinessData(dateRange.start_date, dateRange.end_date, useCache),
        this.getHeartRateVariability(dateRange.start_date, dateRange.end_date, useCache),
        this.getTemperatureData(dateRange.start_date, dateRange.end_date, useCache),
      ]);
      
      const healthSummary = {
        dateRange,
        activity: activity.status === 'fulfilled' ? activity.value : { error: activity.reason?.message },
        sleep: sleep.status === 'fulfilled' ? sleep.value : { error: sleep.reason?.message },
        readiness: readiness.status === 'fulfilled' ? readiness.value : { error: readiness.reason?.message },
        hrv: hrv.status === 'fulfilled' ? hrv.value : { error: hrv.reason?.message },
        temperature: temperature.status === 'fulfilled' ? temperature.value : { error: temperature.reason?.message },
        lastUpdated: new Date().toISOString(),
      };
      
      if (useCache) {
        await this.setCachedData(cacheKey, healthSummary);
      }
      
      return healthSummary;
      
    } catch (error) {
      throw new Error(`Failed to fetch health summary: ${error.message}`);
    }
  }

  /**
   * PERSONAL INFO
   * Get user's personal information and preferences
   */
  async getPersonalInfo(useCache = true) {
    const cacheKey = 'personal_info';
    
    if (useCache) {
      const cached = await this.getCachedData(cacheKey);
      if (cached) return cached;
    }
    
    const data = await this.makeRequest('/personal_info');
    
    if (useCache) {
      await this.setCachedData(cacheKey, data);
    }
    
    return data;
  }

  /**
   * CLEAR CACHE
   * Clear all cached Oura data
   */
  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const ouraKeys = keys.filter(key => key.startsWith('oura_'));
      await AsyncStorage.multiRemove(ouraKeys);
      console.log(`Cleared ${ouraKeys.length} cached Oura data entries`);
    } catch (error) {
      console.error('Error clearing Oura cache:', error);
    }
  }

  /**
   * VALIDATE API CONNECTION
   * Test the API connection and token validity
   */
  async validateConnection() {
    try {
      await this.getPersonalInfo(false); // Don't use cache for validation
      return { valid: true, message: 'API connection successful' };
    } catch (error) {
      return { valid: false, message: error.message };
    }
  }

  /**
   * GET API USAGE STATS
   * Return current rate limiting status
   */
  getUsageStats() {
    const windowRemaining = 60000 - (Date.now() - this.rateLimitWindow);
    return {
      requestsInCurrentWindow: this.requestCount,
      rateLimit: this.rateLimit,
      windowRemainingMs: Math.max(0, windowRemaining),
      requestsRemaining: Math.max(0, this.rateLimit - this.requestCount),
    };
  }
}

// Create and export singleton instance
const ouraAPI = new OuraAPIService();

export default ouraAPI;

// Export individual methods for convenience
export {
  ouraAPI,
};

// Export types for TypeScript support
export const OuraDataTypes = {
  ACTIVITY: 'daily_activity',
  SLEEP: 'sleep',
  READINESS: 'daily_readiness',
  HEART_RATE: 'heartrate',
  TEMPERATURE: 'temperature',
  PERSONAL_INFO: 'personal_info',
};

export const OuraErrorTypes = {
  RATE_LIMITED: 'RATE_LIMITED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  API_ERROR: 'API_ERROR',
  CACHE_ERROR: 'CACHE_ERROR',
};