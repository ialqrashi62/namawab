# NamaMedical — AI Governance Policy
v1.0 — Owner: AI Lead + CMO + DPO + CISO — Reviewed semi-annually
Aligned with: KSA SDAIA AI Ethics Principles, ISO/IEC 42001 (AI mgmt systems),
WHO Ethics & Governance of AI for Health, FDA SaMD GMLP, EU AI Act risk tiers.

## 1. Purpose
Establish guardrails for safe, ethical, transparent, and effective use of AI within
NamaMedical clinical and operational workflows.

## 2. Scope
All AI/ML components: LLM-based co-pilots, classical ML models (e.g., ECG AI),
imaging AI, NLP extractors, recommender systems, statistical predictors.

## 3. Principles (anchored on SDAIA + WHO)
1. **Patient safety first** — risks of harm minimized; advisory-only by default.
2. **Human-in-the-loop** — final clinical decisions are physicians'.
3. **Transparency** — patients/clinicians informed when AI is used.
4. **Explainability** — outputs cite sources and surface confidence.
5. **Fairness** — bias monitored across age, sex, nationality, language.
6. **Privacy by design** — PHI redaction, KSA data residency, minimum necessary.
7. **Accountability** — owners named per model; audit trail mandatory.
8. **Sustainability** — efficient inference; avoid unnecessary recomputation.

## 4. Risk tiers
| Tier | Definition | Examples | Controls |
|------|-----------|----------|---------|
| Low | Operational, no clinical impact | KPI summarization | standard QA |
| Moderate | Clinical-adjacent, advisory | order-set suggestion | model card + review |
| High | Direct clinical advisory | ECG STEMI flag, sepsis alert | rigorous validation, drift monitor, opt-out |
| Critical | Could change life-critical decision | autonomous triage, pediatric dosing | NOT permitted autonomously |

## 5. Lifecycle gates
1. **Inception**: clinical need + risk tier proposal → AI Governance Committee approval.
2. **Data**: provenance + consent + de-identification check + license.
3. **Build**: reproducible training; held-out test sets representative of KSA population.
4. **Validation**: prospective study where feasible; per-subgroup performance reported.
5. **Model card**: published before launch (template in `model_card_template.md`).
6. **Deployment**: shadow mode → silent → advisory; opt-in feature flag.
7. **Monitoring**: drift, fairness, latency, satisfaction; monthly review for High tier.
8. **Decommission**: when superseded or no longer fit; archive model card.

## 6. Vendor / external models
- DPA with PHI restrictions; KSA-region inference required.
- Independent evaluation on KSA validation set before clinical use.
- No training on our PHI without explicit institutional + patient consent.

## 7. Prompt engineering & safety
- System prompts version-controlled; changes go through PR review.
- PHI redaction layer mandatory.
- Prompt-injection defenses: delimiters, content classifiers, refusal patterns.
- Output post-filter for medical claims; confidence threshold ≥ 0.7 for advisory.
- Self-critique node before emit; safety-critical → human confirm.

## 8. Audit & incident
- Every AI invocation logged (user, time, prompt-hash, response-hash, confidence,
  citations, safety flag).
- Misuse / hallucination incidents follow `runbooks/incident_response.md`.
- AI-related adverse events logged in OVR (G36) with mandatory RCA-2.

## 9. Human oversight
- "Human-in-the-loop" required for all High tier outputs.
- Override pathway: clinician can dismiss AI suggestion with reason.
- Patient may request human-only review (Patient Bill of Rights §18).

## 10. Bias & fairness monitoring
- Subgroup performance by age, sex, nationality (quarterly).
- Trigger investigation if disparate performance > 5% absolute.
- Mitigation: data augmentation, threshold calibration, retraining.

## 11. Roles
- **AI Lead**: technical strategy, model lifecycle.
- **AI Governance Committee** (CMO, AI Lead, DPO, CISO, Chief Quality):
  monthly review of new launches and incidents.
- **Model Owner**: per model — accountable for performance, monitoring, retirement.
- **Clinical Champions**: per department — usability + acceptance.

## 12. Documentation requirements per model
- Model card (purpose, data, performance, limitations, intended use, ethical considerations).
- Training data sheet.
- Validation report (KSA cohort).
- Risk assessment.
- Monitoring plan.
- Decommission criteria.

## 13. Communication
- Patient-facing: Privacy Policy §10 + Consents §6.
- Clinician-facing: in-app banners ("AI advisory"), training modules.
- Public: high-level disclosures on website; no model details that enable evasion.

## 14. Compliance
- SDAIA AI ethics evaluations as required.
- ISO/IEC 42001 alignment (AI management system).
- FDA/CE classifications for SaMD where applicable.
- KSA-MoH AI in Healthcare directives (when published).

## 15. Continuous improvement
- Annual policy review.
- Industry signal monitoring (incidents elsewhere) → playbook updates.
- AI literacy training mandatory for clinical staff annually.
