# برومنت AutoPilot مختصر لتطبيق تصميم Stitch عبر Antigravity

استخدم هذا البرومنت داخل Antigravity IDE بعد وضع مجلد المهارات داخل المشروع.

```text
You are working in AutoPilot mode as a senior frontend engineer and UI system architect.

Goal:
Apply the uploaded Stitch healthcare premium RTL design package to this existing web project with minimum risk and maximum component reuse.

Use these local skills before editing:
- 01_STITCH_PACKAGE_INVENTORY_SKILL.md
- 02_DESIGN_SYSTEM_TOKENS_SKILL.md
- 03_HTML_TO_REACT_CONVERSION_SKILL.md
- 04_ROUTE_MAPPING_AND_PHASES_SKILL.md
- 05_WEB_ONLY_AND_NATIVE_CODE_GUARD_SKILL.md
- 06_RTL_RESPONSIVE_ACCESSIBILITY_SKILL.md
- 07_VALIDATION_AND_REPORTING_SKILL.md
- 08_ANTIGRAVITY_AUTOPILOT_RUNTIME_SKILL.md

Stitch package path:
- ./748/

First action:
Inspect the current project and the ./748 Stitch package. Do not edit immediately. Create a concise route mapping and implementation plan.

Implementation scope for this run:
1. Create/update the shared design system tokens and reusable UI components.
2. Redesign the landing/home page using `saudihealth_premium_landing_page_rtl`.
3. Redesign the main dashboard using `saudihealth_premium_hospital_operations_dashboard_rtl` and `saudihealth_premium_strategic_executive_command_center_rtl`.
4. Apply the new RTL premium app shell: sidebar, topbar, page container, cards, tables, buttons, status chips.
5. Preserve all existing backend/business logic.
6. Do not touch EXE/Desktop/C++/native files in this task.

Execution rules:
- Do not paste raw Stitch HTML as one giant component.
- Convert Stitch patterns into clean React/TSX components.
- Reuse existing APIs and data flows where available.
- Use mock data only for widgets with no backend and add TODO comments.
- Keep Arabic RTL primary and responsive.
- Avoid new heavy dependencies.
- Fix TypeScript/JSX/Tailwind/build errors caused by the migration.

Validation:
Run available safe checks:
- npm run lint if available
- npm run typecheck if available
- npm run build
- npm test if reasonable

Documentation:
Create/update:
- docs/STITCH_DESIGN_IMPLEMENTATION_REPORT_AR.md

The report must include screens reviewed, tokens extracted, components changed, routes affected, validation results, risks, and final status.

Final acceptance:
- Homepage uses the new Stitch premium healthcare design.
- Dashboard uses the new premium RTL design.
- App shell uses the new sidebar/topbar/card/table style.
- Web app builds successfully.
- No backend/database/EXE/Desktop/C++ logic is broken.
- Arabic report is saved in UTF-8.
```
