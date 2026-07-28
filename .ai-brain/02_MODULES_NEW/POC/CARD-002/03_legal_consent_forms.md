<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — Legal Consent Forms (10 types)

## 1. PCI Consent
- Procedure: Percutaneous Coronary Intervention with stenting
- Risks: Bleeding, vascular complications, CIN, stent thrombosis, MI, stroke, death (~1-2%)
- Alternatives: Medical therapy, CABG, no intervention
- Special: SFDA UDI scan acknowledgment

## 2. TAVR Consent
- Procedure: Transcatheter Aortic Valve Replacement
- Risks: Stroke (1-2%), vascular complications (5-10%), paravalvular leak, pacemaker (10-15%), death (~2-3%)
- Alternatives: Surgical AVR, medical management
- Special: Heart Team MDT sign-off (5 specialists)

## 3. MitraClip Consent
- Procedure: Transcatheter Edge-to-Edge Repair
- Risks: Leaflet injury, residual MR, single-leaflet detachment, stroke
- Alternatives: Surgical MV repair/replacement, medical

## 4. Watchman LAA Closure Consent
- Procedure: Left Atrial Appendage Closure
- Risks: Device embolization, pericardial effusion, residual leak, device-related thrombus
- Alternatives: Long-term OAC, no intervention
- Special: 45d OAC post-implant

## 5. PFO Closure Consent
- Procedure: Patent Foramen Ovale Closure
- Risks: Atrial fibrillation, device erosion, thrombus, recurrent stroke
- Alternatives: Medical therapy (antiplatelet), no closure

## 6. Alcohol Septal Ablation Consent (HOCM)
- Procedure: Alcohol-induced septal infarction
- Risks: Complete heart block (10-15%, may need PPM), MI (extensive), arrhythmia
- Alternatives: Surgical myectomy, medical

## 7. Endomyocardial Biopsy Consent
- Procedure: Right ventricular endomyocardial biopsy
- Risks: Perforation (1%), tamponade, arrhythmia, tricuspid injury

## 8. Research Consent (Optional)
- For participation in cath lab registry
- Withdrawal at any time
- Data anonymization guaranteed

## 9. AI-Assisted Care Consent (MANDATORY)
- Acknowledge: AI may provide decision support (risk scores, MDT summary, cath report draft)
- AI is NOT autonomous: MD reviews and signs
- PHI may be processed by external LLM (with PII redaction per SNIPPETS.md#SNIP-11)

## 10. Teaching Consent (Optional)
- For fellows, residents, students observation
- Patient may decline without affecting care
- Videos/photos only with separate consent

## E-Signature Requirements
- Patient signature (e-signature with timestamp)
- Witness signature (RN or family)
- Interpreter signature (if used)
- MD signature (procedure operator)
- All required for cath_consent row creation

---
*Section 23 of CARD-002. CQO voice. L1 DRAFT.*