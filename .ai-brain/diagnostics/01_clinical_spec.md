# 01 Clinical Spec — Diagnostics Suite

## 1. Clinical Domain & Scope
- **Focus**: Laboratory, radiology, pathology, blood bank, and functional diagnostics.
- **Key Workflows**:
  - Order management and specimen tracking.
  - Imaging scheduling, acquisition, and reporting.
  - Pathology specimen processing and reporting.
  - Blood bank inventory and transfusion safety.
  - Functional tests (ECG, EEG, PFT, endoscopy).

## 2. Patient Journey
1. Clinical order → 2. Scheduling/collection → 3. Acquisition/processing → 4. Interpretation → 5. Result reporting → 6. Critical value communication → 7. Billing.

## 3. Clinical Decision Support
- Critical value auto-alerts.
- Delta checks against prior results.
- Turnaround time tracking.
- Transfusion compatibility checks.

## 4. Integration Points
- CPOE, LIS, RIS-PACS, pathology, blood bank, billing.

## 5. Safety Gates
- Specimen identification verification.
- Critical value read-back.
- Dual verification before blood transfusion.
- Radiologist approval before critical finding closure.
