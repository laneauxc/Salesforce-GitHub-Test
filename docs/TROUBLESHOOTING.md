# Troubleshooting Guide

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication Issues](#authentication-issues)
- [Deployment Problems](#deployment-problems)
- [Test Failures](#test-failures)
- [API Issues](#api-issues)
- [GitHub Actions Problems](#github-actions-problems)
- [Performance Issues](#performance-issues)
- [Common Error Messages](#common-error-messages)
- [Debugging Tools](#debugging-tools)
- [Getting Help](#getting-help)

## 🎯 Overview

This guide provides solutions to common problems encountered when working with the Salesforce-GitHub-Test integration. Each section includes problem descriptions, potential causes, and step-by-step solutions.

### Quick Diagnostic Commands

```bash
# Check Salesforce CLI version
sf --version

# List authenticated orgs
sf org list

# Check org status
sf org display --target-org myorg

# View recent deployments
sf project deploy report

# Check API limits
sf limits api display --target-org myorg
```

## 🔐 Authentication Issues

### Issue 1: Cannot Authenticate to Salesforce

**Symptoms**:
- "Invalid username, password, security token" error
- "Invalid grant" error
- Unable to login via web browser

**Potential Causes**:
- Incorrect credentials
- Expired security token
- IP restrictions
- Disabled API access
- Incorrect login URL

**Solutions**:

#### Solution 1: Verify Credentials
```bash
# Check environment variables
echo $SF_USERNAME
echo $SF_LOGIN_URL

# Test authentication
sf org login web --alias testorg --instance-url https://login.salesforce.com
```

#### Solution 2: Reset Security Token
1. Log into Salesforce
2. Navigate to: Setup → Personal Setup → My Personal Information → Reset Security Token
3. Check email for new token
4. Update environment variables

#### Solution 3: Check IP Restrictions
```bash
# Check if IP is restricted
# Setup → Security Controls → Network Access
# Add your IP to trusted ranges
```

#### Solution 4: Verify API Access
```bash
# Check user permissions
# Setup → Users → [Your User] → Permission Sets
# Ensure "API Enabled" is checked
```

### Issue 2: Session Expired

**Symptoms**:
- "INVALID_SESSION_ID" error
- Operations fail after period of inactivity

**Solutions**:

```bash
# Re-authenticate
sf org logout --target-org myorg --no-prompt
sf org login web --alias myorg

# For automation, use JWT authentication
sf org login jwt --username user@example.com \
  --jwt-key-file server.key \
  --client-id CONSUMER_KEY \
  --instance-url https://login.salesforce.com
```

### Issue 3: OAuth Authorization Failed

**Symptoms**:
- "error=redirect_uri_mismatch"
- "error=invalid_client_id"

**Solutions**:

```bash
# Verify Connected App settings
# Setup → App Manager → [Your App] → View

# Check:
# - Callback URL matches exactly
# - Consumer Key is correct
# - App is enabled for OAuth
```

## 🚀 Deployment Problems

### Issue 1: Deployment Fails with Component Errors

**Symptoms**:
- "Component failures" in deployment result
- Specific metadata fails to deploy
- Dependency errors

**Solutions**:

#### Solution 1: Check Component Details
```bash
# View detailed error messages
sf project deploy report --job-id DEPLOY_ID --verbose

# Review specific component
sf project retrieve start --metadata ApexClass:YourClass
```

#### Solution 2: Deploy Dependencies First
```bash
# Create a dependency manifest
cat > dependencies.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <types>
        <members>DependencyClass1</members>
        <members>DependencyClass2</members>
        <name>ApexClass</name>
    </types>
    <version>58.0</version>
</Package>
EOF

# Deploy dependencies first
sf project deploy start --manifest dependencies.xml
```

#### Solution 3: Incremental Deployment
```bash
# Deploy in stages
sf project deploy start --source-dir force-app/main/default/objects
sf project deploy start --source-dir force-app/main/default/classes
sf project deploy start --source-dir force-app/main/default/triggers
```

### Issue 2: Test Failures During Deployment

**Symptoms**:
- "Code coverage failure"
- "Test methods failing"
- Deployment blocked by test results

**Solutions**:

#### Solution 1: Run Tests Locally
```bash
# Run all tests
sf apex test run --test-level RunLocalTests --result-format human

# Run specific test class
sf apex test run --tests TestClassName --result-format human

# Check code coverage
sf apex test run --code-coverage --result-format human
```

#### Solution 2: Fix Test Data Issues
```apex
// Use @TestSetup for common test data
@isTest
private class MyTestClass {
    @TestSetup
    static void setupTestData() {
        // Create test data
        Account testAccount = new Account(Name = 'Test');
        insert testAccount;
    }
    
    @isTest
    static void testMethod() {
        // Tests use the setup data
        Account acc = [SELECT Id FROM Account LIMIT 1];
        System.assertNotEquals(null, acc);
    }
}
```

#### Solution 3: Bypass Tests (Dev Only)
```bash
# For development environments only
sf project deploy start \
  --source-dir force-app \
  --test-level NoTestRun \
  --target-org dev
```

### Issue 3: Metadata API Limit Exceeded

**Symptoms**:
- "Component limit exceeded"
- "Too many items in package"

**Solutions**:

```bash
# Split large deployments
# Create multiple package.xml files

# Deploy in batches
sf project deploy start --manifest package-batch1.xml
sf project deploy start --manifest package-batch2.xml
sf project deploy start --manifest package-batch3.xml
```

### Issue 4: Deployment Timeout

**Symptoms**:
- Deployment times out
- No response from server

**Solutions**:

```bash
# Increase timeout
sf project deploy start \
  --manifest package.xml \
  --wait 120  # Wait up to 120 minutes

# Check deployment status separately
sf project deploy report --job-id DEPLOY_ID
```

## 🧪 Test Failures

### Issue 1: Insufficient Code Coverage

**Symptoms**:
- "Average test coverage across all Apex Classes and Triggers is 65%, at least 75% test coverage is required"

**Solutions**:

#### Solution 1: Identify Untested Code
```bash
# Run tests with coverage
sf apex test run \
  --code-coverage \
  --result-format human \
  --target-org myorg

# Review coverage report
# Focus on classes with <75% coverage
```

#### Solution 2: Add Test Methods
```apex
@isTest
private class MyClassTest {
    @isTest
    static void testAllMethods() {
        // Create test data
        Account acc = new Account(Name = 'Test');
        insert acc;
        
        // Test all public methods
        Test.startTest();
        MyClass.method1(acc.Id);
        MyClass.method2(acc.Id);
        Test.stopTest();
        
        // Assert results
        Account result = [SELECT Id, Status__c FROM Account WHERE Id = :acc.Id];
        System.assertEquals('Processed', result.Status__c);
    }
}
```

### Issue 2: Flaky Tests

**Symptoms**:
- Tests pass sometimes, fail other times
- "Unable to lock row" errors
- Timing-dependent failures

**Solutions**:

#### Solution 1: Add Test.startTest() and Test.stopTest()
```apex
@isTest
static void testAsyncOperation() {
    // Setup
    Account acc = new Account(Name = 'Test');
    insert acc;
    
    // Reset governor limits
    Test.startTest();
    MyClass.asyncMethod(acc.Id);
    Test.stopTest();  // Forces async to complete
    
    // Verify results
    Account result = [SELECT Id, Status__c FROM Account WHERE Id = :acc.Id];
    System.assertEquals('Complete', result.Status__c);
}
```

#### Solution 2: Avoid Timing Dependencies
```apex
// Bad: Relies on timing
System.assert(DateTime.now() > startTime);

// Good: Check actual results
System.assertEquals('Complete', record.Status__c);
```

#### Solution 3: Use Proper Test Isolation
```apex
@isTest
private class IsolatedTest {
    @TestSetup
    static void setup() {
        // Each test method gets fresh copy
    }
    
    @isTest
    static void test1() {
        // Isolated test data
    }
    
    @isTest
    static void test2() {
        // Different isolated test data
    }
}
```

### Issue 3: Test Data Issues

**Symptoms**:
- "List has no rows for assignment"
- "Required field is missing"
- Data validation errors in tests

**Solutions**:

```apex
@isTest
private class RobustTestClass {
    @TestSetup
    static void setupTestData() {
        // Create all required data
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User' LIMIT 1];
        
        User testUser = new User(
            FirstName = 'Test',
            LastName = 'User',
            Email = 'test@example.com',
            Username = 'testuser' + DateTime.now().getTime() + '@example.com',
            Alias = 'tuser',
            ProfileId = p.Id,
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US'
        );
        insert testUser;
        
        // Create test accounts with all required fields
        List<Account> accounts = new List<Account>();
        for(Integer i = 0; i < 10; i++) {
            accounts.add(new Account(
                Name = 'Test Account ' + i,
                Industry = 'Technology',
                BillingCountry = 'USA'
            ));
        }
        insert accounts;
    }
}
```

## 🌐 API Issues

### Issue 1: API Limits Exceeded

**Symptoms**:
- "REQUEST_LIMIT_EXCEEDED"
- "TooManyRequests" error
- Operations failing after many API calls

**Solutions**:

#### Solution 1: Check Current Limits
```bash
# View all limits
sf limits api display --target-org myorg

# Monitor usage
watch -n 60 'sf limits api display --target-org myorg'
```

#### Solution 2: Implement Exponential Backoff
```javascript
async function callAPIWithRetry(apiCall, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (error.errorCode === 'REQUEST_LIMIT_EXCEEDED' && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}
```

#### Solution 3: Use Bulk API
```javascript
// Instead of individual API calls, use bulk
const jsforce = require('jsforce');

// Bad: Multiple API calls
for (let record of records) {
  await conn.sobject('Account').create(record);
}

// Good: Bulk operation
await conn.sobject('Account').create(records);
```

### Issue 2: Connection Timeout

**Symptoms**:
- "ECONNRESET" error
- "Connection timeout"
- Requests hanging

**Solutions**:

```javascript
// Increase timeout
const jsforce = require('jsforce');

const conn = new jsforce.Connection({
  loginUrl: 'https://login.salesforce.com',
  timeout: 60000  // 60 seconds
});

// Add retry logic
conn.on('error', (err) => {
  console.error('Connection error:', err);
  // Implement retry
});
```

## ⚙️ GitHub Actions Problems

### Issue 1: Workflow Not Triggering

**Symptoms**:
- Push/PR doesn't trigger workflow
- Workflow shows in "disabled" state

**Solutions**:

#### Solution 1: Check Workflow Configuration
```yaml
# Verify triggers in .github/workflows/ci.yml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
```

#### Solution 2: Enable Workflows
1. Go to Actions tab
2. Enable workflows if disabled
3. Check repository settings → Actions → General

#### Solution 3: Check Branch Protection
```bash
# Verify branch name matches trigger
git branch --show-current

# Check for typos in workflow file
```

### Issue 2: Secrets Not Available

**Symptoms**:
- "Secret not found" error
- Authentication fails in workflow
- Empty secret values

**Solutions**:

```yaml
# Verify secret names match exactly
steps:
  - name: Check Secrets
    env:
      USERNAME: ${{ secrets.SF_USERNAME }}
      PASSWORD: ${{ secrets.SF_PASSWORD }}
    run: |
      if [ -z "$USERNAME" ]; then
        echo "SF_USERNAME secret is not set"
        exit 1
      fi
```

#### Add Secrets Properly
1. Settings → Secrets and variables → Actions
2. New repository secret
3. Use exact names referenced in workflow

### Issue 3: Workflow Timeout

**Symptoms**:
- "The job running on runner has exceeded the maximum execution time"
- Workflow cancelled after 6 hours

**Solutions**:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 30  # Set appropriate timeout
    
    steps:
      - name: Deploy
        timeout-minutes: 15  # Step-level timeout
        run: |
          sf project deploy start --wait 10
```

## 📊 Performance Issues

### Issue 1: Slow Deployments

**Symptoms**:
- Deployments taking >30 minutes
- Validation very slow

**Solutions**:

#### Solution 1: Use Specified Tests
```bash
# Instead of RunLocalTests
sf project deploy start \
  --tests "TestClass1,TestClass2,TestClass3" \
  --target-org myorg
```

#### Solution 2: Deploy Only Changed Components
```bash
# Get changed files
git diff --name-only HEAD~1 HEAD

# Deploy only changed
sf project deploy start \
  --source-dir force-app/main/default/classes/ChangedClass.cls
```

#### Solution 3: Use Quick Deploy
```bash
# Validate once
VALIDATION_ID=$(sf project deploy validate \
  --manifest package.xml \
  --test-level RunLocalTests \
  --json | jq -r '.result.id')

# Deploy multiple times using validation
sf project deploy quick --job-id $VALIDATION_ID
```

### Issue 2: Slow Tests

**Symptoms**:
- Test execution takes very long
- Individual tests timeout

**Solutions**:

```apex
// Use @TestSetup instead of creating data in each test
@isTest
private class OptimizedTests {
    @TestSetup
    static void setup() {
        // Create once, use in all tests
        insert new Account(Name = 'Test');
    }
    
    @isTest
    static void test1() {
        Account acc = [SELECT Id FROM Account LIMIT 1];
        // Test logic
    }
}

// Bulkify test operations
@isTest
static void testBulk() {
    List<Account> accounts = new List<Account>();
    for(Integer i = 0; i < 200; i++) {
        accounts.add(new Account(Name = 'Test ' + i));
    }
    
    Test.startTest();
    insert accounts;  // Single DML
    Test.stopTest();
}
```

## ⚠️ Common Error Messages

### Error: "INVALID_CROSS_REFERENCE_KEY"

**Meaning**: Referenced record doesn't exist

**Solution**:
```apex
// Ensure parent records exist before creating children
Account acc = new Account(Name = 'Parent');
insert acc;

Contact con = new Contact(
    LastName = 'Child',
    AccountId = acc.Id  // Valid reference
);
insert con;
```

### Error: "REQUIRED_FIELD_MISSING"

**Meaning**: Required field not provided

**Solution**:
```apex
// Include all required fields
Account acc = new Account(
    Name = 'Required Field'  // Name is required
);
insert acc;
```

### Error: "FIELD_CUSTOM_VALIDATION_EXCEPTION"

**Meaning**: Custom validation rule failed

**Solution**:
1. Check validation rules on the object
2. Ensure data meets validation criteria
3. For tests, create data that passes validation

```apex
// Check validation rules: Setup → Object Manager → [Object] → Validation Rules
Account acc = new Account(
    Name = 'Test',
    AnnualRevenue = 1000000  // Meets minimum revenue validation
);
insert acc;
```

## 🛠️ Debugging Tools

### Salesforce Debug Logs

```bash
# Enable debug logs
sf apex log list --target-org myorg

# Tail logs in real-time
sf apex log tail --target-org myorg --color

# Get specific log
sf apex log get --log-id LOG_ID
```

### Apex Debugging

```apex
// Add debug statements
System.debug('Variable value: ' + myVariable);
System.debug(LoggingLevel.ERROR, 'Error occurred: ' + errorMessage);

// Check debug logs
// Setup → Debug Logs
```

### GitHub Actions Debugging

```yaml
# Enable debug logging
steps:
  - name: Debug
    run: |
      echo "::debug::Debug message"
      echo "SF_USERNAME: ${{ secrets.SF_USERNAME }}"
      
# Enable step debugging
- name: Run with debug
  run: set -x && sf org list
```

### Network Debugging

```bash
# Test API connectivity
curl -v https://login.salesforce.com

# Test with authentication
curl -H "Authorization: Bearer TOKEN" \
  https://instance.salesforce.com/services/data/v58.0/sobjects
```

## 🆘 Getting Help

### Self-Help Resources

1. **Check Documentation**
   - [README.md](../README.md)
   - [API Documentation](API.md)
   - [Configuration Guide](CONFIGURATION.md)

2. **Search Existing Issues**
   - [GitHub Issues](https://github.com/laneauxc/Salesforce-GitHub-Test/issues)
   - Filter by label: `bug`, `question`

3. **Community Forums**
   - [Salesforce Developer Forums](https://developer.salesforce.com/forums)
   - [Salesforce Stack Exchange](https://salesforce.stackexchange.com/)

### Creating a Support Request

If you need help, include:

```markdown
**Problem Description**
[Clear description of the issue]

**Steps to Reproduce**
1. [First step]
2. [Second step]
3. [See error]

**Expected Behavior**
[What should happen]

**Actual Behavior**
[What actually happens]

**Environment**
- Salesforce CLI Version: [sf --version]
- Node.js Version: [node --version]
- OS: [Windows/Mac/Linux]
- Salesforce Org Type: [Dev/Sandbox/Production]

**Error Messages**
```
[Full error text]
```

**Screenshots**
[If applicable]

**Additional Context**
[Any other relevant information]
```

### Contact Information

- **GitHub Issues**: https://github.com/laneauxc/Salesforce-GitHub-Test/issues
- **Email Support**: support@example.com
- **Emergency**: emergency@example.com

---

**Version**: 1.0  
**Last Updated**: November 2025  
**Maintained By**: Support Team
