<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# NEPH-002 — 7-Expert Panel Synthesis (L1-L4)

## Module Summary
**ID:** NEPH-002 · **Name:** Renal Transplantation · **Parent:** Nephrology (NEPH) · **Tier:** 1 (life-saving + chronic) · **Status:** L1 DRAFT

## 7-Expert Contributions

### CMO
**Inputs:** 10 conditions (ESRD, CKD-5, DN, ADPKD, GN, Alport, IgA, lupus, FSGS, HUS); 20 procedures (LDN open/lap, DD procurement, transplant, ureteroneocystostomy, biopsy, anti-rejection); 12 red flags; crossmatch (CDC/flow/vXM); HLA 10 loci high-res NGS; IS protocols (KDIGO 2009, CST 2023); KDPI/EPTS scoring; ABOi desensitization.
**Key decisions:** ABOi requires desensitization (rituximab + PLEX + IVIG); biopsy for-cause at 1-3% Cr rise; BK PCR >10⁴ = reduce IS; CNI trough >20 = block + escalate; SCOT reporting within 7d; paired exchange for sensitized recipients.
**Veto conditions:** Positive CDC XM (absolute decline); missing crossmatch; missing HLA typing; IS without dual-pharmacist verify; biopsy without indication; BK viremia without reduction; discharge without IS education.

### AIE
**Inputs:** 6 LangChain chains (donor-recipient match, Banff interpreter, trough advisor, rejection risk, infection prophylaxis, paired exchange); RAG over KDIGO/Banff/OPTN/CST; LLM gateway with PII redaction.
**Key decisions:** MedEmbed primary; gpt-4o + claude-3.5; med-llama offline fallback; rule-based 	ransplant_engine.js safety floor; PII redaction before LLM; citation required; auto-fallback.
**Critical:** Trough >20 ng/mL = BLOCK + escalate; Banff grade requires MD sign-off.

### SA
**Inputs:** 13 new tables; 26 new endpoints; RLS on all; pure JS engine 	ransplant_engine.js (10 functions); OpenAPI 3.1.
**Key decisions:** Single DB, multi-tenant; pure JS engine; AsyncLocalStorage; hash-chained audit; SCOT integration via API; paired exchange as separate module.
**Performance:** p99 <500ms read, <1.5s write; 200 concurrent users.

### DSL
**Inputs:** PHI encryption; tenant isolation; money route idempotency; hash-chained audit; DR.
**Key decisions:** Rate limit 200/min; CSP report-only; HIGH-ALERT gate for IS drugs; ABORh gate; SCOT integration secure; data residency KSA.
**Compliance:** 13 rails + 4 dept-specific.

### PM
**Inputs:** 5 personas; Stitch 3-column transplant station; AR+EN; mobile+desktop.
**Key decisions:** Left = donor + match score; Center = procedure + IS; Right = graft + trough + biopsy.

### CQO
**Inputs:** JCI/CBAHI/SCOT/NPHIES/ZATCA/SFDA/PDPL/HIPAA.
**Key decisions:** All 8 audit categories; 10 consent types; SCOT reporting mandatory; lifetime retention for recipient; doubly protected PHI (donor + recipient); breach 72h.
**Audit events:** transplant.waitlist.added, crossmatch.performed, procedure.completed, IS.administered, rejection.detected, graft_loss, donor.organs.recovered, biopsy.banff.graded.

### ORC
**Synthesis:** Multi-tenant via RLS; pure JS engine; SCOT integration; high-alert IS dual-pharm verify; LLM decision support (NOT authority); 6 L4 gates pending.

## L1-L4 Cycle Plan
- **L1 DRAFT** (current): 35 files → COMPLETE
- **L2 CRITIQUE**: 3 pairs (CMO↔AIE, SA↔DSL, PM↔CQO)
- **L3 REFINE**: ORC merges
- **L4 VALIDATE**: 6 hard gates

---
*ORC synthesis. NEPH-002 L1 DRAFT complete.*