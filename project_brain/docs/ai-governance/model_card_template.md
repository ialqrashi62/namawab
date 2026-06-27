# Model Card — {{Model Name}}
> Aligned with WHO/FDA/SDAIA expectations. One per model; published before launch
> and updated on retraining.

## 1. Model details
- **Name**: ...
- **Version**: ...
- **Owner**: name + role
- **Type**: classifier / segmentation / regression / LLM-orchestrator
- **Architecture**: e.g., 1D-CNN, ViT, fine-tuned LLM, ensemble
- **Inputs**: format + units + preprocessing
- **Outputs**: schema + confidence semantics
- **License**: internal / vendor (specify)
- **Risk tier** (per AI policy): low / moderate / high / critical

## 2. Intended use
- **Use case**: ...
- **Users**: clinicians/role
- **Setting**: outpatient / ED / ICU / etc.
- **Out of scope**: what the model is NOT to be used for

## 3. Training data
- Sources: ... (with licenses & approvals)
- Size: ...
- Cohort characteristics: age, sex, nationality, comorbidity distribution
- Time range: ...
- Labels: how generated, label quality
- Pre-processing: ...
- Class balance: ...
- Known limitations: ...

## 4. Evaluation data
- Held-out set: size, source, period
- KSA validation cohort: size, characteristics
- Subgroup analysis (must report):
  - by sex
  - by age band
  - by nationality
  - by language

## 5. Metrics
- Primary: AUROC / sensitivity / specificity / PPV / NPV / calibration / Brier
- Confusion matrix at chosen threshold
- Subgroup table

## 6. Operating point
- Threshold chosen + clinical rationale
- Expected workload at threshold (alerts/day)

## 7. Calibration
- Reliability diagram + ECE

## 8. Robustness
- Adversarial / OOD performance
- Missing data tolerance
- Time/site drift behavior

## 9. Fairness
- Performance gap reporting (any subgroup with > 5% gap → mitigation plan)

## 10. Privacy
- Data governance during training: PHI handling, DPA with vendor (if any)
- Inference path: KSA-region only / vendor list

## 11. Limitations
- Edge cases known to fail
- Populations not represented
- Cohort shift sensitivity

## 12. Ethical considerations
- Risks of harm; mitigations
- Bias risks
- Patient perception (informed via Privacy Policy + Consents)

## 13. Monitoring
- Drift detection method + cadence
- Performance monitoring metrics + threshold
- Alerting + ownership

## 14. Maintenance
- Retraining cadence
- Versioning policy
- Decommission criteria

## 15. Release & change history
- vX.Y — date — change summary — approvals
