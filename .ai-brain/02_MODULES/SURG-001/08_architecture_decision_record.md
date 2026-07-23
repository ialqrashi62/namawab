# SURG-001 — ADRs

## ADR-001: Multi-Tenant via tenant_id + RLS
**Status:** Accepted
**Decision:** Same as ER-001

## ADR-002: WHO Surgical Safety Checklist Mandatory
**Status:** Accepted
**Context:** WHO 2009 checklist reduces mortality 40%
**Decision:** Three-phase checklist (sign-in, time-out, sign-out) mandatory
**Consequence:** Better outcomes, audit trail

## ADR-003: Site Marking Mandatory
**Status:** Accepted
**Context:** Wrong-site surgery is a "never event"
**Decision:** Site marked before anesthesia
**Consequence:** Prevents wrong-site surgery

## ADR-004: Pre-Op Antibiotic Within 60 Min
**Status:** Accepted
**Context:** SCIP measures
**Decision:** Antibiotic within 60 min of incision
**Consequence:** SSI reduction

## ADR-005: VTE Prophylaxis = Standard
**Status:** Accepted
**Decision:** LMWH or UFH for all major surgery unless contraindicated
**Consequence:** DVT/PE reduction

## ADR-006: Enhanced Recovery (ERAS)
**Status:** Accepted
**Decision:** ERAS protocol for major abdominal surgery
**Consequence:** Faster recovery, less LOS, fewer complications

## ADR-007: All Procedures Coded
**Status:** Accepted
**Decision:** CPT code required for billing + reporting
**Consequence:** Accurate billing, quality reporting

## ADR-008: All Complications Tracked
**Status:** Accepted
**Decision:** Clavien-Dindo classification
**Consequence:** Quality improvement, comparison

## ADR-009: AI = Suggest, Not Operate
**Status:** Accepted
**Decision:** AI supports pre-op + post-op decisions, not OR
**Consequence:** Surgeon autonomy, audit trail

## ADR-010: All ORs Have Backup Generator + Medical Gases
**Status:** Accepted
**Decision:** Backup power, O2, suction, air at every OR
**Consequence:** Safety in case of failure
