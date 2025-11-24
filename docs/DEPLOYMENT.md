# Deployment Guide

## 📋 Table of Contents

- [Overview](#overview)
- [Deployment Prerequisites](#deployment-prerequisites)
- [Deployment Strategies](#deployment-strategies)
- [Manual Deployment](#manual-deployment)
- [Automated Deployment](#automated-deployment)
- [Deployment Environments](#deployment-environments)
- [Rollback Procedures](#rollback-procedures)
- [Deployment Checklist](#deployment-checklist)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This guide provides comprehensive instructions for deploying the Salesforce-GitHub-Test application to various environments. It covers manual and automated deployment strategies, best practices, and troubleshooting guidance.

### Deployment Goals

- **Zero Downtime**: Minimize service interruption
- **Data Integrity**: Preserve all data during deployment
- **Rollback Capability**: Quick recovery from failed deployments
- **Auditability**: Track all deployment activities
- **Consistency**: Ensure identical deployments across environments

## ✅ Deployment Prerequisites

### Required Tools

- [ ] Salesforce CLI (v2.0+)
- [ ] Git (v2.0+)
- [ ] Node.js (v16+)
- [ ] Valid Salesforce credentials
- [ ] GitHub access token

### Pre-Deployment Checks

```bash
# Verify Salesforce CLI installation
sf --version

# Check org authentication
sf org list

# Verify Git status
git status

# Check for uncommitted changes
git diff

# Verify test coverage
sf apex test run --test-level RunLocalTests --code-coverage
```

### Access Requirements

- **Salesforce**: System Administrator or equivalent
- **GitHub**: Write access to repository
- **CI/CD**: Appropriate secrets configured
- **Environments**: Access to target org

## 🚀 Deployment Strategies

### 1. Direct Deployment

**Use Case**: Small changes, hotfixes, development environments

```bash
sf project deploy start --target-org myorg
```

**Pros**:
- Fast and simple
- Direct control

**Cons**:
- No validation phase
- Higher risk

### 2. Validated Deployment

**Use Case**: Production deployments, critical changes

```bash
# Step 1: Validate
sf project deploy validate \
  --manifest package.xml \
  --test-level RunLocalTests \
  --target-org production

# Step 2: Deploy using validation ID
sf project deploy quick \
  --job-id VALIDATION_ID \
  --target-org production
```

**Pros**:
- Tests run only once
- Faster final deployment
- Safer for production

**Cons**:
- Two-step process
- Validation expires after 96 hours

### 3. Change Set Deployment

**Use Case**: UI-driven deployments, non-technical deployments

1. Create outbound change set in source org
2. Upload change set
3. Deploy change set in target org

**Pros**:
- No CLI required
- Visual interface

**Cons**:
- Manual process
- Limited automation

### 4. Blue-Green Deployment

**Use Case**: Zero-downtime production deployments

```
Production (Blue - Active)
           ↓
    Deploy to Green
           ↓
    Validate Green
           ↓
    Switch Traffic
           ↓
Production (Green - Active)
```

**Pros**:
- Zero downtime
- Easy rollback

**Cons**:
- Requires duplicate resources
- More complex setup

### 5. Canary Deployment

**Use Case**: Gradual rollouts, risk mitigation

```
Deploy to 10% of users → Monitor → 50% → 100%
```

**Pros**:
- Gradual rollout
- Early issue detection

**Cons**:
- Longer deployment time
- Requires traffic management

## 🔧 Manual Deployment

### Step 1: Prepare Deployment

```bash
# Clone repository
git clone https://github.com/laneauxc/Salesforce-GitHub-Test.git
cd Salesforce-GitHub-Test

# Checkout target branch
git checkout main

# Pull latest changes
git pull origin main

# Review changes
git log --oneline -10
```

### Step 2: Authenticate to Target Org

```bash
# Production org
sf org login web --alias production --set-default

# Verify authentication
sf org display --target-org production
```

### Step 3: Validate Deployment

```bash
# Validate with tests
sf project deploy validate \
  --manifest package.xml \
  --test-level RunLocalTests \
  --target-org production \
  --verbose

# Check validation status
sf project deploy report --job-id VALIDATION_ID
```

### Step 4: Deploy to Target Org

```bash
# Quick deploy using validation
sf project deploy quick \
  --job-id VALIDATION_ID \
  --target-org production

# Or direct deploy
sf project deploy start \
  --manifest package.xml \
  --test-level RunLocalTests \
  --target-org production
```

### Step 5: Verify Deployment

```bash
# Check deployment status
sf project deploy report

# Run smoke tests
sf apex test run --tests SmokeTestClass

# Verify specific components
sf project retrieve start --manifest verify-package.xml
```

### Step 6: Post-Deployment Tasks

```bash
# Clear caches
sf apex run --file scripts/clear-cache.apex

# Run data migration (if needed)
sf apex run --file scripts/migrate-data.apex

# Send notifications
./scripts/notify-deployment.sh
```

## 🤖 Automated Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Salesforce

on:
  push:
    branches:
      - main
      - staging
      - develop

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
      
      - name: Install Salesforce CLI
        run: |
          npm install -g @salesforce/cli
          sf --version
      
      - name: Authenticate to Salesforce
        env:
          SF_AUTH_URL: ${{ secrets.SF_AUTH_URL }}
        run: |
          echo "$SF_AUTH_URL" > auth.txt
          sf org login sfdx-url --sfdx-url-file auth.txt --alias target
      
      - name: Run Tests
        run: |
          sf apex test run \
            --test-level RunLocalTests \
            --code-coverage \
            --result-format human \
            --target-org target
      
      - name: Deploy to Salesforce
        run: |
          sf project deploy start \
            --manifest package.xml \
            --test-level RunLocalTests \
            --target-org target
      
      - name: Notify on Success
        if: success()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-Type: application/json' \
            -d '{"text":"Deployment successful!"}'
      
      - name: Notify on Failure
        if: failure()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-Type: application/json' \
            -d '{"text":"Deployment failed!"}'
```

### Continuous Deployment Configuration

```yaml
# .github/workflows/cd.yml
name: Continuous Deployment

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
      test_level:
        description: 'Test level'
        required: true
        type: choice
        options:
          - NoTestRun
          - RunSpecifiedTests
          - RunLocalTests
          - RunAllTestsInOrg

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy
        run: |
          echo "Deploying to ${{ github.event.inputs.environment }}"
          echo "Test level: ${{ github.event.inputs.test_level }}"
          
          # Deployment commands here
```

## 🌍 Deployment Environments

### Development Environment

**Purpose**: Active development and testing

```bash
# Deploy to development
sf project deploy start \
  --target-org dev \
  --test-level NoTestRun

# Features:
# - Frequent deployments
# - No test requirements
# - Rapid iteration
```

### Staging Environment

**Purpose**: Pre-production validation

```bash
# Deploy to staging
sf project deploy start \
  --target-org staging \
  --test-level RunLocalTests

# Features:
# - Production-like environment
# - Full test suite execution
# - User acceptance testing (UAT)
```

### Production Environment

**Purpose**: Live user-facing application

```bash
# Validate first
sf project deploy validate \
  --manifest package.xml \
  --test-level RunLocalTests \
  --target-org production

# Then deploy
sf project deploy quick \
  --job-id VALIDATION_ID \
  --target-org production

# Features:
# - Approval required
# - Validation mandatory
# - Rollback plan required
# - Change window adherence
```

### Environment Comparison

| Aspect | Development | Staging | Production |
|--------|------------|---------|------------|
| Tests Required | No | Yes | Yes |
| Approval Needed | No | Recommended | Mandatory |
| Rollback Plan | Optional | Recommended | Required |
| Downtime Window | Anytime | Flexible | Scheduled |
| Validation | Optional | Recommended | Required |

## ⏪ Rollback Procedures

### Quick Rollback (Retrieve Previous Version)

```bash
# Step 1: Get previous commit hash
git log --oneline -5

# Step 2: Checkout previous version
git checkout PREVIOUS_COMMIT

# Step 3: Deploy previous version
sf project deploy start \
  --target-org production \
  --test-level RunLocalTests

# Step 4: Verify rollback
sf apex test run --tests SmokeTestClass
```

### Backup Restoration

```bash
# Step 1: Retrieve current metadata
sf project retrieve start \
  --manifest backup-package.xml \
  --target-org production

# Step 2: Save as backup
mv force-app backup-$(date +%Y%m%d-%H%M%S)

# Step 3: Restore from backup
sf project deploy start \
  --source-dir backup-20250101-120000
```

### Change Set Rollback

1. Create rollback change set from backup org
2. Upload to production
3. Deploy rollback change set
4. Validate functionality

### Emergency Rollback Script

```bash
#!/bin/bash
# scripts/emergency-rollback.sh

set -e

echo "Starting emergency rollback..."

# Authenticate
sf org login sfdx-url --sfdx-url-file production-auth.txt --alias prod

# Deploy last known good state
sf project deploy start \
  --source-dir last-known-good \
  --test-level RunLocalTests \
  --target-org prod

# Run smoke tests
sf apex test run --tests SmokeTestClass --target-org prod

echo "Rollback completed!"

# Send notification
curl -X POST "$SLACK_WEBHOOK" \
  -H 'Content-Type: application/json' \
  -d '{"text":"Emergency rollback executed"}'
```

## ✅ Deployment Checklist

### Pre-Deployment

- [ ] Code review completed
- [ ] All tests passing locally
- [ ] Documentation updated
- [ ] Change approval obtained
- [ ] Stakeholders notified
- [ ] Backup created
- [ ] Rollback plan prepared
- [ ] Deployment window scheduled

### During Deployment

- [ ] Authenticate to target org
- [ ] Validate deployment
- [ ] Monitor deployment progress
- [ ] Check for errors
- [ ] Run smoke tests
- [ ] Verify critical functionality

### Post-Deployment

- [ ] Run full test suite
- [ ] Verify all components deployed
- [ ] Check system health
- [ ] Update documentation
- [ ] Notify stakeholders
- [ ] Monitor for issues
- [ ] Archive deployment artifacts
- [ ] Update changelog

## 🎯 Best Practices

### 1. Always Validate First

```bash
# Never deploy directly to production without validation
sf project deploy validate \
  --manifest package.xml \
  --test-level RunLocalTests \
  --target-org production
```

### 2. Use Deployment Manifest

```xml
<!-- package.xml -->
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
    <version>58.0</version>
</Package>
```

### 3. Monitor Deployment

```bash
# Watch deployment in real-time
sf project deploy report --job-id DEPLOY_ID --wait 60
```

### 4. Maintain Deployment Logs

```bash
# Log all deployments
sf project deploy start \
  --manifest package.xml \
  --target-org production \
  | tee deployment-$(date +%Y%m%d-%H%M%S).log
```

### 5. Use Deployment Scripts

```bash
#!/bin/bash
# scripts/deploy-to-production.sh

# Configuration
TARGET_ORG="production"
TEST_LEVEL="RunLocalTests"

# Pre-deployment checks
echo "Running pre-deployment checks..."
./scripts/pre-deploy-checks.sh

# Validate
echo "Validating deployment..."
VALIDATION_ID=$(sf project deploy validate \
  --manifest package.xml \
  --test-level $TEST_LEVEL \
  --target-org $TARGET_ORG \
  --json | jq -r '.result.id')

# Wait for validation
sf project deploy report --job-id $VALIDATION_ID --wait 60

# Deploy
echo "Deploying to production..."
sf project deploy quick --job-id $VALIDATION_ID

# Post-deployment
echo "Running post-deployment tasks..."
./scripts/post-deploy-tasks.sh

echo "Deployment completed successfully!"
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Test Failures

**Problem**: Deployment fails due to test failures

**Solution**:
```bash
# Run tests locally first
sf apex test run \
  --test-level RunLocalTests \
  --result-format human \
  --code-coverage

# Fix failing tests before deploying
```

#### 2. Component Failures

**Problem**: Specific components fail to deploy

**Solution**:
```bash
# Check component details
sf project deploy report --job-id DEPLOY_ID

# Deploy components individually
sf project deploy start --source-dir force-app/main/default/classes
```

#### 3. Insufficient Coverage

**Problem**: Code coverage below 75%

**Solution**:
```bash
# Check coverage
sf apex test run --code-coverage --result-format human

# Add more test classes
# Aim for 85%+ coverage
```

#### 4. Org Limit Exceeded

**Problem**: Deployment exceeds org limits

**Solution**:
```bash
# Check limits
sf limits api display

# Split deployment into smaller batches
# Wait and retry
```

#### 5. Validation Timeout

**Problem**: Validation takes too long

**Solution**:
```bash
# Use specified tests instead of RunLocalTests
sf project deploy validate \
  --tests "TestClass1,TestClass2" \
  --target-org production
```

## 📊 Deployment Metrics

Track these metrics for each deployment:

- **Deployment Duration**: Time from start to completion
- **Test Execution Time**: Time spent running tests
- **Success Rate**: Percentage of successful deployments
- **Rollback Rate**: Percentage requiring rollback
- **Mean Time to Recovery (MTTR)**: Average time to fix issues

## 📚 Additional Resources

- [Salesforce Deployment Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_develop_deploy.htm)
- [GitHub Actions for Salesforce](https://github.com/marketplace?type=actions&query=salesforce)
- [Deployment Best Practices](https://developer.salesforce.com/blogs/2020/01/best-practices-for-salesforce-deployments.html)

---

**Version**: 1.0  
**Last Updated**: November 2025  
**Maintained By**: DevOps Team
