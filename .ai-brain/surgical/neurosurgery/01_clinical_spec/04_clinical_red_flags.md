# Clinical Red Flags — NS-NEURO

| Flag | Trigger / threshold | Required action | System behavior |
|---|---|---|---|
| Critical TBI | GCS ≤8, pupil asymmetry, or CT bleed w/ GCS≤12 | Emergent CT + OR-ready; airway team | Red banner + page neurosurgeon; `triageTbi.tier=emergent` |
| Suspected SAH | Sudden worst-ever headache ± nuchal rigidity | Stat non-con CT; CTA if positive | Blocks routine queue routing |
| Raised ICP | ICP >22 mmHg sustained >5 min, or CPP <60 | Osmotherapy, EVD level check, repeat CT | Auto-alert to NICU board |
| Post-op deterioration | Drop ≥2 GCS points from baseline | Surgeon stat review + CT | Delta-detector on assessment stream |
| Scoliosis surgical threshold | Cobb ≥45° (any curve) or ≥25° w/ progression ≥5°/yr | Surgical consult; brace interim | `assessScoliosis.plan` forces referral task |
| DBS hardware infection | Erythema/discharge over pump/pulse-generator | Urgent explant evaluation | Infection case flag → PCI reporting |
| Cauda equina syndrome | Saddle anesthesia + bladder dysfunction | Emergency MRI <6h | Cross-link SPINE → emergency track |
| Seizure cluster | ≥3 seizures /24h in FUNC program | Load rescue med, review levels | Seizure diary breach alert |

**Enforcement:** flags computed server-side post-write (engine outputs); UI may not dismiss a red banner without recorded clinician override reason.
