// src/hooks/useChat.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../services/chat-service';

export interface UseChatOptions {
  sessionId?: string;
  autoCreateSession?: boolean;
  onMessage?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
  onStream?: (chunk: string) => void;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  error: Error | null;
  sessionId: string | null;
  sendMessage: (content: string, options?: { stream?: boolean; model?: string; temperature?: number }) => Promise<void>;
  clearMessages: () => void;
  createSession: () => string;
  deleteSession: () => void;
  exportHistory: () => string;
  importHistory: (data: string) => void;
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(options.sessionId || null);

  const wsRef = useRef<WebSocket | null>(null);
  const streamBufferRef = useRef<string>('');

  // Initialize session if autoCreateSession is true
  useEffect(() => {
    if (options.autoCreateSession && !sessionId) {
      const newSessionId = createSession();
      setSessionId(newSessionId);
    }
  }, [options.autoCreateSession, sessionId]);

  // WebSocket connection management
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    // Construct WebSocket URL based on current browser location
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/chat`;

    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'chat_response') {
          const message: ChatMessage = {
            id: data.messageId || Date.now().toString(),
            role: 'assistant',
            content: data.content,
            timestamp: new Date(data.timestamp || Date.now()),
            metadata: data.metadata
          };

          setMessages(prev => [...prev, message]);
          options.onMessage?.(message);
        } else if (data.type === 'stream_chunk') {
          streamBufferRef.current += data.chunk;
          options.onStream?.(data.chunk);
        } else if (data.type === 'stream_end') {
          setIsStreaming(false);
          // Add the complete streamed message
          const message: ChatMessage = {
            id: data.messageId || Date.now().toString(),
            role: 'assistant',
            content: streamBufferRef.current,
            timestamp: new Date(data.timestamp || Date.now()),
            metadata: data.metadata
          };
          setMessages(prev => [...prev, message]);
          streamBufferRef.current = '';
          options.onMessage?.(message);
        } else if (data.type === 'error') {
          const error = new Error(data.message || 'WebSocket error');
          setError(error);
          options.onError?.(error);
          setIsLoading(false);
          setIsStreaming(false);
        }
      } catch (err) {
        console.error('WebSocket message parse error:', err);
      }
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      wsRef.current = null;
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      const wsError = new Error('WebSocket connection failed');
      setError(wsError);
      options.onError?.(wsError);
    };
  }, [options]);

  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Send message via WebSocket
  const sendMessage = useCallback(async (
    content: string,
    sendOptions: { stream?: boolean; model?: string; temperature?: number } = {}
  ) => {
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    options.onMessage?.(userMessage);

    try {
      // Ensure WebSocket is connected
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        connectWebSocket();
        // Wait for connection
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('WebSocket connection timeout')), 5000);
          if (wsRef.current) {
            wsRef.current.onopen = () => {
              clearTimeout(timeout);
              resolve(void 0);
            };
          }
        });
      }

      if (sendOptions.stream) {
        setIsStreaming(true);
        streamBufferRef.current = '';
      }

      // Send message via WebSocket
      const messageData = {
        type: 'chat_message',
        content: userMessage.content,
        sessionId,
        stream: sendOptions.stream || false,
        model: sendOptions.model,
        temperature: sendOptions.temperature,
        timestamp: userMessage.timestamp.toISOString()
      };

      wsRef.current?.send(JSON.stringify(messageData));

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to send message');
      setError(error);
      options.onError?.(error);
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [sessionId, connectWebSocket, options]);

  // Create new session
  const createSession = useCallback((): string => {
    const newSessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    setSessionId(newSessionId);
    setMessages([]);
    setError(null);
    return newSessionId;
  }, []);

  // Delete current session
  const deleteSession = useCallback(() => {
    setSessionId(null);
    setMessages([]);
    setError(null);
    disconnectWebSocket();
  }, [disconnectWebSocket]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Export chat history
  const exportHistory = useCallback((): string => {
    const history = {
      sessionId,
      messages,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(history, null, 2);
  }, [sessionId, messages]);

  // Import chat history
  const importHistory = useCallback((data: string) => {
    try {
      const history = JSON.parse(data);
      setSessionId(history.sessionId || null);
      setMessages(history.messages || []);
      setError(null);
    } catch (err) {
      const error = new Error('Failed to import chat history');
      setError(error);
      options.onError?.(error);
    }
  }, [options]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, [disconnectWebSocket]);

  return {
    messages,
    isLoading,
    isStreaming,
    error,
    sessionId,
    sendMessage,
    clearMessages,
    createSession,
    deleteSession,
    exportHistory,
    importHistory
  };
}