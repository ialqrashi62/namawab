# OB/GYN Benchmark — Epic, Cerner, MEDITECH, WHO SMART Maternal

## Mandatory features

### 1. Prenatal
- [ ] Gestational age tracking (LMP, US)
- [ ] EDD recalculation
- [ ] Routine labs (CBC, blood type, Rubella, HepB, HIV, RPR)
- [ ] Genetic screening (NIPT, quad screen)
- [ ] Anatomy US (18-22w)
- [ ] GDM screening (24-28w)
- [ ] GBS screening (35-37w)
- [ ] Tdap, flu vaccines

### 2. Antenatal Risk
- [ ] Preeclampsia screening (ACOG)
- [ ] Preterm labor risk (cervical length US)
- [ ] Multiple gestation management

### 3. Labor & Delivery
- [x] Bishop Score (cervical favorability) — **shipped** `obgyn_engine.bishopScore`
- [x] Partogram — **shipped** `partograph`
- [ ] Friedman curve (progress of labor)
- [ ] Fetal monitoring (CTG interpretation)
- [ ] Category I/II/III strips
- [ ] Mode of delivery (SVD, vacuum, forceps, C-section)

### 4. Delivery
- [x] APGAR — see pediatrics
- [ ] 3rd stage management (active vs expectant)
- [ ] PPH management (4 Ts)
- [ ] Laceration repair

### 5. Postpartum
- [ ] VTE prophylaxis
- [ ] Depression screening (EPDS, PHQ-9)
- [ ] Breastfeeding support
- [ ] Contraception counseling

### 6. Gynecology
- [ ] Cervical cancer screening (Pap, HPV co-test)
- [ ] Colposcopy tracking
- [ ] Abnormal uterine bleeding workup
- [ ] Endometriosis (rASRM staging)
- [ ] Fibroids (FIGO classification)
- [ ] PCOS (Rotterdam criteria)

### 7. Infertility
- [ ] Menstrual cycle tracking
- [ ] Ovulation induction
- [ ] IVF cycle tracking
- [ ] Semen analysis results

### 8. Menopause
- [ ] Symptoms (Greene Climacteric Scale)
- [ ] MHT (menopausal hormone therapy)
- [ ] Bone density screening

### 9. Gynecologic Oncology (link oncology)
- [ ] Ovarian, uterine, cervical, vulvar cancer staging
- [ ] Cytoreductive surgery

### 10. Quality
- [ ] NTSV (nulliparous term singleton vertex) C-section rate
- [ ] Primary C-section rate
- [ ] VBAC success rate
- [ ] Episiotomy rate

## Shipped
- Bishop Score (cervical dilation, effacement, station, position, consistency)
- Partograph (cervical dilation vs time, action line, alert line)

## WHO SMART Maternal Health
- Antenatal care (8 contacts)
- Intrapartum care (skilled birth attendant)
- Postnatal care (3 checks)
- All documented in EHR

## Sources
- ACOG Practice Bulletins
- WHO Maternal Health Guidelines
- RCOG Green-top Guidelines
