# GitHub Sync Explained

## What is the GitHub Sync?

The GitHub Sync in this repository is a **bidirectional synchronization system** that automatically keeps GitHub Issues/Pull Requests and Salesforce Cases in sync. It uses the **Model Context Protocol (MCP)** to maintain structured metadata that links the two systems together.

## How Does It Work?

### The Big Picture

```
┌─────────────────────────────────────────────────────────────┐
│                    MCP Sync System                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  GitHub Issues/PRs  ◄──────────────────► Salesforce Cases  │
│         │                                         │          │
│         └──────► MCP Sync Orchestrator ◄─────────┘          │
│                           │                                  │
│           ┌───────────────┼───────────────┐                 │
│           │                               │                 │
│     Webhook Handler              Nightly Sync               │
│     (Real-time)                  (Midnight UTC)             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Two Main Components

#### 1. **Webhook Handler** (Real-time Sync)
- Triggers immediately when events happen in GitHub
- Handles: issue creation, PR creation, comments, status changes, PR merges
- File: `.github/workflows/mcp-webhook-handler.yml`

#### 2. **Nightly Sync** (Scheduled Batch Sync)
- Runs automatically every night at midnight UTC
- Retries any failed syncs from the day
- Checks for merged PRs that need case closure
- File: `.github/workflows/mcp-nightly-sync.yml`

## What Gets Synced?

### Events That Trigger Sync

| Event | What Happens | Direction |
|-------|-------------|-----------|
| **New GitHub Issue** | Creates a Salesforce Case, adds metadata to issue | GitHub → Salesforce |
| **New Pull Request** | Creates a Salesforce Case, adds metadata to PR | GitHub → Salesforce |
| **Issue/PR Comment** | Adds comment to linked Salesforce Case | GitHub → Salesforce |
| **Issue/PR Closed** | Updates Salesforce Case status to "Closed" | GitHub → Salesforce |
| **Issue/PR Reopened** | Updates Salesforce Case status back to "Open" | GitHub → Salesforce |
| **PR Merged** | Can close the linked Salesforce Case (configurable) | GitHub → Salesforce |

### The MCP Metadata Block

Every synced issue or PR gets a special metadata block that looks like this:

```markdown
[SF Case #12345] Fix invoice calculation

<!-- MCP-METADATA -->
```json
{
  "salesforce": {
    "caseId": "5001234567890ABC",
    "caseNumber": "12345",
    "caseStatus": "In Progress"
  },
  "github": {
    "repo": "laneauxc/Salesforce-GitHub-Test",
    "issueNumber": 42,
    "lastSyncedAt": "2026-02-05T06:00:00Z"
  }
}
```
<!-- MCP-METADATA -->
```

This metadata:
- Links the GitHub issue/PR to the Salesforce case
- Stores the sync status
- Enables bidirectional updates
- Is hidden in the rendered view but accessible to the sync system

## Real-World Example Walkthrough

### Scenario: A Developer Creates a Bug Fix PR

1. **Developer creates PR #123** with title "Fix invoice rounding error"
   
2. **Webhook Handler activates** (within seconds)
   - Detects new PR creation
   - Checks: Does this PR already have Salesforce metadata? (No)
   
3. **Sync Orchestrator runs**:
   - Creates a new Salesforce Case
   - Case gets: Subject = "Fix invoice rounding error", Description = PR body
   - Salesforce returns Case ID: 5001234567890ABC, Case Number: 12345
   
4. **GitHub PR is updated**:
   - Title becomes: "[SF Case #12345] Fix invoice rounding error"
   - MCP metadata block added to PR description
   - Labels added: `Salesforce-Case:12345`, `sf-synced`
   
5. **Teammate adds a comment**: "I tested this locally and it works!"
   - Webhook Handler detects comment
   - Comment is added to Salesforce Case #12345
   
6. **PR is merged** to main branch
   - Webhook Handler detects merge
   - Based on configuration:
     - **If immediateClose = true**: Case is closed immediately
     - **If nightlyCheck = true**: Case is marked for closure during nightly sync
     - **If autoCloseCase = false**: Case stays open for manual closure

7. **Nightly Sync runs** at midnight UTC
   - Verifies the merge was synced properly
   - Retries any failed operations
   - Updates case with resolution details

## Configuration

The sync behavior is controlled by `/configs/mcp-config.json`:

```json
{
  "sync": {
    "enabled": true,
    "mode": "bidirectional"
  },
  "triggers": {
    "onCreate": true,           // Sync new issues/PRs
    "onComment": true,          // Sync comments
    "onStatusChange": true,     // Sync when closed/reopened
    "onPRMerge": {
      "enabled": true,          // Handle PR merges
      "nightlyCheck": true,     // Check during nightly sync
      "immediateClose": false   // Don't close case immediately
    }
  }
}
```

### Key Settings:

- **onCreate**: When enabled, new GitHub issues/PRs automatically create Salesforce cases
- **onComment**: When enabled, comments sync between systems
- **onStatusChange**: When enabled, closing/reopening syncs status
- **onPRMerge.immediateClose**: If true, merged PRs close the Salesforce case immediately
- **onPRMerge.nightlyCheck**: If true, nightly sync checks for merged PRs

## The Source Code

The system is built from 4 main JavaScript modules in the `/src` directory:

1. **mcp-utils.js** - Utilities for creating and parsing MCP metadata blocks
2. **github-client.js** - Wrapper for GitHub API operations
3. **salesforce-client.js** - Wrapper for Salesforce API operations
4. **sync-orchestrator.js** - Main logic that coordinates the sync

## Error Handling

If a sync fails:

1. The system adds an `sf-sync-error` label to the issue/PR
2. A warning comment is posted explaining the error
3. The nightly sync job automatically retries the operation
4. If the retry succeeds, the error label is removed and a success comment is posted

Example error notification:
```markdown
⚠️ **Salesforce Sync Failed**

The synchronization with Salesforce failed. The system will retry at 
the next scheduled sync (midnight UTC).

**Error**: Connection timeout
**Timestamp**: 2026-02-05T15:30:00.000Z
```

## Benefits

### For Developers:
- **No manual case entry** - Create issues naturally in GitHub
- **All context in one place** - See Salesforce case info right in the issue
- **Automatic updates** - Comments and status changes sync automatically

### For Support Teams:
- **Salesforce case tracking** - All work tracked in familiar Salesforce environment
- **GitHub visibility** - See exactly what code changes were made
- **Audit trail** - Complete history of sync operations

### For Both:
- **Single source of truth** - Both systems stay in sync
- **Clear linkage** - MCP metadata maintains relationships
- **Error recovery** - Automatic retry prevents data loss

## Monitoring the Sync

### Check Sync Status:
1. **GitHub Actions Tab** - View workflow runs
2. **Issue/PR Labels** - Look for `sf-synced` (success) or `sf-sync-error` (failure)
3. **MCP Metadata** - Check the metadata block for sync timestamp

### Manual Trigger:
You can manually trigger the nightly sync:
1. Go to **Actions** tab
2. Select **"MCP Nightly Sync"**
3. Click **"Run workflow"**
4. Click the green **"Run workflow"** button

## Common Questions

### Q: What if I create an issue that shouldn't sync?
A: Once created, it will sync. However, you can configure which events trigger syncs in the config file.

### Q: Can I edit the MCP metadata manually?
A: It's not recommended. The sync system manages this automatically. Manual edits could break the sync.

### Q: What happens if Salesforce is down?
A: The sync will fail, add an error label, and automatically retry during the next nightly sync.

### Q: Do all comments sync?
A: Yes, except bot comments are typically filtered to avoid sync loops.

### Q: Can I disable sync for my repository?
A: Yes, set `"enabled": false` in `/configs/mcp-config.json`.

## Troubleshooting

### Sync isn't working:
1. Check GitHub Actions logs for error messages
2. Verify environment secrets are set (Settings → Secrets → Actions):
   - `SALESFORCE_INSTANCE_URL`
   - `SALESFORCE_USERNAME`
   - `SALESFORCE_PASSWORD`
3. Check `mcp-config.json` for syntax errors

### Duplicate cases created:
1. Check if issue already has MCP metadata before creating
2. Review webhook event logs
3. Verify case search logic in Salesforce

### Comments not syncing:
1. Verify `onComment: true` in config
2. Check if comment author is a bot (may be filtered)
3. Review API rate limits

## Summary

The GitHub Sync is a sophisticated **bidirectional synchronization system** that:
- Automatically syncs GitHub Issues/PRs with Salesforce Cases
- Uses MCP metadata blocks to maintain clear linkage
- Provides real-time webhook-based sync and nightly batch sync
- Handles errors gracefully with automatic retry
- Keeps development and support teams in sync without manual effort

It eliminates duplicate data entry, maintains audit trails, and ensures both systems always reflect the current state of work.
