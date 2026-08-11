# Nephrology Benchmark — Epic, Cerner, MEDITECH

## Mandatory features

### 1. CKD Staging
- [x] eGFR by CKD-EPI 2021 — **shipped** `ckd_staging_engine`
- [ ] Albuminuria (ACR)
- [ ] KDIGO heatmap (G1-G5, A1-A3)
- [ ] CKD-MBD (Ca, Phos, PTH)

### 2. Hemodialysis
- [x] HD adequacy (Kt/V, URR) — **shipped**
- [ ] Access (AV fistula, graft, catheter)
- [ ] Dialysis prescription (bath, time, QB)
- [ ] Intradialytic events (hypotension, cramps)
- [ ] Treatment sheet

### 3. Peritoneal Dialysis
- [ ] PET test
- [ ] Kt/V peritoneal
- [ ] Peritonitis episodes

### 4. AKI
- [x] KDIGO AKI staging — **shipped** `aki_engine`
- [ ] RIFLE criteria
- [ ] ATN vs pre-renal workup
- [ ] CRRT ordering

### 5. Hypertension
- [ ] ABPM interpretation
- [ ] Resistant HTN workup
- [ ] Renin/aldosterone ratio

### 6. Glomerular Disease
- [ ] Nephrotic syndrome workup
- [ ] Nephritic syndrome workup
- [ ] Biopsy tracking

### 7. Transplant
- [ ] Waitlist management
- [ ] Donor matching
- [ ] Immunosuppression
- [ ] Rejection workup

### 8. ESRD
- [ ] Renal replacement therapy (HD/PD/Tx)
- [ ] Anemia management (ESAs, iron)
- [ ] MBD management

### 9. Fluid & Electrolytes
- [ ] Hyponatremia workup
- [ ] Hyperkalemia management
- [ ] Metabolic acidosis

### 10. Quality
- [ ] KDOQI targets
- [ ] Fistula First
- [ ] Vaccination rates (HepB)

## Shipped
- eGFR (CKD-EPI 2021 race-free)
- AKI staging
- HD adequacy (Kt/V, URR)
- Albuminuria staging

## Sources
- KDIGO 2024 CKD Guidelines
- KDOQI
- CMS ESRD Quality Incentive Program
