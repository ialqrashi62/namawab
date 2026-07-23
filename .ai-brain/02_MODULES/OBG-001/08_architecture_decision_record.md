# OBG-001 — Architecture Decision Records

## ADR-001: Preeclampsia Screening Using ASPRE
**Status:** Accepted
**Context:** Preeclampsia is a leading cause of maternal mortality. ASPRE trial (2017) showed low-dose aspirin reduces early-onset PE by 62%.
**Decision:** Use ASPRE-based risk model for first-trimester screening.
**Consequence:** High-risk → 150 mg aspirin nightly from 12-36 weeks.

## ADR-002: Active Management of Third Stage of Labor
**Status:** Accepted
**Context:** WHO recommendation to reduce PPH.
**Decision:** Oxytocin 10U IV within 1 min of delivery, controlled cord traction, uterine massage.
**Consequence:** 60-70% reduction in PPH >500 mL.

## ADR-003: Fetal Heart Rate Monitoring — Continuous
**Status:** Accepted
**Context:** ACOG/SMFM recommendations.
**Decision:** Continuous FHR monitoring in active labor (intermittent only in low-risk).
**Consequence:** Earlier detection of fetal distress, but increased intervention.

## ADR-004: VBAC (Vaginal Birth After Cesarean) — Selective
**Status:** Accepted
**Context:** TOLAC trial (2010, NEJM).
**Decision:** Offer TOLAC if low transverse incision, no contraindication, resources for emergency C-section.
**Consequence:** Lower repeat C-section rate, but small uterine rupture risk (0.5%).

## ADR-005: GDM Screening — Universal
**Status:** Accepted
**Context:** International recommendations vary.
**Decision:** Universal screening at 24-28 weeks (IADPSG criteria).
**Consequence:** Earlier GDM detection, treatment.

## ADR-006: Cervical Cancer Screening — HPV Co-test
**Status:** Accepted
**Context:** Higher sensitivity than Pap alone.
**Decision:** Co-test q5y for 30-65, Pap alone q3y for 21-29.
**Consequence:** Earlier detection, less frequent screening.

## ADR-007: Pregnancy Data — PDPL Special Category
**Status:** Accepted
**Context:** Pregnancy, HIV, hepatitis are PDPL special categories.
**Decision:** Field-level encryption, restricted access, audit log of all access.
**Consequence:** Stronger security, more complex access management.

## ADR-008: Multi-Tenant via tenant_id + RLS
**Status:** Accepted
**Context:** Single DB, multiple hospital tenants.
**Decision:** Same as ER-001: tenant_id + RLS.
**Consequence:** Defense-in-depth.

## ADR-009: AI Suggestions, Not Decisions
**Status:** Accepted
**Context:** Patient safety.
**Decision:** AI suggests, MD decides. Mandatory human review for high-risk recommendations.
**Consequence:** Audit trail of suggestion → order.

## ADR-010: All Deliveries Logged + Analyzed
**Status:** Accepted
**Context:** MOH requires maternal + perinatal mortality reporting.
**Decision:** Every delivery logged, PPH tracked, sentinel events reviewed.
**Consequence:** Quality improvement, regulatory compliance.
