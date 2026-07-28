# 17 — Data Flow (CARD-001)

> Owner: SA · Tier 1

## Flow 1: Cardiology outpatient consult (wf-1)

```
[Patient arrives]
    ↓
[Receptionist] → POST /api/patients/register → DB(patients)
    ↓
[Nurse] → POST /api/vitals → DB(vitals) + CDS check
    ↓
[Nurse] → POST /api/cardiology/ecg → DB(ecg_records) + phi_vault(ecg_file)
    ↓                       ↓
    ↓                [Engine] cardiology.ecgBasic(ecg) → redFlag?
    ↓                       ↓
    ↓                 [IF redFlag] → POST /api/cardiology/red-flags/STEMI/activate → CODE STEMI
    ↓                       ↓
    ↓                 [Paging] cardiologist on-call
    ↓
[Cardiologist] → GET /api/cardiology/encounters/:id → DB
    ↓
[Cardiologist] → POST /api/cardiology/encounters/:id/notes → DB(encounter_notes)
    ↓
[Cardiologist] → POST /api/cardiology/orders (echo, stress, holter, labs) → DB(orders)
    ↓
[Engine] cardiology.cdsCheck(orders) → [DDI, dose, contraindication]
    ↓
[Cardiologist] → POST /api/prescriptions (NPHIES e-prescription) → NPHIES
    ↓
[Nurse] → POST /api/appointments (follow-up) → DB
    ↓
[Engine] cardiology.heartScore / cha2ds2vasc / hasBled / hfGdmt (as needed)
    ↓
[IF any redFlag] → redFlag protocol activated
    ↓
[Audit] hash-chained entry written
```

## Flow 2: CODE STEMI (wf-2)

```
[ER Nurse] → 12-lead ECG within 10 min → DB(ecg_records)
    ↓
[Engine] cardiology.ecgBasic → redFlag=true (STEMI)
    ↓
[Auto] POST /api/cardiology/red-flags/STEMI/activate
    ↓
[Paging] ER doc + cardiologist + cath lab team (parallel)
    ↓
[ER Doc] → ASA 300mg + ticagrelor 180mg → DB(medication_admin)
    ↓
[ER Doc] → heparin bolus → DB(medication_admin)
    ↓
[Cath Team] → accept page → DB(activation_status)
    ↓
[Cardiologist] → POST /api/cardiology/cath (PCI procedure) → DB(cath_reports) + phi_vault
    ↓
[IDM Guard] same key returns same response (prevent duplicate PCI billing)
    ↓
[CCU Nurse] → admit to CCU → DB(icu_admissions)
    ↓
[Audit] CRITICAL: door_to_balloon, all_meds, cath_findings
    ↓
[NPHIES] claim submission with bundle NPH-CARD-PCI
```

## Flow 3: Co-pilot LLM query

```
[Cardiologist] → POST /api/cardiology/copilot/query
    ↓
[Auth + T + Role + VB] validated
    ↓
[Service] look up patient context (RLS enforced) → DB(patient, allergies, meds, labs)
    ↓
[Service] redact PHI → ctx_redacted
    ↓
[AIE] triage: classify intent (clinical_q | rx | red_flag | admin)
    ↓
[AIE] retriever.query("nm_cardio_guidelines_v1", query, k=5, filter: tenant+lang)
    ↓
[AIE] rerank top 5 → top 3
    ↓
[AIE] llm.call(gpt-4o, system=cardio_persona, ctx=ctx+docs, question)
    ↓
[AIE] parser: pydantic.CardioQAResponse
    ↓
[AIE] reviewer: citation + refusal check
    ↓
[IF redFlag detected] → also POST /api/cardiology/red-flags/...
    ↓
[Audit] trace_id + cost + tokens
    ↓
[Response] { answer_ar, source, evidence_level, warnings, cds_rules, red_flag }
```

## Flow 4: HF GDMT optimization (chain-3)

```
[Cardiologist] → POST /api/cardiology/risk-scores/hf-gdmt
    ↓
[Auth + T + Role + VB] validated
    ↓
[Service] lookup_patient_context (RLS) → {ef, nyha, bp, hr, egfr, k, current_meds, allergies}
    ↓
[Service] lookup_active_medications (RLS)
    ↓
[Service] lookup_recent_labs (RLS, 30d)
    ↓
[Engine] cardiology.hfGdmt(ctx) → {changes, contra, monitor, redFlag}
    ↓
[CDS check] run CDS-HF-GDMT, CDS-HF-HYPERKALEMIA, CDS-HF-DIURETIC-DOSE
    ↓
[IF redFlag] → redFlag activated
    ↓
[Audit] GDMT recommendations logged
    ↓
[Response] { changes, contra, monitor, redFlag }
```

## Failure modes

| Failure | Detection | Response |
|---------|-----------|----------|
| Tenant context missing | requireTenantScope | 403 |
| LLM service down | timeout/circuit-breaker | 503 + retry |
| Vector index missing | init check | 503 + alert |
| PHI in vector | redact pre-embed | log + alert |
| Red flag not detected | reviewer + 4-eye rule | alert + block |
| NPHIES down | claim status | queue + retry |
| Audit log down | write-fail | 503 (fail-closed) |
