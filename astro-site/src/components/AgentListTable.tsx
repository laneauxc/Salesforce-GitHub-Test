/**
 * Agent List Table Component
 * Displays agents in a table format using HeroUI Table component
 * Features: sorting, filtering, status badges, and action buttons
 */
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { demoAgents, type Agent } from '../data/agents';

// Status color mapping for HeroUI Chip component
const statusColorMap: Record<Agent['status'], 'success' | 'warning' | 'default'> = {
  active: 'success',
  testing: 'warning',
  inactive: 'default',
};

export default function AgentListTable() {
  const [filterValue, setFilterValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set(['all']));

  // Filter agents based on search and status
  const filteredAgents = useMemo(() => {
    let filtered = [...demoAgents];

    // Apply search filter
    if (filterValue) {
      filtered = filtered.filter((agent) =>
        agent.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        agent.description.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Apply status filter
    if (!statusFilter.has('all')) {
      filtered = filtered.filter((agent) => statusFilter.has(agent.status));
    }

    return filtered;
  }, [filterValue, statusFilter]);

  // Get base URL for navigation
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const baseUrl = (window as any).BASE_URL || '/Salesforce-GitHub-Test';
      return baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    }
    return '/Salesforce-GitHub-Test/';
  };

  // Navigate to agent details/builder
  const handleViewAgent = (agentId: string) => {
    const baseUrl = getBaseUrl();
    window.location.href = `${baseUrl}agents/builder/?id=${agentId}`;
  };

  // Navigate to test page
  const handleTestAgent = (agentId: string) => {
    const baseUrl = getBaseUrl();
    window.location.href = `${baseUrl}agents/test/?id=${agentId}`;
  };

  // Top content with search and filters
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name or description..."
            value={filterValue}
            onClear={() => setFilterValue('')}
            onValueChange={setFilterValue}
            startContent={
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="flat">
                  Status Filter
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Status filter"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) => setStatusFilter(keys as Set<string>)}
              >
                <DropdownItem key="all">All Status</DropdownItem>
                <DropdownItem key="active">Active</DropdownItem>
                <DropdownItem key="testing">Testing</DropdownItem>
                <DropdownItem key="inactive">Inactive</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredAgents.length} agents
          </span>
        </div>
      </div>
    );
  }, [filterValue, statusFilter, filteredAgents.length]);

  return (
    <div className="w-full">
      <Table
        aria-label="Agent list table"
        topContent={topContent}
        topContentPlacement="outside"
        classNames={{
          wrapper: "min-h-[400px]",
        }}
      >
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>MODEL</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>TEST RUNS</TableColumn>
          <TableColumn>SUCCESS RATE</TableColumn>
          <TableColumn>LAST MODIFIED</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No agents found"}>
          {filteredAgents.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell>
                <div className="flex flex-col">
                  <p className="font-bold text-sm">{agent.name}</p>
                  <p className="text-xs text-default-400">{agent.description}</p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{agent.model}</span>
              </TableCell>
              <TableCell>
                <Chip
                  className="capitalize"
                  color={statusColorMap[agent.status]}
                  size="sm"
                  variant="flat"
                >
                  {agent.status}
                </Chip>
              </TableCell>
              <TableCell>
                <span className="text-sm">{agent.testRuns}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{agent.successRate}%</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${agent.successRate}%` }}
                    ></div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-default-400">{agent.lastModified}</span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    onClick={() => handleViewAgent(agent.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="secondary"
                    onClick={() => handleTestAgent(agent.id)}
                  >
                    Test
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
