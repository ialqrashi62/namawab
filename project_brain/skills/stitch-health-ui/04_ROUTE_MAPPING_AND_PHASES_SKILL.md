# Skill: Route Mapping and Implementation Phases

Use this skill to prevent the agent from applying 90 screens randomly.

Phase order:
1. Inspect current project framework and routes.
2. Inspect `748/` Stitch package.
3. Build shared design system components.
4. Apply to homepage/landing page.
5. Apply to main dashboard and app shell.
6. Apply module pages gradually using existing business logic.
7. Validate, document, and archive.

Priority mapping:
- Landing page → `saudihealth_premium_landing_page_rtl`
- Dashboard → `saudihealth_premium_hospital_operations_dashboard_rtl`
- Executive dashboard → `saudihealth_premium_strategic_executive_command_center_rtl`
- Patient portal → `saudihealth_premium_patient_digital_portal_rtl`
- Lab → `saudihealth_premium_laboratory_information_system_rtl`
- Pharmacy → `saudihealth_premium_central_pharmacy_management_rtl`
- Inventory → `saudihealth_premium_supply_chain_inventory_rtl`
- Finance → `saudihealth_premium_financial_performance_rtl`
- HR → `saudihealth_premium_human_resources_payroll_command_rtl`
- Compliance → `saudihealth_premium_compliance_audit_center_rtl`
- Cybersecurity → `saudihealth_premium_cybersecurity_governance_rtl`
- Maintenance → `saudihealth_premium_ai_predictive_maintenance_rtl` or equipment maintenance screens
- Supplier portal/contracts → supplier/vendor screens

Route rule:
- If an existing route exists, redesign that route rather than creating duplicates.
- If no route exists, create a frontend-only route only when it is explicitly part of the phase.
- Never remove backend logic to make the UI fit.

Batch rule:
- Do not do all 90 screens in one pass.
- First pass acceptance scope: homepage + dashboard + app shell + shared UI components.
- Later passes can redesign modules by domain.
