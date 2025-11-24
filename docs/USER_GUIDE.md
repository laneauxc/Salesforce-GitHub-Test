# User Guide

## 📋 Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Basic Workflows](#basic-workflows)
- [Development Guide](#development-guide)
- [Testing Guide](#testing-guide)
- [Deployment Guide](#deployment-guide)
- [Best Practices](#best-practices)
- [FAQs](#faqs)
- [Glossary](#glossary)

## 🎯 Introduction

Welcome to the Salesforce-GitHub-Test User Guide! This comprehensive guide will help you understand and effectively use the Salesforce-GitHub integration platform.

### What is Salesforce-GitHub-Test?

Salesforce-GitHub-Test is an enterprise-grade integration platform that connects Salesforce development with GitHub-based CI/CD workflows. It enables:

- **Automated Testing**: Run tests automatically on every code change
- **Continuous Integration**: Validate code quality before merging
- **Continuous Deployment**: Deploy code automatically to target environments
- **Version Control**: Track all changes with Git
- **Collaboration**: Team-based development with code reviews

### Who Should Use This Guide?

- **Developers**: Building Salesforce applications
- **Administrators**: Managing Salesforce environments
- **DevOps Engineers**: Setting up CI/CD pipelines
- **QA Engineers**: Running and validating tests
- **Project Managers**: Understanding the development process

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

1. **Accounts**
   - [ ] GitHub account
   - [ ] Salesforce Developer Edition (free) or org access
   
2. **Software**
   - [ ] Git installed
   - [ ] Salesforce CLI installed
   - [ ] VS Code (recommended)
   - [ ] Node.js (v16 or higher)

### Installation

#### Step 1: Install Salesforce CLI

**macOS** (using Homebrew):
```bash
brew tap salesforce/sf
brew install salesforce/sf/cli
```

**Windows** (using npm):
```bash
npm install -g @salesforce/cli
```

**Linux** (using npm):
```bash
sudo npm install -g @salesforce/cli
```

Verify installation:
```bash
sf --version
```

#### Step 2: Install VS Code Extensions

1. Open VS Code
2. Go to Extensions (Ctrl/Cmd + Shift + X)
3. Search and install:
   - Salesforce Extension Pack
   - GitLens
   - ESLint

#### Step 3: Clone Repository

```bash
# Clone the repository
git clone https://github.com/laneauxc/Salesforce-GitHub-Test.git

# Navigate to directory
cd Salesforce-GitHub-Test

# Install dependencies
npm install
```

#### Step 4: Configure Your Environment

```bash
# Create environment file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

### First-Time Setup

#### Authenticate to Salesforce

```bash
# Login via web browser (recommended for developers)
sf org login web --alias myorg --set-default

# Verify authentication
sf org display --target-org myorg
```

#### Configure Git

```bash
# Set your name and email
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Set default branch name
git config init.defaultBranch main
```

## 🔄 Basic Workflows

### Workflow 1: Making Your First Change

#### Step 1: Create a Feature Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create new feature branch
git checkout -b feature/my-first-change

# Verify branch
git branch
```

#### Step 2: Make Changes

```bash
# Retrieve metadata from Salesforce
sf project retrieve start --target-org myorg

# Open VS Code
code .

# Make your changes to files
# Example: Edit force-app/main/default/classes/MyClass.cls
```

#### Step 3: Test Changes Locally

```bash
# Deploy to org
sf project deploy start --source-dir force-app --target-org myorg

# Run tests
sf apex test run --test-level RunLocalTests --target-org myorg
```

#### Step 4: Commit Changes

```bash
# Check status
git status

# Add changes
git add force-app/

# Commit with descriptive message
git commit -m "feat: add new functionality to MyClass"

# Push to GitHub
git push origin feature/my-first-change
```

#### Step 5: Create Pull Request

1. Go to GitHub repository
2. Click "Pull requests" → "New pull request"
3. Select your feature branch
4. Fill in PR description
5. Click "Create pull request"
6. Wait for CI checks to pass
7. Request review from team members

### Workflow 2: Code Review Process

#### As a Developer

1. **Create PR**: After pushing your changes
2. **Address Feedback**: Make changes based on review comments
3. **Update PR**: Push additional commits to same branch
4. **Merge**: Once approved, merge your PR

```bash
# Address feedback
git checkout feature/my-feature

# Make changes
# ... edit files ...

# Commit and push
git add .
git commit -m "fix: address review feedback"
git push origin feature/my-feature
```

#### As a Reviewer

1. **Review Code**: Check for quality, bugs, and style
2. **Test Changes**: Optionally test the changes
3. **Provide Feedback**: Use constructive comments
4. **Approve or Request Changes**: Based on your review

### Workflow 3: Syncing with Main Branch

```bash
# Switch to main
git checkout main

# Pull latest changes
git pull origin main

# Switch back to your branch
git checkout feature/my-feature

# Merge main into your branch
git merge main

# Resolve any conflicts
# ... edit conflicted files ...
git add .
git commit -m "merge: sync with main branch"

# Push updated branch
git push origin feature/my-feature
```

## 👨‍💻 Development Guide

### Creating Apex Classes

#### Step 1: Create Class File

```bash
# Using Salesforce CLI
sf apex class create --name MyNewClass --output-dir force-app/main/default/classes
```

#### Step 2: Implement Class

```apex
/**
 * @description My new Apex class
 * @author Your Name
 * @date 2025-11-24
 */
public with sharing class MyNewClass {
    
    /**
     * @description Constructor
     */
    public MyNewClass() {
        // Initialization
    }
    
    /**
     * @description Public method example
     * @param recordId The record ID to process
     * @return String result message
     */
    public static String processRecord(Id recordId) {
        try {
            // Implementation
            return 'Success';
        } catch (Exception e) {
            throw new AuraHandledException('Error: ' + e.getMessage());
        }
    }
}
```

#### Step 3: Create Test Class

```apex
/**
 * @description Test class for MyNewClass
 */
@isTest
private class MyNewClassTest {
    
    @TestSetup
    static void setupTestData() {
        // Create test data
        Account testAccount = new Account(
            Name = 'Test Account'
        );
        insert testAccount;
    }
    
    @isTest
    static void testProcessRecord_Success() {
        // Given
        Account acc = [SELECT Id FROM Account LIMIT 1];
        
        // When
        Test.startTest();
        String result = MyNewClass.processRecord(acc.Id);
        Test.stopTest();
        
        // Then
        System.assertEquals('Success', result, 'Should return success message');
    }
    
    @isTest
    static void testProcessRecord_Error() {
        // Given
        Id invalidId = null;
        
        // When/Then
        Test.startTest();
        try {
            MyNewClass.processRecord(invalidId);
            System.assert(false, 'Should have thrown exception');
        } catch (Exception e) {
            System.assert(true, 'Exception thrown as expected');
        }
        Test.stopTest();
    }
}
```

### Creating Lightning Web Components

#### Step 1: Create Component

```bash
# Create LWC
sf lightning component create --name myComponent \
  --type lwc \
  --output-dir force-app/main/default/lwc
```

#### Step 2: Implement Component

**myComponent.html**:
```html
<template>
    <lightning-card title="My Component" icon-name="custom:custom14">
        <div class="slds-m-around_medium">
            <p>Hello, {name}!</p>
            <lightning-input 
                label="Name" 
                value={name} 
                onchange={handleNameChange}>
            </lightning-input>
        </div>
    </lightning-card>
</template>
```

**myComponent.js**:
```javascript
import { LightningElement, track } from 'lwc';

export default class MyComponent extends LightningElement {
    @track name = 'World';
    
    handleNameChange(event) {
        this.name = event.target.value;
    }
}
```

**myComponent.js-meta.xml**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>58.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__AppPage</target>
        <target>lightning__RecordPage</target>
        <target>lightning__HomePage</target>
    </targets>
</LightningComponentBundle>
```

### Working with Triggers

#### Step 1: Create Trigger

```bash
# Create trigger
sf apex trigger create --name AccountTrigger \
  --sobject Account \
  --output-dir force-app/main/default/triggers
```

#### Step 2: Implement Trigger Handler Pattern

**AccountTrigger.trigger**:
```apex
trigger AccountTrigger on Account (before insert, after insert, before update, after update) {
    new AccountTriggerHandler().run();
}
```

**AccountTriggerHandler.cls**:
```apex
public class AccountTriggerHandler extends TriggerHandler {
    
    protected override void beforeInsert() {
        AccountService.validateAccounts((List<Account>) Trigger.new);
    }
    
    protected override void afterInsert() {
        AccountService.processNewAccounts((List<Account>) Trigger.new);
    }
    
    protected override void beforeUpdate() {
        AccountService.validateAccountUpdates(
            (List<Account>) Trigger.new,
            (Map<Id, Account>) Trigger.oldMap
        );
    }
}
```

## 🧪 Testing Guide

### Running Tests

#### Run All Tests

```bash
# Run all tests in org
sf apex test run --test-level RunAllTestsInOrg --result-format human
```

#### Run Specific Tests

```bash
# Run specific test class
sf apex test run --tests MyClassTest --result-format human

# Run multiple test classes
sf apex test run --tests MyClassTest,AnotherTest --result-format human

# Run tests in namespace
sf apex test run --tests MyNamespace.MyClassTest --result-format human
```

#### Check Code Coverage

```bash
# Run tests with coverage
sf apex test run \
  --test-level RunLocalTests \
  --code-coverage \
  --result-format human

# Get detailed coverage
sf apex get test --test-run-id TEST_RUN_ID --code-coverage
```

### Writing Good Tests

#### Best Practices

1. **Test Setup**: Use @TestSetup for common data
2. **Test Isolation**: Each test should be independent
3. **Meaningful Assertions**: Use descriptive messages
4. **Cover Edge Cases**: Test positive and negative scenarios
5. **Test Bulk Operations**: Test with 200+ records

#### Example: Comprehensive Test Class

```apex
@isTest
private class ComprehensiveTestExample {
    
    // Setup common test data
    @TestSetup
    static void setupTestData() {
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < 200; i++) {
            accounts.add(new Account(
                Name = 'Test Account ' + i,
                Industry = 'Technology'
            ));
        }
        insert accounts;
    }
    
    // Test positive scenario
    @isTest
    static void testPositiveScenario() {
        // Given
        Account acc = [SELECT Id FROM Account LIMIT 1];
        
        // When
        Test.startTest();
        String result = MyClass.processAccount(acc.Id);
        Test.stopTest();
        
        // Then
        System.assertEquals('Success', result, 'Should process successfully');
    }
    
    // Test negative scenario
    @isTest
    static void testNegativeScenario() {
        // Given
        Id invalidId = null;
        
        // When/Then
        Test.startTest();
        try {
            MyClass.processAccount(invalidId);
            System.assert(false, 'Should throw exception');
        } catch (Exception e) {
            System.assert(e.getMessage().contains('Invalid'), 
                'Should throw invalid ID exception');
        }
        Test.stopTest();
    }
    
    // Test bulk operations
    @isTest
    static void testBulkProcessing() {
        // Given
        List<Account> accounts = [SELECT Id FROM Account];
        
        // When
        Test.startTest();
        List<String> results = MyClass.processAccounts(accounts);
        Test.stopTest();
        
        // Then
        System.assertEquals(200, results.size(), 'Should process all records');
        for (String result : results) {
            System.assertEquals('Success', result, 'All should succeed');
        }
    }
    
    // Test with different user context
    @isTest
    static void testWithDifferentUser() {
        // Given
        User testUser = createTestUser();
        Account acc = [SELECT Id FROM Account LIMIT 1];
        
        // When
        System.runAs(testUser) {
            Test.startTest();
            String result = MyClass.processAccount(acc.Id);
            Test.stopTest();
            
            // Then
            System.assertEquals('Success', result);
        }
    }
    
    // Helper method
    private static User createTestUser() {
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User' LIMIT 1];
        return new User(
            FirstName = 'Test',
            LastName = 'User',
            Email = 'test@example.com',
            Username = 'testuser' + DateTime.now().getTime() + '@test.com',
            Alias = 'tuser',
            ProfileId = p.Id,
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US'
        );
    }
}
```

## 🚀 Deployment Guide

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions.

### Quick Deployment

```bash
# Deploy to development
sf project deploy start --target-org dev

# Deploy to production (with validation)
sf project deploy validate \
  --manifest package.xml \
  --test-level RunLocalTests \
  --target-org production

# Deploy using validation ID
sf project deploy quick --job-id VALIDATION_ID
```

## 💡 Best Practices

### Code Quality

1. **Follow Naming Conventions**
   - Classes: PascalCase (e.g., `AccountService`)
   - Methods: camelCase (e.g., `getAccountById`)
   - Variables: camelCase (e.g., `accountList`)
   - Constants: UPPER_SNAKE_CASE (e.g., `MAX_RECORDS`)

2. **Write Clean Code**
   - Keep methods short (<50 lines)
   - Use meaningful variable names
   - Add comments for complex logic
   - Follow single responsibility principle

3. **Error Handling**
   ```apex
   try {
       // Your code
   } catch (DmlException e) {
       // Handle DML errors
       System.debug('DML Error: ' + e.getMessage());
   } catch (Exception e) {
       // Handle other errors
       System.debug('Error: ' + e.getMessage());
   }
   ```

### Git Best Practices

1. **Commit Messages**
   - Use conventional commits format
   - Be descriptive but concise
   - Reference issue numbers

   ```bash
   feat: add account validation
   fix: resolve null pointer exception in trigger
   docs: update API documentation
   test: add test coverage for AccountService
   ```

2. **Branch Strategy**
   - `main`: Production-ready code
   - `develop`: Integration branch
   - `feature/*`: New features
   - `bugfix/*`: Bug fixes
   - `hotfix/*`: Production hotfixes

3. **Pull Requests**
   - Keep PRs small and focused
   - Add clear description
   - Include tests
   - Request reviews

## ❓ FAQs

### General Questions

**Q: How do I get started?**
A: Follow the [Getting Started](#getting-started) section above.

**Q: Do I need a paid Salesforce org?**
A: No, you can use a free Developer Edition org.

**Q: Can I use this for production?**
A: Yes, but ensure proper testing and validation.

### Technical Questions

**Q: How do I resolve merge conflicts?**
A: See [Workflow 3: Syncing with Main Branch](#workflow-3-syncing-with-main-branch).

**Q: My tests are failing, what should I do?**
A: Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for solutions.

**Q: How do I increase code coverage?**
A: Write comprehensive test classes covering all scenarios.

### CI/CD Questions

**Q: How does automated deployment work?**
A: GitHub Actions automatically runs when you push code. See [DEPLOYMENT.md](DEPLOYMENT.md).

**Q: Can I manually trigger deployments?**
A: Yes, use workflow_dispatch in GitHub Actions.

**Q: How do I rollback a deployment?**
A: See [Rollback Procedures](DEPLOYMENT.md#rollback-procedures).

## 📚 Glossary

- **Apex**: Salesforce's proprietary programming language
- **LWC**: Lightning Web Components
- **SOQL**: Salesforce Object Query Language
- **SOSL**: Salesforce Object Search Language
- **Metadata**: Configuration and code that defines Salesforce functionality
- **Org**: Salesforce organization/instance
- **DML**: Data Manipulation Language
- **Governor Limits**: Salesforce platform limits
- **CI/CD**: Continuous Integration/Continuous Deployment
- **PR**: Pull Request
- **CLI**: Command Line Interface

## 📞 Support

Need help? Here's how to get support:

1. **Documentation**: Check all docs in the `/docs` folder
2. **GitHub Issues**: Search or create issues
3. **Community**: Join Salesforce developer community
4. **Email**: support@example.com

---

**Version**: 1.0  
**Last Updated**: November 2025  
**Maintained By**: Documentation Team

Happy coding! 🚀
