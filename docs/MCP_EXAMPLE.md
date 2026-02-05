# MCP Metadata Example

This file demonstrates what the MCP metadata looks like when embedded in a GitHub issue or pull request.

## Example Issue with MCP Metadata

---

**Title**: `[SF Case #12345] Fix invoice rounding calculation error`

**Body**:

```markdown
## Problem Description

The invoice calculation system is producing incorrect results when dealing with fractional amounts. This is causing customer billing discrepancies.

## Expected Behavior

Invoices should round to 2 decimal places using standard rounding rules (0.5 rounds up).

## Current Behavior

Invoices are sometimes rounding down when they should round up, resulting in underbilling.

## Salesforce Case Link

This issue is linked to Salesforce Case #12345

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

## Steps to Reproduce

1. Create invoice with amount $100.555
2. Process invoice
3. Observe final amount is $100.55 instead of $100.56

## Additional Context

Priority: High
Affects: Production environment
Customer Impact: Multiple customers affected
```

**Labels**: 
- `Salesforce-Case:12345`
- `sf-synced`
- `bug`
- `priority:high`

---

## What Happens When This Issue Is Created

1. **Initial Creation** (GitHub):
   - Developer creates issue via GitHub UI
   - Issue has title and description but no MCP metadata yet

2. **Webhook Trigger**:
   - GitHub webhook fires on issue creation
   - MCP webhook handler workflow executes

3. **Salesforce Sync**:
   - System checks if issue has MCP metadata
   - No metadata found, so creates new Salesforce case
   - Case created with Subject and Description from issue

4. **Metadata Injection**:
   - System updates issue with MCP metadata block
   - Adds Salesforce case ID, number, URL
   - Adds sync status and timestamp

5. **Label Application**:
   - `Salesforce-Case:12345` label created and added
   - `sf-synced` label added
   - Priority labels added based on Salesforce priority

6. **Salesforce Update**:
   - Salesforce case updated with GitHub issue number
   - GitHub URL stored in custom Salesforce field
   - Linkage established bidirectionally

## What Happens When Someone Comments

**On GitHub**:
```markdown
I've investigated this issue and found the root cause in the `calculateInvoiceTotal()` function. 
The problem is we're using Math.floor() instead of Math.round().
```

**Sync to Salesforce**:
- Comment syncs to Salesforce case
- Appears as case comment with attribution
- Includes link back to GitHub issue

**On Salesforce**:
```
GitHub Comment from @developer:
I've investigated this issue and found the root cause in the `calculateInvoiceTotal()` function.
The problem is we're using Math.floor() instead of Math.round().

Source: https://github.com/laneauxc/Salesforce-GitHub-Test/issues/42#issuecomment-123456
```

## What Happens When PR Merges

**PR Created**:
```markdown
Title: [SF Case #12345] Fix invoice rounding calculation

This PR fixes the invoice rounding issue by:
- Replacing Math.floor() with Math.round()
- Adding unit tests for edge cases
- Updating documentation

Closes #42

<!-- MCP-METADATA -->
{
  "salesforce": {
    "caseId": "5001234567890ABC",
    "caseNumber": "12345",
    "caseStatus": "In Progress"
  },
  "github": {
    "prNumber": 43,
    "issueNumber": 42
  }
}
<!-- MCP-METADATA -->
```

**PR Merged**:
1. PR merges to main branch
2. Based on configuration:
   - **Immediate mode**: Case closed immediately
   - **Nightly mode**: Marked for closure at midnight
   - **Manual mode**: Waits for manual trigger

3. Case updated with resolution:
   ```
   Status: Closed
   Resolution: Fixed in PR #43
   Resolution Date: 2026-02-05
   ```

## Benefits Demonstrated

✅ **No Double Entry**: Create once, sync everywhere
✅ **Clear Linkage**: Always know which case relates to which issue
✅ **Audit Trail**: Full history of when/how things synced
✅ **Developer-Friendly**: Developers work in GitHub as usual
✅ **Support-Friendly**: Support team has full context in Salesforce
✅ **Machine-Readable**: Easy for automation to parse and act on
✅ **Human-Readable**: Clear structure that humans can understand

## Extensibility Example

You can extend the MCP metadata with custom fields:

```json
{
  "version": "1.0",
  "salesforce": {
    "caseId": "5001234567890ABC",
    "caseNumber": "12345",
    "caseStatus": "In Progress",
    "customField1": "value",
    "customField2": "value"
  },
  "github": {
    "repo": "laneauxc/Salesforce-GitHub-Test",
    "issueNumber": 42,
    "sprint": "Sprint 23",
    "epic": "Invoice Improvements"
  },
  "sync": {
    "direction": "bidirectional",
    "status": "active",
    "syncedTeams": ["backend", "finance"]
  }
}
```

This allows for future enhancements without breaking existing functionality.
