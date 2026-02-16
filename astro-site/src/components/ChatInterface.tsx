import React, { useState, useRef, useEffect } from 'react';
import { dataStore, type Message } from '../utils/dataStore';
import { Button, Input, Textarea, Select, SelectItem, Card, CardBody, Avatar, Chip } from '@heroui/react';

interface ChatInterfaceProps {
  onCreateAgentClick?: () => void;
}

export default function ChatInterface({ onCreateAgentClick }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [selectedAssistant, setSelectedAssistant] = useState<string | null>(null);
  const [assistants, setAssistants] = useState(dataStore.getAssistants());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load settings
    const settings = dataStore.getSettings();
    setSelectedModel(settings.selectedModel);
    setSelectedAssistant(settings.selectedAssistant || null);
  }, []);

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
      <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900">
        {/* Model/Assistant Selector Header */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-6 py-4">
          <div className="flex items-center justify-between max-w-3xl mx-auto gap-4">
            <Select
              label="Model"
              selectedKeys={[selectedModel]}
              onChange={(e) => setSelectedModel(e.target.value)}
              size="sm"
              variant="bordered"
              className="max-w-[200px]"
              classNames={{
                trigger: "bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600",
              }}
            >
              <SelectItem key="gpt-4" value="gpt-4">GPT-4</SelectItem>
              <SelectItem key="gpt-4-turbo" value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
              <SelectItem key="gpt-3.5-turbo" value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              <SelectItem key="claude-3-opus" value="claude-3-opus">Claude 3 Opus</SelectItem>
              <SelectItem key="claude-3-sonnet" value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
            </Select>
            
            <Select
              label="Assistant"
              selectedKeys={selectedAssistant ? [selectedAssistant] : ['']}
              onChange={(e) => setSelectedAssistant(e.target.value || null)}
              size="sm"
              variant="bordered"
              className="max-w-[200px]"
              classNames={{
                trigger: "bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600",
              }}
            >
              <SelectItem key="" value="">None (Direct)</SelectItem>
              {assistants.map(assistant => (
                <SelectItem key={assistant.id} value={assistant.id}>{assistant.name}</SelectItem>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 gap-8 max-w-3xl mx-auto px-8">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-neutral-700 dark:text-neutral-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">Create a chat prompt</h2>

          {/* Input row */}
          <div className="w-full flex gap-3">
            <Button
              onClick={onCreateAgentClick}
              color="default"
              variant="solid"
              size="lg"
              className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
              startContent={<span className="text-lg">+</span>}
            >
              Create
            </Button>

            <div className="flex-1 relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Generate..."
                minRows={1}
                maxRows={3}
                variant="bordered"
                classNames={{
                  input: "bg-white dark:bg-neutral-800",
                  inputWrapper: "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800",
                }}
                endContent={
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onClick={handleSendMessage}
                    isDisabled={!inputValue.trim()}
                    className="text-neutral-600 dark:text-neutral-400"
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
                  </Button>
                }
              />
            </div>
          </div>

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion, idx) => (
              <Chip
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                variant="flat"
                className="cursor-pointer bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                {suggestion}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Chat view
  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900">
      {/* Model/Assistant Selector Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Select
              label="Model"
              selectedKeys={[selectedModel]}
              onChange={(e) => setSelectedModel(e.target.value)}
              size="sm"
              variant="bordered"
              className="max-w-[180px]"
              classNames={{
                trigger: "bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600",
              }}
            >
              <SelectItem key="gpt-4" value="gpt-4">GPT-4</SelectItem>
              <SelectItem key="gpt-4-turbo" value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
              <SelectItem key="gpt-3.5-turbo" value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              <SelectItem key="claude-3-opus" value="claude-3-opus">Claude 3 Opus</SelectItem>
              <SelectItem key="claude-3-sonnet" value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
            </Select>
            
            <Select
              label="Assistant"
              selectedKeys={selectedAssistant ? [selectedAssistant] : ['']}
              onChange={(e) => setSelectedAssistant(e.target.value || null)}
              size="sm"
              variant="bordered"
              className="max-w-[180px]"
              classNames={{
                trigger: "bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600",
              }}
            >
              <SelectItem key="" value="">None (Direct)</SelectItem>
              {assistants.map(assistant => (
                <SelectItem key={assistant.id} value={assistant.id}>{assistant.name}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {selectedAssistant ? (
              <span>Using: {assistants.find(a => a.id === selectedAssistant)?.name}</span>
            ) : (
              <span>Using: {selectedModel}</span>
            )}
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'assistant' && (
                <Avatar 
                  size="sm"
                  className="bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 flex-shrink-0"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />
              )}
              
              <div
                className={`flex flex-col max-w-[80%] ${
                  message.role === 'user' ? 'items-end' : ''
                }`}
              >
                <Card
                  className={`${
                    message.role === 'user'
                      ? 'bg-neutral-900 dark:bg-neutral-100'
                      : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  <CardBody className="py-3 px-4">
                    <pre className={`whitespace-pre-wrap font-sans text-sm ${
                      message.role === 'user'
                        ? 'text-white dark:text-neutral-900'
                        : 'text-neutral-900 dark:text-neutral-100'
                    }`}>
                      {message.content}
                    </pre>
                  </CardBody>
                </Card>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 px-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>

              {message.role === 'user' && (
                <Avatar 
                  size="sm"
                  className="bg-neutral-600 dark:bg-neutral-400 text-white dark:text-neutral-900 flex-shrink-0"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                />
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <Avatar 
                size="sm"
                className="bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 flex-shrink-0"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              <Card className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <CardBody className="py-3 px-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            minRows={1}
            maxRows={4}
            variant="bordered"
            classNames={{
              input: "bg-white dark:bg-neutral-800",
              inputWrapper: "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800",
            }}
            endContent={
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={handleSendMessage}
                isDisabled={!inputValue.trim() || isLoading}
                className="text-neutral-600 dark:text-neutral-400"
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
              </Button>
            }
          />
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
