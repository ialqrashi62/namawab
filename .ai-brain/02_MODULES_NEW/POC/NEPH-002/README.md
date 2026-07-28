<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: NEPH-002
name: "Renal Transplantation"
parent: "Nephrology"
code: NEPH
generated: 2026-07-24
loop_status: "L1 DRAFT"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
catalog_ref: ".ai-brain/01_DATA/CATALOG.yaml:38"
context_brief_ref: "CONTEXT_BRIEFS.md#section-2"
---

# Renal Transplantation — NEPH-002

## Mission
Comprehensive kidney transplant program: living + deceased donor, ABO-compatible + ABO-incompatible, paired exchange, post-transplant immunosuppression, rejection workup, long-term graft surveillance. SCOT-mandated reporting (Saudi Center for Organ Transplantation).

## Scope
- Living donor nephrectomy (open + laparoscopic)
- Deceased donor procurement
- Recipient transplant (vascular + ureteral)
- Immunosuppression induction + maintenance
- ABOi desensitization (PLEX + IVIG + rituximab)
- Protocol + for-cause biopsy
- Rejection treatment (ACR/AMR)
- BK/CMV prophylaxis + monitoring
- Long-term follow-up (graft survival, QoL)
- 13 new tables, 26 endpoints, 6 LangChain chains

## Top 10 Conditions
ESRD (N18.6) · CKD-5 (N18.5) · Diabetic nephropathy (E11.22) · ADPKD (Q61.2) · Chronic GN (N03.9) · Alport (Q87.81) · IgA (N02.B) · Lupus nephritis (M32.14) · FSGS (N04.1) · HUS/TTP (D59.3/M31.1)

## Top 20 Procedures
LDN (50300) · Lap LDN (50547) · Back-table (50325) · DD procurement (50300-50) · Recipient nephrectomy (50220/50240) · Renal transplant (50360) · Vascular anastomosis · Ureteroneocystostomy (50780) · Ureteral stent (50605) · Induction ATG/basiliximab · PLEX (36514) · IVIG (90284) · Biopsy (50200/88307) · Protocol biopsy · Anti-rejection (J-codes) · Graft nephrectomy (50340) · HD bridge (90935) · PD bridge (90945) · DSA monitoring · HLA typing (81370-81383)

## 12 Red Flags
Hyperacute rejection · ACR (Banff IA-IIIA) · AMR (DSA+/C4d+) · CNI toxicity (trough >20) · BK polyomavirus · RAV thrombosis · RV thrombosis · Urinary leak · Lymphocele · Post-Tx infection · PTLD (EBV) · Recurrent primary disease

## Database (13 tables, RLS-forced)
transplant_waitlist · donor_registry · recipient_evaluation · hla_typing · crossmatch_results · transplant_procedure · immunosuppression_log (HIGH-ALERT) · rejection_episodes · protocol_biopsies · graft_surveillance · post_transplant_infections · long_term_followup · paired_exchange_pool

## 6 LangChain Chains
donor_recipient_matching_score · banff_biopsy_interpreter · immunosuppression_trough_advisor · rejection_risk_predictor · infection_prophylaxis_checker · paired_exchange_optimizer

## Compliance
- JCI: COP, MMU (high-alert IS), QPS, SQE
- CBAHI: transplant program
- SCOT: mandatory reporting
- NPHIES: transplant bundle
- ZATCA: billing + VAT
- SFDA: IS + REMS (ATG, rituximab, eculizumab)
- PDPL: 10y records, 20y donor, lifetime recipient
- HIPAA: 164.312 (doubly protected)

## Sign-off
CMO/AIE/SA/DSL/PM/CQO/ORC: L1 DRAFT complete.