import axios from 'axios';
import API_URL from '../config';

// Function to store logs in localStorage
const storeLog = (type, data) => {
  try {
    const logs = JSON.parse(localStorage.getItem('apiLogs') || '[]');
    logs.unshift({
      timestamp: new Date().toISOString(),
      type,
      data
    });
    // Keep only the last 50 logs
    if (logs.length > 50) {
      logs.pop();
    }
    localStorage.setItem('apiLogs', JSON.stringify(logs));
  } catch (error) {
    console.error('Error storing log:', error);
  }
};

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure the token is properly formatted
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers['Authorization'] = formattedToken;
    }
    console.log('Making request to:', config.url);
    console.log('Request config:', config);
    storeLog('request', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    storeLog('response', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if it's a network error and we haven't retried yet
    if (error.message === 'Network Error' && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest._retryCount = originalRequest._retryCount || 0;

      if (originalRequest._retryCount < MAX_RETRIES) {
        originalRequest._retryCount++;
        console.log(`Retrying request (${originalRequest._retryCount}/${MAX_RETRIES})...`);
        
        // Wait before retrying
        await delay(RETRY_DELAY * originalRequest._retryCount);
        
        // Retry the request
        return axiosInstance(originalRequest);
      }
    }

    console.error('Response error:', error);
    console.error('Error data:', error.response?.data);
    console.error('Error status:', error.response?.status);
    storeLog('error', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Handle specific error cases
    if (error.message === 'Network Error') {
      // Show a user-friendly message for network errors
      throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
    }

    // Only clear token and redirect for auth-related endpoints
    if (error.response?.status === 401 && error.config.url.includes('/api/auth/')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 