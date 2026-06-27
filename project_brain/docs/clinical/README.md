# Clinical Content Library

| File | Purpose |
|------|---------|
| `order_sets.yaml` | One-click order bundles per condition (STEMI, sepsis, stroke, FN, NRP, ARDS, etc.) |
| `cds_rules.yaml` | Clinical decision support rules (drug safety, peds, AF, sepsis, cardio, imaging, pregnancy, stewardship, falls) |
| `smart_phrases.md` | `.shortcode`-style note templates for common clinical scenarios |

## How they fit together
1. Doctor opens patient → selects "Apply order set" → picks `stemi`.
2. Each item passes through `cds_rules` evaluation:
   - Allergies block aspirin? → block + override.
   - Anthracycline cumulative > 450? → block + cardiology consult.
3. Approved items become orders; bundle reaches required SLA timer.
4. Documentation uses smart phrases for SOAP/SBAR speed.

## Implementation notes
- **Order set engine**: render YAML to JSON, filter by patient context, apply CDS gates,
  present to clinician for sign-off. Persist as `cardio_orders` / `ed_order_bundles`.
- **CDS engine**: rule evaluator triggered on events (`order.med`, `vitals.posted`, etc.).
  Results returned synchronously for blocking rules; async for warn/info.
- **Smart phrases**: client-side expansion in note editors; templates pulled from server
  to allow updates without redeployment.

## Governance
- New rules require Clinical Champion approval + log in CHANGELOG.
- Rule changes pass through clinical safety review (CMO + Pharmacy + Quality).
- Quarterly review of rule firing stats; tune thresholds for alert fatigue.
- Inactive rules archived (not deleted) to preserve audit history.

## Localization
- Order set names + smart phrases in AR/EN.
- Drug names follow MoH formulary nomenclature with rxnorm cross-mapping.

## References
- NCCN, AHA/ESC, NICE, IDSA, ACOG, AAP, AAOS, ACR Appropriateness, ASHP, ISMP.
- Local: KSA-MoH protocols + CBAHI standards.
