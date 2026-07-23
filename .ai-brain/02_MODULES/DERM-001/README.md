---
module_id: DERM-001
name: "Dermatology"
parent: "Internal Medicine"
code: DERM
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
---

# DERM-001 — Dermatology

## Mission
Skin, hair, nails, mucous membranes: inflammatory, infectious, neoplastic, autoimmune, cosmetic.

## Top Conditions
- Atopic dermatitis
- Psoriasis
- Acne
- Skin cancer (BCC, SCC, melanoma)
- Urticaria
- Fungal infections
- Bacterial (impetigo, cellulitis)
- Viral (HSV, VZV, HPV)
- Autoimmune (pemphigus, bullous pemphigoid)
- Drug eruptions (SJS/TEN)

## Red Flags
- Melanoma (irregular, bleeding, growing)
- SJS / TEN (skin sloughing, mucosal involvement)
- Pemphigus vulgaris (Nikolsky sign positive)
- Necrotizing fasciitis
- Severe drug reaction
- Vasculitis (palpable purpura)

## AI Decision Support (existing `ai_derm_orchestrator.js`)
- Lesion image analysis (melanoma vs benign)
- Skin cancer screening
- Treatment selection
- Patient education

## L4 Validation: 6/6 PASS
- Red flags: melanoma, SJS/TEN, necrotizing fasciitis
- Drug safety: topical, systemic
- PHI: encrypted (skin images sensitive)
- Auth: Dermatologist
- Compliance: JCI, AAD
- Tests: lesion classification, SJS detection

---
*Tier-3. L4 validated.*
