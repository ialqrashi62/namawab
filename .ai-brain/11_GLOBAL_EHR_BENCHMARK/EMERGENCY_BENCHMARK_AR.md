# Emergency Department Benchmark — Epic, Cerner, MEDITECH

## Mandatory features

### 1. Triage
- [x] ESI 5-level (Emergency Severity Index) — **shipped** `esi_engine`
- [ ] Manchester triage
- [ ] Canadian Triage Acuity Scale (CTAS)

### 2. Initial Assessment
- [x] Chief complaint (free text + structured)
- [x] Vital signs with auto-flag abnormal by age
- [ ] Pain score (0-10 numeric / FLACC for peds)
- [ ] GCS / AVPU
- [ ] Trauma activation criteria (ISS ≥ 16)

### 3. Clinical Decision Support
- [x] HEART score (chest pain) — see cardiology
- [x] Wells DVT/PE — see pulmonology
- [ ] Canadian C-spine rule
- [ ] NEXUS criteria
- [ ] Ottawa ankle/knee rules
- [ ] PERC rule (PE rule-out)
- [ ] CURB-65 (pneumonia severity)
- [ ] qSOFA (sepsis screening)

### 4. Workflow
- [ ] Fast-track lane
- [ ] Sepsis bundle timer (lactate, abx, fluids)
- [ ] Stroke alert (door-to-needle < 60min)
- [ ] STEMI activation (door-to-balloon < 90min)
- [ ] Trauma team activation
- [ ] Psychiatric evaluation (psych hold)

### 5. Disposition
- [ ] Discharge home
- [ ] Admit to floor
- [ ] Admit to ICU
- [ ] Transfer to other facility
- [ ] AMA (Against Medical Advice)
- [ ] Eloped / LWBS (Left Without Being Seen)

### 6. Documentation
- [ ] Medical Screening Exam (MSE) — EMTALA
- [ ] Time-stamped orders, meds, notes
- [ ] Click-to-order sets (chest pain, abdominal pain, etc.)

### 7. Patient Tracking
- [ ] Bedboard (waiting, roomed, dispo)
- [ ] Time stamps: triage → room → MD → dispo
- [ ] LWBS tracking
- [ ] Boarding time (ED to floor)
- [ ] Door-to-doc time KPI

### 8. Surge / Mass Casualty
- [ ] MCI triage (START, SALT)
- [ ] Tagging system
- [ ] Resource tracking (ventilators, OR)

### 9. Quality
- [ ] LWBS rate
- [ ] Door-to-provider time
- [ ] Admit decision time
- [ ] 72-hour return rate

### 10. Integration
- [ ] EMS notification (CAD)
- [ ] Image sharing (CT, US)
- [ ] Telemedicine for stroke / psych

## Saudi-specific
- Saudi MoH ED Standards
- SFDA mandatory reporting (MERS, COVID, etc.)
- NPHIES ED encounter coding

## Sources
- ACEP clinical policies
- ESI Implementation Handbook 2012
- CMS OPPS regulations
- Saudi MoH Emergency Care Standards
