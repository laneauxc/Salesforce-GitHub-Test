/**
 * MCP (Model Context Protocol) Utilities
 * Handles MCP metadata formatting, parsing, and validation for GitHub-Salesforce sync
 */

const fs = require('fs');
const path = require('path');

// Load MCP configuration
function loadConfig() {
  const configPath = path.join(__dirname, '../configs/mcp-config.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

/**
 * Create MCP metadata block for GitHub issue/PR body
 * @param {Object} data - Metadata object
 * @returns {string} Formatted MCP metadata block
 */
function createMCPMetadata(data) {
  const config = loadConfig();
  const metadata = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    salesforce: {
      caseId: data.caseId || null,
      caseNumber: data.caseNumber || null,
      caseStatus: data.caseStatus || null,
      caseUrl: data.caseUrl || null
    },
    github: {
      repo: data.repo || config.github.defaultRepo,
      issueNumber: data.issueNumber || null,
      prNumber: data.prNumber || null,
      lastSyncedAt: data.lastSyncedAt || new Date().toISOString(),
      syncedBy: data.syncedBy || 'mcp-automation'
    },
    sync: {
      direction: data.direction || 'bidirectional',
      status: data.status || 'active',
      lastError: data.lastError || null
    }
  };

  const jsonBlock = JSON.stringify(metadata, null, 2);
  return `${config.github.mcpMetadataMarker}\n\`\`\`json\n${jsonBlock}\n\`\`\`\n${config.github.mcpMetadataMarker}`;
}

/**
 * Parse MCP metadata from GitHub issue/PR body
 * @param {string} body - Issue/PR body text
 * @returns {Object|null} Parsed metadata or null if not found
 */
function parseMCPMetadata(body) {
  const config = loadConfig();
  const marker = config.github.mcpMetadataMarker;
  
  // Find MCP metadata block
  const regex = new RegExp(`${marker}\\s*\`\`\`json\\s*([\\s\\S]*?)\`\`\`\\s*${marker}`, 'm');
  const match = body.match(regex);
  
  if (!match) {
    return null;
  }
  
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    console.error('Failed to parse MCP metadata:', error);
    return null;
  }
}

/**
 * Update MCP metadata in GitHub issue/PR body
 * @param {string} body - Current body text
 * @param {Object} updates - Metadata updates to apply
 * @returns {string} Updated body text
 */
function updateMCPMetadata(body, updates) {
  const existingMetadata = parseMCPMetadata(body);
  const config = loadConfig();
  const marker = config.github.mcpMetadataMarker;
  
  if (!existingMetadata) {
    // No existing metadata, append new
    return body + '\n\n' + createMCPMetadata(updates);
  }
  
  // Merge updates with existing metadata
  const mergedMetadata = {
    ...existingMetadata,
    salesforce: { ...existingMetadata.salesforce, ...updates.salesforce },
    github: { ...existingMetadata.github, ...updates.github },
    sync: { ...existingMetadata.sync, ...updates.sync }
  };
  
  // Update timestamp
  mergedMetadata.github.lastSyncedAt = new Date().toISOString();
  
  const newMetadataBlock = createMCPMetadata({
    caseId: mergedMetadata.salesforce.caseId,
    caseNumber: mergedMetadata.salesforce.caseNumber,
    caseStatus: mergedMetadata.salesforce.caseStatus,
    caseUrl: mergedMetadata.salesforce.caseUrl,
    repo: mergedMetadata.github.repo,
    issueNumber: mergedMetadata.github.issueNumber,
    prNumber: mergedMetadata.github.prNumber,
    lastSyncedAt: mergedMetadata.github.lastSyncedAt,
    syncedBy: mergedMetadata.github.syncedBy,
    direction: mergedMetadata.sync.direction,
    status: mergedMetadata.sync.status,
    lastError: mergedMetadata.sync.lastError
  });
  
  // Replace existing metadata block
  const regex = new RegExp(`${marker}\\s*\`\`\`json\\s*[\\s\\S]*?\`\`\`\\s*${marker}`, 'm');
  return body.replace(regex, newMetadataBlock);
}

/**
 * Extract Salesforce case number from title
 * @param {string} title - Issue/PR title
 * @returns {string|null} Case number or null
 */
function extractCaseNumberFromTitle(title) {
  const match = title.match(/\[SF Case #?(\d+)\]/i);
  return match ? match[1] : null;
}

/**
 * Format title with Salesforce case number
 * @param {string} title - Original title
 * @param {string} caseNumber - Salesforce case number
 * @returns {string} Formatted title
 */
function formatTitleWithCase(title, caseNumber) {
  // Remove existing case number if present
  const cleanTitle = title.replace(/\[SF Case #?\d+\]\s*/i, '');
  return `[SF Case #${caseNumber}] ${cleanTitle}`;
}

/**
 * Create Salesforce case label
 * @param {string} caseNumber - Salesforce case number
 * @returns {string} Label name
 */
function createCaseLabel(caseNumber) {
  const config = loadConfig();
  return `${config.github.labelPrefix}:${caseNumber}`;
}

/**
 * Validate MCP metadata structure
 * @param {Object} metadata - Metadata to validate
 * @returns {boolean} True if valid
 */
function validateMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object') {
    return false;
  }
  
  // Check required fields
  const hasRequiredFields = 
    metadata.version &&
    metadata.salesforce &&
    metadata.github &&
    metadata.sync;
  
  return hasRequiredFields;
}

/**
 * Log MCP event for audit trail
 * @param {string} event - Event type
 * @param {Object} data - Event data
 */
function logMCPEvent(event, data) {
  const config = loadConfig();
  
  if (!config.audit.enabled || !config.audit.logEvents.includes(event)) {
    return;
  }
  
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    data,
    level: config.audit.logLevel
  };
  
  console.log(`[MCP-AUDIT] ${JSON.stringify(logEntry)}`);
}

module.exports = {
  loadConfig,
  createMCPMetadata,
  parseMCPMetadata,
  updateMCPMetadata,
  extractCaseNumberFromTitle,
  formatTitleWithCase,
  createCaseLabel,
  validateMetadata,
  logMCPEvent
};
