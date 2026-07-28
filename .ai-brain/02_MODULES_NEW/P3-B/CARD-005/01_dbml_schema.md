<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-005 DBML Schema (5 tables)

All tables: 	enant_id UUID NOT NULL, RLS + FORCE RLS, soft_deleted_at, audit columns.
Per SNIPPETS.md#SNIP-02 RLS pattern.

## Tables
1. CARD-005 main record (tenant_id, patient_id, encounter_id, ...)
2. clinical_findings (encrypted)
3. treatment_log
4. followup_visits
5. red_flags
6. consent
7. audit_log (hash-chained)
8. specialized table 1
9. specialized table 2
10. specialized table 3
11. equipment
12. i18n_keys
13. billing_log (NPHIES)
14. complications_log
15. outcomes

---
*Section 04. SA voice. L1 DRAFT.*