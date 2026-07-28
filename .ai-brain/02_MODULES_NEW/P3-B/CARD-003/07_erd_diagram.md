<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-003 ERD (Mermaid)


`mermaid
erDiagram
    tenants ||--o{ ep_procedures : has
    tenants ||--o{ device_registry : has
    device_registry ||--o{ device_leads : has
    device_registry ||--o{ device_remote_monitoring : has
    device_registry ||--o{ device_followup : has
    ep_procedures ||--o{ ep_study_findings : has
    ep_procedures ||--o{ ep_red_flags : has
    ep_procedures ||--o{ ep_audit_log : has
`

---
*Section 34. L1 DRAFT.*