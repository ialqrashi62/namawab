<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# ER-002 — 7-Expert Panel Synthesis

## CMO
**Inputs:** 10 conditions, 20 procedures, 12 red flags, 3 tiers, MTP 1:1:1, ACS-COT Level I standards, time targets.
**Key decisions:** ATLS-driven; 24/7 in-house trauma surgeon; MTP <10 min trigger→infusion; tier 1 full team 15 min; massive transfusion 1:1:1 (PROPPR); TXA within 3h; tranexamic acid + e-aminocaproic acid; damage control surgery; craniectomy <4h TBI.
**Veto:** Patient leaves without being seen; MTP not triggered on shock; activation tier 1 missed; transfer without workup; PI case not opened on deviation.

## AIE
**Inputs:** 7 LangChain chains (ISS, TRISS, tier classifier, MTP trigger, TBI severity, hemorrhage control, transfer advisor); RAG over ATLS/ACS-COT/EAST/BTF; LLM gateway.
**Key decisions:** MedEmbed primary; gpt-4o + claude-3.5; auto-fallback to rule-based 	rauma_center_engine.js; PII redaction; MD-in-loop for AIS>3.
**Critical:** STEMI in trauma → cross-team activation; p99 LLM <1.5s; BRAVO rule (Be Rigorous And Verify Outcome).

## SA
**Inputs:** 14 new tables; 22 new endpoints; RLS; pure JS engine (extends existing 	rauma_score_engine.js).
**Key decisions:** Single DB, multi-tenant; pure JS engine; AsyncLocalStorage; hash-chained audit; real-time integration with blood bank, OR, CT, EMS.
**Performance:** p99 <500ms read; MTP trigger p99 <1s; DICOM first tile <3s.

## DSL
**Inputs:** PHI encryption; tenant isolation; idempotency on MTP; hash-chained audit.
**Key decisions:** Rate limit 200/min; CSP report-only; **High-alert blood gate** (2-RN bedside check); MTP traceability (per CBAHI).
**Compliance:** 13 rails + 4 dept-specific.

## PM
**Inputs:** 7 personas; Stitch 3-column trauma station (dark mode, high contrast); mobile + wall-mounted 4K.
**Key decisions:** Center = ATLS stepper + MTP; Right = GCS trend + lactate + consultants; DICOM dual-monitor.

## CQO
**Inputs:** JCI/ACS-COT/CBAHI/NPHIES/ZATCA/PDPL/HIPAA.
**Key decisions:** All 8 audit categories; 10 consent types; blood traceability; NTDB export; monthly PI review.
**Audit events:** activation.triggered, mtp.activated, mtp.terminated, transfusion.completed, or.available, transfer.out, pi.case.opened, pi.loop.closed.

## ORC
**Synthesis:** Multi-tenant RLS; pure JS engine; ACS-COT Level I; MTP safety floor; LLM decision support; 6 L4 gates.

---
*L1 DRAFT complete.*