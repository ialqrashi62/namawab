# Endocrinology Benchmark — Epic, Cerner, MEDITECH

## Mandatory features

### 1. Diabetes Mellitus
- [x] HbA1c target setting (ADA 2024: <7% for most) — **shipped** `endocrine_engine`
- [ ] Time-in-range (CGM data ingestion)
- [x] Insulin sensitivity factor (1500 rule or 1800 for rapid) — **shipped**
- [x] Carbohydrate ratio (500 rule) — **shipped**
- [x] Total daily dose calculation — **shipped**
- [ ] Insulin pump integration (Medtronic, Tandem)
- [ ] CGM alerts (Dexcom, Libre)
- [ ] Hypoglycemia event capture
- [ ] DKA protocol (anion gap, fluid, insulin drip)

### 2. Thyroid
- [x] TSH/FT4/FT3 interpretation — **shipped** `thyroidCancerRisk`
- [ ] ATA risk stratification (low/intermediate/high)
- [ ] Thyroid nodule TIRADS (ACR TI-RADS)
- [ ] RAI (radioactive iodine) treatment tracking

### 3. Adrenal / Pituitary
- [ ] Cushing's workup (24h urine cortisol, dex suppression)
- [ ] Addison's crisis
- [ ] Hyperaldosteronism

### 4. Bone
- [x] DEXA T-score / Z-score — **shipped** `bone_density`
- [ ] FRAX fracture risk
- [ ] Calcium / vitamin D dosing

### 5. Reproductive
- [ ] PCOS
- [ ] Menopause (HRT)
- [ ] Gender-affirming hormone therapy

### 6. Lipids
- [ ] ASCVD 10-yr risk (Pooled Cohort)
- [ ] Statin intensity (high/moderate/low)
- [ ] LDL-C goal < 70 (very high risk)

### 7. Obesity
- [ ] BMI tracker
- [ ] GLP-1 RA prescribing
- [ ] Bariatric surgery referral

### 8. Quality
- [ ] DPV (Diabetes Prospective Follow-up) registry
- [ ] ADA Standards of Care 2024
- [ ] AACE/ACE Guidelines

## Shipped
- HbA1c interpretation + control assessment
- Insulin dose calculator (TDD, ICR, ISF)
- Thyroid cancer risk (ATA)
- Bone density T-score → WHO classification

## Sources
- ADA Standards of Medical Care in Diabetes 2024
- ATA Management Guidelines for Thyroid Nodules 2015
- Endocrine Society guidelines
- AACE/ACE Obesity Guidelines 2023
