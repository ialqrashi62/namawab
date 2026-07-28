# 01 — Clinical Workflows (CARD-001)

> Owner: CMO · Snippet: snippet:red-flag-entry · Tier 1

## wf-1: New cardiology outpatient consult

```yaml
- id: wf-1
  name_ar: استشارة قلب خارجية جديدة
  name_en: New cardiology outpatient consult
  trigger: referral_or_self_presentation
  actors: [cardiologist, nurse, receptionist, patient]
  duration_est_min: 30
  steps:
    - { seq: 1, actor: receptionist, action: register patient + verify insurance NPHIES, system: /api/patients, red_flag: false }
    - { seq: 2, actor: nurse, action: vitals (BP, HR, SpO2, weight, height), system: /api/vitals, red_flag: true if BP>180/120 or HR>140 }
    - { seq: 3, actor: nurse, action: 12-lead ECG (auto-flag if STEMI), system: /api/cardiology/ecg, red_flag: true if STEMI pattern }
    - { seq: 4, actor: cardiologist, action: H&P + ROS + risk assessment (HEART, CHA2DS2-VASc, HAS-BLED), system: /api/encounters, red_flag: false }
    - { seq: 5, actor: cardiologist, action: orders (echo, stress, holter, labs), system: /api/cardiology/orders, red_flag: false }
    - { seq: 6, actor: cardiologist, action: CDS alerts (drug interactions, dosing, contraindications), system: cds.js, red_flag: true if major }
    - { seq: 7, actor: cardiologist, action: Rx (with mandatory e-prescription to NPHIES), system: /api/prescriptions, red_flag: true if DDI }
    - { seq: 8, actor: nurse, action: schedule follow-up + patient education, system: /api/appointments, red_flag: false }
  red_flags_inline: [STEMI, hypertensive_emergency, bradycardia<40, tachycardia>150, syncope]
  cds_rules: [CDS-CARD-DDI, CDS-CARD-DOSE-RENAL, CDS-CARD-BLEED-RISK]
  snomed_codes: [39579001|Angin pectoris|, 53741008|Coronary arteriosclerosis|, 49436004|Atrial fibrillation|]
  icd10_codes: [I20-I25, I48, I50]
```

## wf-2: CODE STEMI pathway

```yaml
- id: wf-2
  name_ar: مسار STEMI (كود الستيمي)
  name_en: CODE STEMI pathway
  trigger: ecg_stemi_pattern OR trop_high_with_st_changes
  duration_target: door_to_balloon < 90 min
  actors: [er_doctor, cardiologist, cath_lab_team, ccu_nurse, ambulance]
  steps:
    - { seq: 1, actor: er_nurse, action: ECG within 10 min of arrival, system: /api/cardiology/ecg, red_flag: true }
    - { seq: 2, actor: er_doctor, action: activate CODE STEMI (page cardiologist + cath lab), system: /api/er/code-stemi, red_flag: true }
    - { seq: 3, actor: er_doctor, action: aspirin 300mg + ticagrelor 180mg PO chewed, system: /api/medications, red_flag: true if allergy }
    - { seq: 4, actor: er_doctor, action: heparin bolus, system: /api/medications, red_flag: false }
    - { seq: 5, actor: cath_team, action: cath lab activation + transport, system: /api/cath/activate, red_flag: true if delay>60min }
    - { seq: 6, actor: cardiologist, action: PCI with stent (DES), system: /api/cath/pci, red_flag: true if complications }
    - { seq: 7, actor: ccu_nurse, action: CCU admission + monitoring, system: /api/ccu/admit, red_flag: true if cardiogenic_shock }
  red_flags_inline: [cardiogenic_shock, mechanical_complication, refractory_vt]
  cds_rules: [CDS-CARD-PCI-INDICATION, CDS-CARD-ANTITHROMBOTIC-DOSE]
```

## wf-3: Heart failure clinic visit

```yaml
- id: wf-3
  name_ar: زيارة عيادة الفشل القلبي
  name_en: Heart failure clinic visit
  trigger: scheduled_or_decompensation
  actors: [cardiologist, hf_nurse, pharmacist, patient]
  duration_est_min: 45
  steps:
    - { seq: 1, actor: hf_nurse, action: weight + BP + HR + symptoms (dyspnea, orthopnea, edema), system: /api/vitals, red_flag: true if weight_gain>2kg/3days }
    - { seq: 2, actor: cardiologist, action: exam + JVP + lung auscult + edema, system: /api/encounters, red_flag: true if S3_gallop or pulmonary_edema }
    - { seq: 3, actor: cardiologist, action: GDMT optimization (ACEi/ARB/ARNI, beta-blocker, MRA, SGLT2i), system: cds.js + /api/prescriptions, red_flag: true if hyperkalemia or bradycardia }
    - { seq: 4, actor: pharmacist, action: med reconciliation + adherence, system: /api/medications/reconcile, red_flag: true if critical_drug_missed }
    - { seq: 5, actor: cardiologist, action: BNP/NT-proBNP + basic metabolic panel, system: /api/labs/orders, red_flag: true if BNP>1000 or K>5.5 }
    - { seq: 6, actor: hf_nurse, action: education (diet, fluid, daily weight, when to call), system: /api/education, red_flag: false }
  red_flags_inline: [acute_decompensated_hf, cardiogenic_shock, hyperkalemia_severe, vt_sustained]
  cds_rules: [CDS-HF-GDMT, CDS-HF-HYPERKALEMIA, CDS-HF-DIURETIC-DOSE]
```

## wf-4: Atrial fibrillation new diagnosis

```yaml
- id: wf-4
  name_ar: تشخيص جديد للرجفان الأذيني
  name_en: New atrial fibrillation diagnosis
  trigger: ECG_or_holter_showing_AF
  actors: [cardiologist, nurse, ep_cardiologist]
  steps:
    - { seq: 1, actor: nurse, action: 12-lead ECG confirmation, system: /api/cardiology/ecg }
    - { seq: 2, actor: cardiologist, action: rate vs rhythm control decision, system: /api/encounters }
    - { seq: 3, actor: cardiologist, action: CHA2DS2-VASc + HAS-BLED, system: cds.js, red_flag: true if score>=2_no_anticoag }
    - { seq: 4, actor: cardiologist, action: anticoagulation decision (DOAC preferred), system: /api/prescriptions }
    - { seq: 5, actor: cardiologist, action: refer EP if ablation candidate, system: /api/referrals }
  red_flags_inline: [AF_with_rvr>180, hemodynamically_unstable, stroke_symptoms]
  cds_rules: [CDS-AF-STROKE-RISK, CDS-AF-BLEED-RISK, CDS-AF-DOAC-DOSE]
```

## wf-5: Pre-op cardiac risk assessment

```yaml
- id: wf-5
  name_ar: تقييم المخاطر القلبية قبل العملية
  name_en: Pre-op cardiac risk assessment
  trigger: preop_clinic_referral
  actors: [cardiologist, anesthesiologist, surgeon]
  steps:
    - { seq: 1, actor: cardiologist, action: functional capacity (METs) + risk factors, system: /api/encounters }
    - { seq: 2, actor: cardiologist, action: revised cardiac risk index, system: cds.js }
    - { seq: 3, actor: cardiologist, action: troponin if intermediate-high risk, system: /api/labs }
    - { seq: 4, actor: cardiologist, action: echo if symptomatic or LV dysfunction suspected, system: /api/cardiology/echo }
    - { seq: 5, actor: cardiologist, action: optimize (beta-blocker, statin, anticoag hold decision), system: /api/prescriptions }
    - { seq: 6, actor: cardiologist, action: clearance letter, system: /api/clearance }
  red_flags_inline: [active_acs, severe_valvular, uncontrolled_arrhythmia]
```
