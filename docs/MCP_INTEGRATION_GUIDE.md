# MCP Automation – GitHub-Salesforce Integration Guide

## Overview

The MCP (Model Context Protocol) Automation system provides **bidirectional synchronization** between GitHub Issues/Pull Requests and Salesforce Cases. This integration eliminates manual data entry, maintains clear linkage between systems, and provides audit-ready structured data.

## Features

### ✅ Core Capabilities
- **Bidirectional Sync**: Automatically sync data between GitHub and Salesforce
- **Smart Linking**: Embedded MCP metadata blocks maintain clear relationships
- **Comment Sync**: Replicate discussions across both platforms
- **Status Sync**: Keep issue/case states synchronized
- **PR Merge Handling**: Multiple closure triggers for completed work
- **Error Recovery**: Automatic retry with user notifications
- **Audit Trail**: Comprehensive logging of all sync operations

### 🔄 Sync Triggers

#### 1. Creation
- **Salesforce → GitHub**: New case creates GitHub issue/PR with metadata
- **GitHub → Salesforce**: New issue/PR creates or links to Salesforce case

#### 2. Comments
- **Salesforce → GitHub**: Case comments replicate to linked issues/PRs
- **GitHub → Salesforce**: Issue/PR comments sync to linked cases

#### 3. Status Changes
- **Salesforce → GitHub**: Case status updates modify issue/PR state
- **GitHub → Salesforce**: Close/reopen actions sync to case status

#### 4. PR Merges
Three configurable closure triggers:
1. **Manual**: Triggered from Salesforce UI
2. **Nightly**: Automatic check at midnight UTC
3. **Immediate**: Close case instantly on merge (optional)

## Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                    MCP Sync Architecture                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  GitHub                          Salesforce                 │
│  ┌──────────┐                    ┌──────────┐              │
│  │ Issues/  │◄───────────────────►│  Cases   │              │
│  │   PRs    │   MCP Metadata      │          │              │
│  └──────────┘                    └──────────┘              │
│       │                                │                     │
│       │                                │                     │
│  ┌────▼────────────────────────────────▼─────┐              │
│  │     MCP Sync Orchestrator                 │              │
│  │  • github-client.js                       │              │
│  │  • salesforce-client.js                   │              │
│  │  • sync-orchestrator.js                   │              │
│  │  • mcp-utils.js                           │              │
│  └───────────────────────────────────────────┘              │
│       │                                │                     │
│  ┌────▼────────┐              ┌────────▼─────────┐          │
│  │  Webhook    │              │  Nightly Sync    │          │
│  │  Handler    │              │  (Midnight UTC)  │          │
│  └─────────────┘              └──────────────────┘          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### File Structure

```
/Salesforce-GitHub-Test/
├── configs/
│   └── mcp-config.json          # Configuration settings
├── src/
│   ├── mcp-utils.js             # Metadata formatting utilities
│   ├── github-client.js         # GitHub API integration
│   ├── salesforce-client.js     # Salesforce API integration
│   └── sync-orchestrator.js     # Main sync orchestration
└── .github/workflows/
    ├── mcp-webhook-handler.yml  # Real-time event handler
    └── mcp-nightly-sync.yml     # Scheduled sync job
```

## Configuration

### Environment Variables

Set these as GitHub repository secrets:

```bash
GITHUB_TOKEN              # Auto-provided by GitHub Actions
SALESFORCE_INSTANCE_URL   # e.g., https://yourorg.salesforce.com
SALESFORCE_USERNAME       # Salesforce integration user
SALESFORCE_PASSWORD       # Salesforce password + security token
```

### Configuration File

Edit `/configs/mcp-config.json`:

```json
{
  "sync": {
    "enabled": true,
    "mode": "bidirectional",
    "retryAttempts": 3,
    "nightlySyncTime": "00:00"
  },
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

## MCP Metadata Format

### Embedded Metadata Block

Every synced issue/PR contains an MCP metadata block:

```markdown
[SF Case #12345] Fix invoice calculation error

This PR addresses the invoice rounding issue...

<!-- MCP-METADATA -->
```json
{
  "version": "1.0",
  "timestamp": "2026-02-05T06:00:00.000Z",
  "salesforce": {
    "caseId": "5001234567890ABC",
    "caseNumber": "12345",
    "caseStatus": "In Progress",
    "caseUrl": "https://yourorg.salesforce.com/lightning/r/Case/5001234567890ABC/view"
  },
  "github": {
    "repo": "laneauxc/Salesforce-GitHub-Test",
    "issueNumber": 42,
    "prNumber": null,
    "lastSyncedAt": "2026-02-05T06:00:00.000Z",
    "syncedBy": "mcp-automation"
  },
  "sync": {
    "direction": "bidirectional",
    "status": "active",
    "lastError": null
  }
}
```
<!-- MCP-METADATA -->
```

### Labels

Synced issues/PRs receive labels:
- `Salesforce-Case:12345` - Links to specific case
- `sf-synced` - Indicates successful sync
- `sf-sync-error` - Marks sync failures (triggers retry)
- `sf-pending-sync` - Temporary state during sync

## Usage Examples

### Example 1: Create GitHub Issue from Salesforce Case

When a Salesforce case is created and needs tracking in GitHub:

1. Use Salesforce automation (Process Builder/Flow) to call webhook
2. System creates GitHub issue with:
   - Title: `[SF Case #12345] Case subject`
   - Body: Case description + MCP metadata
   - Labels: `Salesforce-Case:12345`, `sf-synced`
3. GitHub issue URL stored in Salesforce case

### Example 2: Sync GitHub Issue to Salesforce

When a developer creates a GitHub issue:

1. Issue created via GitHub UI
2. Webhook handler triggers
3. System:
   - Creates new Salesforce case (if no metadata present)
   - Updates issue with MCP metadata
   - Adds case label
   - Stores GitHub URL in Salesforce

### Example 3: Comment Sync

When a comment is added to GitHub issue:

1. Comment created
2. Webhook handler detects comment
3. System:
   - Extracts MCP metadata from issue
   - Adds comment to linked Salesforce case
   - Includes source URL for reference

### Example 4: PR Merge → Case Closure

When a PR is merged to main:

1. PR merge detected
2. Based on configuration:
   - **Immediate**: Case closed instantly
   - **Nightly**: Marked for closure at midnight
   - **Manual**: Waits for Salesforce trigger
3. Case updated with resolution details

## Error Handling

### Automatic Retry

Failed syncs are automatically retried:

1. Error occurs during sync
2. System:
   - Adds `sf-sync-error` label
   - Posts warning comment
   - Logs error details
3. Nightly sync job retries all errored items
4. On success:
   - Removes error label
   - Posts success comment

### Failure Notification

Users see clear notifications:

```markdown
⚠️ **Salesforce Sync Failed**

The synchronization with Salesforce failed. The system will retry at 
the next scheduled sync (midnight UTC).

**Error**: Connection timeout
**Timestamp**: 2026-02-05T15:30:00.000Z
```

## Status Mappings

### Salesforce → GitHub

| Salesforce Status    | GitHub State |
|---------------------|--------------|
| New                 | open         |
| In Progress         | open         |
| Waiting on Customer | open         |
| Escalated           | open         |
| Closed              | closed       |
| Resolved            | closed       |

### Custom Mappings

Modify status mappings in `/configs/mcp-config.json`:

```json
{
  "salesforce": {
    "statusMapping": {
      "Your Custom Status": "open",
      "Another Status": "closed"
    }
  }
}
```

## Field Mappings

### Salesforce Case → GitHub Issue

| Salesforce Field | GitHub Field |
|-----------------|--------------|
| Subject         | title        |
| Description     | body         |
| Status          | state        |
| Priority        | labels       |

### GitHub Issue → Salesforce Case

| GitHub Field | Salesforce Field |
|--------------|------------------|
| title        | Subject          |
| body         | Description      |
| state        | Status           |
| labels       | Priority         |

## Audit & Logging

### Logged Events

The system logs:
- **creation**: New issues/cases created
- **statusChange**: State/status updates
- **closure**: Issues/cases closed
- **comment**: Comments synchronized
- **error**: Sync failures

### Log Format

```json
{
  "timestamp": "2026-02-05T06:00:00.000Z",
  "event": "creation",
  "data": {
    "type": "issue",
    "number": 42,
    "repo": "laneauxc/Salesforce-GitHub-Test"
  },
  "level": "info"
}
```

## Best Practices

### For Developers

1. **Check for Metadata**: Before manual edits, check if issue has MCP metadata
2. **Use Labels**: Filter issues by `Salesforce-Case:*` labels
3. **Review Sync Status**: Check for `sf-sync-error` label on issues
4. **Include Context**: Add meaningful comments that translate well to Salesforce

### For Support/Ops

1. **Monitor Logs**: Check nightly sync job results
2. **Review Errors**: Investigate persistent `sf-sync-error` labels
3. **Update Mappings**: Adjust field/status mappings as needed
4. **Test Changes**: Use manual workflow dispatch to test sync

## Troubleshooting

### Issue: Sync Not Working

1. Check GitHub Actions logs
2. Verify environment variables are set
3. Check Salesforce credentials
4. Review mcp-config.json syntax

### Issue: Duplicate Cases

1. Check if issue already has MCP metadata
2. Verify case search logic in Salesforce
3. Review webhook event logs

### Issue: Comments Not Syncing

1. Verify `onComment` trigger is enabled
2. Check comment author (bot comments may be filtered)
3. Review API rate limits

## Advanced Configuration

### Custom Field Extensions

Add custom fields to MCP metadata:

```javascript
// In sync-orchestrator.js
const metadata = createMCPMetadata({
  // ... standard fields ...
  customField1: 'value',
  customField2: 'value'
});
```

### Integration with Other Tools

The MCP system can be extended to integrate with:
- Jira (via similar webhook patterns)
- Slack (for notifications)
- Custom dashboards (via metadata parsing)

## Security Considerations

1. **Credentials**: Never commit Salesforce credentials to repository
2. **Token Scope**: Use minimal GitHub token permissions
3. **Data Exposure**: Review what data syncs to public repos
4. **Audit Access**: Monitor who has access to secrets

## Support

For issues or questions:
1. Check workflow run logs in GitHub Actions
2. Review audit logs for specific event details
3. Open a GitHub issue with `mcp-sync` label
4. Contact repository maintainers

---

**Version**: 1.0  
**Last Updated**: 2026-02-05  
**Maintainer**: MCP Automation Team
