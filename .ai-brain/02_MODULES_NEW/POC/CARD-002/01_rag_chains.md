<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — LangChain / LangGraph Chains (8 chains)

## 1. pci_risk_stratifier
**Input:** age, vessel tree, syntax score, GRACE vars, TIMI vars
**Output:** {syntax_band, grace_risk, timi_30d_mortality, recommendation}
**Tools:** syntax_scorer, grace_calculator, timi_stemi
**Critical:** YES (drives PCI decision)

## 2. structural_heart_mdt_summarizer
**Input:** patient demographics, echo, CT, STS, frailty, comorbidities
**Output:** MDT summary letter (EN + AR), recommendation, alternatives
**Tools:** fhir_patient_lookup, echo_ct_extract, sts_score, frailty_score
**Critical:** YES (gates TAVR/MitraClip scheduling)

## 3. cin_risk_predictor
**Input:** eGFR, age, diabetes, contrast_volume_ml, hydration_protocol
**Output:** {risk_band: low|moderate|high, recommendation, post_egfr_48h_warning}
**Tools:** egfr_calc, mehta_risk_score, contrast_history_lookup
**Critical:** YES (CIN is leading cause of AKI post-cath)

## 4. dapt_decision_support
**Input:** PCI indication, bleeding risk (PRECISE-DAPT, CRUSADE), ischemic risk (DAPT)
**Output:** {duration_months, p2y12_recommendation, monitoring_plan}
**Tools:** dapt_score, precise_dapt_score, bleeding_risk, ischemic_risk
**Critical:** YES (wrong DAPT = stent thrombosis or bleed)

## 5. radial_vs_femoral_access_advisor
**Input:** Allen test, BMI, prior CABG, vessel tortuosity, operator skill
**Output:** {recommended_access, rationale, fallback}
**Tools:** access_optimizer
**Critical:** NO (operator decision)

## 6. stemi_activation_triage
**Input:** ECG (12-lead), symptoms, vitals
**Output:** {stemi_confirmed, activation_tier, lab_to_activate, eta}
**Tools:** ecg_stemi_detector (vision model), red_flag_classifier
**Critical:** YES — must fire <60s (drives D2B)

## 7. cath_report_generator
**Input:** procedure event log, devices, complications, findings
**Output:** Structured cath report (EN), AR translation
**Tools:** procedure_event_log, cath_report_template, lesion_classifier
**Critical:** NO (LLM-assisted; MD must review+sign)

## 8. discharge_summary
**Input:** procedure summary, DAPT plan, follow-up, education
**Output:** Patient-friendly discharge summary (AR 5th-grade reading level)
**Tools:** consent_template, reading_level_5_rewriter, i18n_translator
**Critical:** NO (LLM-assisted; RN must review)

## Implementation
LangGraph supervisor pattern; 6-stage RAG pipeline (query rewrite → hybrid retrieval → rerank → context → LLM → validation). PII redacted BEFORE external LLM. MedEmbed 768d primary; gpt-4o + claude-3.5 secondary; med-llama-70b offline fallback. All LLM calls traced to LangSmith + Helicone.

---
*Section 07 of CARD-002. AIE voice. L1 DRAFT.*