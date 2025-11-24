# Contributing to Salesforce-GitHub-Test

First off, thank you for considering contributing to Salesforce-GitHub-Test! It's people like you that make this project such a great tool for the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Process](#development-process)
- [Style Guidelines](#style-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to conduct@example.com.

## 🚀 Getting Started

### Prerequisites

Before you begin contributing, ensure you have:

1. A GitHub account
2. Git installed on your local machine
3. Salesforce CLI installed
4. Node.js (v16 or higher)
5. A Salesforce Developer Edition org (free)
6. Basic understanding of Salesforce development

### Setting Up Your Development Environment

1. **Fork the Repository**
   ```bash
   # Visit https://github.com/laneauxc/Salesforce-GitHub-Test
   # Click the "Fork" button in the top right
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Salesforce-GitHub-Test.git
   cd Salesforce-GitHub-Test
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/laneauxc/Salesforce-GitHub-Test.git
   ```

4. **Verify Remotes**
   ```bash
   git remote -v
   # origin    https://github.com/YOUR-USERNAME/Salesforce-GitHub-Test.git (fetch)
   # origin    https://github.com/YOUR-USERNAME/Salesforce-GitHub-Test.git (push)
   # upstream  https://github.com/laneauxc/Salesforce-GitHub-Test.git (fetch)
   # upstream  https://github.com/laneauxc/Salesforce-GitHub-Test.git (push)
   ```

5. **Install Development Dependencies**
   ```bash
   npm install
   ```

6. **Authenticate with Salesforce**
   ```bash
   sf org login web --alias devorg
   ```

## 🤔 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
**Description**
A clear and concise description of the bug.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- OS: [e.g., Windows 10, macOS 12.0, Ubuntu 20.04]
- Salesforce CLI Version: [e.g., 1.77.0]
- Node.js Version: [e.g., 16.14.0]
- Salesforce Org Type: [e.g., Developer Edition, Sandbox]

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Additional Context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

**Enhancement Template:**

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Proposed Solution**
A clear description of what you want to happen.

**Alternative Solutions**
Any alternative solutions or features you've considered.

**Additional Context**
Any other context, mockups, or examples.
```

### Your First Code Contribution

Unsure where to begin? Look for issues tagged with:
- `good first issue` - Simple issues for newcomers
- `help wanted` - Issues where we need community help
- `documentation` - Documentation improvements

### Pull Requests

1. Create a new branch for your feature or fix
2. Make your changes
3. Add or update tests as needed
4. Update documentation as needed
5. Submit a pull request

## 💻 Development Process

### Branch Naming Convention

Use descriptive branch names following this pattern:

```
<type>/<short-description>

Examples:
- feature/add-apex-trigger-support
- bugfix/fix-authentication-error
- docs/update-api-documentation
- refactor/improve-test-coverage
```

**Types:**
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical production fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications
- `chore/` - Maintenance tasks

### Development Workflow

1. **Sync with Upstream**
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Write clean, maintainable code
   - Follow style guidelines
   - Add appropriate tests
   - Update documentation

4. **Test Your Changes**
   ```bash
   # Run unit tests
   sf apex test run --test-level RunLocalTests
   
   # Run linter
   npm run lint
   
   # Run formatter
   npm run format
   ```

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill out the PR template
   - Link related issues

## 🎨 Style Guidelines

### Apex Code Style

Follow Salesforce's Apex coding best practices:

```apex
// Good
public class AccountController {
    private static final Integer MAX_RECORDS = 100;
    
    /**
     * Retrieves active accounts
     * @return List of active Account records
     */
    public static List<Account> getActiveAccounts() {
        return [
            SELECT Id, Name, Industry
            FROM Account
            WHERE IsActive__c = true
            LIMIT :MAX_RECORDS
        ];
    }
}

// Bad
public class accountcontroller {
    public static list<account> getaccounts() {
        return [select id,name from account];
    }
}
```

**Key Points:**
- Use PascalCase for class names
- Use camelCase for method and variable names
- Use UPPER_SNAKE_CASE for constants
- Always include proper indentation (4 spaces)
- Add meaningful comments and documentation
- Follow SOQL best practices (bulkification)

### JavaScript/Node.js Style

```javascript
// Good
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// Bad
function calc(i) {
  var t = 0;
  for(var x=0;x<i.length;x++)
    t+=i[x].price;
  return t;
}
```

**Key Points:**
- Use `const` and `let`, avoid `var`
- Use arrow functions where appropriate
- Follow ESLint rules
- Use meaningful variable names
- Add JSDoc comments for functions

### Documentation Style

- Use clear, concise language
- Include code examples
- Keep line length under 100 characters
- Use proper markdown formatting
- Add table of contents for long documents

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples

```bash
# Feature
feat(auth): add OAuth 2.0 support

# Bug fix
fix(deploy): resolve metadata API timeout issue

# Documentation
docs(readme): update installation instructions

# Breaking change
feat(api)!: change authentication method

BREAKING CHANGE: OAuth is now required for all API calls
```

### Commit Message Rules

1. Use present tense ("add feature" not "added feature")
2. Use imperative mood ("move cursor to..." not "moves cursor to...")
3. Limit first line to 72 characters
4. Reference issues and pull requests when relevant
5. Add body and footer for complex changes

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] New tests added for new functionality
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] No merge conflicts with main branch
- [ ] Code coverage maintained or improved

### PR Template

When creating a PR, use this template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that causes existing functionality to change)
- [ ] Documentation update

## Related Issues
Fixes #(issue number)

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally

## Screenshots (if applicable)
Add screenshots of UI changes

## Additional Notes
Any additional information reviewers should know
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs automatically
2. **Code Review**: At least one maintainer reviews the code
3. **Feedback**: Address all review comments
4. **Approval**: Maintainer approves the PR
5. **Merge**: Maintainer merges the PR

### After Merge

1. Delete your feature branch
2. Sync your fork with upstream
3. Celebrate! 🎉

## 🧪 Testing Guidelines

### Test Coverage Requirements

- Minimum 85% code coverage for Apex code
- All new features must include tests
- All bug fixes must include regression tests

### Writing Tests

```apex
@isTest
private class AccountControllerTest {
    @TestSetup
    static void setupTestData() {
        // Create test data
        Account testAccount = new Account(
            Name = 'Test Account',
            Industry = 'Technology'
        );
        insert testAccount;
    }
    
    @isTest
    static void testGetActiveAccounts() {
        // Given
        Integer expectedCount = 1;
        
        // When
        Test.startTest();
        List<Account> results = AccountController.getActiveAccounts();
        Test.stopTest();
        
        // Then
        System.assertEquals(expectedCount, results.size(), 
            'Should return one active account');
    }
}
```

### Test Best Practices

- Use `@TestSetup` for common test data
- Use `Test.startTest()` and `Test.stopTest()` for governor limit resets
- Test positive and negative scenarios
- Test bulk operations
- Mock external callouts
- Use meaningful assertions with messages

## 📚 Documentation Guidelines

### When to Update Documentation

Update documentation when you:
- Add new features
- Change existing functionality
- Fix bugs that affect usage
- Add or modify APIs
- Change configuration options

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Update all relevant documents
- Keep table of contents current
- Use proper markdown formatting

### Documentation Files to Update

- `README.md` - For user-facing changes
- `ARCHITECTURE.md` - For structural changes
- `API.md` - For API changes
- Inline code comments - For implementation details
- `CHANGELOG.md` - For all changes

## 👥 Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and discussions
- **Pull Requests**: Code reviews and contributions

### Getting Help

- Check existing documentation
- Search closed issues
- Ask in GitHub Discussions
- Tag maintainers if urgent

### Recognition

Contributors are recognized in:
- `CONTRIBUTORS.md` file
- Release notes
- Project README

## 🏆 Becoming a Maintainer

Regular contributors may be invited to become maintainers. Maintainers have:
- Write access to the repository
- Ability to review and merge PRs
- Responsibility for project direction

To become a maintainer:
1. Make consistent, high-quality contributions
2. Help review other contributors' PRs
3. Participate in discussions
4. Demonstrate understanding of project goals

## 📞 Contact

- **General Questions**: Open a GitHub Discussion
- **Security Issues**: security@example.com
- **Code of Conduct**: conduct@example.com
- **Other Inquiries**: support@example.com

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Salesforce-GitHub-Test! 🙏

**Last Updated**: November 2025
