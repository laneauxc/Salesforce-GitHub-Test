# Bug Fix – Invoice Rounding

## Summary
Resolved an invoice calculation bug where totals were off by up to $0.01 in specific edge cases.

## Implementation
- Adjusted rounding after sum of line items.
- Added test coverage for tax and subtotal edge cases.

## Business Impact
- Prevents future billing issues.
- Improves accounting accuracy for financial records.

## Reference
- Issue #505
