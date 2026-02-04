// Simple in-memory data store for application state
// In a real application, this would be connected to a backend API or local storage

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AudioRecording {
  id: string;
  name: string;
  duration: number;
  size: number;
  url: string;
  createdAt: Date;
}

export interface ImageGeneration {
  id: string;
  prompt: string;
  url: string;
  createdAt: Date;
}

export interface Assistant {
  id: string;
  name: string;
  description: string;
  model: string;
  instructions: string;
  tools: string[];
  createdAt: Date;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: string;
}

export interface UsageMetric {
  date: string;
  requests: number;
  tokens: number;
  cost: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  organization?: string;
}

export interface AppSettings {
  darkMode: boolean;
  selectedModel: string;
  selectedAssistant?: string;
}

class DataStore {
  private conversations: Conversation[] = [];
  private audioRecordings: AudioRecording[] = [];
  private imageGenerations: ImageGeneration[] = [];
  private assistants: Assistant[] = [];
  private apiKeys: ApiKey[] = [];
  private logs: LogEntry[] = [];
  private usageMetrics: UsageMetric[] = [];
  private userProfile: UserProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Developer',
    organization: 'Salesforce'
  };
  private settings: AppSettings = {
    darkMode: false,
    selectedModel: 'gpt-4'
  };
  private storageKey = 'salesforce-github-test-data';

  constructor() {
    this.loadFromStorage();
    if (this.conversations.length === 0 && this.assistants.length === 0 && this.apiKeys.length === 0) {
      this.initializeSampleData();
      this.saveToStorage();
    }
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.conversations = data.conversations || [];
        this.audioRecordings = data.audioRecordings || [];
        this.imageGenerations = data.imageGenerations || [];
        this.assistants = data.assistants || [];
        this.apiKeys = data.apiKeys || [];
        this.logs = data.logs || [];
        this.usageMetrics = data.usageMetrics || [];
        this.userProfile = data.userProfile || this.userProfile;
        this.settings = data.settings || this.settings;
      }
    } catch (error) {
      console.error('Error loading data from storage:', error);
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      const data = {
        conversations: this.conversations,
        audioRecordings: this.audioRecordings,
        imageGenerations: this.imageGenerations,
        assistants: this.assistants,
        apiKeys: this.apiKeys,
        logs: this.logs,
        usageMetrics: this.usageMetrics,
        userProfile: this.userProfile,
        settings: this.settings
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data to storage:', error);
    }
  }

  private initializeSampleData() {
    // Sample conversations
    this.conversations = [
      {
        id: 'conv-1',
        title: 'Trip Planning to Paris',
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Help me plan a 5-day trip to Paris',
            timestamp: new Date('2026-01-28T10:00:00Z')
          },
          {
            id: 'msg-2',
            role: 'assistant',
            content: 'I\'d be happy to help you plan your trip to Paris! Here\'s a suggested 5-day itinerary:\n\nDay 1: Arrival & Eiffel Tower\n- Check into hotel\n- Visit Eiffel Tower in the evening\n- Dinner at a nearby bistro\n\nDay 2: Louvre & Notre-Dame\n- Morning at the Louvre Museum\n- Lunch in Le Marais\n- Afternoon at Notre-Dame Cathedral\n\nDay 3: Versailles\n- Full day trip to Palace of Versailles\n- Gardens and fountains\n\nDay 4: Montmartre & Sacré-Cœur\n- Explore Montmartre neighborhood\n- Visit Sacré-Cœur Basilica\n- Evening show at Moulin Rouge\n\nDay 5: Shopping & Departure\n- Morning at Champs-Élysées\n- Last-minute shopping\n- Departure',
            timestamp: new Date('2026-01-28T10:01:00Z')
          }
        ],
        createdAt: new Date('2026-01-28T10:00:00Z'),
        updatedAt: new Date('2026-01-28T10:01:00Z')
      }
    ];

    // Sample assistants
    this.assistants = [
      {
        id: 'asst-1',
        name: 'Code Helper',
        description: 'Helps with code debugging and explanation',
        model: 'gpt-4',
        instructions: 'You are an expert programmer. Help users debug their code and explain programming concepts.',
        tools: ['code_interpreter'],
        createdAt: new Date('2026-01-20T10:00:00Z')
      },
      {
        id: 'asst-2',
        name: 'Research Assistant',
        description: 'Helps with research and information gathering',
        model: 'gpt-4',
        instructions: 'You are a research assistant. Help users find and synthesize information.',
        tools: ['file_search'],
        createdAt: new Date('2026-01-22T10:00:00Z')
      }
    ];

    // Sample API keys
    this.apiKeys = [
      {
        id: 'key-1',
        name: 'Production API Key',
        key: 'sk-proj-abc123...xyz',
        createdAt: new Date('2026-01-15T10:00:00Z'),
        lastUsed: new Date('2026-02-02T06:00:00Z')
      },
      {
        id: 'key-2',
        name: 'Development API Key',
        key: 'sk-proj-def456...uvw',
        createdAt: new Date('2026-01-20T10:00:00Z'),
        lastUsed: new Date('2026-02-01T14:30:00Z')
      }
    ];

    // Sample logs
    this.logs = [
      {
        id: 'log-1',
        timestamp: new Date('2026-02-02T06:00:00Z'),
        level: 'info',
        message: 'API request completed successfully',
        details: 'GET /api/chat/completions - 200 OK'
      },
      {
        id: 'log-2',
        timestamp: new Date('2026-02-02T05:55:00Z'),
        level: 'warning',
        message: 'Rate limit approaching',
        details: 'Current usage: 85% of daily quota'
      },
      {
        id: 'log-3',
        timestamp: new Date('2026-02-02T05:50:00Z'),
        level: 'error',
        message: 'API request failed',
        details: 'POST /api/chat/completions - 429 Too Many Requests'
      }
    ];

    // Sample usage metrics
    this.usageMetrics = [
      { date: '2026-01-27', requests: 245, tokens: 125000, cost: 2.50 },
      { date: '2026-01-28', requests: 312, tokens: 156000, cost: 3.12 },
      { date: '2026-01-29', requests: 198, tokens: 99000, cost: 1.98 },
      { date: '2026-01-30', requests: 267, tokens: 133500, cost: 2.67 },
      { date: '2026-01-31', requests: 289, tokens: 144500, cost: 2.89 },
      { date: '2026-02-01', requests: 334, tokens: 167000, cost: 3.34 },
      { date: '2026-02-02', requests: 156, tokens: 78000, cost: 1.56 }
    ];
  }

  // Conversations
  getConversations(): Conversation[] {
    return this.conversations;
  }

  getConversation(id: string): Conversation | undefined {
    return this.conversations.find(c => c.id === id);
  }

  createConversation(title: string): Conversation {
    const conversation: Conversation = {
      id: `conv-${Date.now()}`,
      title,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.conversations.push(conversation);
    this.saveToStorage();
    return conversation;
  }

  addMessage(conversationId: string, role: 'user' | 'assistant', content: string): Message {
    const conversation = this.getConversation(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    const message: Message = {
      id: `msg-${Date.now()}`,
      role,
      content,
      timestamp: new Date()
    };

    conversation.messages.push(message);
    conversation.updatedAt = new Date();
    this.saveToStorage();
    return message;
  }

  // Audio
  getAudioRecordings(): AudioRecording[] {
    return this.audioRecordings;
  }

  addAudioRecording(name: string, duration: number, size: number, url: string): AudioRecording {
    const recording: AudioRecording = {
      id: `audio-${Date.now()}`,
      name,
      duration,
      size,
      url,
      createdAt: new Date()
    };
    this.audioRecordings.push(recording);
    this.saveToStorage();
    return recording;
  }

  // Images
  getImageGenerations(): ImageGeneration[] {
    return this.imageGenerations;
  }

  addImageGeneration(prompt: string, url: string): ImageGeneration {
    const image: ImageGeneration = {
      id: `img-${Date.now()}`,
      prompt,
      url,
      createdAt: new Date()
    };
    this.imageGenerations.push(image);
    this.saveToStorage();
    return image;
  }

  // Assistants
  getAssistants(): Assistant[] {
    return this.assistants;
  }

  getAssistant(id: string): Assistant | undefined {
    return this.assistants.find(a => a.id === id);
  }

  createAssistant(data: Omit<Assistant, 'id' | 'createdAt'>): Assistant {
    const assistant: Assistant = {
      ...data,
      id: `asst-${Date.now()}`,
      createdAt: new Date()
    };
    this.assistants.push(assistant);
    this.saveToStorage();
    return assistant;
  }

  updateAssistant(id: string, data: Partial<Omit<Assistant, 'id' | 'createdAt'>>): Assistant | undefined {
    const assistant = this.getAssistant(id);
    if (!assistant) return undefined;
    Object.assign(assistant, data);
    this.saveToStorage();
    return assistant;
  }

  deleteAssistant(id: string): boolean {
    const index = this.assistants.findIndex(a => a.id === id);
    if (index === -1) return false;
    this.assistants.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // API Keys
  getApiKeys(): ApiKey[] {
    return this.apiKeys;
  }

  createApiKey(name: string): ApiKey {
    // Generate a proper full API key instead of truncated
    const randomPart1 = Math.random().toString(36).substring(2, 15);
    const randomPart2 = Math.random().toString(36).substring(2, 15);
    const randomPart3 = Math.random().toString(36).substring(2, 15);
    const randomPart4 = Math.random().toString(36).substring(2, 7);
    
    const key: ApiKey = {
      id: `key-${Date.now()}`,
      name,
      key: `sk-proj-${randomPart1}${randomPart2}${randomPart3}${randomPart4}`,
      createdAt: new Date()
    };
    this.apiKeys.push(key);
    this.saveToStorage();
    return key;
  }

  deleteApiKey(id: string): boolean {
    const index = this.apiKeys.findIndex(k => k.id === id);
    if (index === -1) return false;
    this.apiKeys.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Logs
  getLogs(): LogEntry[] {
    return this.logs;
  }

  addLog(level: 'info' | 'warning' | 'error', message: string, details?: string): LogEntry {
    const log: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      level,
      message,
      details
    };
    this.logs.unshift(log); // Add to beginning
    this.saveToStorage();
    return log;
  }

  // Usage
  getUsageMetrics(): UsageMetric[] {
    return this.usageMetrics;
  }

  // Profile
  getUserProfile(): UserProfile {
    return this.userProfile;
  }

  updateUserProfile(data: Partial<UserProfile>): UserProfile {
    this.userProfile = { ...this.userProfile, ...data };
    this.saveToStorage();
    return this.userProfile;
  }

  // Settings
  getSettings(): AppSettings {
    return this.settings;
  }

  updateSettings(data: Partial<AppSettings>): AppSettings {
    this.settings = { ...this.settings, ...data };
    this.saveToStorage();
    // Dispatch event for dark mode changes
    if (data.darkMode !== undefined && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('darkModeChange', { detail: { darkMode: data.darkMode } }));
    }
    return this.settings;
  }
}

// Export singleton instance
export const dataStore = new DataStore();
