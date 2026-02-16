/**
 * Agent Test Sandbox Component
 * Interactive testing interface for AI agents using HeroUI components
 * Features: Input area, Run button, Output display with Modal/Alert, Reset functionality
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Textarea,
  Button,
  Select,
  SelectItem,
  Chip,
  Alert,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
  Spinner,
} from '@heroui/react';
import { demoAgents, type Agent } from '../data/agents';

export default function AgentTestSandbox() {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [testInput, setTestInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number>(0);
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Load agent from URL parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      
      if (id) {
        setSelectedAgentId(id);
        const agent = demoAgents.find(a => a.id === id);
        if (agent) {
          setSelectedAgent(agent);
        }
      } else if (demoAgents.length > 0) {
        // Default to first agent
        setSelectedAgentId(demoAgents[0].id);
        setSelectedAgent(demoAgents[0]);
      }
    }
  }, []);

  // Handle agent selection
  const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedAgentId(id);
    const agent = demoAgents.find(a => a.id === id);
    setSelectedAgent(agent || null);
    // Reset test state
    setTestOutput(null);
    setTestError(null);
  };

  // Handle test run
  const handleRun = () => {
    if (!testInput.trim() || !selectedAgent) return;

    setIsRunning(true);
    setTestOutput(null);
    setTestError(null);

    // Simulate API call with random delay
    const delay = Math.random() * 2000 + 1000; // 1-3 seconds
    const startTime = Date.now();

    setTimeout(() => {
      const endTime = Date.now();
      setExecutionTime(endTime - startTime);

      // Simulate success/failure (90% success rate)
      const isSuccess = Math.random() < 0.9;

      if (isSuccess) {
        // Generate mock response based on agent type
        const mockResponse = generateMockResponse(selectedAgent, testInput);
        setTestOutput(mockResponse);
        setTestError(null);
      } else {
        // Simulate error
        setTestError('Agent execution failed: Timeout while processing request');
        setTestOutput(null);
      }

      setIsRunning(false);
      onOpen(); // Open result modal
    }, delay);
  };

  // Generate mock response based on agent
  const generateMockResponse = (agent: Agent, input: string): string => {
    const responses: Record<string, string[]> = {
      'Customer Support Agent': [
        `Thank you for contacting us. I've processed your request regarding: "${input}". I'll be happy to help you with this issue.`,
        `I understand your concern about "${input}". Let me look into this for you and provide the best solution.`,
      ],
      'Sales Assistant': [
        `Based on your inquiry about "${input}", I recommend checking out our product catalog. Would you like me to show you some options?`,
        `Great question about "${input}"! Let me help you find the perfect product that matches your needs.`,
      ],
      'Code Review Agent': [
        `I've analyzed the code you provided: "${input}". Here are my findings:\n\n✓ Code structure: Good\n✓ Best practices: Mostly followed\n⚠ Potential improvement: Consider adding error handling`,
        `Code review completed for: "${input}"\n\nNo critical issues found. Minor suggestions:\n- Add comments for complex logic\n- Consider refactoring for better readability`,
      ],
      'Data Analyst': [
        `Analysis of "${input}" completed.\n\nKey insights:\n• Total records: 1,234\n• Average value: $567.89\n• Trend: +15% increase`,
        `Data analysis results for "${input}":\n\nSummary:\n- Dataset size: 1,234 rows\n- Time period: Q1 2026\n- Key metric: 15% growth YoY`,
      ],
    };

    const agentResponses = responses[agent.name] || [
      `I've processed your request: "${input}". Here's the result based on my analysis.`,
      `Response generated for: "${input}". The task has been completed successfully.`,
    ];

    return agentResponses[Math.floor(Math.random() * agentResponses.length)];
  };

  // Handle reset
  const handleReset = () => {
    setTestInput('');
    setTestOutput(null);
    setTestError(null);
    setExecutionTime(0);
  };

  // Navigate to results page
  const handleViewResults = () => {
    const baseUrl = getBaseUrl();
    window.location.href = `${baseUrl}agents/results/`;
  };

  // Get base URL
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const baseUrl = (window as any).BASE_URL || '/Salesforce-GitHub-Test';
      return baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    }
    return '/Salesforce-GitHub-Test/';
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Agent Selection Card */}
      <Card>
        <CardBody className="p-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Select
                label="Select Agent"
                placeholder="Choose an agent to test"
                selectedKeys={selectedAgentId ? [selectedAgentId] : []}
                onChange={handleAgentChange}
                classNames={{
                  label: "font-medium",
                }}
              >
                {demoAgents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name} ({agent.model})
                  </SelectItem>
                ))}
              </Select>
            </div>
            {selectedAgent && (
              <Chip
                color={selectedAgent.status === 'active' ? 'success' : selectedAgent.status === 'testing' ? 'warning' : 'default'}
                variant="flat"
              >
                {selectedAgent.status}
              </Chip>
            )}
          </div>
          
          {selectedAgent && (
            <div className="mt-4 p-4 bg-default-100 rounded-lg">
              <p className="text-sm text-default-600">
                <strong>Description:</strong> {selectedAgent.description}
              </p>
              <p className="text-sm text-default-600 mt-2">
                <strong>Tools:</strong> {selectedAgent.tools.join(', ')}
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Test Input Card */}
      <Card>
        <CardHeader className="px-6 pt-6">
          <h2 className="text-xl font-bold">Test Input</h2>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <Textarea
            placeholder="Enter your test input here..."
            value={testInput}
            onValueChange={setTestInput}
            minRows={6}
            description="Provide input to test the agent's response"
            isDisabled={!selectedAgent || isRunning}
          />
        </CardBody>
        <CardFooter className="px-6 pb-6 flex justify-between">
          <Button
            variant="flat"
            onPress={handleReset}
            isDisabled={isRunning}
          >
            Reset
          </Button>
          <div className="flex gap-3">
            <Button
              variant="flat"
              color="secondary"
              onPress={handleViewResults}
            >
              View All Results
            </Button>
            <Button
              color="primary"
              onPress={handleRun}
              isDisabled={!selectedAgent || !testInput.trim() || isRunning}
              isLoading={isRunning}
              startContent={
                !isRunning && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              }
            >
              {isRunning ? 'Running...' : 'Run Test'}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Test Results Alert (shown inline when available) */}
      {!isRunning && testOutput && (
        <Alert
          color="success"
          title="Test Completed Successfully"
          description={`Execution time: ${executionTime}ms`}
          variant="flat"
          startContent={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          <div className="mt-2 p-3 bg-white rounded-md">
            <p className="text-sm whitespace-pre-wrap">{testOutput}</p>
          </div>
        </Alert>
      )}

      {!isRunning && testError && (
        <Alert
          color="danger"
          title="Test Failed"
          description={`Execution time: ${executionTime}ms`}
          variant="flat"
          startContent={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          <div className="mt-2 p-3 bg-white rounded-md">
            <p className="text-sm text-danger-600">{testError}</p>
          </div>
        </Alert>
      )}

      {/* Results Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-xl font-bold">
                  {testError ? 'Test Failed' : 'Test Results'}
                </h3>
                <p className="text-sm text-default-500">
                  Agent: {selectedAgent?.name} | Execution time: {executionTime}ms
                </p>
              </ModalHeader>
              <ModalBody>
                {testError ? (
                  <Alert
                    color="danger"
                    title="Error"
                    variant="flat"
                  >
                    {testError}
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Input:</h4>
                      <div className="p-3 bg-default-100 rounded-md">
                        <p className="text-sm">{testInput}</p>
                      </div>
                    </div>
                    <Divider />
                    <div>
                      <h4 className="font-semibold mb-2">Output:</h4>
                      <div className="p-3 bg-success-50 rounded-md">
                        <p className="text-sm whitespace-pre-wrap">{testOutput}</p>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => {
                  onClose();
                  handleViewResults();
                }}>
                  View All Results
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
