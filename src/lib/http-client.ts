// src/lib/http-client.ts
import { Agent } from 'https';
import { EventEmitter } from 'events';

export interface HttpConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  maxRetryDelay?: number;
  rateLimit?: {
    requests: number;
    period: number; // in milliseconds
  };
  headers?: Record<string, string>;
  auth?: {
    type: 'bearer' | 'basic' | 'api-key';
    token?: string;
    username?: string;
    password?: string;
    headerName?: string;
  };
  agent?: Agent;
  validateStatus?: (status: number) => boolean;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  maxRetryDelay?: number;
  auth?: HttpConfig['auth'];
  responseType?: 'json' | 'text' | 'buffer' | 'stream';
  validateStatus?: (status: number) => boolean;
  onProgress?: (progress: { loaded: number; total: number }) => void;
  onStream?: (chunk: any) => void; // For streaming responses
  stream?: boolean; // Enable streaming mode
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: RequestOptions & { url: string };
  request?: any;
}

export interface HttpError extends Error {
  config: RequestOptions & { url: string };
  response?: HttpResponse;
  status?: number;
  code?: string;
}

export class HttpClient extends EventEmitter {
  private config: HttpConfig;
  private rateLimiter: RateLimiter;
  private interceptors: {
    request: Array<(config: RequestOptions & { url: string }) => (RequestOptions & { url: string }) | Promise<RequestOptions & { url: string }>>;
    response: Array<(response: HttpResponse) => HttpResponse | Promise<HttpResponse>>;
  } = {
    request: [],
    response: []
  };

  constructor(config: HttpConfig = {}) {
    super();
    this.config = {
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      maxRetryDelay: 30000,
      validateStatus: (status) => status >= 200 && status < 300,
      ...config
    };
    this.rateLimiter = new RateLimiter(this.config.rateLimit);
  }

  // Request Interceptors
  addRequestInterceptor(interceptor: (config: RequestOptions & { url: string }) => (RequestOptions & { url: string }) | Promise<RequestOptions & { url: string }>) {
    this.interceptors.request.push(interceptor);
    return this.interceptors.request.length - 1;
  }

  removeRequestInterceptor(id: number) {
    if (id >= 0 && id < this.interceptors.request.length) {
      this.interceptors.request.splice(id, 1);
    }
  }

  // Response Interceptors
  addResponseInterceptor(interceptor: (response: HttpResponse) => HttpResponse | Promise<HttpResponse>) {
    this.interceptors.response.push(interceptor);
    return this.interceptors.response.length - 1;
  }

  removeResponseInterceptor(id: number) {
    if (id >= 0 && id < this.interceptors.response.length) {
      this.interceptors.response.splice(id, 1);
    }
  }

  // HTTP Methods
  get<T = any>(url: string, config: Omit<RequestOptions, 'method' | 'data'> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  post<T = any>(url: string, data?: any, config: Omit<RequestOptions, 'method' | 'data'> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', data, url });
  }

  put<T = any>(url: string, data?: any, config: Omit<RequestOptions, 'method' | 'data'> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', data, url });
  }

  delete<T = any>(url: string, config: Omit<RequestOptions, 'method' | 'data'> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  patch<T = any>(url: string, data?: any, config: Omit<RequestOptions, 'method' | 'data'> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', data, url });
  }

  head<T = any>(url: string, config: Omit<RequestOptions, 'method' | 'data'> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'HEAD', url });
  }

  options<T = any>(url: string, config: Omit<RequestOptions, 'method' | 'data'> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, method: 'OPTIONS', url });
  }

  // Streaming request method
  async *postStream(url: string, data?: any, config: Omit<RequestOptions, 'method' | 'data'> = {}): AsyncGenerator<any, void, unknown> {
    const mergedConfig = this.mergeConfig({ ...config, method: 'POST', data, url, stream: true });

    // Apply request interceptors
    let processedConfig = mergedConfig;
    for (const interceptor of this.interceptors.request) {
      processedConfig = await interceptor(processedConfig);
    }

    // Rate limiting
    await this.rateLimiter.waitForSlot();

    yield* this.executeStreamRequest(processedConfig);
  }

  async request<T = any>(config: RequestOptions & { url: string }): Promise<HttpResponse<T>> {
    // Merge configs
    const mergedConfig = this.mergeConfig(config);

    // Apply request interceptors
    let processedConfig = mergedConfig;
    for (const interceptor of this.interceptors.request) {
      processedConfig = await interceptor(processedConfig);
    }

    // Rate limiting
    await this.rateLimiter.waitForSlot();

    // Execute request with retry logic
    return this.executeWithRetry<T>(processedConfig);
  }

  private async *executeStreamRequest(config: RequestOptions & { url: string }): AsyncGenerator<any, void, unknown> {
    const url = this.buildUrl(config.url, config.params);
    const headers = { ...this.config.headers, ...config.headers };

    // Add authentication
    this.addAuthHeaders(headers, config);

    const requestConfig = {
      method: config.method || 'GET',
      headers,
      timeout: config.timeout || this.config.timeout,
      agent: this.config.agent
    };

    // Add body for non-GET requests
    if (config.data && config.method !== 'GET') {
      if (typeof config.data === 'object') {
        (requestConfig as any).body = JSON.stringify(config.data);
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
      } else {
        (requestConfig as any).body = config.data;
      }
    }

    this.emit('request', { config: requestConfig, url });

    try {
      const response = await fetch(url, requestConfig as any);

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Check if response is ok
      const validateStatus = config.validateStatus || this.config.validateStatus!;
      if (!validateStatus(response.status)) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is not available for streaming');
      }

      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          if (config.onStream) {
            config.onStream(chunk);
          }
          yield chunk;
        }
      } finally {
        reader.releaseLock();
      }

      this.emit('response', { status: response.status, headers: responseHeaders });
    } catch (error) {
      this.emit('error', { error, config });
      throw error;
    }
  }

  private async executeWithRetry<T>(config: RequestOptions & { url: string }): Promise<HttpResponse<T>> {
    const maxRetries = config.retries ?? this.config.retries ?? 0;
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.executeRequest<T>(config);

        // Apply response interceptors
        let processedResponse = response;
        for (const interceptor of this.interceptors.response) {
          processedResponse = await interceptor(processedResponse);
        }

        return processedResponse;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on the last attempt or if it's not a retryable error
        if (attempt === maxRetries || !this.isRetryableError(error)) {
          throw this.createHttpError(error, config);
        }

        // Calculate delay with exponential backoff
        const delay = this.calculateRetryDelay(attempt, config);
        this.emit('retry', { attempt, delay, error, config });

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  private async executeRequest<T>(config: RequestOptions & { url: string }): Promise<HttpResponse<T>> {
    const url = this.buildUrl(config.url, config.params);
    const headers = { ...this.config.headers, ...config.headers };

    // Add authentication
    this.addAuthHeaders(headers, config);

    const requestConfig = {
      method: config.method || 'GET',
      headers,
      timeout: config.timeout || this.config.timeout,
      agent: this.config.agent
    };

    // Add body for non-GET requests
    if (config.data && config.method !== 'GET') {
      if (typeof config.data === 'object') {
        (requestConfig as any).body = JSON.stringify(config.data);
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
      } else {
        (requestConfig as any).body = config.data;
      }
    }

    this.emit('request', { config: requestConfig, url });

    try {
      const response = await fetch(url, requestConfig as any);

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let data: T;
      const responseType = config.responseType || 'json';

      switch (responseType) {
        case 'json':
          data = await response.json();
          break;
        case 'text':
          data = await response.text() as T;
          break;
        case 'buffer':
          data = await response.arrayBuffer() as T;
          break;
        case 'stream':
          data = response.body as T;
          break;
        default:
          data = await response.json();
      }

      const httpResponse: HttpResponse<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        config,
        request: requestConfig
      };

      // Validate status
      const validateStatus = config.validateStatus || this.config.validateStatus!;
      if (!validateStatus(response.status)) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      this.emit('response', httpResponse);
      return httpResponse;
    } catch (error) {
      this.emit('error', { error, config });
      throw error;
    }
  }

  private mergeConfig(config: RequestOptions & { url: string }): RequestOptions & { url: string } {
    return {
      ...this.config,
      ...config,
      headers: { ...this.config.headers, ...config.headers }
    };
  }

  private buildUrl(url: string, params?: Record<string, any>): string {
    const baseUrl = this.config.baseURL || '';
    const fullUrl = baseUrl + url;

    if (!params) return fullUrl;

    const urlObj = new URL(fullUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, String(value));
      }
    });

    return urlObj.toString();
  }

  private addAuthHeaders(headers: Record<string, string>, config: RequestOptions) {
    const auth = config.auth || this.config.auth;
    if (!auth) return;

    switch (auth.type) {
      case 'bearer':
        if (auth.token) {
          headers['Authorization'] = `Bearer ${auth.token}`;
        }
        break;
      case 'basic':
        if (auth.username && auth.password) {
          const credentials = Buffer.from(`${auth.username}:${auth.password}`).toString('base64');
          headers['Authorization'] = `Basic ${credentials}`;
        }
        break;
      case 'api-key':
        if (auth.token && auth.headerName) {
          headers[auth.headerName] = auth.token;
        }
        break;
    }
  }

  private isRetryableError(error: any): boolean {
    // Retry on network errors, 5xx server errors, and specific 4xx errors
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
      return true;
    }

    if (error.response) {
      const status = error.response.status;
      return status >= 500 || status === 429 || status === 408;
    }

    return false;
  }

  private calculateRetryDelay(attempt: number, config: RequestOptions): number {
    const baseDelay = config.retryDelay || this.config.retryDelay || 1000;
    const maxDelay = config.maxRetryDelay || this.config.maxRetryDelay || 30000;

    // Exponential backoff with jitter
    const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    const jitter = Math.random() * 0.1 * exponentialDelay;

    return exponentialDelay + jitter;
  }

  private createHttpError(error: any, config: RequestOptions & { url: string }): HttpError {
    const httpError = new Error(error.message || 'Request failed') as HttpError;
    httpError.config = config;
    httpError.code = error.code;

    if (error.response) {
      httpError.response = error.response;
      httpError.status = error.response.status;
    }

    return httpError;
  }
}

// Rate Limiter Implementation
class RateLimiter {
  private requests: number[] = [];
  private config?: { requests: number; period: number };

  constructor(config?: { requests: number; period: number }) {
    this.config = config;
  }

  async waitForSlot(): Promise<void> {
    if (!this.config) return;

    const now = Date.now();
    const { requests, period } = this.config;

    // Remove old requests outside the time window
    this.requests = this.requests.filter(time => now - time < period);

    if (this.requests.length >= requests) {
      // Calculate wait time until the oldest request expires
      const oldestRequest = Math.min(...this.requests);
      const waitTime = period - (now - oldestRequest);

      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    this.requests.push(Date.now());
  }
}

// Factory function for creating configured clients
export function createHttpClient(config: HttpConfig = {}): HttpClient {
  return new HttpClient(config);
}

// Default client instance
export const httpClient = createHttpClient();