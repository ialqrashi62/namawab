# CARD-001 — RAG Chains

## Chain 1: STEMI Activation
- **Trigger:** ECG with ST elevation in 2+ contiguous leads
- **Steps:**
  1. Confirm STEMI (vs pericarditis, BER, early repol)
  2. Identify location (anterior, inferior, lateral)
  3. Activate cath lab
  4. Aspirin + P2Y12
  5. Anticoag
  6. Statin
  7. Door-to-balloon <90 min
- **Output:** STEMI protocol + cath lab activation

## Chain 2: Chest Pain Triage
- **Trigger:** Chest pain + ECG
- **Steps:**
  1. ECG interpretation
  2. HEART score
  3. Troponin (0h, 3h)
  4. Risk stratify
  5. Disposition
- **Output:** Disposition (discharge, observation, admit)

## Chain 3: AF Management
- **Trigger:** New AF on ECG
- **Steps:**
  1. Confirm AF
  2. Assess rate, duration, symptoms
  3. CHA2DS2-VASc
  4. HAS-BLED
  5. Rate vs rhythm control
  6. Anticoagulation
  7. Cardioversion if appropriate
- **Output:** AF care plan

## Chain 4: Heart Failure GDMT
- **Trigger:** HFrEF (EF <40%)
- **Steps:**
  1. ARNI (sacubitril-valsartan)
  2. Beta-blocker
  3. MRA
  4. SGLT2i
  5. Diuretic
  6. Education
  7. Follow-up
- **Output:** HF treatment plan

## Chain 5: Syncope Workup
- **Trigger:** Loss of consciousness
- **Steps:**
  1. History (witness, prodrome, post-ictal)
  2. Exam (orthostatic, murmur)
  3. ECG
  4. Echo (if indicated)
  5. Tilt table (if indicated)
  6. Holter/loop (if arrhythmia suspected)
  7. Disposition
- **Output:** Syncope workup

## Vector Indexes
- **ecg_interpretation_idx** — 300 patterns
- **acs_protocols_idx** — 200 ACS
- **heart_failure_idx** — 150 HF
- **afib_protocols_idx** — 100 AF
- **echo_findings_idx** — 200 echo
- **valvular_disease_idx** — 100 valvular
- **cardiomyopathy_idx** — 80 CM
- **anticoagulation_idx** — 100 anticoag
