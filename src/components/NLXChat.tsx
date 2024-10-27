import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Send } from 'lucide-react';

// Extend the existing interfaces
interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  skill?: string;
  metrics?: SkillMetrics;
}

interface SkillMetrics {
  eyeContact?: number;
  posture?: number;
  gestures?: number;
  voiceClarity?: number;
  pace?: number;
  engagement?: number;
}

interface NLXResponse {
  message: string;
  conversationId?: string;
  skill?: string;
  metrics?: SkillMetrics;
}

// Define available skills for type safety
const AVAILABLE_SKILLS = [
  'eyeContact',
  'posture',
  'gestures',
  'voiceClarity',
  'pace',
  'engagement'
] as const;

type Skill = typeof AVAILABLE_SKILLS[number];

const useNLX = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);

  const makeRequest = async (endpoint: string, data: any): Promise<NLXResponse> => {
    // Using environment variables
    const config = {
      apiKey: process.env.REACT_APP_NLX_API_KEY,
      baseUrl: process.env.REACT_APP_NLX_BASE_URL,
      botId: process.env.REACT_APP_NLX_BOT_ID,
    };

    try {
      const response = await fetch(`${config.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          ...data,
          botId: config.botId,
          context: {
            skills: AVAILABLE_SKILLS,
            currentSkill,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`NLX API error: ${response.statusText}`);
      }

      const responseData = await response.json();
      if (responseData.skill) {
        setCurrentSkill(responseData.skill as Skill);
      }
      
      return responseData;
    } catch (error) {
      console.error('NLX request failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initConversation = async () => {
      try {
        setLoading(true);
        const response = await makeRequest('/start', {});
        setConversationId(response.conversationId);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    initConversation();
  }, []);

  return {
    sendMessage: async (message: string) => {
      if (!conversationId) {
        throw new Error('Conversation not initialized');
      }

      try {
        setLoading(true);
        setError(null);
        const response = await makeRequest('/message', {
          conversationId,
          message,
          currentSkill,
        });
        return response;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    loading,
    error,
    conversationId,
    currentSkill,
  };
};

const NLXChat: React.FC<{ onMetricsUpdate?: (metrics: SkillMetrics) => void }> = ({ 
  onMetricsUpdate 
}) => {
  const { sendMessage, loading, error, currentSkill } = useNLX();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    setMessages([
      {
        text: "Hello! I'm your AI communication coach. I can help you improve your presentation skills including eye contact, posture, gestures, voice clarity, pace, and engagement. What would you like to work on?",
        sender: 'bot',
        timestamp: new Date(),
        skill: 'general'
      }
    ]);
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage: Message = {
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      const response = await sendMessage(inputText);
      const botMessage: Message = {
        text: response.message,
        sender: 'bot',
        timestamp: new Date(),
        skill: response.skill,
        metrics: response.metrics
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Update dashboard metrics if provided
      if (onMetricsUpdate && response.metrics) {
        onMetricsUpdate(response.metrics);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const renderSkillBadge = (skill: string) => {
    const colors: Record<string, string> = {
      eyeContact: 'bg-blue-100 text-blue-600',
      posture: 'bg-green-100 text-green-600',
      gestures: 'bg-purple-100 text-purple-600',
      voiceClarity: 'bg-yellow-100 text-yellow-600',
      pace: 'bg-red-100 text-red-600',
      engagement: 'bg-indigo-100 text-indigo-600',
      general: 'bg-gray-100 text-gray-600'
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${colors[skill] || colors.general}`}>
        {skill.charAt(0).toUpperCase() + skill.slice(1)}
      </span>
    );
  };

  // Rest of your component remains the same until the messages rendering part
  
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all z-50"
      >
        <Maximize2 className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div 
      className={`fixed top-0 right-0 h-screen bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
        isExpanded ? 'translate-x-0 w-96' : 'translate-x-[calc(100%-2rem)] w-96'
      } z-50`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute left-0 top-1/2 -translate-x-full transform bg-white p-2 rounded-l-lg shadow-lg hover:bg-gray-50"
        aria-label={isExpanded ? "Collapse chat" : "Expand chat"}
      >
        {isExpanded ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>

      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between bg-indigo-600 text-white">
          <div className="flex items-center space-x-2">
            <h2 className="font-semibold text-lg">AI Communication Coach</h2>
            {currentSkill && renderSkillBadge(currentSkill)}
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-indigo-700 rounded"
          >
            <Minimize2 className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.skill && message.sender === 'bot' && (
                  <div className="mb-2">{renderSkillBadge(message.skill)}</div>
                )}
                <div>{message.text}</div>
                {message.metrics && (
                  <div className="mt-2 space-y-1">
                    {Object.entries(message.metrics).map(([key, value]) => (
                      <div key={key} className="text-xs flex justify-between">
                        <span>{key}:</span>
                        <span className="font-semibold">{value}%</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-xs mt-1 opacity-75">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 round-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center text-sm">
              Error: {error.message}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask your AI coach..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NLXChat;