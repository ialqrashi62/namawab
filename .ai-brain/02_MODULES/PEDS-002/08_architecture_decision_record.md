# PEDS-002 — ADRs

## ADR-001: Multi-Tenant via tenant_id + RLS
**Status:** Accepted
**Decision:** Same as ER-001: tenant_id + RLS
**Consequence:** Strong isolation, single deployment

## ADR-002: Weight-Based Dosing = Mandatory
**Status:** Accepted
**Context:** Neonatal dosing is critical; weight changes daily
**Decision:** All doses are weight-based; system recalculates on weight change
**Consequence:** Safety guard, prevents under/overdosing

## ADR-003: High-Alert = Double-Check
**Status:** Accepted
**Decision:** Insulin, vasopressors, opioid, paralytic, prostaglandin = double-check + co-sign
**Consequence:** Reduces medication errors

## ADR-004: Breast Milk = First Choice
**Status:** Accepted
**Decision:** Breast milk first; formula only if breast milk unavailable
**Consequence:** Better outcomes (NEC reduction, immunity)

## ADR-005: Family-Centered Rounds
**Status:** Accepted
**Decision:** Parents present during rounds (if available)
**Consequence:** Better communication, parent engagement

## ADR-006: ROP Screening by GA, Not Birth Date
**Status:** Accepted
**Context:** Premature infants have delayed retinal maturation
**Decision:** First ROP exam at 4-6 weeks chronological, or 31-32w corrected
**Consequence:** Timely detection, treatment

## ADR-007: Therapeutic Hypothermia for HIE
**Status:** Accepted
**Context:** CoolCap / TOBY trials
**Decision:** 72h cooling 33.5°C for eligible neonates
**Consequence:** Mortality + neuro-disability reduction

## ADR-008: All Med Orders = Audit Logged
**Status:** Accepted
**Decision:** 7-year audit log of all medication orders + administrations
**Consequence:** JCI compliance, incident investigation

## ADR-009: AI = Suggest, Not Order
**Status:** Accepted
**Decision:** AI suggests, neonatologist decides
**Consequence:** Audit trail, no autonomous AI in critical care

## ADR-010: Parent Linking Across Modules
**Status:** Accepted
**Context:** Mother in OBG, baby in PEDS, both need to be linked
**Decision:** Mother → baby link via delivery record
**Consequence:** Cross-module access, requires explicit linkage
