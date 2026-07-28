<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# ER-002 — ERD (Mermaid)

`mermaid
erDiagram
    tenants ||--o{ trauma_activations : has
    tenants ||--o{ trauma_primary_survey : has
    tenants ||--o{ trauma_secondary_survey : has
    tenants ||--o{ trauma_injuries_ais : has
    tenants ||--o{ trauma_iss_score : has
    tenants ||--o{ trauma_mtp_activations : has
    tenants ||--o{ trauma_operative_log : has
    tenants ||--o{ trauma_transfers_in : has
    tenants ||--o{ trauma_transfers_out : has
    tenants ||--o{ trauma_registry_export : has
    tenants ||--o{ trauma_pi_cases : has
    tenants ||--o{ trauma_outreach_events : has
    tenants ||--o{ trauma_research_projects : has
    tenants ||--o{ trauma_prevention_programs : has
    trauma_activations ||--o{ trauma_primary_survey : has
    trauma_activations ||--o{ trauma_injuries_ais : has
    trauma_activations ||--o{ trauma_mtp_activations : triggers
    trauma_activations ||--o{ trauma_operative_log : leads_to
`

---
*Section 34 of ER-002. L1 DRAFT.*