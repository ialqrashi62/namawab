# Prompt Engineering — Cardiology

> **Owner:** AI Engineer
> **Date:** 2026-07-22
> **Cluster:** cardiology.dbml
> **Status:** A (existing) — extend per Phase 3 plan

---

## Input (structured)

```json
{
  "patient": {
    "patient_id": "string",
    "age_years": "int (0-120)",
    "sex": "male|female",
    "weight_kg": "number (0-400)",
    "allergies": ["string"],
    "active_meds": ["string"],
    "active_problems": ["ICD-10-AM code"],
    "vitals": { "hr": "int", "bp_sys": "int", "bp_dia": "int", "spo2": "int", "rr": "int", "temp_c": "number" },
    "lab_results_recent": ["Lipid panel, BNP, Troponin, TSH, BMP, CBC"],
    "imaging_recent": ["ECG, Echo, Stress, Cath, MRI"],
    "consent_flags": { "ai_cds": "bool", "data_sharing": "bool" }
  },
  "encounter": {
    "encounter_id": "string",
    "specialty": "cardiology",
    "triage_level": "1-5 (ESI)",
    "presenting_complaint": "string",
    "duration_hours": "int",
    "relevant_history": "string"
  },
  "question": "string (free text)"
}
```

## Output (structured, JSON)

```json
{
  "ok": true,
  "icd10_am_codes": ["I25.10", "I50.22"],
  "recommendations": [
    {
      "action": "string",
      "evidence": "string",
      "urgency": "stat|urgent|routine",
      "cite": "chunk_id"
    }
  ],
  "drug_interactions": [
    { "drug_a": "...", "drug_b": "...", "severity": "...", "cite": "chunk_id" }
  ],
  "allergy_alerts": [
    { "allergen": "...", "med": "...", "severity": "anaphylaxis|mild" }
  ],
  "red_flags": ["LVEF <30% → escalate"],
  "citations": [
    { "chunk_id": "string", "source": "string", "score": "number" }
  ],
  "confidence": "0.0-1.0",
  "model_version": "gpt-4o-mini-2025-01",
  "latency_ms": 0
}
```

## Guardrails

1. **No diagnosis without clinician confirmation.** LLM is decision support, not decision.
2. **Always cite a guideline chunk** (chunk_id present, score ≥0.7).
3. **Refuse if question is outside cardiology scope** → route to correct dept.
4. **Reject if input contains unredacted PHI markers** (full SSN, full national ID, full DOB) → return 422.
5. **Drug-allergy and drug-drug interaction checks are mandatory** for any medication suggestion.
6. **STEMI red flag:** if `troponin` rising OR `st_elevation=true` → STAT response + page on-call.

## Eval Set (50 golden Q&A)

- 10 ACS (STEMI/NSTEMI/unstable angina) scenarios
- 10 Heart failure (HFrEF, HFpEF, acute decompensated)
- 10 AF (rate/rhythm, anticoagulation, cardioversion)
- 10 Hypertension (essential, secondary, resistant)
- 10 Valvular (AS, MR, MS, endocarditis)
- Each must pass with 90% accuracy vs expert cardiologist review.

## Re-rank

- Initial retrieval: top-50 by cosine.
- Re-rank: cross-encoder/ms-marco-MiniLM (top-5).
- Threshold: chunk score ≥0.7 to be cited.

---

End of file.
