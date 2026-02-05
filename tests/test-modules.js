#!/usr/bin/env node

/**
 * MCP Module Test Script
 * Verifies that all MCP modules can be loaded and basic functionality works
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 MCP Module Test Suite\n');

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   Error: ${error.message}`);
    testsFailed++;
  }
}

// Test 1: Configuration Loading
test('Configuration file exists and is valid JSON', () => {
  const configPath = path.join(__dirname, '../configs/mcp-config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error('Configuration file not found');
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!config.sync || !config.github || !config.salesforce) {
    throw new Error('Configuration missing required sections');
  }
});

// Test 2: MCP Utils Module
test('MCP Utils module loads correctly', () => {
  const mcpUtils = require('../src/mcp-utils.js');
  if (typeof mcpUtils.createMCPMetadata !== 'function') {
    throw new Error('createMCPMetadata function not exported');
  }
  if (typeof mcpUtils.parseMCPMetadata !== 'function') {
    throw new Error('parseMCPMetadata function not exported');
  }
});

// Test 3: Create MCP Metadata
test('Create MCP metadata block', () => {
  const { createMCPMetadata } = require('../src/mcp-utils.js');
  const metadata = createMCPMetadata({
    caseId: '500TEST123',
    caseNumber: '12345',
    repo: 'test/repo',
    issueNumber: 42
  });
  
  if (!metadata.includes('<!-- MCP-METADATA -->')) {
    throw new Error('Metadata marker not found');
  }
  if (!metadata.includes('"caseId": "500TEST123"')) {
    throw new Error('Case ID not in metadata');
  }
});

// Test 4: Parse MCP Metadata
test('Parse MCP metadata from body', () => {
  const { createMCPMetadata, parseMCPMetadata } = require('../src/mcp-utils.js');
  const metadata = createMCPMetadata({
    caseId: '500TEST123',
    caseNumber: '12345'
  });
  
  const body = `Issue description\n\n${metadata}\n\nMore content`;
  const parsed = parseMCPMetadata(body);
  
  if (!parsed) {
    throw new Error('Failed to parse metadata');
  }
  if (parsed.salesforce.caseId !== '500TEST123') {
    throw new Error('Parsed case ID does not match');
  }
});

// Test 5: Extract Case Number from Title
test('Extract case number from title', () => {
  const { extractCaseNumberFromTitle } = require('../src/mcp-utils.js');
  const caseNumber = extractCaseNumberFromTitle('[SF Case #12345] Test issue');
  if (caseNumber !== '12345') {
    throw new Error(`Expected 12345, got ${caseNumber}`);
  }
});

// Test 6: Format Title with Case
test('Format title with case number', () => {
  const { formatTitleWithCase } = require('../src/mcp-utils.js');
  const title = formatTitleWithCase('Test issue', '12345');
  if (!title.includes('[SF Case #12345]')) {
    throw new Error('Title not formatted correctly');
  }
});

// Test 7: Create Case Label
test('Create Salesforce case label', () => {
  const { createCaseLabel } = require('../src/mcp-utils.js');
  const label = createCaseLabel('12345');
  if (!label.startsWith('Salesforce-Case:')) {
    throw new Error('Label format incorrect');
  }
});

// Test 8: Validate Metadata
test('Validate MCP metadata structure', () => {
  const { validateMetadata } = require('../src/mcp-utils.js');
  const validMetadata = {
    version: '1.0',
    salesforce: { caseId: '500TEST123' },
    github: { repo: 'test/repo' },
    sync: { status: 'active' }
  };
  
  if (!validateMetadata(validMetadata)) {
    throw new Error('Valid metadata marked as invalid');
  }
  
  if (validateMetadata(null)) {
    throw new Error('Null metadata marked as valid');
  }
  
  if (validateMetadata({ version: '1.0' })) {
    throw new Error('Incomplete metadata marked as valid');
  }
});

// Test 9: GitHub Client Module
test('GitHub Client module loads correctly', () => {
  const GitHubClient = require('../src/github-client.js');
  if (typeof GitHubClient !== 'function') {
    throw new Error('GitHubClient is not a constructor');
  }
});

// Test 10: Salesforce Client Module
test('Salesforce Client module loads correctly', () => {
  const SalesforceClient = require('../src/salesforce-client.js');
  if (typeof SalesforceClient !== 'function') {
    throw new Error('SalesforceClient is not a constructor');
  }
});

// Test 11: Sync Orchestrator Module
test('Sync Orchestrator module loads correctly', () => {
  const MCPSyncOrchestrator = require('../src/sync-orchestrator.js');
  if (typeof MCPSyncOrchestrator !== 'function') {
    throw new Error('MCPSyncOrchestrator is not a constructor');
  }
});

// Test 12: Package.json exists
test('Package.json exists and is valid', () => {
  const packagePath = path.join(__dirname, '../package.json');
  if (!fs.existsSync(packagePath)) {
    throw new Error('package.json not found');
  }
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  if (!pkg.dependencies || !pkg.dependencies['@octokit/rest']) {
    throw new Error('Missing required dependency @octokit/rest');
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Tests Passed: ${testsPassed}`);
console.log(`Tests Failed: ${testsFailed}`);
console.log('='.repeat(50));

if (testsFailed > 0) {
  console.error('\n❌ Some tests failed');
  process.exit(1);
} else {
  console.log('\n✅ All tests passed!');
  process.exit(0);
}
