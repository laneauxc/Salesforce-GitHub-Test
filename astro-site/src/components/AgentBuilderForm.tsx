/**
 * Agent Builder Form Component
 * Provides a comprehensive form for creating/editing AI agents using HeroUI components
 * Features: Input fields, Select dropdowns, Textarea, Checkboxes, and action Buttons
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
  Chip,
  Divider,
} from '@heroui/react';
import { demoAgents, type Agent } from '../data/agents';

// Available AI models
const availableModels = [
  { key: 'gpt-4', label: 'GPT-4' },
  { key: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { key: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { key: 'claude-3-opus', label: 'Claude 3 Opus' },
  { key: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
];

// Available tools
const availableTools = [
  'knowledge-base',
  'ticket-system',
  'email',
  'product-catalog',
  'pricing-api',
  'inventory',
  'github-api',
  'code-analysis',
  'documentation',
  'database',
  'analytics-engine',
  'chart-generator',
  'cms',
  'seo-analyzer',
  'grammar-check',
  'issue-tracker',
  'git-history',
  'notification',
  'calendar-api',
  'timezone-converter',
  'ocr',
  'file-parser',
];

export default function AgentBuilderForm() {
  // Form state
  const [agentId, setAgentId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [model, setModel] = useState('gpt-4');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [status, setStatus] = useState<Agent['status']>('testing');
  const [isSaving, setIsSaving] = useState(false);

  // Load agent data if editing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      
      if (id) {
        const agent = demoAgents.find(a => a.id === id);
        if (agent) {
          setAgentId(agent.id);
          setName(agent.name);
          setModel(agent.model);
          setDescription(agent.description);
          setInstructions(agent.instructions);
          setSelectedTools(agent.tools);
          setStatus(agent.status);
        }
      }
    }
  }, []);

  // Handle tool selection
  const handleToolToggle = (tool: string) => {
    setSelectedTools(prev =>
      prev.includes(tool)
        ? prev.filter(t => t !== tool)
        : [...prev, tool]
    );
  };

  // Handle form submission
  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Saving agent:', {
        id: agentId || `agent-${Date.now()}`,
        name,
        model,
        description,
        instructions,
        tools: selectedTools,
        status,
      });
      
      setIsSaving(false);
      
      // Navigate back to agents list
      const baseUrl = getBaseUrl();
      window.location.href = `${baseUrl}agents/`;
    }, 1000);
  };

  // Handle cancel
  const handleCancel = () => {
    const baseUrl = getBaseUrl();
    window.location.href = `${baseUrl}agents/`;
  };

  // Get base URL
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const baseUrl = (window as any).BASE_URL || '/Salesforce-GitHub-Test';
      return baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    }
    return '/Salesforce-GitHub-Test/';
  };

  // Validation
  const isValid = name.trim() !== '' && description.trim() !== '' && instructions.trim() !== '';

  return (
    <div className="max-w-4xl">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-start px-6 pt-6">
          <h2 className="text-2xl font-bold">
            {agentId ? 'Edit Agent' : 'Create New Agent'}
          </h2>
          <p className="text-sm text-default-500 mt-1">
            Configure the basic settings and capabilities for your AI agent
          </p>
        </CardHeader>
        
        <Divider />
        
        <CardBody className="px-6 py-6 space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <Input
              label="Agent Name"
              placeholder="Enter agent name"
              value={name}
              onValueChange={setName}
              isRequired
              description="A descriptive name for your agent"
              classNames={{
                label: "font-medium",
              }}
            />

            <Textarea
              label="Description"
              placeholder="Enter agent description"
              value={description}
              onValueChange={setDescription}
              isRequired
              minRows={2}
              description="Brief description of what this agent does"
              classNames={{
                label: "font-medium",
              }}
            />
          </div>

          <Divider />

          {/* Model Configuration Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Model Configuration</h3>
            
            <Select
              label="AI Model"
              placeholder="Select a model"
              selectedKeys={[model]}
              onChange={(e) => setModel(e.target.value)}
              description="Choose the AI model for this agent"
              classNames={{
                label: "font-medium",
              }}
            >
              {availableModels.map((m) => (
                <SelectItem key={m.key} value={m.key}>
                  {m.label}
                </SelectItem>
              ))}
            </Select>

            <Textarea
              label="System Instructions"
              placeholder="Enter detailed instructions for the agent"
              value={instructions}
              onValueChange={setInstructions}
              isRequired
              minRows={4}
              description="Detailed instructions on how the agent should behave and respond"
              classNames={{
                label: "font-medium",
              }}
            />
          </div>

          <Divider />

          {/* Tools & Capabilities Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tools & Capabilities</h3>
            <p className="text-sm text-default-500">
              Select the tools and capabilities this agent can use
            </p>
            
            <div className="flex flex-wrap gap-2">
              {availableTools.map((tool) => (
                <Chip
                  key={tool}
                  onClick={() => handleToolToggle(tool)}
                  variant={selectedTools.includes(tool) ? 'solid' : 'bordered'}
                  color={selectedTools.includes(tool) ? 'primary' : 'default'}
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  {tool}
                </Chip>
              ))}
            </div>
            
            {selectedTools.length > 0 && (
              <p className="text-sm text-default-500">
                Selected {selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <Divider />

          {/* Status Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Status</h3>
            
            <Select
              label="Agent Status"
              placeholder="Select status"
              selectedKeys={[status]}
              onChange={(e) => setStatus(e.target.value as Agent['status'])}
              description="Set the current status of the agent"
              classNames={{
                label: "font-medium",
              }}
            >
              <SelectItem key="active" value="active">Active</SelectItem>
              <SelectItem key="testing" value="testing">Testing</SelectItem>
              <SelectItem key="inactive" value="inactive">Inactive</SelectItem>
            </Select>
          </div>
        </CardBody>

        <Divider />

        <CardFooter className="px-6 py-4 flex justify-end gap-3">
          <Button
            variant="flat"
            onPress={handleCancel}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSave}
            isDisabled={!isValid}
            isLoading={isSaving}
          >
            {isSaving ? 'Saving...' : agentId ? 'Update Agent' : 'Create Agent'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
