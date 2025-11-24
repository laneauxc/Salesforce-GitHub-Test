# Configuration Guide

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Salesforce Configuration](#salesforce-configuration)
- [GitHub Configuration](#github-configuration)
- [CI/CD Configuration](#cicd-configuration)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Advanced Configuration](#advanced-configuration)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This guide provides step-by-step instructions for configuring the Salesforce-GitHub-Test integration. Proper configuration is essential for seamless operation of the CI/CD pipeline and integration workflows.

## ✅ Prerequisites

Before configuring the system, ensure you have:

- [ ] Salesforce Developer Edition, Sandbox, or Production org access
- [ ] GitHub account with repository access
- [ ] Admin/System Administrator permissions in Salesforce
- [ ] Admin permissions in GitHub repository
- [ ] Salesforce CLI installed
- [ ] Node.js (v16+) installed
- [ ] Git installed

## 🔧 Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/laneauxc/Salesforce-GitHub-Test.git
cd Salesforce-GitHub-Test
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Salesforce CLI (if not already installed)
npm install -g @salesforce/cli

# Verify installations
sf --version
node --version
npm --version
```

### 3. Create Configuration Files

```bash
# Create environment file
cp .env.example .env

# Create local Git configuration
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## 🏢 Salesforce Configuration

### Step 1: Create Connected App

1. **Navigate to Setup**
   - Log into Salesforce
   - Click Setup (gear icon)
   - Search for "App Manager" in Quick Find

2. **Create New Connected App**
   ```
   Setup → App Manager → New Connected App
   ```

3. **Configure Basic Information**
   ```
   Connected App Name: Salesforce-GitHub-Test
   API Name: Salesforce_GitHub_Test
   Contact Email: your.email@example.com
   ```

4. **Enable OAuth Settings**
   ```
   ✓ Enable OAuth Settings
   Callback URL: https://login.salesforce.com/services/oauth2/callback
   
   Selected OAuth Scopes:
   - Access and manage your data (api)
   - Perform requests on your behalf at any time (refresh_token, offline_access)
   - Access your basic information (id, profile, email, address, phone)
   - Provide access to custom applications (visualforce)
   ```

5. **Save and Note Credentials**
   - Consumer Key (Client ID)
   - Consumer Secret (Client Secret)
   - Save these securely - you'll need them later

### Step 2: Configure User Permissions

1. **Create Permission Set (Optional)**
   ```
   Setup → Permission Sets → New
   
   Label: CI/CD Integration
   API Name: CICD_Integration
   
   Add permissions:
   - System Permissions: API Enabled
   - System Permissions: Modify All Data
   - Object Settings: Enable all necessary objects
   ```

2. **Assign Permission Set to User**
   ```
   Setup → Users → [Select User] → Permission Set Assignments
   Add: CI/CD Integration
   ```

### Step 3: Configure Security Settings

1. **IP Restrictions**
   ```
   Setup → Security Controls → Network Access
   Add Trusted IP Ranges for GitHub Actions:
   - GitHub Actions IP ranges (check GitHub docs)
   ```

2. **Session Settings**
   ```
   Setup → Session Settings
   - Timeout: 2 hours (recommended for CI/CD)
   - Lock sessions to IP: Disabled (for CI/CD flexibility)
   ```

### Step 4: Generate Security Token

1. **Reset Security Token**
   ```
   Profile Menu → Settings → Reset My Security Token
   ```

2. **Check Email**
   - New security token sent to email
   - Save securely with password

### Step 5: Configure Metadata Types

Create `sfdx-project.json` if not exists:

```json
{
  "packageDirectories": [
    {
      "path": "force-app",
      "default": true,
      "package": "Salesforce-GitHub-Test",
      "versionName": "ver 1.0",
      "versionNumber": "1.0.0.NEXT"
    }
  ],
  "name": "Salesforce-GitHub-Test",
  "namespace": "",
  "sfdcLoginUrl": "https://login.salesforce.com",
  "sourceApiVersion": "58.0",
  "packageAliases": {}
}
```

## 🐙 GitHub Configuration

### Step 1: Repository Settings

1. **Enable Actions**
   ```
   Settings → Actions → General
   ✓ Allow all actions and reusable workflows
   ```

2. **Configure Branch Protection**
   ```
   Settings → Branches → Add rule
   
   Branch name pattern: main
   ✓ Require pull request reviews before merging
   ✓ Require status checks to pass before merging
   ✓ Require branches to be up to date before merging
   ✓ Include administrators
   ```

### Step 2: Configure Secrets

1. **Add Repository Secrets**
   ```
   Settings → Secrets and variables → Actions → New repository secret
   ```

2. **Required Secrets**
   ```
   SF_USERNAME          = your.username@example.com
   SF_PASSWORD          = YourPassword123
   SF_SECURITY_TOKEN    = YourSecurityToken456
   SF_CONSUMER_KEY      = SalesforceConsumerKey
   SF_CONSUMER_SECRET   = SalesforceConsumerSecret
   SF_LOGIN_URL         = https://login.salesforce.com (or test.salesforce.com)
   ```

3. **Optional Secrets**
   ```
   SLACK_WEBHOOK_URL    = https://hooks.slack.com/...
   TEAMS_WEBHOOK_URL    = https://outlook.office.com/...
   CODECOV_TOKEN        = YourCodecovToken
   ```

### Step 3: Configure Environments

1. **Create Environments**
   ```
   Settings → Environments → New environment
   
   Environments:
   - development
   - staging
   - production
   ```

2. **Configure Protection Rules**
   ```
   production environment:
   ✓ Required reviewers: [Add reviewers]
   ✓ Wait timer: 5 minutes
   ```

### Step 4: Configure Webhooks (Optional)

```
Settings → Webhooks → Add webhook

Payload URL: https://your-server.com/webhook
Content type: application/json
Secret: [Generate secure secret]

Events:
✓ Push events
✓ Pull request events
✓ Workflow run events
```

## 🔄 CI/CD Configuration

### Step 1: Create Workflow Files

Create `.github/workflows/ci.yml`:

```yaml
name: Continuous Integration

on:
  push:
    branches: [ develop, staging, main ]
  pull_request:
    branches: [ develop, staging, main ]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      
      - name: Install Salesforce CLI
        run: npm install -g @salesforce/cli
      
      - name: Authenticate to Salesforce
        run: |
          echo "${{ secrets.SF_AUTH_URL }}" > auth.txt
          sf org login sfdx-url --sfdx-url-file auth.txt --alias ciorg
      
      - name: Run Apex Tests
        run: |
          sf apex test run \
            --test-level RunLocalTests \
            --code-coverage \
            --result-format human \
            --target-org ciorg
      
      - name: Deploy to Salesforce
        if: github.ref == 'refs/heads/main'
        run: |
          sf project deploy start \
            --target-org ciorg \
            --test-level RunLocalTests
```

### Step 2: Configure Deployment Workflows

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        type: choice
        options:
          - development
          - staging
          - production

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy
        run: |
          # Deployment steps
          echo "Deploying to ${{ github.event.inputs.environment }}"
```

## 💻 Local Development

### Step 1: Authenticate to Salesforce

```bash
# Web-based authentication (recommended)
sf org login web --alias myorg --set-default

# Username/password authentication
sf org login jwt --username user@example.com \
  --jwt-key-file server.key \
  --client-id CONSUMER_KEY \
  --alias myorg
```

### Step 2: Configure Default Org

```bash
# Set default org
sf config set target-org myorg

# Verify configuration
sf config list
```

### Step 3: Configure VS Code

Install extensions:
```
- Salesforce Extension Pack
- Salesforce CLI Integration
- Apex PMD
```

Configure `.vscode/settings.json`:

```json
{
  "salesforcedx-vscode-core.push-or-deploy-on-save.enabled": false,
  "salesforcedx-vscode-core.show-cli-success-msg": false,
  "salesforcedx-vscode-apex.enable-semantic-errors": true,
  "salesforcedx-vscode-apex.enable-sobject-refresh-on-startup": true,
  "editor.formatOnSave": true,
  "editor.tabSize": 2
}
```

## 📝 Environment Variables

### Required Variables

```bash
# .env file
# Salesforce Configuration
SF_USERNAME=your.username@example.com
SF_PASSWORD=YourPassword123
SF_SECURITY_TOKEN=YourSecurityToken456
SF_LOGIN_URL=https://login.salesforce.com
SF_CONSUMER_KEY=YourConsumerKey
SF_CONSUMER_SECRET=YourConsumerSecret

# GitHub Configuration
GITHUB_TOKEN=ghp_YourGitHubToken
GITHUB_OWNER=laneauxc
GITHUB_REPO=Salesforce-GitHub-Test

# Environment Settings
NODE_ENV=development
LOG_LEVEL=info
PORT=3000
```

### Optional Variables

```bash
# API Configuration
API_VERSION=58.0
MAX_RETRIES=3
TIMEOUT=30000

# Feature Flags
ENABLE_MONITORING=true
ENABLE_NOTIFICATIONS=true

# Integration Settings
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
TEAMS_WEBHOOK_URL=https://outlook.office.com/...
```

### Environment-Specific Files

```bash
# Development
.env.development

# Staging
.env.staging

# Production
.env.production
```

## 🔧 Advanced Configuration

### Custom Metadata Configuration

```bash
# Deploy custom metadata
sf project deploy start \
  --metadata-dir config/customMetadata \
  --target-org myorg
```

### Pre/Post Deployment Scripts

Create `scripts/pre-deploy.sh`:

```bash
#!/bin/bash
echo "Running pre-deployment checks..."

# Validate metadata
sf project deploy validate \
  --manifest package.xml \
  --target-org myorg

# Run security scan
pmd-bin-6.50.0/bin/run.sh pmd \
  -d force-app/main/default/classes \
  -R category/apex/security.xml \
  -f text
```

Create `scripts/post-deploy.sh`:

```bash
#!/bin/bash
echo "Running post-deployment tasks..."

# Run smoke tests
sf apex test run \
  --tests SmokeTestClass \
  --target-org myorg

# Send notification
curl -X POST "$SLACK_WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -d '{"text":"Deployment completed successfully"}'
```

### Package Configuration

`config/package.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <types>
        <members>*</members>
        <name>ApexClass</name>
    </types>
    <types>
        <members>*</members>
        <name>ApexTrigger</name>
    </types>
    <types>
        <members>*</members>
        <name>LightningComponentBundle</name>
    </types>
    <version>58.0</version>
</Package>
```

### Org Configuration

`config/project-scratch-def.json`:

```json
{
  "orgName": "Salesforce GitHub Test",
  "edition": "Developer",
  "features": ["EnableSetPasswordInApi", "MultiCurrency"],
  "settings": {
    "lightningExperienceSettings": {
      "enableS1DesktopEnabled": true
    },
    "mobileSettings": {
      "enableS1EncryptedStoragePref2": false
    }
  }
}
```

## 🔍 Troubleshooting

### Authentication Issues

**Problem**: Cannot authenticate to Salesforce

**Solution**:
```bash
# Clear cached credentials
sf org logout --all --no-prompt

# Re-authenticate
sf org login web --alias myorg

# Check org status
sf org display --target-org myorg
```

### Deployment Failures

**Problem**: Deployment fails with metadata errors

**Solution**:
```bash
# Validate before deployment
sf project deploy validate \
  --manifest package.xml \
  --target-org myorg

# Check deployment status
sf project deploy report --job-id DEPLOY_ID
```

### API Limit Issues

**Problem**: Hitting API limits

**Solution**:
```bash
# Check limits
sf limits api display --target-org myorg

# Use bulk API for large operations
# Add delay between API calls
```

### GitHub Actions Failures

**Problem**: Workflow fails

**Solution**:
1. Check workflow logs in Actions tab
2. Verify secrets are correctly set
3. Check network connectivity
4. Verify Salesforce credentials

## 📚 Additional Resources

- [Salesforce CLI Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Connected App Setup](https://help.salesforce.com/articleView?id=connected_app_create.htm)

## 🆘 Getting Help

If you encounter issues:
1. Check [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Search [existing issues](https://github.com/laneauxc/Salesforce-GitHub-Test/issues)
3. Create a [new issue](https://github.com/laneauxc/Salesforce-GitHub-Test/issues/new)
4. Contact support@example.com

---

**Version**: 1.0  
**Last Updated**: November 2025  
**Maintained By**: DevOps Team
