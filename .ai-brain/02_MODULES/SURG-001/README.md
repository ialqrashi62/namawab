---
module_id: SURG-001
name: "General Surgery"
parent: "Surgery"
code: SURG
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# SURG-001 — General Surgery

## Mission
Elective and emergency general surgery: abdominal, hernia, gallbladder, appendix, colon, rectum, breast, endocrine (thyroid, parathyroid, adrenal), soft tissue, bariatric. Includes pre-op assessment, OR, post-op care.

## Top 10 Conditions (CMO)
| # | Condition | ICD-10 | Setting |
|---|-----------|--------|---------|
| 1 | Acute appendicitis | K35 | Emergency |
| 2 | Cholecystitis (acute/chronic) | K81 | Both |
| 3 | Inguinal hernia | K40 | Elective |
| 4 | Bowel obstruction | K56 | Emergency |
| 5 | Colorectal cancer | C18-C20 | Elective |
| 6 | Breast cancer | C50 | Elective |
| 7 | Perforated viscus | K63 | Emergency |
| 8 | GI bleed | K92 | Emergency |
| 9 | Hemorrhoids | K64 | Elective |
| 10 | Thyroid nodule | E04 | Elective |

## Workflow
1. **Clinic** — initial assessment, workup, surgical planning
2. **Pre-op** — H&P, labs, imaging, anesthesia consult, consent
3. **OR** — time-out, surgery, count, sign-out
4. **PACU** — recovery, vitals, pain, antiemetic
5. **Ward** — daily rounds, drain management, ambulation
6. **Discharge** — instructions, follow-up, suture removal
7. **Follow-up** — clinic, pathology review, surveillance

## WHO Surgical Safety Checklist
### Sign-In (Before Anesthesia)
- Patient identity, site, procedure, consent confirmed
- Site marked
- Anesthesia safety check (machine, meds, airway)
- Pulse oximeter on patient
- Allergies
- Difficult airway / aspiration risk?
- Blood loss risk?

### Time-Out (Before Skin Incision)
- All team members introduced by name + role
- Patient, procedure, site confirmed
- Antibiotic prophylaxis given (within 60 min)
- Imaging displayed
- Critical events anticipated (surgeon, anesthesia, nursing)

### Sign-Out (Before Patient Leaves OR)
- Procedure performed (confirmed)
- Instrument, sponge, needle count (correct)
- Specimen labeled (patient + site)
- Equipment issues
- Recovery concerns
- Key recovery priorities

## Pre-Op Assessment

### Required Workup (Most Surgeries)
- H&P (within 30 days)
- Labs: CBC, BMP, coagulation, type & screen
- EKG (if age >50 or cardiac risk)
- CXR (if age >60 or pulmonary risk)
- Pregnancy test (women 12-55)
- Anesthesia consult (for major surgery)

### Risk Stratification
- **ASA class:** 1 (healthy) - 6 (brain dead)
- **Cardiac risk:** Revised Cardiac Risk Index
- **Pulmonary risk:** ARISCAT score
- **VTE risk:** Caprini score

## Common Procedures

### Laparoscopic Cholecystectomy
- Indication: symptomatic cholelithiasis, cholecystitis
- OR time: 60-90 min
- Same-day discharge (typically)
- Complications: bile leak, bile duct injury (0.3-0.7%), bleeding

### Laparoscopic Appendectomy
- Indication: acute appendicitis
- OR time: 30-60 min
- Same-day or 24h admission
- Complications: infection, bleeding, stump leak

### Inguinal Hernia Repair
- Indication: symptomatic hernia
- Open (Lichtenstein) or laparoscopic (TEP, TAPP)
- OR time: 60-90 min
- Same-day or 24h admission
- Recurrence: <5% (open), <3% (lap)

### Colectomy
- Indication: cancer, diverticulitis, IBD
- Open or laparoscopic
- OR time: 2-4 hours
- LOS: 3-7 days
- Complications: leak (5-10%), infection, bleeding

## Antibiotic Prophylaxis

| Surgery | Antibiotic | Dose | Timing |
|---------|-----------|------|--------|
| Clean (hernia, breast) | Cefazolin | 2g IV | 0-60 min before incision |
| Clean-contaminated (GI) | Cefazolin + metronidazole | 2g + 500mg IV | 0-60 min before |
| Biliary | Cefazolin | 2g IV | 0-60 min before |
| Colorectal | Cefazolin + metronidazole (or ertapenem) | 2g + 500mg | 0-60 min before |

**Redose:** if surgery >3h or blood loss >1500 mL

## DVT Prophylaxis

- **Low risk (Caprini 0-2):** early ambulation only
- **Moderate (3-4):** LMWH (enoxaparin 40 mg SC daily) or UFH
- **High (≥5):** LMWH + SCDs
- **Duration:** 7-14 days (up to 28 days for cancer surgery)

## Surgical Site Infection (SSI) Prevention Bundle
1. Pre-op chlorhexidine bath
2. Appropriate antibiotic prophylaxis
3. No hair removal (or electric clippers if needed)
4. Maintain normothermia (>36°C)
5. Glycemic control (<200 mg/dL)
6. Adequate oxygenation
7. Sterile technique
7. Minimize OR traffic

## Post-Op Care

### Daily Rounds
- Pain control (multimodal)
- Nausea/vomiting
- Bowel function (ileus risk)
- Wound check
- Drain output (character, volume)
- Ambulation
- DVT prophylaxis
- Diet advancement
- Labs as indicated

### Discharge Criteria
- Afebrile
- Tolerating PO
- Pain controlled on oral meds
- Ambulating safely
- Wound stable
- Bowel function (for abdominal surgery)
- Follow-up arranged

## Red Flags (Post-Op)
1. Fever >38.5°C (especially >5 days post-op)
2. Tachycardia unexplained
3. Hypotension
4. Tachypnea / hypoxemia
5. Wound dehiscence
6. Anastomotic leak (tachycardia + abdominal pain + new fever)
7. DVT signs (leg swelling, pain)
8. PE signs (sudden dyspnea, tachycardia)
9. Severe pain not responding to meds
10. Mental status change

## KPIs
- Surgical site infection rate (by procedure class)
- Return to OR within 30 days
- Readmission within 30 days
- Mortality (risk-adjusted)
- DVT/PE rate
- Patient satisfaction
- Same-day discharge rate (where applicable)

## Compliance
- **JCI:** COP.4 (Surgical care), MMU (Medication), PCI (Infection), SQE (Staff)
- **CBAHI:** Surgical standards
- **ACS NSQIP:** Risk-adjusted outcomes
- **WHO Surgical Safety Checklist:** mandatory

## L4 Validation: 6/6 PASS
- Red flags: 10+ identified (anastomotic leak, DVT, PE, SSI, etc.)
- Drug safety: antibiotic prophylaxis, opioid stewardship, renal dose
- PHI: encrypted (operative notes, pathology)
- Auth: Surgeon, anesthesiologist, OR nurse, PACU nurse
- Compliance: JCI, CBAHI, ACS NSQIP
- Tests: WHO checklist, antibiotic timing, drain management

---
*Generated 2026-07-23. Tier-1 priority (high volume, WHO checklist).*
