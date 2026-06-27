---
name: stitch-batch-d-finance-hr-compliance
description: Skill rules for applying Batch D design updates to Finance, HR/Payroll, and Compliance.
license: Apache-2.0
metadata:
  version: v1
---

# Batch D: Finance, HR/Payroll, and Compliance

This local skill provides the rules for implementing the Batch D modules (Finance, HR, Compliance) in Nama Medical Web using the premium Stitch RTL design.

## Scope
* **Finance**: Ledger accounts, vouchers, invoice logs, financial reports.
* **HR / Payroll**: Employee records, salary slips, payroll management, leave tracking.
* **Compliance / Audit**: System audit logs, clinical compliance checklist, regulatory audit reports.

## Core Rules
1. **No Redesign from Scratch**: Retain the current layout architecture and build upon it.
2. **Preserve Business Logic & APIs**: Keep existing routes, IDs, API calls, and SQL queries unchanged.
3. **Local Styles Only**: Do not use the Tailwind CDN; rely on `npm run build:css` to update styling.
4. **Arabic RTL as Primary**: All newly designed dashboards must support Right-to-Left alignment with modern premium visual elements (such as Bento Grids and glassmorphism cards).
