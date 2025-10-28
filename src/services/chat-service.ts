// src/services/chat-service.ts
import { clients } from '../lib/http-client-config';
import { HttpResponse } from '../lib/http-client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  sessionId?: string;
}

export interface ChatResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class ChatService {
  private sessions: Map<string, ChatSession> = new Map();

  // Send a chat message and get response
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response: HttpResponse<ChatResponse> = await clients.default.post('/chat/completions', {
        model: request.model || 'gpt-3.5-turbo',
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 1000,
        stream: false
      });

      // Store the conversation if sessionId is provided
      if (request.sessionId) {
        await this.addMessagesToSession(request.sessionId, [
          {
            id: this.generateId(),
            role: 'user',
            content: request.messages[request.messages.length - 1].content,
            timestamp: new Date()
          },
          {
            id: this.generateId(),
            role: 'assistant',
            content: response.data.choices[0].message.content,
            timestamp: new Date()
          }
        ]);
      }

      return response.data;
    } catch (error) {
      console.error('Chat service error:', error);
      throw new Error(`Failed to send chat message: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Stream a chat response
  async *streamMessage(request: ChatRequest): AsyncGenerator<string, void, unknown> {
    try {
      let accumulatedContent = '';
      const userMessage = request.messages[request.messages.length - 1];
      const streamRequest = {
        prompt: userMessage.content,
        session: request.sessionId,
      };
      for await (const chunk of clients.default.postStream(process.env.CHAT_API_URL!, streamRequest)) {
        // Parse the streaming response (SSE format)
        const lines = chunk.split('\n').filter((line: string) => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              // Store the conversation if sessionId is provided
              if (request.sessionId) {
                await this.addMessagesToSession(request.sessionId, [
                  {
                    id: this.generateId(),
                    role: 'user',
                    content: userMessage.content,
                    timestamp: new Date()
                  },
                  {
                    id: this.generateId(),
                    role: 'assistant',
                    content: accumulatedContent,
                    timestamp: new Date()
                  }
                ]);
              }
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;

              if (content) {
                accumulatedContent += content;
                yield content;
              }
            } catch (parseError) {
              // Skip invalid JSON chunks
              continue;
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat streaming error:', error);
      throw new Error(`Failed to stream chat message: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Session management
  createSession(metadata?: Record<string, any>): string {
    const sessionId = this.generateId();
    const session: ChatSession = {
      id: sessionId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata
    };

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  async addMessagesToSession(sessionId: string, messages: ChatMessage[]): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.messages.push(...messages);
    session.updatedAt = new Date();
  }

  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  getAllSessions(): ChatSession[] {
    return Array.from(this.sessions.values());
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get chat history for a session
  getChatHistory(sessionId: string): ChatMessage[] {
    const session = this.sessions.get(sessionId);
    return session ? session.messages : [];
  }

  // Clear chat history for a session
  clearChatHistory(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.messages = [];
      session.updatedAt = new Date();
    }
  }

  // Export chat history
  exportChatHistory(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    return JSON.stringify({
      sessionId: session.id,
      createdAt: session.createdAt,
      messages: session.messages
    }, null, 2);
  }

  // Import chat history
  importChatHistory(data: string): string {
    try {
      const parsed = JSON.parse(data);
      const session: ChatSession = {
        id: parsed.sessionId || this.generateId(),
        messages: parsed.messages || [],
        createdAt: new Date(parsed.createdAt) || new Date(),
        updatedAt: new Date(),
        metadata: parsed.metadata
      };

      this.sessions.set(session.id, session);
      return session.id;
    } catch (error) {
      throw new Error(`Failed to import chat history: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// Default instance
export const chatService = new ChatService();