# 01 Clinical Spec — Pediatrics

## 1. Clinical Domain & Scope
- **Focus**: General pediatric care, growth and development, immunization, common acute illnesses, and pediatric subspecialty referrals.
- **Key Workflows**:
  - Pediatric outpatient visits.
  - Growth chart tracking (height, weight, head circumference, BMI).
  - Immunization schedule per Saudi MOH.
  - Developmental milestones screening.
  - Acute illness management and referral.

## 2. Patient Journey
1. Registration with guardian → 2. Triage/vitals → 3. Physician encounter → 4. Orders/Rx → 5. Immunization/growth update → 6. Follow-up.

## 3. Clinical Decision Support
- Growth percentile against WHO charts.
- Immunization due and overdue alerts.
- Weight-based dosing for medications.
- Red-flag alerts for sepsis, dehydration, respiratory distress.

## 4. Integration Points
- CPOE for pediatric orders.
- LIS/RIS for labs/imaging.
- Pharmacy for weight-based dosing.
- Pediatric subspecialty referrals.

## 5. Safety Gates
- Guardian consent for procedures.
- Weight verification before medication dosing.
- Allergy and contraindication checks.
