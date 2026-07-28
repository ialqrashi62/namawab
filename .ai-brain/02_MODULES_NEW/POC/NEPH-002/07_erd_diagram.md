<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# NEPH-002 — ERD (Mermaid)

`mermaid
erDiagram
    tenants ||--o{ transplant_waitlist : has
    tenants ||--o{ donor_registry : has
    tenants ||--o{ recipient_evaluation : has
    tenants ||--o{ hla_typing : has
    tenants ||--o{ crossmatch_results : has
    tenants ||--o{ transplant_procedure : has
    tenants ||--o{ immunosuppression_log : has
    tenants ||--o{ rejection_episodes : has
    tenants ||--o{ protocol_biopsies : has
    tenants ||--o{ graft_surveillance : has
    tenants ||--o{ post_transplant_infections : has
    tenants ||--o{ long_term_followup : has
    tenants ||--o{ paired_exchange_pool : has
    transplant_procedure ||--o{ rejection_episodes : produces
    transplant_procedure ||--o{ protocol_biopsies : has
    transplant_procedure ||--o{ graft_surveillance : monitored_by
    transplant_procedure ||--o{ post_transplant_infections : has
    transplant_procedure ||--o{ long_term_followup : has
`

---
*Section 34 of NEPH-002. L1 DRAFT.*