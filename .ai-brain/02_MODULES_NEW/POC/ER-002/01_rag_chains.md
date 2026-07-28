<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# ER-002 — 7 LangChain Chains

## 1. issCalculator
**Input:** injuries: [{region, ais, descriptor}]
**Output:** {iss_total, max_ais, mortality_band}
**Tools:** parseInjuries, dedupByRegion, squareTop3
**Critical:** YES (drives mortality prediction)

## 2. trissPs
**Input:** {age, iss, rts}
**Output:** {ps_pct, lower_95_ci, band}
**Tools:** trissCoefficients, logit, sigmoid
**Critical:** YES

## 3. activationTierClassifier
**Input:** {mechanism, sbp, hr, rr, gcs, penetrating, fall, ejection, mvcSpeed, intubation, bloodLoss, paralysis}
**Output:** {tier: 1|2|3, team_set, eta_set, criteria_met}
**Tools:** mechanismClassifier, vitalsCheck, anatomyCheck
**Critical:** YES (drives team activation)

## 4. mtpTriggerCheck
**Input:** {sbp, hr, lactate, fast, suspected_hemorrhage, mechanism}
**Output:** {trigger, score, ratio_recommendation}
**Tools:** abcScore, clinicalOverride, ratioCompute
**Critical:** YES (HARD RULE: trigger = 1:1:1; override = MD only)

## 5. tbiSeverityScore
**Input:** {gcs, ct_marshall, pupillary, hypoxia, hypotension}
**Output:** {severity, prognosis_band, icp_monitor_indicated}
**Tools:** gcsParse, ctMarshall, pupillaryCheck, btfClassify
**Critical:** YES

## 6. hemorrhageControlPathway
**Input:** {bleed_source, hemodynamics}
**Output:** {pathway: damage_control_surg|angioembolization|pelvic_packing|tourniquet, sequence[]}
**Critical:** YES

## 7. transferDecisionAdvisor
**Input:** {capability_gap, stability, receiving_facility}
**Output:** {decision, time_to_transfer, mode, contraindications}
**Critical:** YES

## Implementation
LangGraph supervisor; 6-stage RAG; MedEmbed 768d primary; gpt-4o + claude-3.5 secondary; med-llama offline fallback; auto-fallback to rule-based 	rauma_center_engine.js.

**BRAVO rule:** Be Rigorous And Verify Outcome — if AI recommends deviation, must name alternative guideline + MD sign-off.

---
*Section 07 of ER-002. AIE voice. L1 DRAFT.*