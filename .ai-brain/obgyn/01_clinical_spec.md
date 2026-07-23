# 01 Clinical Spec — Obstetrics & Gynecology

## 1. Clinical Domain & Scope
- **Focus**: Antenatal care, intrapartum management, postpartum care, gynecology, family planning, and reproductive medicine.
- **Key Workflows**:
  - Antenatal visits and risk stratification.
  - Partogram and labor monitoring.
  - Delivery documentation and APGAR.
  - Postpartum rounds and contraception counseling.
  - Gynecology clinic visits and procedures.

## 2. Patient Journey
1. Registration/confirmation of pregnancy → 2. Antenatal visits → 3. Labor admission → 4. Partogram → 5. Delivery → 6. Postpartum → 7. Discharge/follow-up.

## 3. Clinical Decision Support
- Auto-calculate gestational age and EDD.
- High-risk pregnancy flags (PIH, GDM, previa, previous C-section).
- Partogram alerts for prolonged labor, fetal distress.
- APGAR scoring at 1 and 5 minutes.

## 4. Integration Points
- CPOE for labs/imaging/Rx.
- LIS/RIS for prenatal tests and ultrasounds.
- NICU for newborn admissions.
- Billing and NPHIES eligibility.

## 5. Safety Gates
- Mandatory consent before procedures.
- Blood availability check for high-risk deliveries.
- Newborn identification and mother-baby matching before discharge.
