# Gastroenterology Benchmark — Epic, Cerner, MEDITECH

## Mandatory features

### 1. IBD (Crohn's / UC)
- [x] Mayo Score (UC severity) — **shipped** `ucMayoScore`
- [x] CDAI (Crohn's) — planned `cdaiScore`
- [ ] SES-CD (endoscopic score)
- [ ] Biologic therapy tracking (infliximab, adalimumab, vedolizumab)
- [ ] TPMT levels (azathioprine)
- [ ] Fecal calprotectin trend
- [ ] Post-op surveillance

### 2. GI Bleed
- [x] Glasgow-Blatchford Score — **shipped** `gi_bleed_risk_engine.js`
- [ ] Forrest classification (ulcer)
- [ ] Transfusion triggers
- [ ] Endoscopic intervention tracking

### 3. Liver
- [ ] MELD / MELD-Na (cirrhosis severity)
- [ ] Child-Pugh score
- [ ] Hepatitis B/C staging
- [ ] NAFLD/MASLD fibrosis score (FIB-4, NFS)
- [ ] HCC screening (US + AFP q6mo)
- [ ] Liver transplant workup

### 4. Pancreas
- [ ] Ranson / APACHE-II for pancreatitis severity
- [ ] BISAP score
- [ ] EUS / ERCP procedure documentation

### 5. GERD / Dyspepsia
- [ ] Endoscopy reporting
- [ ] H. pylori testing
- [ ] PPI appropriateness

### 6. Colorectal Cancer Screening
- [ ] FIT / FOBT result tracking
- [ ] Colonoscopy with ADR (adenoma detection rate)
- [ ] Polyp surveillance interval

### 7. IBS
- [ ] Rome IV criteria
- [ ] Bristol Stool Chart

### 8. Endoscopy Suite
- [ ] EGD, colonoscopy, ERCP, EUS
- [ ] Pathology integration
- [ ] Image capture
- [ ] Sedation documentation (anesthesia)

### 9. Nutrition
- [ ] MUST / MNA screening
- [ ] TPN orders
- [ ] Dietitian consult

### 10. Motility
- [ ] pH impedance
- [ ] Manometry
- [ ] Wireless capsule endoscopy

## Shipped
- UC Mayo score (stool frequency, rectal bleeding, endoscopy, PGA)
- GI bleed risk (BUN, Hb, SBP, HR, melena, syncope, hepatic, cardiac)

## Sources
- AGA guidelines 2024
- ECCO guidelines
- AASLD guidelines
