/**
 * Agent Results Table Component
 * Displays test results in a table format with filtering and status indicators
 * Uses HeroUI Table, Chip, Button, and other components
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
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
} from '@heroui/react';
import { demoTestResults, type TestResult } from '../data/agents';

// Status color mapping for Chip component
const statusColorMap: Record<TestResult['status'], 'success' | 'warning' | 'danger'> = {
  passed: 'success',
  warning: 'warning',
  failed: 'danger',
};

export default function AgentResultsTable() {
  const [filterValue, setFilterValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set(['all']));
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Filter results based on search and status
  const filteredResults = useMemo(() => {
    let filtered = [...demoTestResults];

    // Apply search filter
    if (filterValue) {
      filtered = filtered.filter((result) =>
        result.agentName.toLowerCase().includes(filterValue.toLowerCase()) ||
        result.testCase.toLowerCase().includes(filterValue.toLowerCase()) ||
        result.input.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Apply status filter
    if (!statusFilter.has('all')) {
      filtered = filtered.filter((result) => statusFilter.has(result.status));
    }

    return filtered;
  }, [filterValue, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredResults.length;
    const passed = filteredResults.filter(r => r.status === 'passed').length;
    const failed = filteredResults.filter(r => r.status === 'failed').length;
    const warnings = filteredResults.filter(r => r.status === 'warning').length;
    const avgTime = filteredResults.reduce((acc, r) => acc + r.executionTime, 0) / total;
    
    return {
      total,
      passed,
      failed,
      warnings,
      successRate: total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0',
      avgExecutionTime: avgTime.toFixed(0),
    };
  }, [filteredResults]);

  // Handle view details
  const handleViewDetails = (result: TestResult) => {
    setSelectedResult(result);
    onOpen();
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Top content with stats and filters
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardBody className="p-4">
              <p className="text-xs text-default-500 uppercase">Total Tests</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4">
              <p className="text-xs text-default-500 uppercase">Passed</p>
              <p className="text-2xl font-bold text-success-600">{stats.passed}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4">
              <p className="text-xs text-default-500 uppercase">Failed</p>
              <p className="text-2xl font-bold text-danger-600">{stats.failed}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4">
              <p className="text-xs text-default-500 uppercase">Warnings</p>
              <p className="text-2xl font-bold text-warning-600">{stats.warnings}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4">
              <p className="text-xs text-default-500 uppercase">Success Rate</p>
              <p className="text-2xl font-bold">{stats.successRate}%</p>
            </CardBody>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by agent, test case, or input..."
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
                <DropdownItem key="passed">Passed</DropdownItem>
                <DropdownItem key="warning">Warning</DropdownItem>
                <DropdownItem key="failed">Failed</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }, [filterValue, statusFilter, stats]);

  return (
    <div className="w-full space-y-6">
      <Table
        aria-label="Test results table"
        topContent={topContent}
        topContentPlacement="outside"
        classNames={{
          wrapper: "min-h-[400px]",
        }}
      >
        <TableHeader>
          <TableColumn>AGENT</TableColumn>
          <TableColumn>TEST CASE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>EXECUTION TIME</TableColumn>
          <TableColumn>TIMESTAMP</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No test results found"}>
          {filteredResults.map((result) => (
            <TableRow key={result.id}>
              <TableCell>
                <div className="flex flex-col">
                  <p className="font-semibold text-sm">{result.agentName}</p>
                  <p className="text-xs text-default-400">{result.agentId}</p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{result.testCase}</span>
              </TableCell>
              <TableCell>
                <Chip
                  className="capitalize"
                  color={statusColorMap[result.status]}
                  size="sm"
                  variant="flat"
                  startContent={
                    result.status === 'passed' ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : result.status === 'failed' ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )
                  }
                >
                  {result.status}
                </Chip>
              </TableCell>
              <TableCell>
                <span className="text-sm font-mono">{result.executionTime}ms</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-default-400">
                  {formatTimestamp(result.timestamp)}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  onPress={() => handleViewDetails(result)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Details Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-xl font-bold">Test Result Details</h3>
                {selectedResult && (
                  <div className="flex items-center gap-2 mt-2">
                    <Chip
                      color={statusColorMap[selectedResult.status]}
                      size="sm"
                      variant="flat"
                    >
                      {selectedResult.status}
                    </Chip>
                    <span className="text-sm text-default-500">
                      {formatTimestamp(selectedResult.timestamp)}
                    </span>
                  </div>
                )}
              </ModalHeader>
              <ModalBody>
                {selectedResult && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-default-500 uppercase">Agent</p>
                        <p className="font-semibold">{selectedResult.agentName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-default-500 uppercase">Test Case</p>
                        <p className="font-semibold">{selectedResult.testCase}</p>
                      </div>
                      <div>
                        <p className="text-xs text-default-500 uppercase">Execution Time</p>
                        <p className="font-semibold font-mono">{selectedResult.executionTime}ms</p>
                      </div>
                      <div>
                        <p className="text-xs text-default-500 uppercase">Status</p>
                        <Chip
                          color={statusColorMap[selectedResult.status]}
                          size="sm"
                          variant="flat"
                        >
                          {selectedResult.status}
                        </Chip>
                      </div>
                    </div>

                    <Divider />

                    <div>
                      <h4 className="font-semibold mb-2">Input:</h4>
                      <div className="p-3 bg-default-100 rounded-md">
                        <p className="text-sm">{selectedResult.input}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Expected Output:</h4>
                      <div className="p-3 bg-default-100 rounded-md">
                        <p className="text-sm">{selectedResult.expectedOutput}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Actual Output:</h4>
                      <div className={`p-3 rounded-md ${
                        selectedResult.status === 'passed' ? 'bg-success-50' :
                        selectedResult.status === 'warning' ? 'bg-warning-50' :
                        'bg-danger-50'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{selectedResult.actualOutput}</p>
                      </div>
                    </div>

                    {selectedResult.errorMessage && (
                      <div>
                        <h4 className="font-semibold mb-2 text-danger-600">Error Message:</h4>
                        <div className="p-3 bg-danger-50 rounded-md border border-danger-200">
                          <p className="text-sm text-danger-700">{selectedResult.errorMessage}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
