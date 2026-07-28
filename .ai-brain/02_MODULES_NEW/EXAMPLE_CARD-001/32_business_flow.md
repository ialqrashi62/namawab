# 32 — Business Flow (CARD-001)

> Owner: PM/UX · Tier 1

## Flow 1: Outpatient cardiology visit (happy path)

```
[Patient] schedules via portal or phone
    ↓
[Reception] confirms insurance eligibility (NPHIES pre-check)
    ↓
[Patient] arrives
    ↓
[Nurse] checks in: demographics + vitals + ECG
    ↓
[Cardiologist] opens station: HPI + exam + orders (echo, stress, labs, meds)
    ↓
[Engine] CDS check on orders + meds (DDI, dose, contraindication)
    ↓
[Cardiologist] reviews CDS, signs orders
    ↓
[Cardiologist] writes Rx (NPHIES e-prescription, server-side money)
    ↓
[Nurse] schedules follow-up + patient education
    ↓
[Patient] receives discharge summary + follow-up date
    ↓
[Audit] hash-chained entry per action
    ↓
[Billing] claims generated automatically
```

## Flow 2: ER chest pain → STEMI

```
[Patient] arrives with chest pain
    ↓
[ER Triage] ESI level 1-2
    ↓
[ER Nurse] 12-lead ECG within 10 min
    ↓
[Engine] cardiology.ecgBasic → redFlag=true (STEMI)
    ↓
[Auto] CODE STEMI activated
    ↓
[Pages] ER doc + cardiologist + cath lab team (parallel)
    ↓
[ER Doc] ASA 300mg + ticagrelor 180mg PO
    ↓
[Cath Team] accepts page, cath lab prep
    ↓
[Cardiologist] arrives, reviews ECG
    ↓
[Cardiologist] PCI with stent (DES) — within 90 min door-to-balloon
    ↓
[Cath Lab Nurse] records procedure (cath report)
    ↓
[CCU Nurse] admit to CCU
    ↓
[Cardiologist] discharge plan
    ↓
[NPHIES] claim submitted (NPH-CARD-PCI bundle)
    ↓
[Follow-up] cardiac rehab enrollment
```

## Flow 3: HF clinic visit (chronic)

```
[Patient] scheduled (every 1-3 months)
    ↓
[HF Nurse] intake: weight + BP + symptoms (tele-pre if available)
    ↓
[Engine] auto-check weight trend: if gain > 2kg/3d → redFlag
    ↓
[Cardiologist] exam + GDMT review
    ↓
[Engine] cardiology.hfGdmt → recommendations
    ↓
[Cardiologist] accepts/modifies + writes Rx
    ↓
[Pharmacist] med reconciliation
    ↓
[HF Nurse] education (diet, fluid, daily weight, when to call)
    ↓
[Patient] leaves with plan + next visit
    ↓
[Engine] monitor labs (K, Cr, BNP) at follow-up
```

## Flow 4: AF new diagnosis (chronic)

```
[Patient] presents with palpitations
    ↓
[Cardiologist] ECG → AF
    ↓
[Engine] cardiology.cha2ds2vasc + hasBled
    ↓
[Cardiologist] rate vs rhythm control decision
    ↓
[Engine] anticoagulation recommendation (DOAC preferred)
    ↓
[Cardiologist] Rx: anticoag + rate/rhythm control
    ↓
[Engine] CDS check: DDI, renal dose
    ↓
[Cardiologist] refer to EP for ablation evaluation (if paroxysmal + young)
    ↓
[Patient] education + follow-up
    ↓
[Long-term] device interrogation (PM if AF burden)
```

## Flow 5: Pre-op cardiac clearance

```
[Surgeon] requests cardiac clearance
    ↓
[Cardiologist] clinic visit
    ↓
[Engine] cardiology.preopCardiac → RCRI score
    ↓
[Cardiologist] review + troponin (if intermediate-high risk)
    ↓
[Cardiologist] echo (if symptomatic or LV dysfunction suspected)
    ↓
[Cardiologist] optimize: beta-blocker, statin, anticoag hold decision
    ↓
[Engine] preop_cardiac chain → clearance letter
    ↓
[Cardiologist] signs clearance
    ↓
[Anesthesiologist] receives letter
    ↓
[Surgery] proceeds
```

## Flow 6: Co-pilot query (multi-step)

```
[Cardiologist] opens co-pilot tab
    ↓
[Cardiologist] types question
    ↓
[Engine] AIE: triage intent
    ↓
[Engine] AIE: retrieve top 5 from nm_cardio_guidelines_v1
    ↓
[Engine] AIE: rerank → top 3
    ↓
[Engine] AIE: LLM call with system prompt
    ↓
[Engine] AIE: parse + review (citation check, refusal check)
    ↓
[IF red_flag detected] → also activate red_flag
    ↓
[UI] show answer + sources + cds_rules + red_flag status
    ↓
[Cardiologist] saves to encounter (optional)
    ↓
[Audit] trace_id + cost + tokens stored
```

## Flow 7: Red flag activation (manual)

```
[Doctor] detects red flag in clinical context
    ↓
[Doctor] clicks "Activate CODE" button on encounter
    ↓
[Doctor] confirms with reason
    ↓
[Engine] create cardio_red_flag_activations row
    ↓
[Engine] page on-call team (priority channel)
    ↓
[Engine] audit CRITICAL entry
    ↓
[UI] critical banner shown
    ↓
[On-call] ACKs page
    ↓
[Action] cath lab / ICU / pharmacy / blood bank as needed
    ↓
[Doctor] signs off after 4-eye review
    ↓
[Engine] close activation, log outcome
```

## Flow 8: NPHIES claim (money)

```
[Cardiologist] signs cath / device report
    ↓
[Billing] opens claim
    ↓
[Engine] auto-populate from report
    ↓
[Engine] NPHIES eligibility check
    ↓
[Engine] amount_total + NPHIES bundle
    ↓
[Billing] review + submit
    ↓
[Engine] submit to NPHIES with Idempotency-Key
    ↓
[Engine] status: submitted → response
    ↓
[IF approved] → paid status
    ↓
[IF denied] → queue for review + retry
    ↓
[Engine] audit hash-chained
```

## Cross-cutting flows

- All flows: tenant-scoped (RLS)
- All flows: audit-log every action (hash-chained)
- All flows: bilingual (AR + EN)
- All flows: red-flag detection at every step
- All flows: Golden Access Rule enforced
- All flows: PHI encrypted in storage, redacted in logs
