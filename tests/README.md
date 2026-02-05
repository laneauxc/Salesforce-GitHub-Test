# MCP Tests

This directory contains test files for the MCP automation system.

## Running Tests

### Prerequisites

Install dependencies first:

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Specific Tests

```bash
# Test MCP utilities only (no dependencies required)
npm run test:utils

# Test configuration validation
npm run validate-config
```

## Test Files

- **test-modules.js** - Tests for all MCP modules, including:
  - Configuration loading
  - MCP metadata creation and parsing
  - Title and label formatting
  - Module loading and exports

## Expected Results

With dependencies installed, all 12 tests should pass:

```
✅ Configuration file exists and is valid JSON
✅ MCP Utils module loads correctly
✅ Create MCP metadata block
✅ Parse MCP metadata from body
✅ Extract case number from title
✅ Format title with case number
✅ Create Salesforce case label
✅ Validate MCP metadata structure
✅ GitHub Client module loads correctly
✅ Salesforce Client module loads correctly
✅ Sync Orchestrator module loads correctly
✅ Package.json exists and is valid
```

## Notes

- Tests that require `@octokit/rest` will fail if dependencies are not installed
- The GitHub Actions workflows automatically install dependencies before running
- MCP utilities can be tested independently without external dependencies
