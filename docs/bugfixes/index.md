---
layout: default
title: Bug Fixes
---

# Bug Fixes & Updates

This section contains documentation for bug fixes, patches, and system improvements.

## Recent Fixes

### [Invoice Calculation Fix](invoice-fix.html)
Resolved an issue where invoice totals could be off by a small margin due to rounding inconsistencies.

**Impact:**
- Prevents billing discrepancies
- Improves trust in financial reporting
- Low risk implementation with no schema changes

---

### [Security Patch - Authentication Vulnerability](security-patch.html)
Closed a critical vulnerability affecting API authentication. All requests now require validated JWTs and legacy tokens are no longer accepted.

**Impact:**
- Enhances system security
- Addresses audit compliance for customer data protection
- Reference: Issue #404

---

### [Reporting Dashboard Fixes](bugfix-description.html)
Fixed intermittent errors on the dashboard charts caused by missing data fields.

**Improvements:**
- Improved error messages and loading indicators
- Smoother user experience
- Reference: Issue #202

---

[← Back to Home](../index.html)
