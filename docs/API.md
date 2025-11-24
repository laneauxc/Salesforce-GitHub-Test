# API Documentation

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URLs](#base-urls)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Salesforce APIs](#salesforce-apis)
- [GitHub APIs](#github-apis)
- [Custom Endpoints](#custom-endpoints)
- [Webhooks](#webhooks)
- [Code Examples](#code-examples)
- [SDK Reference](#sdk-reference)

## 🎯 Overview

This document provides comprehensive API documentation for the Salesforce-GitHub-Test integration. The project leverages multiple APIs to enable seamless integration between Salesforce and GitHub.

### API Types

1. **Salesforce REST API**: For CRUD operations on Salesforce objects
2. **Salesforce Metadata API**: For deploying and retrieving metadata
3. **Salesforce Tooling API**: For development and deployment operations
4. **GitHub REST API**: For repository and workflow management
5. **Custom Integration APIs**: For project-specific functionality

## 🔐 Authentication

### Salesforce Authentication

#### OAuth 2.0 Web Server Flow

```bash
# Step 1: Get authorization code
curl -X POST https://login.salesforce.com/services/oauth2/authorize \
  -d "response_type=code" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "redirect_uri=YOUR_REDIRECT_URI"

# Step 2: Exchange code for access token
curl -X POST https://login.salesforce.com/services/oauth2/token \
  -d "grant_type=authorization_code" \
  -d "code=YOUR_AUTH_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=YOUR_REDIRECT_URI"
```

#### Username-Password Flow (CI/CD)

```bash
curl -X POST https://login.salesforce.com/services/oauth2/token \
  -d "grant_type=password" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "username=YOUR_USERNAME" \
  -d "password=YOUR_PASSWORD+SECURITY_TOKEN"
```

#### JWT Bearer Token Flow

```javascript
const jsforce = require('jsforce');
const jwt = require('jsonwebtoken');

const privateKey = fs.readFileSync('private.key', 'utf8');
const token = jwt.sign(
  {
    iss: clientId,
    sub: username,
    aud: 'https://login.salesforce.com',
    exp: Math.floor(Date.now() / 1000) + 300
  },
  privateKey,
  { algorithm: 'RS256' }
);

const conn = new jsforce.Connection();
await conn.loginByToken(token);
```

### GitHub Authentication

#### Personal Access Token

```bash
# Create token at: https://github.com/settings/tokens
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/user
```

#### GitHub App Authentication

```javascript
const { App } = require('@octokit/app');

const app = new App({
  appId: process.env.GITHUB_APP_ID,
  privateKey: process.env.GITHUB_PRIVATE_KEY
});

const jwt = app.getSignedJsonWebToken();
const installation = await app.octokit.request('GET /app/installations');
```

## 🌐 Base URLs

### Salesforce

| Environment | Base URL | API Version |
|-------------|----------|-------------|
| Production | `https://login.salesforce.com` | v58.0 |
| Sandbox | `https://test.salesforce.com` | v58.0 |
| REST API | `https://[instance].salesforce.com/services/data/v58.0` | v58.0 |
| Metadata API | `https://[instance].salesforce.com/services/Soap/m/58.0` | v58.0 |
| Tooling API | `https://[instance].salesforce.com/services/data/v58.0/tooling` | v58.0 |

### GitHub

| Service | Base URL |
|---------|----------|
| REST API | `https://api.github.com` |
| GraphQL | `https://api.github.com/graphql` |
| Uploads | `https://uploads.github.com` |

## ⏱️ Rate Limiting

### Salesforce API Limits

| API Type | Limit |
|----------|-------|
| REST API | 15,000 calls per 24 hours (per user) |
| Bulk API | 5,000 batches per 24 hours |
| Streaming API | 40 concurrent connections per org |
| Metadata API | 10,000 component limit per retrieve/deploy |

#### Handling Rate Limits

```javascript
async function callSalesforceAPI(conn, query) {
  try {
    return await conn.query(query);
  } catch (error) {
    if (error.errorCode === 'REQUEST_LIMIT_EXCEEDED') {
      // Wait and retry
      await sleep(60000); // Wait 1 minute
      return callSalesforceAPI(conn, query);
    }
    throw error;
  }
}
```

### GitHub API Limits

| Authentication | Requests per Hour |
|---------------|-------------------|
| Unauthenticated | 60 |
| Authenticated | 5,000 |
| GitHub Actions | 1,000 per workflow run |

#### Check Rate Limit

```bash
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/rate_limit
```

## ❌ Error Handling

### Salesforce Error Responses

```json
{
  "errorCode": "INVALID_FIELD",
  "message": "No such column 'InvalidField__c' on entity 'Account'",
  "fields": ["InvalidField__c"]
}
```

#### Common Error Codes

| Code | Description | Action |
|------|-------------|--------|
| `INVALID_SESSION_ID` | Session expired | Re-authenticate |
| `REQUEST_LIMIT_EXCEEDED` | API limit reached | Implement backoff |
| `INSUFFICIENT_ACCESS` | Permission denied | Check user permissions |
| `REQUIRED_FIELD_MISSING` | Missing required field | Add required field |
| `DUPLICATE_VALUE` | Duplicate record | Handle uniqueness |

### GitHub Error Responses

```json
{
  "message": "Not Found",
  "documentation_url": "https://docs.github.com/rest"
}
```

#### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 201 | Created | Resource created |
| 204 | No Content | Operation successful |
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Check authentication |
| 403 | Forbidden | Check permissions/rate limit |
| 404 | Not Found | Check resource exists |
| 422 | Unprocessable Entity | Validation failed |

## 📦 Salesforce APIs

### REST API

#### Query Records

```bash
GET /services/data/v58.0/query?q=SELECT+Id,Name+FROM+Account

# Response
{
  "totalSize": 2,
  "done": true,
  "records": [
    {
      "attributes": {
        "type": "Account",
        "url": "/services/data/v58.0/sobjects/Account/001xx000003DHXIAA4"
      },
      "Id": "001xx000003DHXIAA4",
      "Name": "Acme Corporation"
    }
  ]
}
```

#### Create Record

```bash
POST /services/data/v58.0/sobjects/Account
Content-Type: application/json

{
  "Name": "New Account",
  "Industry": "Technology",
  "Phone": "555-0123"
}

# Response
{
  "id": "001xx000003DHXIAA4",
  "success": true,
  "errors": []
}
```

#### Update Record

```bash
PATCH /services/data/v58.0/sobjects/Account/001xx000003DHXIAA4
Content-Type: application/json

{
  "Phone": "555-9999"
}

# Response: 204 No Content
```

#### Delete Record

```bash
DELETE /services/data/v58.0/sobjects/Account/001xx000003DHXIAA4

# Response: 204 No Content
```

### Metadata API

#### Deploy Metadata

```javascript
const jsforce = require('jsforce');
const fs = require('fs');

const conn = new jsforce.Connection();
await conn.login(username, password);

const zipStream = fs.createReadStream('metadata.zip');
const deployResult = await conn.metadata.deploy(zipStream, {
  rollbackOnError: true,
  singlePackage: true
});

// Check deploy status
const status = await conn.metadata.checkDeployStatus(deployResult.id);
console.log('Deploy Status:', status);
```

#### Retrieve Metadata

```javascript
const retrieveResult = await conn.metadata.retrieve({
  apiVersion: '58.0',
  singlePackage: true,
  unpackaged: {
    types: [
      { members: ['*'], name: 'ApexClass' },
      { members: ['*'], name: 'ApexTrigger' }
    ]
  }
});

// Download the zip
const zipFile = await conn.metadata.checkRetrieveStatus(retrieveResult.id);
fs.writeFileSync('metadata.zip', Buffer.from(zipFile.zipFile, 'base64'));
```

### Tooling API

#### Execute Anonymous Apex

```bash
POST /services/data/v58.0/tooling/executeAnonymous
Content-Type: application/json

{
  "anonymousBody": "System.debug('Hello World');"
}

# Response
{
  "line": -1,
  "column": -1,
  "compiled": true,
  "success": true,
  "compileProblem": null,
  "exceptionStackTrace": null,
  "exceptionMessage": null
}
```

#### Run Tests

```bash
POST /services/data/v58.0/tooling/runTestsAsynchronous
Content-Type: application/json

{
  "classNames": ["TestClass1", "TestClass2"]
}

# Response
{
  "asyncId": "707xx00000ABC123"
}
```

## 🐙 GitHub APIs

### Repositories

#### Get Repository

```bash
GET /repos/{owner}/{repo}

# Response
{
  "id": 1296269,
  "name": "Salesforce-GitHub-Test",
  "full_name": "laneauxc/Salesforce-GitHub-Test",
  "owner": {
    "login": "laneauxc",
    "id": 1
  },
  "private": false,
  "description": "Test repository"
}
```

#### List Branches

```bash
GET /repos/{owner}/{repo}/branches

# Response
[
  {
    "name": "main",
    "commit": {
      "sha": "6dcb09b5b57875f334f61aebed695e2e4193db5e",
      "url": "https://api.github.com/repos/..."
    },
    "protected": true
  }
]
```

### Actions

#### List Workflow Runs

```bash
GET /repos/{owner}/{repo}/actions/runs

# Response
{
  "total_count": 1,
  "workflow_runs": [
    {
      "id": 30433642,
      "name": "CI",
      "status": "completed",
      "conclusion": "success"
    }
  ]
}
```

#### Trigger Workflow

```bash
POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches
Content-Type: application/json

{
  "ref": "main",
  "inputs": {
    "environment": "production"
  }
}
```

### Pull Requests

#### Create Pull Request

```bash
POST /repos/{owner}/{repo}/pulls
Content-Type: application/json

{
  "title": "Amazing new feature",
  "body": "Description of changes",
  "head": "feature-branch",
  "base": "main"
}

# Response
{
  "id": 1,
  "number": 123,
  "state": "open",
  "title": "Amazing new feature",
  "html_url": "https://github.com/..."
}
```

## 🔧 Custom Endpoints

### Deployment Endpoint

```bash
POST /api/deploy
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "environment": "sandbox",
  "branch": "develop",
  "tests": "RunLocalTests"
}

# Response
{
  "deploymentId": "0Afxx0000000123",
  "status": "InProgress",
  "startTime": "2025-11-24T12:00:00Z"
}
```

### Status Endpoint

```bash
GET /api/deploy/{deploymentId}/status
Authorization: Bearer YOUR_TOKEN

# Response
{
  "deploymentId": "0Afxx0000000123",
  "status": "Succeeded",
  "componentSuccesses": 10,
  "componentFailures": 0,
  "completedTime": "2025-11-24T12:05:00Z"
}
```

## 🪝 Webhooks

### GitHub Webhooks

#### Push Event

```json
{
  "ref": "refs/heads/main",
  "before": "abc123",
  "after": "def456",
  "repository": {
    "name": "Salesforce-GitHub-Test",
    "full_name": "laneauxc/Salesforce-GitHub-Test"
  },
  "pusher": {
    "name": "developer",
    "email": "dev@example.com"
  },
  "commits": [
    {
      "id": "def456",
      "message": "Update feature",
      "author": {
        "name": "Developer",
        "email": "dev@example.com"
      }
    }
  ]
}
```

#### Pull Request Event

```json
{
  "action": "opened",
  "number": 123,
  "pull_request": {
    "id": 1,
    "title": "New feature",
    "state": "open",
    "head": {
      "ref": "feature-branch"
    },
    "base": {
      "ref": "main"
    }
  }
}
```

### Webhook Handler Example

```javascript
const express = require('express');
const app = express();

app.post('/webhook', express.json(), (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;
  
  console.log(`Received ${event} event`);
  
  switch(event) {
    case 'push':
      handlePush(payload);
      break;
    case 'pull_request':
      handlePullRequest(payload);
      break;
    default:
      console.log(`Unhandled event: ${event}`);
  }
  
  res.status(200).send('OK');
});

app.listen(3000);
```

## 💻 Code Examples

### JavaScript/Node.js

```javascript
const jsforce = require('jsforce');
const { Octokit } = require('@octokit/rest');

// Salesforce connection
const conn = new jsforce.Connection({
  loginUrl: process.env.SF_LOGIN_URL
});

await conn.login(
  process.env.SF_USERNAME,
  process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN
);

// Query Salesforce
const accounts = await conn.query(
  'SELECT Id, Name FROM Account LIMIT 10'
);
console.log('Accounts:', accounts.records);

// GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Get repository
const { data: repo } = await octokit.repos.get({
  owner: 'laneauxc',
  repo: 'Salesforce-GitHub-Test'
});
console.log('Repository:', repo.name);
```

### Python

```python
from simple_salesforce import Salesforce
from github import Github

# Salesforce connection
sf = Salesforce(
    username=os.environ['SF_USERNAME'],
    password=os.environ['SF_PASSWORD'],
    security_token=os.environ['SF_SECURITY_TOKEN']
)

# Query Salesforce
accounts = sf.query("SELECT Id, Name FROM Account LIMIT 10")
print(f"Found {accounts['totalSize']} accounts")

# GitHub connection
g = Github(os.environ['GITHUB_TOKEN'])
repo = g.get_repo("laneauxc/Salesforce-GitHub-Test")
print(f"Repository: {repo.name}")
```

### Apex

```apex
// HTTP Callout to external API
HttpRequest req = new HttpRequest();
req.setEndpoint('https://api.github.com/repos/laneauxc/Salesforce-GitHub-Test');
req.setMethod('GET');
req.setHeader('Authorization', 'token ' + githubToken);
req.setHeader('Accept', 'application/vnd.github.v3+json');

Http http = new Http();
HttpResponse res = http.send(req);

if (res.getStatusCode() == 200) {
    Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
    System.debug('Repository: ' + result.get('name'));
}
```

## 📚 SDK Reference

### Salesforce CLI

```bash
# Login to org
sf org login web --alias myorg

# Query data
sf data query --query "SELECT Id, Name FROM Account" --target-org myorg

# Deploy metadata
sf project deploy start --target-org myorg

# Run tests
sf apex test run --test-level RunLocalTests --target-org myorg
```

### JSForce (JavaScript)

```javascript
// Connection
const conn = new jsforce.Connection({ /* options */ });

// Login
await conn.login(username, password);

// Query
const result = await conn.query('SELECT Id FROM Account');

// Insert
const result = await conn.sobject('Account').create({ Name: 'Test' });

// Update
await conn.sobject('Account').update({ Id: id, Name: 'Updated' });

// Delete
await conn.sobject('Account').destroy(id);
```

### Octokit (JavaScript)

```javascript
// Initialize
const octokit = new Octokit({ auth: token });

// Get repository
await octokit.repos.get({ owner, repo });

// Create issue
await octokit.issues.create({ owner, repo, title, body });

// List pull requests
await octokit.pulls.list({ owner, repo, state: 'open' });
```

## 📖 Additional Resources

- [Salesforce REST API Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/)
- [Salesforce Metadata API Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/)
- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [JSForce Documentation](https://jsforce.github.io/)
- [Octokit Documentation](https://octokit.github.io/rest.js/)

---

**Version**: 1.0  
**Last Updated**: November 2025  
**API Version**: Salesforce v58.0, GitHub v3
