# Clinical Context — Cardiology

> **Owner:** CMO + AI Engineer
> **Date:** 2026-07-22

---

## Patient context (input)

```json
{
  "patient_id": "PT-10234",
  "age_years": 62,
  "sex": "male",
  "weight_kg": 78,
  "height_cm": 172,
  "bmi": 26.4,
  "allergies": ["penicillin (anaphylaxis)"],
  "active_meds": [
    "metoprolol 25mg PO BID",
    "apixaban 5mg PO BID",
    "furosemide 40mg PO AM",
    "atorvastatin 40mg PO HS",
    "metformin 1000mg PO BID"
  ],
  "active_problems": [
    "I25.10 ASHD (atherosclerotic heart disease)",
    "I50.22 Chronic systolic heart failure (LVEF 30%)",
    "I48.91 Atrial fibrillation, paroxysmal",
    "I10 Essential hypertension",
    "E11.9 Type 2 diabetes mellitus"
  ],
  "vitals": {
    "hr": 112,
    "bp_sys": 148,
    "bp_dia": 92,
    "spo2": 96,
    "rr": 18,
    "temp_c": 37.0,
    "pain": 0
  },
  "lab_results_recent": {
    "bnp_2026-07-21": 612,
    "cr_2026-07-21": 1.1,
    "k_2026-07-21": 4.2,
    "hba1c_2026-07-15": 7.8,
    "ldl_2026-07-15": 96,
    "troponin_2026-07-22": 0.04
  },
  "imaging_recent": {
    "ecg_2026-07-22_10:15": "sinus tachycardia, 112 bpm, LVH by voltage, no acute ST changes",
    "echo_2026-07-15": "LVEF 30%, mild MR, normal RV, no pericardial effusion"
  },
  "consent_flags": {
    "ai_cds": true,
    "data_sharing": true,
    "privacy_consent_signed": true
  }
}
```

## Encounter context (input)

```json
{
  "encounter_id": "ENC-2026-07-22-001",
  "specialty": "cardiology",
  "triage_level": 2,
  "presenting_complaint": "Palpitations and dyspnea on exertion, 3 days",
  "duration_hours": 72,
  "relevant_history": "New-onset AF on home monitor; no chest pain; no syncope",
  "encounter_type": "outpatient",
  "facility_id": 1
}
```

## Retrieved knowledge (input)

```json
{
  "chunks": [
    {
      "id": "cv-2023-esc-af-007",
      "text": "CHA₂DS₂-VASc scoring: Congestive HF (1), HTN (1), Age ≥75 (2), Diabetes (1), Stroke/TIA (2), Vascular (1), Age 65-74 (1), Sex female (1). Score ≥2 (men) or ≥3 (women) → anticoagulation indicated.",
      "source": "2023 ESC Guidelines for AF management",
      "score": 0.91
    },
    {
      "id": "cv-2022-aha-hf-012",
      "text": "GDMT for HFrEF: ARNI (sacubitril/valsartan) OR ACE-i/ARB; beta-blocker (carvedilol, metoprolol succinate, bisoprolol); MRA (spironolactone, eplerenone); SGLT2i (dapagliflozin, empagliflozin).",
      "source": "2022 AHA/ACC Heart Failure Guidelines",
      "score": 0.88
    }
  ],
  "guidelines_active": ["ESC 2023", "AHA/ACC 2022", "Saudi Heart Assoc 2024"],
  "form_template_id": "cardiology-outpatient-v3"
}
```

## CDS run result (output)

```json
{
  "ok": true,
  "icd10_am_codes": ["I48.91", "I50.22", "I10", "E11.9"],
  "recommendations": [
    {
      "action": "Continue apixaban (already on therapeutic anticoagulation for AF + elevated CHA₂DS₂-VASc = 4)",
      "evidence": "ESC 2023 AF guideline; CHA₂DS₂-VASc ≥2 (men) mandates anticoagulation",
      "urgency": "routine",
      "cite": "cv-2023-esc-af-007"
    },
    {
      "action": "Consider rate control optimization — add diltiazem or increase metoprolol (HR 112 at rest)",
      "evidence": "AHA/ACC 2023 AF guideline; target resting HR <80 in HFrEF",
      "urgency": "urgent",
      "cite": "cv-2023-aha-af-014"
    },
    {
      "action": "Optimize GDMT — patient on metoprolol, furosemide; consider adding SGLT2i (dapagliflozin 10mg) per 2022 AHA/ACC HFrEF GDMT",
      "evidence": "Class I recommendation for HFrEF with LVEF ≤40%",
      "urgency": "routine",
      "cite": "cv-2022-aha-hf-012"
    }
  ],
  "drug_interactions": [
    { "drug_a": "apixaban", "drug_b": "furosemide", "severity": "minor", "note": "diuretic may increase apixaban levels; monitor renal function", "cite": "drug-interactions-2024-007" }
  ],
  "allergy_alerts": [
    { "allergen": "penicillin", "med": "amoxicillin", "severity": "anaphylaxis" }
  ],
  "red_flags": ["LVEF 30% — heart failure team should be following"],
  "citations": [
    { "chunk_id": "cv-2023-esc-af-007", "source": "2023 ESC Guidelines for AF management", "score": 0.91 },
    { "chunk_id": "cv-2022-aha-hf-012", "source": "2022 AHA/ACC Heart Failure Guidelines", "score": 0.88 }
  ],
  "confidence": 0.87,
  "model_version": "gpt-4o-mini-2025-01",
  "latency_ms": 1840
}
```

---

End of context spec.
