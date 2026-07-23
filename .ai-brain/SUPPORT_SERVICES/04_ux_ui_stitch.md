# 04 UX/UI Stitch — Support Services & Operations

## 1. Design Tokens
- **Palette**: operations blue/gray, status colors (green/yellow/red), service-specific accents.
- **Typography**: same as Stitch clinical stations.
- **Layout**: dashboard + 3-column detail views.

## 2. Components
- `OperationsDashboard`: KPI cards + request queues by service.
- `CSSDBoard`: sterilization cycles, set tracking, OR linkage.
- `DietaryMenu`: meal orders, allergy flags, special diets.
- `TransportBoard`: porter requests with SLA timers.
- `BiomedCalendar`: preventive maintenance and calibration schedule.
- `WasteTracker`: bag log, transport manifest, disposal certificate.

## 3. User Stories
- "As an OR nurse, I want to see sterile set availability before booking a case."
- "As a biomedical engineer, I want a calendar of devices due for calibration."

## 4. Wireframe Logic
- Top: operations dashboard with KPIs.
- Left: service selector + request queue.
- Center: active request/service tabs.
- Right: SLA alerts + resource status.

## 5. Accessibility
- RTL/LTR, high-contrast status badges, touch-friendly forms.
