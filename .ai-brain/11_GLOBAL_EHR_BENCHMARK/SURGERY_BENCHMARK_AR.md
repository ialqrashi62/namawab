# Surgery Benchmark — Epic vs Cerner vs MEDITECH (WHO Surgical Checklist aligned)

## Mandatory features

### 1. Pre-op
- [x] ASA classification (I-VI) — **shipped** `surgery_engine`
- [x] NSQIP risk calculator (simplified) — **shipped**
- [x] WHO Surgical Safety Checklist (Time-Out) — **shipped**
- [x] Caprini VTE risk — **shipped**
- [ ] Pre-op nursing assessment
- [ ] Anesthesia plan
- [ ] Consent (procedure + anesthesia + blood)
- [ ] NPO status
- [ ] Site marking

### 2. OR Management
- [ ] OR scheduling (room, surgeon, team, equipment)
- [ ] Preference cards (per surgeon)
- [ ] Equipment / instrument tracking
- [ ] Conflict detection (equipment, surgeon, room)
- [ ] Anesthesia documentation (vital signs q5min, drug admin, fluids)
- [ ] Surgical counts (instruments, sponges, needles)

### 3. Intra-op
- [ ] Time-stamped event log (incision, closure)
- [ ] Live vital signs from anesthesia machine (HL7)
- [ ] Blood loss tracking
- [ ] Specimen tracking
- [ ] Implant tracking (UDI barcode)
- [ ] Surgical video / image capture (PACS)

### 4. Post-op
- [ ] PACU (recovery) documentation
- [ ] Aldrete score (discharge from PACU)
- [ ] Pain score
- [ ] Post-op orders
- [ ] Wound checks
- [ ] Discharge instructions

### 5. Specialties
- [ ] General surgery
- [ ] Cardiothoracic
- [ ] Vascular
- [ ] Neuro
- [ ] Ortho
- [ ] Plastics / burns
- [ ] ENT
- [ ] Ophthalmology
- [ ] Urology
- [ ] OB-GYN surgery

### 6. Surgical Site Infection (SSI) Surveillance
- [ ] NHSN SSI criteria
- [ ] 30-day follow-up
- [ ] SSIN surveillance

### 7. Quality
- [ ] NSQIP outcomes tracking
- [ ] SCIP (Surgical Care Improvement Project) measures
- [ ] VTE prophylaxis compliance
- [ ] Antibiotic timing compliance

### 8. Robotics & Minimally Invasive
- [ ] Robotic surgery case logging
- [ ] Laparoscopic case duration tracking

### 9. Trauma
- [ ] ATLS primary/secondary survey
- [ ] Injury severity score (ISS)
- [ ] Trauma registry

### 10. Transplantation
- [ ] Organ donor/recipient registry
- [ ] Immunosuppression tracking

## Saudi MoH surgical workflow
- Mandatory **Time-Out** before incision
- Mandatory **Sign-Out** before patient leaves OR
- Both documented in EHR

## Gaps vs Epic OpTime
- Implant tracking
- Robotic case video
- Trauma registry (need separate module)

## Sources
- WHO Surgical Safety Checklist 2009
- ACS NSQIP
- ASA Physical Status Classification
- NHSN SSI surveillance 2024
- Saudi MoH OR Standards
