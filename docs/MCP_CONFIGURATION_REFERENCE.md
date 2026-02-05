# MCP Configuration Reference

## Overview

This document provides detailed reference for all configuration options in the MCP (Model Context Protocol) automation system.

## Configuration File Location

`/configs/mcp-config.json`

## Complete Configuration Schema

```json
{
  "sync": {
    "enabled": boolean,
    "mode": "bidirectional" | "github-to-salesforce" | "salesforce-to-github",
    "retryAttempts": number,
    "retryDelaySeconds": number,
    "nightlySyncTime": "HH:MM"
  },
  "github": {
    "defaultRepo": "owner/repo",
    "labelPrefix": string,
    "mcpMetadataMarker": string,
    "syncLabels": {
      "synced": string,
      "syncError": string,
      "pendingSync": string
    }
  },
  "salesforce": {
    "caseIdField": string,
    "caseNumberField": string,
    "statusMapping": {
      "SalesforceStatus": "githubState"
    }
  },
  "triggers": {
    "onCreate": boolean,
    "onComment": boolean,
    "onStatusChange": boolean,
    "onPRMerge": {
      "enabled": boolean,
      "autoCloseCase": boolean,
      "nightlyCheck": boolean,
      "immediateClose": boolean
    }
  },
  "fieldMappings": {
    "salesforceToGithub": {
      "SalesforceField": "githubField"
    },
    "githubToSalesforce": {
      "githubField": "SalesforceField"
    }
  },
  "notifications": {
    "onSyncSuccess": boolean,
    "onSyncFailure": boolean,
    "failureTemplate": string
  },
  "audit": {
    "enabled": boolean,
    "logLevel": "debug" | "info" | "warn" | "error",
    "logEvents": ["creation", "statusChange", "closure", "comment", "error"]
  }
}
```

## Configuration Sections

### 1. Sync Settings

Controls overall synchronization behavior.

```json
{
  "sync": {
    "enabled": true,
    "mode": "bidirectional",
    "retryAttempts": 3,
    "retryDelaySeconds": 300,
    "nightlySyncTime": "00:00"
  }
}
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | `true` | Master switch for all sync operations |
| `mode` | string | `"bidirectional"` | Sync direction: `"bidirectional"`, `"github-to-salesforce"`, or `"salesforce-to-github"` |
| `retryAttempts` | number | `3` | Number of retry attempts for failed syncs |
| `retryDelaySeconds` | number | `300` | Delay between retry attempts (seconds) |
| `nightlySyncTime` | string | `"00:00"` | Time for nightly sync job (24-hour format, UTC) |

### 2. GitHub Settings

GitHub-specific configuration.

```json
{
  "github": {
    "defaultRepo": "laneauxc/Salesforce-GitHub-Test",
    "labelPrefix": "Salesforce-Case",
    "mcpMetadataMarker": "<!-- MCP-METADATA -->",
    "syncLabels": {
      "synced": "sf-synced",
      "syncError": "sf-sync-error",
      "pendingSync": "sf-pending-sync"
    }
  }
}
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `defaultRepo` | string | Required | Default repository in format `"owner/repo"` |
| `labelPrefix` | string | `"Salesforce-Case"` | Prefix for case-specific labels |
| `mcpMetadataMarker` | string | `"<!-- MCP-METADATA -->"` | HTML comment marker for metadata blocks |
| `syncLabels.synced` | string | `"sf-synced"` | Label for successfully synced items |
| `syncLabels.syncError` | string | `"sf-sync-error"` | Label for sync failures |
| `syncLabels.pendingSync` | string | `"sf-pending-sync"` | Label for items awaiting sync |

### 3. Salesforce Settings

Salesforce-specific configuration.

```json
{
  "salesforce": {
    "caseIdField": "caseId",
    "caseNumberField": "caseNumber",
    "statusMapping": {
      "New": "open",
      "In Progress": "open",
      "Waiting on Customer": "open",
      "Escalated": "open",
      "Closed": "closed",
      "Resolved": "closed"
    }
  }
}
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `caseIdField` | string | Field name for Salesforce Case ID (typically `"caseId"`) |
| `caseNumberField` | string | Field name for Salesforce Case Number (typically `"caseNumber"`) |
| `statusMapping` | object | Maps Salesforce status values to GitHub states (`"open"` or `"closed"`) |

#### Adding Custom Status Mappings

To add custom Salesforce statuses:

```json
{
  "salesforce": {
    "statusMapping": {
      "New": "open",
      "Custom Status 1": "open",
      "Custom Status 2": "closed",
      "On Hold": "open"
    }
  }
}
```

### 4. Trigger Settings

Controls when sync operations are triggered.

```json
{
  "triggers": {
    "onCreate": true,
    "onComment": true,
    "onStatusChange": true,
    "onPRMerge": {
      "enabled": true,
      "autoCloseCase": false,
      "nightlyCheck": true,
      "immediateClose": false
    }
  }
}
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `onCreate` | boolean | `true` | Sync when issues/PRs/cases are created |
| `onComment` | boolean | `true` | Sync comments between systems |
| `onStatusChange` | boolean | `true` | Sync when status/state changes |
| `onPRMerge.enabled` | boolean | `true` | Enable PR merge handling |
| `onPRMerge.autoCloseCase` | boolean | `false` | **Deprecated**: Use `immediateClose` instead |
| `onPRMerge.nightlyCheck` | boolean | `true` | Check merged PRs during nightly sync |
| `onPRMerge.immediateClose` | boolean | `false` | Close case immediately when PR merges |

#### PR Merge Closure Modes

Three options for closing Salesforce cases when PRs merge:

1. **Manual Only** (default):
   ```json
   {
     "onPRMerge": {
       "enabled": true,
       "nightlyCheck": false,
       "immediateClose": false
     }
   }
   ```

2. **Nightly Automatic** (recommended):
   ```json
   {
     "onPRMerge": {
       "enabled": true,
       "nightlyCheck": true,
       "immediateClose": false
     }
   }
   ```

3. **Immediate Closure** (aggressive):
   ```json
   {
     "onPRMerge": {
       "enabled": true,
       "nightlyCheck": false,
       "immediateClose": true
     }
   }
   ```

### 5. Field Mappings

Maps fields between Salesforce and GitHub.

```json
{
  "fieldMappings": {
    "salesforceToGithub": {
      "Subject": "title",
      "Description": "body",
      "Status": "state",
      "Priority": "labels"
    },
    "githubToSalesforce": {
      "title": "Subject",
      "body": "Description",
      "state": "Status",
      "labels": "Priority"
    }
  }
}
```

#### Standard Field Mappings

| Salesforce Field | GitHub Field | Sync Direction |
|-----------------|--------------|----------------|
| `Subject` | `title` | Bidirectional |
| `Description` | `body` | Bidirectional |
| `Status` | `state` | Bidirectional |
| `Priority` | `labels` | Bidirectional |

#### Adding Custom Field Mappings

To map custom Salesforce fields:

```json
{
  "fieldMappings": {
    "salesforceToGithub": {
      "Subject": "title",
      "CustomField__c": "labels"
    },
    "githubToSalesforce": {
      "title": "Subject",
      "milestone": "Sprint__c"
    }
  }
}
```

**Note**: Custom field mapping requires code changes in `sync-orchestrator.js` to handle the field conversion logic.

### 6. Notification Settings

Controls user notifications about sync events.

```json
{
  "notifications": {
    "onSyncSuccess": false,
    "onSyncFailure": true,
    "failureTemplate": ":warning: **Salesforce Sync Failed**\n\nThe synchronization with Salesforce failed..."
  }
}
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `onSyncSuccess` | boolean | `false` | Post comment on successful sync |
| `onSyncFailure` | boolean | `true` | Post comment on sync failure |
| `failureTemplate` | string | See default | Markdown template for failure notifications |

#### Customizing Failure Template

Available placeholders:
- `{error}` - Error message
- `{timestamp}` - ISO 8601 timestamp
- `{caseNumber}` - Salesforce case number (if available)
- `{issueNumber}` - GitHub issue number

Example custom template:

```json
{
  "notifications": {
    "failureTemplate": "🚨 **Sync Error**\n\n**Issue**: {error}\n**Time**: {timestamp}\n\nPlease contact support if this persists."
  }
}
```

### 7. Audit Settings

Controls logging and audit trail.

```json
{
  "audit": {
    "enabled": true,
    "logLevel": "info",
    "logEvents": ["creation", "statusChange", "closure", "comment", "error"]
  }
}
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable audit logging |
| `logLevel` | string | `"info"` | Log level: `"debug"`, `"info"`, `"warn"`, `"error"` |
| `logEvents` | array | See default | Events to log |

#### Available Log Events

| Event | Description |
|-------|-------------|
| `creation` | Issue/PR/case creation |
| `statusChange` | State/status updates |
| `closure` | Issue/PR/case closure |
| `comment` | Comment synchronization |
| `error` | Sync errors and failures |

#### Log Levels

- **debug**: Verbose logging including metadata parsing
- **info**: Standard operational logging (default)
- **warn**: Warnings and recoverable errors
- **error**: Errors and failures only

## Environment Variables

Required environment variables (set as GitHub Secrets):

```bash
# GitHub (auto-provided)
GITHUB_TOKEN=<github-token>

# Salesforce
SALESFORCE_INSTANCE_URL=https://yourorg.salesforce.com
SALESFORCE_USERNAME=integration.user@yourorg.com
SALESFORCE_PASSWORD=password+securitytoken
```

### Optional Environment Variables

```bash
# Override default repository
MCP_DEFAULT_REPO=owner/repo

# Custom config path
MCP_CONFIG_PATH=/path/to/custom-config.json

# Enable verbose logging
MCP_DEBUG=true
```

## Validation

### Validating Configuration

Use this Node.js script to validate your configuration:

```javascript
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./configs/mcp-config.json'));

function validateConfig(config) {
  const errors = [];
  
  // Check required sections
  if (!config.sync) errors.push('Missing "sync" section');
  if (!config.github) errors.push('Missing "github" section');
  if (!config.salesforce) errors.push('Missing "salesforce" section');
  
  // Check required fields
  if (config.github && !config.github.defaultRepo) {
    errors.push('Missing required field: github.defaultRepo');
  }
  
  // Validate mode
  const validModes = ['bidirectional', 'github-to-salesforce', 'salesforce-to-github'];
  if (config.sync && !validModes.includes(config.sync.mode)) {
    errors.push(`Invalid sync mode: ${config.sync.mode}`);
  }
  
  return errors;
}

const errors = validateConfig(config);
if (errors.length > 0) {
  console.error('Configuration errors:', errors);
  process.exit(1);
} else {
  console.log('Configuration is valid');
}
```

## Migration Guide

### Updating from v1.0 to v1.1 (Future)

When new versions are released, migration steps will be documented here.

## Best Practices

1. **Version Control**: Keep config in version control but exclude secrets
2. **Test Changes**: Test configuration changes in a staging environment first
3. **Document Customizations**: Comment your custom field mappings
4. **Monitor Logs**: Review audit logs after configuration changes
5. **Gradual Rollout**: Enable features one at a time to isolate issues

## Common Configuration Patterns

### Pattern 1: Development Environment

Minimal sync for testing:

```json
{
  "sync": {
    "enabled": true,
    "mode": "bidirectional"
  },
  "triggers": {
    "onCreate": true,
    "onComment": false,
    "onStatusChange": false,
    "onPRMerge": {
      "enabled": false
    }
  }
}
```

### Pattern 2: Production (Conservative)

Safe settings for production:

```json
{
  "sync": {
    "enabled": true,
    "mode": "bidirectional",
    "retryAttempts": 5
  },
  "triggers": {
    "onCreate": true,
    "onComment": true,
    "onStatusChange": true,
    "onPRMerge": {
      "enabled": true,
      "nightlyCheck": true,
      "immediateClose": false
    }
  },
  "notifications": {
    "onSyncSuccess": false,
    "onSyncFailure": true
  }
}
```

### Pattern 3: Production (Aggressive)

Immediate synchronization:

```json
{
  "sync": {
    "enabled": true,
    "mode": "bidirectional",
    "retryAttempts": 3
  },
  "triggers": {
    "onCreate": true,
    "onComment": true,
    "onStatusChange": true,
    "onPRMerge": {
      "enabled": true,
      "nightlyCheck": false,
      "immediateClose": true
    }
  }
}
```

## Troubleshooting

### Issue: Configuration not loading

- Verify file path: `/configs/mcp-config.json`
- Check JSON syntax (no trailing commas)
- Ensure file encoding is UTF-8

### Issue: Invalid configuration

- Run validation script above
- Check for typos in field names
- Verify boolean/string types match schema

### Issue: Changes not taking effect

- Restart workflows after configuration changes
- Check GitHub Actions cache
- Verify configuration is committed to repository

---

**Last Updated**: 2026-02-05  
**Version**: 1.0
