# 05_compliance_security.md - Functional Tests Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of physiological waveforms and recordings stored in `phi_vault/`.
- **JCI:** Safety protocols for stress tests, EEG/EMG, and spirometry.
- **ESC/ACCF:** ECG interpretation standards.
- **AASM:** Sleep study standards.
- **ATS/ERS:** Pulmonary function testing standards.
- **ASGE:** Endoscopy reporting standards.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('functional_test_specialist')`.
- **Audit:** All waveform interpretations, stress-test events, and biopsy linkages are hash-chained.
- **Segregation of Duties:** Technicians acquire data; physicians interpret and sign. Modification after sign requires addendum.

## 3. PHI Protection
- **Vaulting:** ECG/EEG/PFT waveforms and endoscopy images/videos stored in `phi_vault/`.
- **Encryption:** DPAPI KEK envelope for waveform data and report text.
- **Access Logging:** Every waveform view and report view writes an `ACCESS_EVENT` to the audit trail.

## 4. Safety Gates
- Stress test: cardiac clearance and crash cart readiness verified before start.
- Endoscopy: fasting status and anticoagulation review required before procedure.
- Critical ECG findings (STEMI, severe arrhythmia) trigger immediate physician notification.
- Biopsy specimens must be linked to pathology order at collection time.
- Spirometry: minimum 3 acceptable maneuvers required for valid FEV1/FVC interpretation.
