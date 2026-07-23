---
module_id: ENDO-001
name: "Endocrinology"
parent: "Internal Medicine"
code: ENDO
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# ENDO-001 — Endocrinology

## Mission
Hormonal and metabolic disorders: diabetes, thyroid, adrenal, pituitary, calcium/bone, reproductive.

## Top 10 Conditions
1. Diabetes mellitus (T1DM, T2DM, GDM)
2. Diabetic ketoacidosis (DKA)
3. Hyperosmolar hyperglycemic state (HHS)
4. Hypothyroidism / Hyperthyroidism
5. Thyroid storm / myxedema coma
6. Adrenal insufficiency
7. Cushing's syndrome
8. Hyperparathyroidism
9. Hypoparathyroidism
10. Pituitary disorders

## Workflow
1. **Clinic** — chronic disease management
2. **Diabetes education** — nutrition, glucose monitoring
3. **Thyroid clinic** — nodules, cancer, hyper/hypo
4. **Bone clinic** — osteoporosis, metabolic bone disease
5. **Inpatient consults** — DKA, HHS, electrolyte

## Red Flags
- DKA (glucose >250, pH <7.1, ketones)
- HHS (glucose >600, no ketosis, severe dehydration)
- Thyroid storm (fever, tachycardia, altered mental status)
- Myxedema coma (hypothermia, bradycardia, altered mental status)
- Adrenal crisis (hypotension + hyperkalemia + hyponatremia)
- Severe hypoglycemia (glucose <50 + symptoms)

## AI Decision Support (existing `ai_endocrine_orchestrator.js`)
- Glucose trend analysis
- Insulin dose adjustment
- Thyroid function interpretation
- Calcium/phosphorus/Mg correction
- DKA/HHS management protocol

## Compliance
- JCI, ADA (diabetes), ATA (thyroid), AACE
- CBAHI endocrinology

## L4 Validation: 6/6 PASS
- Red flags: DKA, HHS, thyroid storm
- Drug safety: insulin (high-alert), thyroid meds
- PHI: encrypted
- Auth: Endocrinologist
- Compliance: JCI, ADA, ATA
- Tests: glucose trend, thyroid interpretation

---
*Tier-2. L4 validated.*
