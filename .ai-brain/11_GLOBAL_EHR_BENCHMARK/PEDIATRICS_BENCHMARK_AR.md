# Pediatrics Benchmark — Epic vs Cerner vs MEDITECH

## Mandatory features

### 1. Growth & Development
- [x] WHO growth charts (0-5y, 5-19y) — **planned** `pediatrics_engine.growthZScore`
- [ ] Head circumference, BMI percentiles
- [ ] Developmental milestones (ASQ-3, PEDS)
- [ ] Autism screening (M-CHAT-R/F)

### 2. Newborn Care
- [x] APGAR score (1min, 5min, 10min) — **shipped**
- [ ] Ballard score (gestational age)
- [ ] Hearing screen (OAE/ABR)
- [ ] Newborn screening (heel stick, MS/MS)
- [ ] Critical CHD screening (pulse ox)
- [ ] Breastfeeding support

### 3. Immunizations (Saudi MoH schedule)
- [x] Birth: HepB, BCG — **shipped** `pediatrics_engine.immunizations`
- [ ] 2mo: DTaP, IPV, Hib, PCV13, Rota, HepB
- [ ] 4mo, 6mo boosters
- [ ] 9mo: Measles (single)
- [ ] 12mo: MMR, Varicella, PCV13 booster
- [ ] 18mo: DTaP booster, HepA series
- [ ] 4-6y: DTaP, IPV, MMR, Varicella boosters
- [ ] 12y: Tdap, HPV (2 doses), MenACWY
- [ ] Catch-up schedule generator
- [ ] Auto-recall SMS

### 4. Acute Care
- [x] Vital signs by age (BP, HR, RR norms) — **shipped**
- [x] PEWS (Pediatric Early Warning Score) — **shipped**
- [x] APGAR, fluid resuscitation (Holliday-Segar) — **shipped**
- [x] Westley croup score — **shipped**
- [ ] Asthma severity (PRAM)
- [ ] Dehydration score (Gorelick)
- [ ] Pain (FLACC, Wong-Baker FACES)

### 5. Adolescent
- [ ] HEEADSSS psychosocial interview
- [ ] Substance use screening (CRAFFT)
- [ ] Eating disorder (SCOFF)

### 6. Chronic Disease
- [ ] Asthma action plan
- [ ] Diabetes (T1DM, T2DM MODY) — HbA1c trend, ISPAD 2022
- [ ] Cystic fibrosis
- [ ] Sickle cell
- [ ] Epilepsy

### 7. Nutrition
- [ ] WHO growth Z-score calculator
- [ ] BMI percentile + plot
- [ ] Feeding assessment (intake vs estimated requirement)

### 8. School Health
- [ ] Vision/hearing screening
- [ ] Sport physical
- [ ] IEP/504 plan tracking

### 9. Quality
- [ ] AAP Bright Futures periodicity
- [ ] Saudi MoH well-child schedule
- [ ] Vaccination coverage reports

### 10. Family Engagement
- [ ] Proxy access to patient portal (parents)
- [ ] Age-based consent (Gillick competence)
- [ ] School forms auto-population

## Pediatric early warning (PEWS) — shipped
- Monitors HR, RR, BP, SpO2, consciousness
- Score 0-9 with escalation rules
- Bind to patient flow sheet

## Gaps vs Epic

| Feature | Status |
|---|---|
| Neonatal ICU (NICU) flowsheet | Not started — see NICU benchmark |
| Synagis (RSV prophylaxis) | Wave 8 |
| Pediatric oncology | See oncology benchmark |
| Pediatric surgery | See surgery benchmark |

## Sources
- AAP Red Book 2024
- Saudi MoH EPI schedule
- WHO growth standards
- NICE pediatric guidelines
