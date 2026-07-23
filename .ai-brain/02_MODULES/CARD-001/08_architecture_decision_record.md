# CARD-001 — ADRs

## ADR-001: Multi-Tenant via tenant_id + RLS
**Status:** Accepted
**Decision:** Same as ER-001

## ADR-002: STEMI = Auto-Page
**Status:** Accepted
**Context:** STEMI is time-critical
**Decision:** ECG interpretation triggers automatic cath lab activation
**Consequence:** Reduces door-to-balloon time

## ADR-003: Door-to-Balloon <90 min
**Status:** Accepted
**Decision:** System tracks + alerts if >90 min
**Consequence:** Better outcomes, regulatory compliance

## ADR-004: Anticoag = High-Alert
**Status:** Accepted
**Decision:** All anticoag = double-check + co-sign for high dose
**Consequence:** Reduces bleeding events

## ADR-005: All Devices Tracked
**Status:** Accepted
**Decision:** Pacemaker, ICD, TAVR = lifetime tracking
**Consequence:** Recall management, follow-up

## ADR-006: All Procedures Coded
**Status:** Accepted
**Decision:** CPT + ICD-10 mandatory
**Consequence:** Billing, registry reporting

## ADR-007: Pre-Hospital ECG = Integrated
**Status:** Accepted
**Decision:** EMS ECG transmission to hospital
**Consequence:** Time saved, bypass ER if STEMI

## ADR-008: AI ECG Interpretation = Assist, Not Replace
**Status:** Accepted
**Decision:** AI suggests, cardiologist confirms
**Consequence:** Faster, but human review mandatory

## ADR-009: All HF on GDMT
**Status:** Accepted
**Decision:** Standardize GDMT (ARNI, BB, MRA, SGLT2i)
**Consequence:** Better outcomes

## ADR-010: Implant Registry
**Status:** Accepted
**Decision:** All implants registered, tracked
**Consequence:** Recall management, quality reporting
