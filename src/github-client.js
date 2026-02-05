/**
 * GitHub API Integration Module
 * Handles all interactions with GitHub API for MCP sync
 */

const { Octokit } = require('@octokit/rest');
const { loadConfig, logMCPEvent } = require('./mcp-utils');

class GitHubClient {
  constructor(token) {
    this.octokit = new Octokit({ auth: token });
    this.config = loadConfig();
  }

  /**
   * Create or update issue with MCP metadata
   */
  async createIssue(owner, repo, data) {
    try {
      const { title, body, labels, assignees } = data;
      
      const response = await this.octokit.issues.create({
        owner,
        repo,
        title,
        body,
        labels: labels || [],
        assignees: assignees || []
      });

      logMCPEvent('creation', {
        type: 'issue',
        number: response.data.number,
        repo: `${owner}/${repo}`
      });

      return response.data;
    } catch (error) {
      logMCPEvent('error', {
        action: 'createIssue',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Update issue
   */
  async updateIssue(owner, repo, issueNumber, data) {
    try {
      const { title, body, state, labels } = data;
      
      const updateData = {};
      if (title) updateData.title = title;
      if (body) updateData.body = body;
      if (state) updateData.state = state;
      if (labels) updateData.labels = labels;

      const response = await this.octokit.issues.update({
        owner,
        repo,
        issue_number: issueNumber,
        ...updateData
      });

      logMCPEvent('statusChange', {
        type: 'issue',
        number: issueNumber,
        repo: `${owner}/${repo}`,
        changes: Object.keys(updateData)
      });

      return response.data;
    } catch (error) {
      logMCPEvent('error', {
        action: 'updateIssue',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Add comment to issue or PR
   */
  async addComment(owner, repo, issueNumber, body) {
    try {
      const response = await this.octokit.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body
      });

      logMCPEvent('comment', {
        type: 'github',
        number: issueNumber,
        repo: `${owner}/${repo}`
      });

      return response.data;
    } catch (error) {
      logMCPEvent('error', {
        action: 'addComment',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get issue details
   */
  async getIssue(owner, repo, issueNumber) {
    try {
      const response = await this.octokit.issues.get({
        owner,
        repo,
        issue_number: issueNumber
      });
      return response.data;
    } catch (error) {
      logMCPEvent('error', {
        action: 'getIssue',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get PR details
   */
  async getPullRequest(owner, repo, prNumber) {
    try {
      const response = await this.octokit.pulls.get({
        owner,
        repo,
        pull_number: prNumber
      });
      return response.data;
    } catch (error) {
      logMCPEvent('error', {
        action: 'getPullRequest',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Add labels to issue/PR
   */
  async addLabels(owner, repo, issueNumber, labels) {
    try {
      const response = await this.octokit.issues.addLabels({
        owner,
        repo,
        issue_number: issueNumber,
        labels
      });
      return response.data;
    } catch (error) {
      logMCPEvent('error', {
        action: 'addLabels',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Create label if it doesn't exist
   */
  async ensureLabel(owner, repo, labelName, color = 'e99695') {
    try {
      await this.octokit.issues.getLabel({
        owner,
        repo,
        name: labelName
      });
    } catch (error) {
      if (error.status === 404) {
        // Label doesn't exist, create it
        await this.octokit.issues.createLabel({
          owner,
          repo,
          name: labelName,
          color
        });
      }
    }
  }

  /**
   * List comments on issue/PR
   */
  async listComments(owner, repo, issueNumber) {
    try {
      const response = await this.octokit.issues.listComments({
        owner,
        repo,
        issue_number: issueNumber,
        per_page: 100
      });
      return response.data;
    } catch (error) {
      logMCPEvent('error', {
        action: 'listComments',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Check if PR is merged
   */
  async isPRMerged(owner, repo, prNumber) {
    try {
      const pr = await this.getPullRequest(owner, repo, prNumber);
      return pr.merged === true;
    } catch (error) {
      logMCPEvent('error', {
        action: 'isPRMerged',
        error: error.message
      });
      return false;
    }
  }

  /**
   * Close issue/PR
   */
  async closeIssue(owner, repo, issueNumber, comment = null) {
    try {
      if (comment) {
        await this.addComment(owner, repo, issueNumber, comment);
      }

      const response = await this.updateIssue(owner, repo, issueNumber, {
        state: 'closed'
      });

      logMCPEvent('closure', {
        type: 'issue',
        number: issueNumber,
        repo: `${owner}/${repo}`
      });

      return response;
    } catch (error) {
      logMCPEvent('error', {
        action: 'closeIssue',
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Reopen issue/PR
   */
  async reopenIssue(owner, repo, issueNumber) {
    try {
      const response = await this.updateIssue(owner, repo, issueNumber, {
        state: 'open'
      });

      logMCPEvent('statusChange', {
        type: 'issue',
        number: issueNumber,
        repo: `${owner}/${repo}`,
        action: 'reopen'
      });

      return response;
    } catch (error) {
      logMCPEvent('error', {
        action: 'reopenIssue',
        error: error.message
      });
      throw error;
    }
  }
}

module.exports = GitHubClient;
