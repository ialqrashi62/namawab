# Skill: Stitch Package Inventory

Use this skill whenever working with the Stitch export package.

Expected package path:
- `748/`

Important global design file candidates:
- `748/health_excellence_global/DESIGN.md`
- `748/health_excellence_global/1DESIGN.md`
- `748/health_excellence_global/DESIGN(1).md` through duplicates

Screen folder pattern:
- `748/<screen_name>/code.html`
- `748/<screen_name>/screen.png`
- Some folders may contain `code(1).html` and `screen(1).png`; compare duplicates and keep the most complete version.

Known package scale:
- Around 90 screen folders.
- Do not apply all screens in one pass.
- Use route mapping and component reuse first.

Priority screens:
1. `saudihealth_premium_landing_page_rtl`
2. `saudihealth_premium_hospital_operations_dashboard_rtl`
3. `saudihealth_premium_strategic_executive_command_center_rtl`
4. `saudihealth_premium_patient_digital_portal_rtl`
5. `saudihealth_premium_laboratory_information_system_rtl`
6. `saudihealth_premium_central_pharmacy_management_rtl`
7. `saudihealth_premium_supply_chain_inventory_rtl`
8. `saudihealth_premium_financial_performance_rtl`
9. `saudihealth_premium_human_resources_payroll_command_rtl`
10. `saudihealth_premium_compliance_audit_center_rtl`

Rule:
Read Stitch files locally. Do not paste all HTML into prompts. Extract patterns, tokens, and component structures only.
