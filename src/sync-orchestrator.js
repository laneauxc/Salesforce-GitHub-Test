/**
 * MCP Sync Orchestrator
 * Main sync logic between GitHub and Salesforce
 */

const GitHubClient = require('./github-client');
const SalesforceClient = require('./salesforce-client');
const {
  loadConfig,
  createMCPMetadata,
  parseMCPMetadata,
  updateMCPMetadata,
  formatTitleWithCase,
  createCaseLabel,
  logMCPEvent
} = require('./mcp-utils');

class MCPSyncOrchestrator {
  constructor(githubToken, salesforceCredentials) {
    this.github = new GitHubClient(githubToken);
    this.salesforce = new SalesforceClient(salesforceCredentials);
    this.config = loadConfig();
  }

  /**
   * Sync Salesforce case to GitHub (create issue/PR)
   */
  async syncCaseToGitHub(caseData, createPR = false) {
    try {
      const { owner, repo } = this._parseRepo(this.config.github.defaultRepo);
      
      // Get case details from Salesforce
      const sfCase = await this.salesforce.getCase(caseData.caseId);
      
      // Format title with case number
      const title = formatTitleWithCase(sfCase.Subject, sfCase.CaseNumber);
      
      // Create MCP metadata
      const mcpMetadata = createMCPMetadata({
        caseId: sfCase.Id,
        caseNumber: sfCase.CaseNumber,
        caseStatus: sfCase.Status,
        caseUrl: `${this.salesforce.baseUrl}/lightning/r/Case/${sfCase.Id}/view`,
        repo: this.config.github.defaultRepo,
        direction: 'salesforce-to-github'
      });
      
      // Create issue body with case description and MCP metadata
      const body = `${sfCase.Description || ''}\n\n${mcpMetadata}`;
      
      // Create case label
      const caseLabel = createCaseLabel(sfCase.CaseNumber);
      await this.github.ensureLabel(owner, repo, caseLabel);
      
      // Prepare labels
      const labels = [
        caseLabel,
        this.config.github.syncLabels.synced
      ];
      
      // Map priority to labels if configured
      if (sfCase.Priority) {
        labels.push(`priority:${sfCase.Priority.toLowerCase()}`);
      }
      
      // Create issue
      const issue = await this.github.createIssue(owner, repo, {
        title,
        body,
        labels
      });
      
      // Update Salesforce case with GitHub issue link
      await this.salesforce.updateCase(sfCase.Id, {
        GitHub_Issue_Number__c: issue.number,
        GitHub_Issue_URL__c: issue.html_url
      });
      
      logMCPEvent('creation', {
        direction: 'salesforce-to-github',
        caseId: sfCase.Id,
        issueNumber: issue.number
      });
      
      return {
        success: true,
        issue,
        case: sfCase
      };
    } catch (error) {
      logMCPEvent('error', {
        action: 'syncCaseToGitHub',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Sync GitHub issue/PR to Salesforce
   */
  async syncGitHubToSalesforce(owner, repo, issueNumber) {
    try {
      // Get issue details
      const issue = await this.github.getIssue(owner, repo, issueNumber);
      
      // Parse existing MCP metadata
      let metadata = parseMCPMetadata(issue.body || '');
      
      let sfCase;
      if (metadata && metadata.salesforce.caseId) {
        // Update existing case
        sfCase = await this.salesforce.updateCase(metadata.salesforce.caseId, {
          Subject: issue.title,
          Description: issue.body,
          Status: this._mapGitHubStateToSalesforce(issue.state)
        });
      } else {
        // Create new case
        sfCase = await this.salesforce.createCase({
          subject: issue.title,
          description: issue.body,
          status: this._mapGitHubStateToSalesforce(issue.state),
          GitHub_Issue_Number__c: issueNumber,
          GitHub_Issue_URL__c: issue.html_url
        });
        
        // Update issue with MCP metadata
        const mcpMetadata = createMCPMetadata({
          caseId: sfCase.Id,
          caseNumber: sfCase.CaseNumber,
          caseStatus: sfCase.Status,
          caseUrl: `${this.salesforce.baseUrl}/lightning/r/Case/${sfCase.Id}/view`,
          repo: `${owner}/${repo}`,
          issueNumber,
          direction: 'github-to-salesforce'
        });
        
        const updatedBody = issue.body 
          ? `${issue.body}\n\n${mcpMetadata}`
          : mcpMetadata;
        
        await this.github.updateIssue(owner, repo, issueNumber, {
          body: updatedBody
        });
        
        // Add case label
        const caseLabel = createCaseLabel(sfCase.CaseNumber);
        await this.github.ensureLabel(owner, repo, caseLabel);
        await this.github.addLabels(owner, repo, issueNumber, [
          caseLabel,
          this.config.github.syncLabels.synced
        ]);
      }
      
      logMCPEvent('creation', {
        direction: 'github-to-salesforce',
        issueNumber,
        caseId: sfCase.Id
      });
      
      return {
        success: true,
        issue,
        case: sfCase
      };
    } catch (error) {
      logMCPEvent('error', {
        action: 'syncGitHubToSalesforce',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Sync comment from GitHub to Salesforce
   */
  async syncCommentToSalesforce(owner, repo, issueNumber, commentBody) {
    try {
      const issue = await this.github.getIssue(owner, repo, issueNumber);
      const metadata = parseMCPMetadata(issue.body || '');
      
      if (!metadata || !metadata.salesforce.caseId) {
        throw new Error('No Salesforce case linked to this issue');
      }
      
      await this.salesforce.addCaseComment(
        metadata.salesforce.caseId,
        `GitHub Comment:\n${commentBody}\n\nSource: ${issue.html_url}`
      );
      
      logMCPEvent('comment', {
        direction: 'github-to-salesforce',
        issueNumber,
        caseId: metadata.salesforce.caseId
      });
      
      return { success: true };
    } catch (error) {
      logMCPEvent('error', {
        action: 'syncCommentToSalesforce',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Sync comment from Salesforce to GitHub
   */
  async syncCommentToGitHub(caseId, commentBody) {
    try {
      // In production, you'd query Salesforce to find the linked GitHub issue
      // For now, this is a placeholder
      
      logMCPEvent('comment', {
        direction: 'salesforce-to-github',
        caseId
      });
      
      return { success: true };
    } catch (error) {
      logMCPEvent('error', {
        action: 'syncCommentToGitHub',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Sync status change from Salesforce to GitHub
   */
  async syncStatusToGitHub(caseId, newStatus) {
    try {
      // Query to find linked GitHub issue
      const githubState = this._mapSalesforceStatusToGitHub(newStatus);
      
      logMCPEvent('statusChange', {
        direction: 'salesforce-to-github',
        caseId,
        newStatus
      });
      
      return { success: true };
    } catch (error) {
      logMCPEvent('error', {
        action: 'syncStatusToGitHub',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Sync status change from GitHub to Salesforce
   */
  async syncStatusToSalesforce(owner, repo, issueNumber, newState) {
    try {
      const issue = await this.github.getIssue(owner, repo, issueNumber);
      const metadata = parseMCPMetadata(issue.body || '');
      
      if (!metadata || !metadata.salesforce.caseId) {
        return { success: false, reason: 'No linked Salesforce case' };
      }
      
      const salesforceStatus = this._mapGitHubStateToSalesforce(newState);
      await this.salesforce.updateCase(metadata.salesforce.caseId, {
        Status: salesforceStatus
      });
      
      logMCPEvent('statusChange', {
        direction: 'github-to-salesforce',
        issueNumber,
        caseId: metadata.salesforce.caseId,
        newState
      });
      
      return { success: true };
    } catch (error) {
      logMCPEvent('error', {
        action: 'syncStatusToSalesforce',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Handle PR merge - close Salesforce case if configured
   */
  async handlePRMerge(owner, repo, prNumber) {
    try {
      const pr = await this.github.getPullRequest(owner, repo, prNumber);
      const metadata = parseMCPMetadata(pr.body || '');
      
      if (!metadata || !metadata.salesforce.caseId) {
        return { success: false, reason: 'No linked Salesforce case' };
      }
      
      const mergeConfig = this.config.triggers.onPRMerge;
      
      if (mergeConfig.immediateClose) {
        // Close case immediately
        await this.salesforce.closeCase(
          metadata.salesforce.caseId,
          `Automatically closed: PR #${prNumber} merged to main`
        );
        
        logMCPEvent('closure', {
          direction: 'github-to-salesforce',
          prNumber,
          caseId: metadata.salesforce.caseId,
          trigger: 'immediate'
        });
      }
      
      return { success: true };
    } catch (error) {
      logMCPEvent('error', {
        action: 'handlePRMerge',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Notify about sync failure
   */
  async notifySyncFailure(owner, repo, issueNumber, error) {
    try {
      const template = this.config.notifications.failureTemplate;
      const message = template
        .replace('{error}', error.message)
        .replace('{timestamp}', new Date().toISOString());
      
      await this.github.addComment(owner, repo, issueNumber, message);
      await this.github.addLabels(owner, repo, issueNumber, [
        this.config.github.syncLabels.syncError
      ]);
      
      return { success: true };
    } catch (err) {
      console.error('Failed to notify about sync failure:', err);
      return { success: false };
    }
  }

  // Helper methods
  _parseRepo(repoString) {
    const [owner, repo] = repoString.split('/');
    return { owner, repo };
  }

  _mapSalesforceStatusToGitHub(salesforceStatus) {
    const mapping = this.config.salesforce.statusMapping;
    return mapping[salesforceStatus] || 'open';
  }

  _mapGitHubStateToSalesforce(githubState) {
    // Reverse mapping
    const mapping = this.config.salesforce.statusMapping;
    for (const [sfStatus, ghState] of Object.entries(mapping)) {
      if (ghState === githubState) {
        return sfStatus;
      }
    }
    return githubState === 'closed' ? 'Closed' : 'In Progress';
  }
}

module.exports = MCPSyncOrchestrator;
