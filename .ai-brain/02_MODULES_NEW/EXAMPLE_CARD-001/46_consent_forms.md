# 46 — Consent Forms (CARD-001)

> Owner: CQO · Tier 1

## Required consents

| Form | Trigger | Contents | Storage | Renewal |
|------|---------|----------|---------|---------|
| CF-CARD-001 | General cardiology visit | Permission to evaluate, order tests, prescribe | patient_consents table | per visit |
| CF-CARD-002 | ECG | Permission to perform + store | patient_consents + ecg_record | per test |
| CF-CARD-003 | Echo | Permission to perform + store | patient_consents + echo_report | per test |
| CF-CARD-004 | Stress test | Permission to perform + risks explained | patient_consents + stress_test | per test |
| CF-CARD-005 | Holter | Permission to wear monitor + remove | patient_consents + holter | per test |
| CF-CARD-006 | Cath lab diagnostic | Procedure, risks (bleeding, infection, stroke, MI, death), alternatives, right to refuse | patient_consents + cath_report | per procedure |
| CF-CARD-007 | Cath lab PCI | Procedure, risks (MACE, stent thrombosis, restenosis, contrast nephropathy), DAPT, follow-up | patient_consents + cath_report | per procedure |
| CF-CARD-008 | TAVR | Procedure, risks (stroke, paravalvular leak, pacemaker, death), TAVR-vs-SAVR discussion, follow-up | patient_consents + cath_report | per procedure |
| CF-CARD-009 | Device implant | Procedure, risks (infection, lead displacement, pneumothorax, generator change), MRI conditional, follow-up | patient_consents + device_record | per procedure |
| CF-CARD-010 | Anticoagulation | Risk of bleeding, falls, interactions, monitoring, reversal | patient_consents + Rx | per Rx |
| CF-CARD-011 | EP study + ablation | Procedure, risks (bleeding, perforation, AV block, death), alternatives | patient_consents + ep_report | per procedure |
| CF-CARD-012 | Anesthesia (procedural) | Anesthesia risks, allergies, fasting, consent for intubation/ resuscitation | anesthesia_consent | per procedure |
| CF-CARD-013 | Blood transfusion | Indications, risks (TRALI, infection, allergic), alternatives, refusal | transfusion_consent | per transfusion |
| CF-CARD-014 | Research (de-identified) | Voluntary, no impact on care, withdraw anytime | research_consent | once (or per study) |
| CF-CARD-015 | LLM co-pilot use (provider-facing) | Provider education on AI assistance, no autonomous decisions, override allowed | provider_ack | once (or on policy change) |
| CF-CARD-016 | Patient portal access | Read own data, AR + EN, secure credentials | portal_consent | once (or on re-registration) |
| CF-CARD-017 | Data sharing (NPHIES, MOH) | Mandatory for billing + reporting | billing_consent | once |
| CF-CARD-018 | Telemedicine (if applicable) | Provider credentials, recording, privacy, location | tele_consent | per session |
| CF-CARD-019 | Withdrawal of care / DNR | Right to refuse, comfort care, palliative, advanced directive | dnr_form | once (renewable) |
| CF-CARD-020 | Minor consent (if applicable) | Parent + minor assent | minor_consent | per visit |

## Form template (AR + EN, RTL)

```yaml
form:
  id: CF-CARD-007
  name_ar: موافقة على قسطرة قلبية تداخلية (PCI)
  name_en: Consent for Percutaneous Coronary Intervention (PCI)
  version: 2.0
  effective_date: 2026-07-27
  review_date: 2027-07-27
  jurisdiction: KSA
  language_primary: ar
  language_secondary: en
  required_for: [cardio_cath with procedure_type=PCI]
  storage: patient_consents table, RLS-scoped, 7y retention
  required_signatures:
    - patient
    - witness
    - cardiologist
  contents:
    - section: procedure_description
      ar: 'سيتم إدخال قسطرة عبر الشريان (الكعبري/الفخذي) لتصوير الشرايين التاجية ومعالجة الانسداد/الانسدادات.'
      en: 'A catheter will be inserted via the radial or femoral artery to image the coronary arteries and treat the blockage(s).'
    - section: risks
      ar: 'تشمل المخاطر: نزيف، عدوى، رد فعل تحسسي، تضرر الكلى من الصبغة، نوبة قلبية، سكتة دماغية، وفاة (نادرة).'
      en: 'Risks include: bleeding, infection, allergic reaction, contrast-induced nephropathy, MI, stroke, death (rare).'
    - section: alternatives
      ar: 'البدائل: علاج دوائي، جراحة مجازة (CABG)، أو رفض الإجراء.'
      en: 'Alternatives: medical therapy, CABG, or refusal.'
    - section: right_to_refuse
      ar: 'يحق للمريض الرفض في أي وقت دون التأثير على الرعاية المستقبلية.'
      en: 'The patient has the right to refuse at any time without affecting future care.'
    - section: dapt_commitment
      ar: 'يلتزم المريض بتناول العلاج المزدوج لمضادات الصفائح (DAPT) لمدة 12 شهراً على الأقل.'
      en: 'The patient commits to dual antiplatelet therapy (DAPT) for at least 12 months.'
    - section: follow_up
      ar: 'متابعة منتظمة مع طبيب القلب. العودة فوراً عند: ألم صدر، ضيق تنفس، نزيف، دوخة.'
      en: 'Regular follow-up with cardiologist. Return immediately for: chest pain, dyspnea, bleeding, dizziness.'
    - section: signature_patient
      ar: 'توقيع المريض: ____________ التاريخ: ____________'
      en: 'Patient signature: ____________ Date: ____________'
    - section: signature_witness
      ar: 'توقيع الشاهد: ____________ التاريخ: ____________'
      en: 'Witness signature: ____________ Date: ____________'
    - section: signature_physician
      ar: 'توقيع الطبيب (بعد شرح كامل): ____________ التاريخ: ____________'
      en: 'Physician signature (after full explanation): ____________ Date: ____________'
```

## Capture

- Tablet/PC at point of care
- Wet signature on paper + scan to phi_vault
- E-signature integrated with provider identity
- Witness required for invasive procedures
- 4-eye review if patient cannot consent (unconscious)

## Audit

- Every consent signed → audit entry (hash-chained)
- Every consent missing → block procedure (CDS rule)
- Every consent override → log with reason + audit

## Special populations

- **Minors:** parent/guardian consent + minor assent (if age 7+)
- **Pregnancy:** specific consent for procedures involving radiation, contrast
- **Elderly with cognitive decline:** capacity assessment + 2-witness
- **Non-AR speakers:** certified translator + form in their language
- **Emergency (STEMI, dissection):** implied consent if unconscious, family notification within 24h

## Renewal

- General consent: per visit
- Procedure consent: per procedure
- Research consent: once per study
- DNR: renewable
- LLM provider ack: annual + on policy change
