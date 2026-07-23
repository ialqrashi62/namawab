# MICU — Architecture Decision Records (ADRs)

## ADR-001: Multi-Tenant via tenant_id + RLS
**Status:** Accepted
**Context:** Single database, multiple hospital tenants
**Decision:** tenant_id column on every table + Postgres RLS
**Consequence:** Strong isolation, single deployment, complex migrations

## ADR-002: Hash-Chained Audit Log
**Status:** Accepted
**Context:** Regulatory requirement (JCI, NPHIES, CBAHI) for tamper-evident audit
**Decision:** Every audit row includes prev_row_hash (SHA-256)
**Consequence:** 7-year retention, ~1KB/row overhead, integrity verifiable

## ADR-003: Vasoactive Drip = High-Alert
**Status:** Accepted
**Context:** Vasoactive medications (norepinephrine, epinephrine) are life-critical
**Decision:** Require attending co-sign, dose range check, double-check
**Consequence:** 403 if not co-signed, prevents junior MD errors

## ADR-004: Sepsis Bundle Mandatory Within 1h
**Status:** Accepted
**Context:** Surviving Sepsis Campaign 2021
**Decision:** System tracks bundle timer, alerts on delay
**Consequence:** Bundle compliance ≥85% target, mortality reduction

## ADR-005: Ventilator Settings: Mode + PBW
**Status:** Accepted
**Context:** ARDSNet lung-protective ventilation
**Decision:** Vt = 6 mL/kg PBW (not actual weight), plateau ≤30
**Consequence:** Prevents VILI, requires PBW calculation (height + sex)

## ADR-006: Code Status = Decision, Not Default
**Status:** Accepted
**Context:** Ethical, legal implications
**Decision:** Every admission requires explicit code status (default FULL with prompt to discuss)
**Consequence:** Audit trail, family communication documented

## ADR-007: Daily Rounds Required
**Status:** Accepted
**Context:** ICU standard of care
**Decision:** Daily interdisciplinary rounds (MD, RN, RT, Pharm, Nutr, PT) documented
**Consequence:** Multidisciplinary care, family update, goals for day

## ADR-008: AI Recommendations = Suggest, Not Order
**Status:** Accepted
**Context:** Patient safety, regulatory (FDA SaMD, SFDA)
**Decision:** All AI recommendations require human (MD) order to execute
**Consequence:** AI assists, MD decides. Audit trail of suggestion → order.

## ADR-009: PHI Auto-Redact Before LLM
**Status:** Accepted
**Context:** PDPL, HIPAA-equivalent
**Decision:** Regex/ML-based PHI detection before LLM call; replace with placeholders
**Consequence:** LLM never sees raw PHI, audit log of redaction
