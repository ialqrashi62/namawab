# Model Card — Cardio-ECG STEMI Detector
v1.0 — Owner: AI Lead + Cardiology Lead — Risk tier: HIGH

## 1. Model details
- **Name**: cardio-ecg-stemi-v1
- **Version**: 1.0.0
- **Owner**: AI Lead (`ai-lead@nama.local`); Clinical Champion: Cardiology Lead
- **Type**: 1D-CNN multi-label classifier on 12-lead ECG
- **Architecture**: ResNet-1D (50-layer) + attention head, 24 M parameters
- **Inputs**: 12-lead ECG, 10 s, 500 Hz, mV, standard lead order; baseline-wander filter
- **Outputs**: 7 labels (STEMI-anterior, STEMI-inferior, STEMI-lateral, STEMI-posterior,
  NSTEMI-suspected, normal, other-abnormality) + per-label probability
- **Risk tier**: HIGH (advisory clinical decision support)

## 2. Intended use
- **Use case**: alert ED + cardiology to suspected STEMI for fast-track activation.
- **Users**: ED nurses (capture), ED physicians (review), Cardiology fellows (over-read).
- **Setting**: ED, OPD, inpatient.
- **Out of scope**: pediatric ECG (< 12 yo); paced rhythms; arrhythmia diagnosis;
  autonomous decision making.

## 3. Training data
- 580,000 ECGs from public datasets (PTB-XL, MIMIC-IV-ECG) + 120,000 ECGs from
  partner KSA hospital (de-identified, IRB-approved).
- Time range: 2014–2025.
- Labels: cardiologist-confirmed where available; cath-confirmed STEMI for positives.
- Pre-processing: bandpass 0.5–40 Hz; per-lead z-score; resampled to 500 Hz.
- Class balance via focal loss + oversampling positives 5×.
- Known gaps: under-representation of women < 45 yo with STEMI; few inferior MI in elderly women.

## 4. Evaluation data
- Held-out: 50,000 ECGs (independent patients).
- KSA validation cohort: 8,000 ECGs from 3 hospitals not used in training.
- Subgroup analysis: sex × age band × nationality × language UI of capturing nurse.

## 5. Metrics (KSA cohort)
| Label | AUROC | Sens | Spec | PPV | NPV |
|-------|-------|------|------|-----|-----|
| STEMI-anterior | 0.97 | 92% | 96% | 78% | 99% |
| STEMI-inferior | 0.95 | 88% | 95% | 72% | 99% |
| STEMI-lateral | 0.93 | 84% | 95% | 65% | 99% |
| STEMI-posterior | 0.90 | 80% | 94% | 58% | 99% |
| Any STEMI (composite) | 0.96 | 91% | 95% | 76% | 99% |

ECE (calibration): 0.04 — well-calibrated.

## 6. Operating point
- Threshold = 0.85 for "STEMI-flag" alert.
- Expected workload at threshold: ≈ 4 alerts/day across 3 EDs.

## 7. Robustness
- Robust to mild noise (10 dB SNR drop loses 2–3 pp sensitivity).
- Sensitive to lead misplacement; UI nudges nurse to verify.
- Time-domain drift quarterly check; rolling AUROC alarm if < 0.92.

## 8. Fairness
- Subgroup gap report (KSA cohort):
  - Female < 45: sensitivity 86% (vs male < 45: 92%) — **flagged for retraining cohort augmentation**.
  - Non-Arabic UI users: equivalent (capture only, doesn't affect model).
- Quarterly review by AI Governance Committee.

## 9. Privacy
- Training: de-identified per IRB; no patient consent required for retrospective de-identified.
- Inference: KSA-region GPU cluster; no third-party transfer.
- ECG blob retention 10 y; AI label permanent in ECG study record.

## 10. Limitations
- Not validated for paced rhythms (< 1% of training).
- Not validated for pediatric.
- LBBB/RBBB: STEMI detection sensitivity drops to 70% (Sgarbossa criteria training planned v1.1).
- Wolff-Parkinson-White: known false positives; UI displays a notice.

## 11. Ethical considerations
- Over-triage may overwhelm cath lab on weekends; threshold tuned with cardiology to balance.
- Under-triage in women < 45 → mitigation in progress; clinicians notified of caveat.
- Patient transparency via Privacy Policy §10 and consent awareness.

## 12. Monitoring
- Drift: monthly KS test on input distributions.
- Performance: quarterly chart-review audit of 100 random alerts.
- Confidence-distribution monitoring: alert if mean drops > 5%.
- Latency: p95 ≤ 5 s (currently 2.1 s).

## 13. Maintenance
- Retraining cadence: every 6 months or on drift.
- Versioning: semver; major bump on architecture change; minor on data refresh.
- Decommission criteria: superseded by v2 with significantly better KSA-validated performance,
  OR sustained drift uncorrectable.

## 14. Release history
- v1.0.0 — 2026-05-13 — initial release; approved by AI Governance Committee.
- v1.1 (planned) — Q3 2026 — improved female-young + LBBB.

## 15. Known incidents / lessons
- (None at v1.0 release; will be tracked here.)
