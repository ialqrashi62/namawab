# 05 — Prompt Engineering (CARD-001)

> Owner: AIE · Snippet: snippet:ccs-prompt-template · Tier 1

## Goal
Allow clinicians to ask natural-language questions and get guideline-backed answers in AR/EN, with citations, evidence levels, and red-flag detection.

## Layered prompt design

```
Layer 1: ROOT_SYSTEM_POLICY  (immutable, loaded once)
  - Persona, language, refusal rules, compliance, safety, golden-access

Layer 2: DEPARTMENT_PERSONA  (per dept, loaded on /api/<dept>/*)
  - Specialty keywords, top guidelines, common pitfalls, dept-specific refusals

Layer 3: USER_CONTEXT  (per request)
  - Patient context (PHI-redacted), user role, current encounter, retrieved docs

Layer 4: USER_QUERY  (per turn)
  - User's actual question
```

## Key decisions

- **Model:** GPT-4o or Claude-3.5-Sonnet (clinical + multilingual). Fallback to local `bge-m3` + `Llama-3-70B` for low-stakes.
- **Temperature:** 0.1 (clinical accuracy)
- **Max output tokens:** 1000
- **Top-p:** 0.9
- **Stream:** false (full response for citation integrity)
- **Context window strategy:** see `07_context_window.md`

## Persona (Layer 2)

```
You are a Cardiology AI Co-pilot for NamaMedical.
Specialty: General + Interventional + EP + HF + Preventive.
Languages: AR primary, EN secondary, RTL.
Guidelines: ACC/AHA 2024, ESC 2023, NPHIES-Cardiology-Bundle, SFDA.
Decisions: defer to human clinician. Refuse on missing context.
Cite: guideline name + year + section + page.
Evidence: A (RCT/meta) / B (cohort) / C (case/opinion).
```

## Refusal rules

- No diagnosis without patient context.
- No prescription recommendation without checking CDS rules.
- No disclosure of PHI to other tenants.
- No treatment change without clinician sign-off.
- No fabricated citations.

## Few-shot examples (Layer 3 augmentation)

- Q: "ما تقييمي للـ HEAR score؟" → A: HEART score components, evidence, risk, recommended next step
- Q: "Is this ECG STEMI?" → A: criteria, measurements, decision (likely yes/no), red-flag protocol
- Q: "DOAC dosing for AF patient with CrCl 35?" → A: dosing table, CDS check, citation

## Eval set (20 prompts)

1. STEMI recognition
2. CHA2DS2-VASc calculation
3. HAS-BLED calculation
4. Heart failure GDMT optimization
5. Anticoagulation in AF + CKD
6. Pre-op cardiac risk
7. Syncope workup
8. Hypertension management
9. Lipid management (statin + non-statin)
10. Chest pain differential
11. Palpitations workup
12. Murmur recognition
13. Antithrombotic therapy post-PCI
14. Pregnancy + cardiac disease
15. ECG interpretation
16. Echo interpretation
17. Stress test interpretation
18. Holter interpretation
19. Device follow-up
20. Drug interactions (warfarin/amiodarone/DOAC)

## Cost guard

- Per-call input: 4,000 tokens
- Per-call output: 1,000 tokens
- Monthly per-tenant cap: $100 (LLM) + $25 (embeddings)
- Alerts: 80% notify, 100% throttle
