# 05_compliance_security.md - ICU Compliance & Security
**Expert: Compliance & Quality Officer**

## 1. Regulatory Framework
- **Saudi PDPL:** Encryption of continuous waveforms and ICU imaging.
- **JCI:** Daily goals, VAP/CLABSI bundle compliance, hand-hygiene.
- **SCCM / Surviving Sepsis Campaign:** Evidence-based protocols.
- **CBAHI:** ICU staffing ratios and outcome reporting.

## 2. Access Control
- **Golden Access Rule:** Enforced via `requireRole('intensivist')` or `requireRole('icu_nurse')`.
- **Audit:** All admission events, vital recordings, and sepsis-bundle completions are hash-chained.
- **Segregation of Duties:** Nurses record vitals; physicians write daily plans and orders.

## 3. PHI Protection
- **Vaulting:** Continuous waveforms and ICU imaging stored in `phi_vault/`.
- **Encryption:** DPAPI KEK envelope for waveform streams and lab records.
- **Access Logging:** Every view of ICU monitoring writes an `ACCESS_EVENT` to the audit trail.

## 4. Safety Gates
- MAP < 60 mmHg or lactate > 4 mmol/L triggers critical alert.
- Sepsis 1-hour bundle must complete within 60 min of trigger; overdue triggers charge-nurse alert.
- RSBI auto-calculated; readiness prompt when < 105.
- VAP/CLABSI prevention bundles auto-validated against orders.
- Daily-goals sign-off required each shift.
