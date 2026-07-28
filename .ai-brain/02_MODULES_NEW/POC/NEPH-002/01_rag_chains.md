<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# NEPH-002 — LangChain / LangGraph Chains (6 chains)

## 1. donor_recipient_matching_score
**Input:** recipient cPRA, DSA, EPTS, blood type, donor KDPI, HLA MM, age delta
**Output:** {match_score, recommendation: proceed/decline/desensitize, rationale}
**Tools:** kdpi_calc, epts_calc, pra_calc, mm_calculator
**Critical:** YES (drives transplant decision; positive CDC XM = absolute decline)

## 2. banff_biopsy_interpreter
**Input:** pathology report (light/IF/EM), C4d, SV40, DSA, Cr
**Output:** {banff_category, suggested_treatment, citations}
**Tools:** banff_grader, c4d_interpreter, sv40_interpreter
**Critical:** YES (gates treatment escalation; MD must sign off)

## 3. immunosuppression_trough_advisor
**Input:** drug, dose, trough, time-post-tx, Cr
**Output:** {dose_change, recheck_interval, warning}
**Tools:** trough_interpreter, cni_toxicity_check
**Critical:** YES — HARD RULE: trough >20 ng/mL = BLOCK + escalate
**HARD BLOCK:** trough >20 → BLOCK + escalate to transplant nephrologist

## 4. rejection_risk_predictor
**Input:** DSA trajectory, eGFR slope, BK/CMV PCR, medication adherence
**Output:** {30d_rejection_risk, recommendation, monitoring}
**Tools:** dsa_trend, egfr_slope, bk_cmv_check
**Critical:** YES

## 5. infection_prophylaxis_checker
**Input:** time-post-tx, IS regimen, serostatus (CMV/EBV/HSV/BK/HepB)
**Output:** {prophylaxis_recommendations, monitoring}
**Tools:** cmv_risk_calculator, ebv_risk, prophylaxis_lookup
**Critical:** YES

## 6. paired_exchange_match_optimizer
**Input:** pool of ABOi/cPRA-high pairs
**Output:** {suggested_swaps: 2-way|3-way, compatibility_check}
**Tools:** abo_compat, pra_match, mm_calculator
**Critical:** NO (coordinator decision)

## Implementation
LangGraph supervisor; 6-stage RAG pipeline; PII redaction; MedEmbed 768d primary; gpt-4o + claude-3.5; auto-fallback to rule-based 	ransplant_engine.js.

---
*Section 07 of NEPH-002. AIE voice. L1 DRAFT.*