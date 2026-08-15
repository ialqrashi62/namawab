# CARD-302_ADHF — Chaining Patterns

## Pattern 1: GDMT Optimization Loop
```
[Patient on HF Meds] → [Check 4 Pillars]
  ├─ [ARNI? Yes/No]
  ├─ [BB? Yes/No + Target Dose]
  ├─ [MRA? Yes/No + K+ Status]
  └─ [SGLT2i? Yes/No + GFR Status]
       ↓
[Optimization Plan] → [Titration Schedule] → [Follow-up]
       ↓
[Recheck 4 Pillars] → [Loop until all at target]
```

## Pattern 2: Cardiogenic Shock (DRIPS Protocol)
```
[SBP <90 + Lactate >2] → [Activate Shock Team]
       ↓
[Hemodynamic Assessment] → [SCAI Stage A-E]
       ↓
[DRIPS Protocol]:
  ├─ D — Definitive (transplant/LVAD)
  ├─ R — Revascularization (PCI/CABG)
  ├─ I — IABP (intra-aortic balloon pump)
  ├─ P — Percutaneous VAD (Impella, TandemHeart)
  └─ S — Surgical (ECMO, LVAD)
       ↓
[Outcome] → [Wean or escalate]
```

## Pattern 3: LVAD Pre-Op Workflow
```
[Stage D HF] → [LVAD Evaluation]
       ↓
[Checklist] (each must be YES):
  ├─ [Cardiac Cath completed]
  ├─ [RHC with PVR <5]
  ├─ [CPET VO2 <14]
  ├─ [Renal Function GFR >30]
  ├─ [Liver Function OK]
  ├─ [Pulmonary Function OK]
  ├─ [Psychosocial Clear]
  ├─ [Financial Counseling]
  └─ [SCOT Listing (if BTT)]
       ↓
[Heart Team Review] → [Approve/Deny]
       ↓
[Schedule Surgery] → [Post-op ICU]
```

## Pattern 4: Heart Transplant Listing
```
[Stage D HF + LVAD candidate considered]
       ↓
[SCOT Evaluation]:
  ├─ [Blood Group Match]
  ├─ [HLA Typing]
  ├─ [PRA <20% (or desensitization)]
  ├─ [Negative Crossmatch]
  ├─ [MELD <30]
  ├─ [PVR <5 Wood Units]
  ├─ [No Active Infection]
  ├─ [No Recent Malignancy]
  └─ [Psychosocial Clear]
       ↓
[Listing Status]:
  ├─ Status 1A (ICU + MCS)
  ├─ Status 1B (LVAD + complications)
  ├─ Status 2 (Stable)
  └─ Inactive (temporary)
       ↓
[Match Run] → [Accept/Decline] → [Transplant]
```

## Pattern 5: Post-Transplant Surveillance
```
[Heart Transplant] → [Induction Immunosuppression]
       ↓
[Schedule]:
  ├─ Wk 1: Daily endomyocardial biopsy
  ├─ Wk 2-4: Biopsy weekly
  ├─ Mo 2-3: Biopsy q2 weeks
  ├─ Mo 3-6: Biopsy monthly
  ├─ Mo 6-12: Biopsy q3 months
  └─ Year 1+: Biopsy annually
       ↓
[Acute Rejection Grade (ISHLT)]:
  ├─ 0 — None
  ├─ 1R — Mild
  ├─ 2R — Moderate
  ├─ 3R — Severe
  └─ AMR — Antibody-mediated
       ↓
[Treatment per grade]
```

## Pattern 6: Agent Collaboration
```
[HF Case] → [Cardiology Agent] (diagnosis, GDMT)
        → [Cardiac Surgery Agent] (revascularization, LVAD)
        → [Cardiothoracic Anesthesia Agent] (peri-op)
        → [Transplant Coordinator] (SCOT)
        → [Pharmacist] (medication interaction)
        → [HF Nurse] (I&O, education)
        → [Palliative Care Agent] (advanced directives)
        → [Coordinator Agent] (consensus)
```

## Pattern 7: Telemetry Monitoring (LVAD)
```
[LVAD Speed × Power] → [Trend Analysis]
       ↓
[Thrombosis Risk]:
  ├─ ↑ Power + ↓ Flow → Consider pump thrombosis
  ├─ ↓ Power + ↓ Flow → Consider obstruction
  └─ ↑ Power + ↑ Flow → Consider recovery
       ↓
[Action] → [Notify LVAD Team]
```

## Pattern 8: Patient Engagement
```
[HF Patient Discharge] → [Daily Weight Monitoring]
       ↓
[Weight Gain >2kg/3d] → [Alert] → [Diuretic Adjustment]
       ↓
[BNP Trend] → [Medication Compliance] → [Re-hospitalization Risk]
       ↓
[Cardiac Rehab Phase II] → [Phase III (Maintenance)]
```
