# G20 — التخصصات الدقيقة للأطفال (Pediatric Subspecialties)

## 0) Meta
```yaml
dept_key: "pediatric_subspec"
group_id: "G20"
sub_units: [peds_cardio, peds_cardio_cath, peds_cardio_surgery,
            peds_nephro, peds_gi, peds_hem_onc, peds_ophth, peds_ent,
            peds_derm, peds_endocrine, peds_rheum, peds_ortho,
            peds_surg_birth_defects, peds_surg_laparoscopy, peds_surg_oncology]
```

## 1) System Prompt
```text
You are NamaMedical-PedsSubspec Assistant.
GUARDRAILS: AAP, ESPN, NASPGHAN, SIOP (peds oncology), ESPED, CHARGE for congenital.
- All meds weight-based; verify max-doses for age band.
- Congenital workup: timing windows critical (DDH 6w, retinopathy of prematurity ≤4w).
- Peds onc: COG/SIOP protocols; pediatric-specific consent.
TOOLS: weight_dose_calc, congenital_classifier, peds_chemo_dose_check,
       audit_growth_plate, escalate.
```

## 2) Workflow
LangGraph: classify subspec → load(peds context + parental consent) → rag(subspec guidelines) → tools → critique.

## 3) API
- One namespace per subspec: `/api/v1/peds/{cardio|nephro|gi|hem-onc|ophth|ent|derm|endo|rheum|ortho|surg}/...`
- Common: `/api/v1/peds/sharedmeds`, `/api/v1/peds/consent_minor`
- `/api/v1/peds_subspec/ai/ask` LangGraph router.

Events: per subspec `peds.{sub}.event.completed`.

## 4) Data
- Reuse adult tables with `is_pediatric BIT` flag + `corrected_age_months` calculated column.
- Add `peds_consent_minor (id, patient_id, parent_guardian_id, signed_at, scope)`.
- `peds_congenital_workup (id, patient_id, suspected_dx, screen_done_at, result)`.
- `peds_drug_doses (id, patient_id, drug, dose_mg_per_kg, total_mg, max_mg_for_age)`.

### 4.2 Vector
- `kb_guidelines_peds_{subspec}` (one per subspec)
- `kb_peds_drug_formulary`

## 5) Frontend
Per-subspec dashboards mirroring adult equivalents, with peds-specific overlays (growth chart sidebar, weight/age banner everywhere). Components: `<PedsBanner>`, `<WeightDoseGuard>`, `<ConsentMinorPad>`.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard, with stricter test gates for dose-calc paths.
- BPMN: `peds_congenital_screening.bpmn`, `peds_subspec_referral.bpmn`.
```gherkin
Feature: Weight-based dose guard
  Scenario: Order in mg without per-kg basis for pediatric
    Given a patient is 8 kg
    When physician enters paracetamol 500 mg PO TID
    Then system blocks order (max 15 mg/kg/dose = 120 mg) and requests recalculation
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#fb7185`. Seeders cross-cutting. PDPL minor extra-strict, CBAHI peds bundles, MoH disability and rare-disease registries.

## 23) Risks
Subspecialist workforce; transition-to-adult pathway design; medication off-label peds; data residency for peds genetics.
