# 04 UX/UI Stitch — Administration, HR & Academic Affairs

## 1. Design Tokens
- **Palette**: corporate navy/gray, credential alert red, CME green.
- **Typography**: same as Stitch admin dashboards.
- **Layout**: dashboard + list+drawer detail views.

## 2. Components
- `HRDashboard`: staff count, credential expiry, leave balance.
- `StaffDirectory`: searchable staff cards with role/department.
- `CredentialCalendar`: expiry timeline with alerts.
- `ScheduleBoard`: shift calendar by department.
- `CMETracker`: activities, credits, license renewal.
- `AuditQueryBuilder`: filters for audit log review.

## 3. User Stories
- "As an HR manager, I want credential expiry alerts 90/60/30 days before expiration."
- "As an auditor, I want read-only query and export of audit logs."

## 4. Wireframe Logic
- Top: executive/HR dashboard.
- Left: menu (staff, schedule, leave, CME, committees, audit).
- Center: selected module tabs.
- Right: alerts + reports + quick actions.

## 5. Accessibility
- RTL/LTR, high-contrast alerts, keyboard-navigable tables.
