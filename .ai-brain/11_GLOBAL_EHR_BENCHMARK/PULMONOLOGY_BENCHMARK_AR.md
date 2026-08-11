# Pulmonology Benchmark — Epic, Cerner, MEDITECH

## Mandatory features

### 1. Asthma
- [x] ACT (Asthma Control Test) — `asthma_control_engine.js`
- [x] GINA 2024 step-wise treatment
- [ ] Spirometry trending (FEV1, FVC, FEV1/FVC)
- [ ] ICS/LABA dosing by step
- [ ] Biologics eligibility (omalizumab, mepolizumab, dupilumab)

### 2. COPD
- [x] GOLD severity (1-4) — **shipped** `copd_severity_engine.js`
- [x] mMRC dyspnea scale, CAT score
- [ ] Exacerbation history tracking
- [ ] Long-term oxygen therapy (LTOT) criteria
- [ ] Pulmonary rehab referral

### 3. Sleep Medicine
- [ ] Polysomnography report (AHI, ODI, sleep stages)
- [ ] CPAP titration
- [ ] Sleep study scheduling

### 4. Pulmonary Function Tests
- [ ] Spirometry (FEV1, FVC, FEV1/FVC)
- [ ] Lung volumes (TLC, RV, FRC)
- [ ] DLCO (diffusing capacity)
- [ ] Bronchoprovocation (methacholine challenge)
- [ ] 6-minute walk test

### 5. Bronchoscopy
- [ ] Procedure note with findings (normal/abnormal)
- [ ] BAL, brushings, biopsies
- [ ] EBUS (endobronchial ultrasound) staging

### 6. Pleural Disease
- [ ] Thoracentesis procedure
- [ ] Pleural fluid analysis (Light's criteria)
- [ ] Chest tube management

### 7. Lung Cancer Screening
- [ ] USPSTF criteria
- [ ] LDCT ordering + Lung-RADS

### 8. Pulmonary HTN
- [ ] Risk stratification
- [ ] Vasodilator therapy

### 9. Cystic Fibrosis
- [ ] Sweat chloride
- [ ] Pulmonary exacerbation tracking

### 10. Pulmonary Rehabilitation
- [ ] 6MWT distance trend
- [ ] QOL (SGRQ)

## Shipped
- ACT (asthma control)
- COPD GOLD severity + exacerbation risk
- Wells PE / DVT
- Pneumonia severity (CURB-65)
- Pulmonary HTN risk

## Sources
- GINA 2024
- GOLD 2024
- ATS/ERS guidelines
