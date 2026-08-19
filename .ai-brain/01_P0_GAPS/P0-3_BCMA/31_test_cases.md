# P0-3 BCMA — Test Cases

| ID | Scenario | Steps | Expected |
|---|---|---|---|
| TC-01 | Normal drug | Scan patient + Amoxicillin 500mg | 200, administered |
| TC-02 | Allergy match | Scan Penicillin + patient allergic | 409, blocked |
| TC-03 | High-alert insulin | Scan insulin, no witness | witness_required=true |
| TC-04 | High-alert with witness | Scan + witness scans badge | 200, administered |
| TC-05 | Wrong patient | Scan patient A + drug for patient B | 409, wrong_patient |
| TC-06 | Late dose (>30min) | Administer > 30min late | late_dose=true flag |
| TC-07 | Override reason | POST /override without reason | 400, missing_reason |
| TC-08 | Disposal | Dispose expired drug with witness | disposal_id returned |
| TC-09 | Refusal | Nurse scans + refuses | refusal logged |
| TC-10 | Drug interaction | Patient on warfarin, scan aspirin | interaction_warning |