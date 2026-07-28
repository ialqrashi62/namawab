<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — 7-Expert Panel Synthesis (L1-L4)

## Module Summary
**ID:** CARD-002 · **Name:** Interventional Cardiology (Cath Lab + Structural Heart) · **Parent:** Cardiology (CARD) · **Tier:** 1 · **Status:** L1 DRAFT — ready for L2_CRITIQUE · **Catalog:** `.ai-brain/01_DATA/CATALOG.yaml:14` · **Context brief:** `CONTEXT_BRIEFS.md#section-1`

## 7-Expert Contributions

### 1. CMO (Dr. Sarah Chen) — Clinical Authority
**Inputs:** 10 top conditions; 20 top procedures; 12 red flags; 8 critical time targets; high-alert drugs (UFH, bivalirudin, enoxaparin, GP IIb/IIIa, aspirin, P2Y12, warfarin, DOACs — 2-RN + 5-rights + witness); Structural Heart MDT (Heart Team).
**Key decisions:** Adopt ACC/AHA 2023 STEMI + 2024 NSTE-ACS + 2020 TAVR + 2024 Valvular + ESC 2023 ACS + 2021 Valvular + 2020 AF. D2B ≤90 min is the single most important KPI; QA owns it. DES implant requires 2-MD/1-RN/1-pharmacist gate with SFDA UDI scan. TAVR/MitraClip/Watchman scheduling REQUIRES Heart Team MDT sign-off first.
**Veto conditions:** Patient receives PCI without prior DAPT loading; stent implant without SFDA UDI scan + witness; TAVR/MitraClip without Heart Team MDT; D2B >90 min without documented exception; ACT out of range with continued heparin bolus; contrast volume >3×eGFR without nephrology consult; radiation dose >5 Gy without pause + dermatology; discharge without DAPT compliance assessment.

### 2. AIE (Eng. Marcus Patel) — AI Engineering
**Inputs:** LangGraph supervisor with 8 chains (PCI risk, MDT summarizer, CIN risk, DAPT, access advisor, STEMI triage, cath report, discharge); hybrid RAG (vector MedEmbed 768d + BM25 + KG); Top-K=20→5; LLM gateway with PII redaction; observability (LangSmith + Helicone).
**Key decisions:** MedEmbed primary; gpt-4o/claude-3.5 primary, med-llama-70b offline fallback; PII redaction BEFORE external LLM; citation required for every response; auto-fallback to rule-based engine if LLM down; hallucination ceiling <1% SYNTAX/GRACE; p99 LLM latency <2s; LLM NEVER autonomously signs consent/DAPT/stent.
**Critical paths:** STEMI activation triage ECG→auto-trigger cath lab within 60s; DAPT decision 90% concordance with Heart Team; cath report 95% acceptance.

### 3. SA (Eng. Elena Volkov) — Architecture
**Inputs:** 12 new tables; 23 new endpoints (base `/api/v1/cath-lab`); RLS on all 12 (`FORCE ROW LEVEL SECURITY`); target FORCE_RLS=189 (150+39 across POC); OpenAPI 3.1; pure JS engine `cath_lab_engine.js` (10 functions); idempotency on 4 routes.
**Key decisions:** Single DB, multi-tenant (RLS) — NOT DB-per-tenant; pure JS engine (testable, version-controlled, deterministic); AsyncLocalStorage for tenant (GATE4); hash-chained audit.
**Performance:** p99 <500ms read, <1.5s write; 200 concurrent users; 50 concurrent STEMI; D2B timer p99 <1s.

### 4. DSL (Eng. Ahmed Hassan) — DevOps & Security
**Inputs:** PHI encryption (DPAPI KEK); tenant isolation (GATE4: session>header); money route idempotency 4 routes; audit log hash-chained + WORM; DR (RPO<1h, RTO<4h).
**Key decisions:** Rate limit 200 req/min/user; CSP report-only default; all 13 universal rails per `$ref: SNIPPETS.md#SNIP-01`; **High-alert anticoagulant gate**; **Stent implant gate**; **Structural Heart MDT gate**; **DAPT loading gate**.
**Compliance:** 13 universal rails + 4 dept-specific; HIPAA 164.312; PDPL 7y/10y/**lifetime implants**; SFDA stent UDI+manufacturer+batch+lot.

### 5. PM (Ms. Priya Sharma) — Product & UX
**Inputs:** 5 personas; Stitch Layout C (Cath Lab 3-column); i18n AR+EN; 10 wireframes.
**Key decisions:** Stitch Layout C (LEFT=patient+prior cath+SYNTAX/GRACE/TIMI; CENTER=timeline+DICOM+hemodynamics; RIGHT=vitals+ACT+anticoag+red flags). D2B timer sticky top bar. DICOM viewer dual-monitor. Color-coded SYNTAX (green<22/yellow 22-32/red ≥33).
**Accessibility:** WCAG 2.2 AA; keyboard nav; screen reader; high contrast; color-blind safe.

### 6. CQO (Dr. Omar Al-Rashid) — Compliance
**Inputs:** JCI 7th Ed; CBAHI; NPHIES; ZATCA; PDPL; SFDA; HIPAA.
**Key decisions:** All 8 audit categories, 23+ events; 10 consent types; breach notification 72h; data localization KSA only; **lifetime for implants**; SFDA stent registry within 7d; monthly radiation safety review.

### 7. ORC (Master Orchestrator) — Synthesis
**Conflict resolution:** AIE wanted LLM to generate stent sizing suggestion → CMO+CQO approved (operator veto, audit). SA wanted RLS-only → DSL agreed. CQO wanted mandatory Heart Team before TAVR → CMO+SA aligned (no override). DSL wanted idempotency on all writes → SA: limit to 4 money/SFDA routes. AIE wanted LLM auto-fill cath report → CMO: MD must review+sign.
**Final architecture:** Module at `/api/v1/cath-lab` (Express router, tenant-scoped); pure JS engine `cath_lab_engine.js` (10 functions); 12 tables RLS-forced; 23 endpoints; AI layer LangGraph+MedEmbed+LangSmith+Helicone; UI Stitch Layout C+Tailwind+i18n; Security TLS 1.3+BearerAuth+RBAC+audit.

## L1-L4 Cycle Plan
- **L1 DRAFT** (current): 4 expert outputs + 2 merged → 35 files → **COMPLETE**
- **L2 CRITIQUE** (next): 3 pairs (CMO↔AIE, SA↔DSL, PM↔CQO) → 5-10 conflicts, 10-20 gaps
- **L3 REFINE** (after L2): ORC merges; resolves conflicts; fills gaps
- **L4 VALIDATE** (after L3): 6 hard gates

## Sign-off
| Expert | Status |
|--------|--------|
| CMO | L1 DRAFT (pending L2) |
| AIE | L1 DRAFT (pending L2) |
| SA | L1 DRAFT (pending L2) |
| DSL | L1 DRAFT (pending L2) |
| PM | L1 DRAFT (pending L2) |
| CQO | L1 DRAFT (pending L2) |
| ORC | **L1 DRAFT COMPLETE** |

---
*ORC synthesis. CARD-002 L1 DRAFT complete. CMO has no veto. Patient safety priority enforced.*
