/**
 * Demo data for Agent Builder Platform
 * Contains sample agents for testing and demonstration purposes
 */

export interface Agent {
  id: string;
  name: string;
  model: string;
  status: 'active' | 'inactive' | 'testing';
  description: string;
  instructions: string;
  tools: string[];
  createdAt: string;
  lastModified: string;
  testRuns: number;
  successRate: number;
}

export const demoAgents: Agent[] = [
  {
    id: 'agent-001',
    name: 'Customer Support Agent',
    model: 'gpt-4',
    status: 'active',
    description: 'Handles customer inquiries and support tickets',
    instructions: 'You are a helpful customer support agent. Be polite, professional, and provide accurate information.',
    tools: ['knowledge-base', 'ticket-system', 'email'],
    createdAt: '2026-01-15',
    lastModified: '2026-02-10',
    testRuns: 145,
    successRate: 94.5
  },
  {
    id: 'agent-002',
    name: 'Sales Assistant',
    model: 'gpt-4-turbo',
    status: 'active',
    description: 'Assists with sales inquiries and product recommendations',
    instructions: 'Help customers find the right products and answer sales questions.',
    tools: ['product-catalog', 'pricing-api', 'inventory'],
    createdAt: '2026-01-20',
    lastModified: '2026-02-12',
    testRuns: 89,
    successRate: 91.2
  },
  {
    id: 'agent-003',
    name: 'Code Review Agent',
    model: 'gpt-4',
    status: 'testing',
    description: 'Reviews code for best practices and potential issues',
    instructions: 'Analyze code for bugs, performance issues, and adherence to coding standards.',
    tools: ['github-api', 'code-analysis', 'documentation'],
    createdAt: '2026-02-01',
    lastModified: '2026-02-15',
    testRuns: 23,
    successRate: 87.0
  },
  {
    id: 'agent-004',
    name: 'Data Analyst',
    model: 'gpt-4-turbo',
    status: 'active',
    description: 'Analyzes data and generates insights',
    instructions: 'Process data queries and provide analytical insights with visualizations.',
    tools: ['database', 'analytics-engine', 'chart-generator'],
    createdAt: '2026-01-25',
    lastModified: '2026-02-08',
    testRuns: 67,
    successRate: 96.8
  },
  {
    id: 'agent-005',
    name: 'Content Writer',
    model: 'gpt-4',
    status: 'active',
    description: 'Creates marketing and technical content',
    instructions: 'Write engaging, SEO-optimized content for various platforms.',
    tools: ['cms', 'seo-analyzer', 'grammar-check'],
    createdAt: '2026-02-05',
    lastModified: '2026-02-14',
    testRuns: 112,
    successRate: 93.7
  },
  {
    id: 'agent-006',
    name: 'Bug Triager',
    model: 'gpt-3.5-turbo',
    status: 'inactive',
    description: 'Categorizes and prioritizes bug reports',
    instructions: 'Analyze bug reports, assign severity levels, and suggest assignments.',
    tools: ['issue-tracker', 'git-history', 'notification'],
    createdAt: '2026-01-10',
    lastModified: '2026-01-30',
    testRuns: 45,
    successRate: 82.3
  },
  {
    id: 'agent-007',
    name: 'Meeting Scheduler',
    model: 'gpt-3.5-turbo',
    status: 'testing',
    description: 'Coordinates meetings and manages calendars',
    instructions: 'Schedule meetings, send invites, and manage calendar conflicts.',
    tools: ['calendar-api', 'email', 'timezone-converter'],
    createdAt: '2026-02-10',
    lastModified: '2026-02-16',
    testRuns: 15,
    successRate: 88.9
  },
  {
    id: 'agent-008',
    name: 'Document Processor',
    model: 'gpt-4',
    status: 'active',
    description: 'Extracts and processes information from documents',
    instructions: 'Extract key information from documents and structure the data.',
    tools: ['ocr', 'file-parser', 'database'],
    createdAt: '2026-01-28',
    lastModified: '2026-02-11',
    testRuns: 78,
    successRate: 95.1
  }
];

/**
 * Test result data for Agent Results Page
 */
export interface TestResult {
  id: string;
  agentId: string;
  agentName: string;
  testCase: string;
  status: 'passed' | 'failed' | 'warning';
  executionTime: number; // in milliseconds
  timestamp: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  errorMessage?: string;
}

export const demoTestResults: TestResult[] = [
  {
    id: 'test-001',
    agentId: 'agent-001',
    agentName: 'Customer Support Agent',
    testCase: 'Handle refund request',
    status: 'passed',
    executionTime: 1250,
    timestamp: '2026-02-16T10:30:00Z',
    input: 'I need a refund for order #12345',
    expectedOutput: 'Refund request processed',
    actualOutput: 'Refund request processed for order #12345'
  },
  {
    id: 'test-002',
    agentId: 'agent-001',
    agentName: 'Customer Support Agent',
    testCase: 'Product availability check',
    status: 'passed',
    executionTime: 890,
    timestamp: '2026-02-16T10:35:00Z',
    input: 'Is Product X in stock?',
    expectedOutput: 'Product availability confirmed',
    actualOutput: 'Product X is in stock with 15 units available'
  },
  {
    id: 'test-003',
    agentId: 'agent-002',
    agentName: 'Sales Assistant',
    testCase: 'Product recommendation',
    status: 'passed',
    executionTime: 1450,
    timestamp: '2026-02-16T11:00:00Z',
    input: 'I need a laptop for programming',
    expectedOutput: 'Suitable product recommendations',
    actualOutput: 'I recommend the ThinkPad X1 Carbon or MacBook Pro for programming'
  },
  {
    id: 'test-004',
    agentId: 'agent-003',
    agentName: 'Code Review Agent',
    testCase: 'Security vulnerability detection',
    status: 'warning',
    executionTime: 2100,
    timestamp: '2026-02-16T11:15:00Z',
    input: 'Review security of authentication code',
    expectedOutput: 'Security issues identified',
    actualOutput: 'Found 1 potential SQL injection vulnerability in login.js:45'
  },
  {
    id: 'test-005',
    agentId: 'agent-003',
    agentName: 'Code Review Agent',
    testCase: 'Code style check',
    status: 'failed',
    executionTime: 1850,
    timestamp: '2026-02-16T11:20:00Z',
    input: 'Check code formatting standards',
    expectedOutput: 'Formatting issues listed',
    actualOutput: 'Analysis incomplete',
    errorMessage: 'Timeout while analyzing large file'
  },
  {
    id: 'test-006',
    agentId: 'agent-004',
    agentName: 'Data Analyst',
    testCase: 'Sales data analysis',
    status: 'passed',
    executionTime: 3200,
    timestamp: '2026-02-16T12:00:00Z',
    input: 'Analyze Q1 sales data',
    expectedOutput: 'Sales insights generated',
    actualOutput: 'Q1 sales increased 15% YoY, top product category: Electronics'
  },
  {
    id: 'test-007',
    agentId: 'agent-005',
    agentName: 'Content Writer',
    testCase: 'Blog post generation',
    status: 'passed',
    executionTime: 4500,
    timestamp: '2026-02-16T12:30:00Z',
    input: 'Write blog about AI in healthcare',
    expectedOutput: 'Well-structured blog post',
    actualOutput: 'Generated 800-word blog post with SEO optimization'
  },
  {
    id: 'test-008',
    agentId: 'agent-007',
    agentName: 'Meeting Scheduler',
    testCase: 'Schedule team meeting',
    status: 'passed',
    executionTime: 1100,
    timestamp: '2026-02-16T13:00:00Z',
    input: 'Schedule meeting with engineering team next week',
    expectedOutput: 'Meeting scheduled',
    actualOutput: 'Meeting scheduled for Feb 24, 2:00 PM PST with 5 participants'
  },
  {
    id: 'test-009',
    agentId: 'agent-008',
    agentName: 'Document Processor',
    testCase: 'Invoice extraction',
    status: 'passed',
    executionTime: 2800,
    timestamp: '2026-02-16T13:30:00Z',
    input: 'Extract data from invoice PDF',
    expectedOutput: 'Invoice data extracted',
    actualOutput: 'Extracted: Invoice #INV-2026-001, Amount: $1,234.56, Date: 2026-02-01'
  },
  {
    id: 'test-010',
    agentId: 'agent-008',
    agentName: 'Document Processor',
    testCase: 'Multi-page document',
    status: 'warning',
    executionTime: 5600,
    timestamp: '2026-02-16T14:00:00Z',
    input: 'Process 50-page contract',
    expectedOutput: 'Contract data extracted',
    actualOutput: 'Extracted key terms, but 3 pages had OCR errors'
  }
];
