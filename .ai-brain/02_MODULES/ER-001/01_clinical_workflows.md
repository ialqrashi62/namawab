---
module_id: ER-001
section: 01_clinical_spec
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 Clinical Workflows

## 1. ESI Triage (Emergency Severity Index 5-level)

### ESI Level Definitions
| Level | Definition | Examples | Re-eval | Time-to-Provider |
|-------|-----------|----------|---------|------------------|
| **1** | Resuscitation — immediate life-saving intervention | Cardiac arrest, severe respiratory distress, unresponsive | Continuous | 0 min (provider to bedside) |
| **2** | Emergent — high risk of deterioration, severe pain/distress | STEMI, stroke, sepsis, suicidal with plan | q15-30 min | <10 min |
| **3** | Urgent — stable but needs multiple resources | Abdominal pain (moderate), hip fracture, asthma exacerbation | q30-60 min | <30 min |
| **4** | Less urgent — stable, one resource | Simple laceration, UTI symptoms, minor sprain | q1-2h | <60 min |
| **5** | Non-urgent — stable, no resources | Suture removal, medication refill, cold symptoms | q2-4h | <120 min |

### Triage Decision Tree
```
Is the patient dying? (no pulse, no breathing, unresponsive, severe distress)
  YES -> ESI 1 -> Resus bay -> Provider STAT
  NO -> What resources will the patient need?
    None (medication refill, simple exam) -> ESI 5
    One (labs, imaging, IV meds) -> ESI 4
    Many (2+ of: labs, imaging, IV, procedure, consult) -> ESI 3
    What's the patient's vitals? (HR>100 or RR>20 or SpO2<92% or altered mental status)
      DANGER ZONE -> upgrade to ESI 2
      Stable -> ESI 3
    ESI 2 criteria: high-risk situation, severe pain (>=7/10), new confusion, immunocompromised + fever
```

## 2. Code Activations

### Code Blue (Cardiac/Respiratory Arrest)
- **Trigger:** unresponsive + no pulse OR no breathing
- **Team:** ACLS-trained MD + senior RN + RT + pharmacist (optional)
- **Actions:** CPR start, defibrillator, IV/IO access, epinephrine q3-5min, airway management
- **Documentation:** Code sheet (timed events), CPR quality metrics, ROSC time
- **Time targets:** 1st shock <3 min, epinephrine <5 min, ROSC <30 min target

### Code STEMI
- **Trigger:** ECG shows ST elevation in 2+ contiguous leads, OR new LBBB with symptoms
- **Team:** Cardiology on-call, ED MD, cath lab team
- **Actions:** ASA 325mg PO (chewed), heparin per protocol, activate cath lab
- **Target:** door-to-balloon <90 min

### Code Stroke
- **Trigger:** focal neuro deficit + last-known-well <24h, OR NIHSS >4
- **Team:** Neurology on-call, ED MD, CT tech, stroke coordinator
- **Actions:** STAT CT head (rule out hemorrhage), NIHSS, BP/glucose check
- **Target:** door-to-CT <25 min, door-to-needle <60 min (if tPA candidate)

### Code Trauma
- **Trigger:** mechanism + abnormal vitals (SBP<90, HR>120, RR<10 or >29, GCS<13)
- **Team:** Trauma surgery, ED MD, anesthesia, blood bank
- **Actions:** ATLS primary/secondary survey, FAST, type & crossmatch, MTP activation
- **Target:** primary survey <10 min, CT <30 min if stable

## 3. Critical Care Bundles

### Sepsis Bundle (Surviving Sepsis 2021)
- **Trigger:** qSOFA >=2 OR clinical suspicion + organ dysfunction
- **Within 1 hour:**
  - Lactate measurement (repeat if >2)
  - Blood cultures x2 BEFORE antibiotics
  - Broad-spectrum antibiotics (within 1h, every hour delay = 7% mortality increase)
  - IV crystalloid 30 mL/kg if hypotensive or lactate >=4
  - Vasopressors if MAP <65 after fluid resuscitation
- **Within 3 hours:**
  - Repeat lactate
  - Source control if identified
- **Documentation:** sepsis order set, time-stamped bundle completion

### Acute MI (STEMI) Pathway
- **Trigger:** ST elevation OR new LBBB OR true posterior MI
- **Within 10 min:** ECG, ASA 325mg, IV access x2
- **Within 30 min:** cardiology consult, cath lab activation
- **Within 90 min:** PCI (door-to-balloon)
- **Adjuncts:** P2Y12 inhibitor (ticagrelor 180mg or clopidogrel 600mg), heparin, statin

### Acute Ischemic Stroke Pathway
- **Trigger:** acute focal neuro deficit, last-known-well <4.5h
- **Within 4.5h:** tPA (alteplase 0.9 mg/kg, max 90mg, 10% bolus + 60min infusion)
  - Exclusions: hemorrhage on CT, recent surgery, INR>1.7, platelets<100k, BP>185/110
- **Within 6-24h:** mechanical thrombectomy (large vessel occlusion)
- **BP target:** <185/110 pre-tPA, <180/105 post-tPA
- **Glucose target:** 140-180 mg/dL

## 4. Disposition Decisions

### Admit Criteria
- ESI 1-2 with unresolved emergency
- Needs continuous monitoring (telemetry, ICU)
- Needs inpatient procedure/surgery
- Cannot ambulate / unsafe for home
- Inadequate home support
- Failed outpatient treatment
- Psychiatric admission (suicide risk, psychosis)

### Discharge Criteria
- Stable vitals >1h
- Pain controlled
- Ambulating safely
- Tolerating PO
- Understanding discharge instructions
- Follow-up arranged
- Escort available if needed

### Transfer Criteria
- Need higher level of care (tertiary center)
- Need specialist not available (burn, peds, trauma center)
- Patient/family request
- Bed availability

### AMA (Against Medical Advice)
- Capacity assessment documented
- Risks explained + patient understands
- AMA form signed (witness)
- Discharge instructions + follow-up offered
- Capacity concerns → ethics + psychiatry consult

## 5. Special Populations

### Pediatric (<18)
- Pediatric ESI (modified)
- Weight-based dosing (kg, not age-based)
- Vital signs by age percentile
- Caregiver present at all times
- Child life specialist for procedures

### Geriatric (>=65)
- High risk for atypical presentations (MI without CP, sepsis without fever)
- Polypharmacy review
- Fall risk assessment
- Delirium screen (CAM)
- Goals of care discussion

### Pregnant
- Left lateral decubitus position (>20 weeks)
- Avoid teratogens (ACE-i, warfarin, NSAIDs in 3rd tri)
- RhoGAM if Rh-negative + bleeding
- OB consult for all >20 weeks
- Fetal heart tones + tocometer if >20 weeks

### Psychiatric
- 1:1 sitter for suicide/ homicide risk
- Remove all sharps/belts/laces from room
- Restraints only as last resort (chemical then physical)
- Mandatory psych eval before disposition
- Involuntary hold per local law

## 6. Documentation Requirements (per shift)

### RN Documentation
- Triage assessment + ESI
- Vital signs (q1h ESI 1-2, q2h ESI 3, q4h ESI 4-5)
- Pain score (with intervention + re-assessment)
- Intake/output
- Medications administered
- Procedures performed
- Patient response
- Communication with MD

### MD Documentation
- History (HPI, PMH, meds, allergies, social, family)
- Physical exam
- Differential diagnosis
- Diagnostic plan + rationale
- Treatment plan
- Disposition decision + reasoning
- Communication with consultants
- Time-stamped events (critical for codes)

## 7. Quality Metrics (CQO)

### Time-based
- Door-to-triage
- Door-to-provider
- Door-to-disposition
- Door-to-admit (if admitted)
- Door-to-ECG (chest pain)
- Door-to-balloon (STEMI)
- Door-to-CT (stroke)
- Door-to-needle (tPA)
- Door-to-antibiotics (sepsis)
- LWBS rate (left without being seen)

### Clinical
- Return-to-ED within 72h
- Unplanned admission within 24h of discharge
- Mortality (overall + by ESI)
- Code survival rate
- Sentinel events

### Patient Experience
- Wait time satisfaction
- Pain management satisfaction
- Communication satisfaction
- Overall satisfaction (Press Ganey / similar)
- Complaint rate

## 8. Disaster & Surge Protocols

### MCI (Mass Casualty Incident) Triage
- Switch to START triage (Simple Triage and Rapid Treatment)
- Categories: GREEN (walking wounded), YELLOW (delayed), RED (immediate), BLACK (deceased/expectant)
- Reverse triage for in-ED patients (discharge stable to make room)

### Surge Capacity
- Level 1: normal operations
- Level 2: hold elective admissions, open overflow areas
- Level 3: ED hallway beds, mutual aid, hospital command center activation
- Level 4: divert incoming EMS, regional coordination

### Hospital Incident Command System (HICS)
- Incident commander
- Operations, planning, logistics, finance/admin sections
- Public information officer
- Liaison officer
- Safety officer

---
*Section 01 of ER-001 module. Owner: CMO. L4 validated.*
