import React, { useState, useRef, useEffect } from 'react';
import { dataStore, type Message } from '../utils/dataStore';

interface ChatInterfaceProps {
  onCreateAgentClick?: () => void;
}

export default function ChatInterface({ onCreateAgentClick }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Create conversation if needed
    let convId = conversationId;
    if (!convId) {
      const conv = dataStore.createConversation(userMessage.substring(0, 50));
      convId = conv.id;
      setConversationId(convId);
    }

    // Add user message
    const userMsg = dataStore.addMessage(convId, 'user', userMessage);
    setMessages(prev => [...prev, userMsg]);

    // Simulate AI response (in real app, this would call an API)
    setTimeout(() => {
      const responseText = generateResponse(userMessage);
      const assistantMsg = dataStore.addMessage(convId!, 'assistant', responseText);
      setMessages(prev => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const suggestions = [
    'Trip planner',
    'Image generator',
    'Code debugger',
    'Research assistant',
    'Decision helper'
  ];

  if (messages.length === 0) {
    // Initial state - show welcome screen
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 max-w-3xl mx-auto px-8">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900">Create a chat prompt</h2>

        {/* Input row */}
        <div className="w-full flex gap-3">
          <button
            onClick={onCreateAgentClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
          >
            <span>+</span>
            <span>Create</span>
          </button>

          <div className="flex-1 relative flex items-center">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Generate..."
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-12 resize-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="absolute right-2 p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Chat view
  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              <div
                className={`flex flex-col max-w-[80%] ${
                  message.role === 'user' ? 'items-end' : ''
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {message.content}
                  </pre>
                </div>
                <div className="text-xs text-gray-500 mt-1 px-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <div className="flex-1 relative flex items-center">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-12 resize-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple AI response generator for demo purposes
function generateResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('trip') || lowerMessage.includes('travel') || lowerMessage.includes('paris') || lowerMessage.includes('vacation')) {
    return `I'd be happy to help you plan your trip! Here are some suggestions:

1. Research your destination - look into local attractions, cultural sites, and hidden gems
2. Book accommodations in advance to get the best rates
3. Create a flexible itinerary that allows for spontaneous discoveries
4. Learn a few key phrases in the local language
5. Check visa requirements and travel advisories

Would you like me to help you plan a specific aspect of your trip?`;
  }
  
  if (lowerMessage.includes('image') || lowerMessage.includes('picture') || lowerMessage.includes('photo')) {
    return `To generate images, I can help you craft effective prompts. Here are some tips:

- Be specific about the subject, style, and mood
- Include details about lighting, colors, and composition
- Mention artistic styles or reference artists if desired
- Specify the perspective or viewpoint

What kind of image would you like to create? For actual image generation, please visit the Images section from the sidebar.`;
  }
  
  if (lowerMessage.includes('code') || lowerMessage.includes('debug') || lowerMessage.includes('program') || lowerMessage.includes('function')) {
    return `I can help you with code debugging! Here's my approach:

1. **Understand the Problem**: Describe what the code should do vs. what it's doing
2. **Review the Code**: Check for syntax errors, logic issues, and edge cases
3. **Test Incrementally**: Break down the problem into smaller parts
4. **Use Debugging Tools**: Console logs, debuggers, and unit tests
5. **Optimize**: Once working, look for performance improvements

Please share your code or describe the issue you're facing, and I'll help you debug it!`;
  }
  
  if (lowerMessage.includes('research') || lowerMessage.includes('find') || lowerMessage.includes('information')) {
    return `I can assist with research! Here's how I can help:

- **Synthesize Information**: Combine multiple sources into coherent summaries
- **Compare Options**: Analyze pros and cons of different approaches
- **Fact-Checking**: Verify information across sources
- **Deep Dives**: Explore topics in detail with citations

What topic would you like to research? Please provide specific questions or areas you'd like to explore.`;
  }
  
  if (lowerMessage.includes('decision') || lowerMessage.includes('choose') || lowerMessage.includes('help me decide')) {
    return `I can help you make better decisions! Let's use a structured approach:

1. **Define the Decision**: What exactly are you trying to decide?
2. **List Options**: What are all the possible choices?
3. **Identify Criteria**: What factors matter most to you?
4. **Evaluate Each Option**: Score options against your criteria
5. **Consider Consequences**: Short-term vs. long-term implications
6. **Make the Call**: Choose based on your analysis

What decision are you trying to make?`;
  }
  
  // Default response
  return `I understand you're interested in: "${userMessage}"

I'm here to help! I can assist with:
- Planning trips and itineraries
- Generating creative content
- Debugging code and technical problems
- Conducting research and finding information
- Making decisions with structured analysis
- And much more!

Could you provide more details about what you need help with?`;
}
