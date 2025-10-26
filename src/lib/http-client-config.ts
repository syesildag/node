// src/lib/http-client-config.ts
import { HttpClient, HttpConfig } from './http-client';

// Environment variables
const AI_CHAT_URL = process.env.AI_CHAT_URL || 'https://api.openai.com/v1/chat/completions';
const AI_API_KEY = process.env.AI_API_KEY || '';

// Default configurations for different APIs
export const httpConfigs: Record<string, HttpConfig> = {
  default: {
    timeout: 30000,
    retries: 3,
    retryDelay: 1000,
    maxRetryDelay: 30000,
    headers: {
      'User-Agent': 'NodeJS-HttpClient/1.0',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },

  aiChat: {
    baseURL: AI_CHAT_URL,
    timeout: 60000, // Longer timeout for AI requests
    retries: 2,
    retryDelay: 2000,
    headers: {
      'Authorization': `Bearer ${AI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    rateLimit: {
      requests: 50, // requests per period
      period: 60000 // 1 minute
    }
  },

  github: {
    baseURL: 'https://api.github.com',
    timeout: 30000,
    retries: 3,
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'NodeJS-HttpClient/1.0'
    },
    auth: {
      type: 'bearer',
      token: process.env.GITHUB_TOKEN
    },
    rateLimit: {
      requests: 5000,
      period: 3600000 // 1 hour
    }
  },

  weather: {
    baseURL: 'https://api.openweathermap.org/data/2.5',
    timeout: 10000,
    retries: 2
  }
};

// Create configured clients
export const clients = {
  default: new HttpClient(httpConfigs.default),
  aiChat: new HttpClient(httpConfigs.aiChat),
  github: new HttpClient(httpConfigs.github),
  weather: new HttpClient(httpConfigs.weather)
};

// Logging interceptor for debugging
export function addLoggingInterceptors(client: HttpClient) {
  client.addRequestInterceptor((config) => {
    console.log(`[HTTP Request] ${config.method} ${config.url}`);
    if (config.data) {
      console.log('[HTTP Request Data]', JSON.stringify(config.data, null, 2));
    }
    return config;
  });

  client.addResponseInterceptor((response) => {
    console.log(`[HTTP Response] ${response.status} ${response.config.method} ${response.config.url}`);
    return response;
  });
}

// Error handling interceptor
export function addErrorHandlingInterceptors(client: HttpClient) {
  client.addResponseInterceptor((response) => {
    if (response.status >= 400) {
      console.error(`[HTTP Error] ${response.status} ${response.config.method} ${response.config.url}`);
      console.error('[HTTP Error Response]', response.data);
    }
    return response;
  });
}

// Initialize clients with interceptors in development
if (process.env.NODE_ENV === 'development') {
  Object.values(clients).forEach(client => {
    addLoggingInterceptors(client);
    addErrorHandlingInterceptors(client);
  });
}

// Utility function to create a client with custom config
export function createCustomClient(config: HttpConfig): HttpClient {
  const client = new HttpClient(config);

  if (process.env.NODE_ENV === 'development') {
    addLoggingInterceptors(client);
    addErrorHandlingInterceptors(client);
  }

  return client;
}

// Export default client
export default clients.default;