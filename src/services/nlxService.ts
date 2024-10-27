// src/services/nlxService.ts
import { useState, useEffect } from 'react';

interface NLXResponse {
  message: string;
  conversationId?: string;
  context?: any;
}

export class NLXService {
  private apiKey: string;
  private baseUrl: string;
  private botId: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_NLX_API_KEY || '';
    this.baseUrl = import.meta.env.VITE_NLX_BASE_URL || '';
    this.botId = import.meta.env.VITE_NLX_BOT_ID || '';
  }

  private async makeRequest(endpoint: string, data: any): Promise<NLXResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          ...data,
          botId: this.botId
        }),
      });

      if (!response.ok) {
        throw new Error(`NLX API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('NLX request failed:', error);
      throw error;
    }
  }

  async startConversation(initialContext = {}) {
    return this.makeRequest('/start', {
      context: initialContext,
    });
  }

  async sendMessage(conversationId: string, message: string, context = {}) {
    return this.makeRequest('/message', {
      conversationId,
      message,
      context,
    });
  }
}

export function useNLX() {
  const [nlxService] = useState(() => new NLXService());
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initConversation = async () => {
      try {
        setLoading(true);
        const response = await nlxService.startConversation();
        setConversationId(response.conversationId);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    initConversation();
  }, [nlxService]);

  const sendMessage = async (message: string, context = {}) => {
    if (!conversationId) {
      throw new Error('Conversation not initialized');
    }

    try {
      setLoading(true);
      setError(null);
      const response = await nlxService.sendMessage(conversationId, message, context);
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    loading,
    error,
    conversationId,
  };
}