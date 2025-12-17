# Invoice Calculation Fix

## Summary
Resolved an issue where invoice totals could be off by a small margin due to rounding inconsistencies.

## Details
- Updated rounding logic to occur after line-item aggregation
- Ensures consistent totals across UI and exported reports

## Business Impact
- Prevents billing discrepancies
- Improves trust in financial reporting

## Risk
Low. No schema changes.
