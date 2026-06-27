---
name: stitch-batch-e-governance-facility-analytics
description: Skill rules for applying Batch E design updates to Cybersecurity Governance, Facility/Maintenance, and Executive Analytics.
license: Apache-2.0
metadata:
  version: v1
---

# Batch E: Cybersecurity Governance, Facility/Maintenance, and Executive Analytics

This local skill provides the rules for implementing the Batch E modules in Nama Medical Web using the premium Stitch RTL design.

## Scope
* **Cybersecurity Governance**: Vulnerability logs, security alerts, encryption status, backup configuration, single-session management status.
* **Facility / Maintenance**: Biomedical and general equipment register, maintenance work orders (preventive and corrective), task assignment.
* **Executive Analytics**: Key clinical performance metrics, occupancy patterns, wait-time analysis, National Transformation Program (Vision 2030) targets, executive reports.

## Core Rules
1. **No Redesign from Scratch**: Retain the current layout architecture and build upon it.
2. **Preserve Business Logic & APIs**: Keep existing routes, IDs, API calls, and SQL queries unchanged.
3. **Local Styles Only**: Do not use the Tailwind CDN; rely on `npm run build:css` to update styling.
4. **Arabic RTL as Primary**: All newly designed dashboards must support Right-to-Left alignment with modern premium visual elements (such as Bento Grids and glassmorphism cards).
