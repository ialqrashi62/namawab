---
module_id: URO-001
name: "Urology"
parent: "Surgical"
code: URO
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# URO-001 — Urology

## Mission
Urinary tract and male reproductive: kidney stones, BPH, prostate cancer, bladder cancer, incontinence, erectile dysfunction, infertility, pediatric urology.

## Top 10 Conditions
1. Urolithiasis (kidney stones)
2. BPH (benign prostatic hyperplasia)
3. Prostate cancer
4. Bladder cancer
5. UTI (complicated, recurrent)
6. Testicular torsion (emergency)
7. Erectile dysfunction
8. Renal cell carcinoma
9. Hematuria (workup)
10. Incontinence (stress, urge)

## Workflow
1. **Clinic** — assessment, imaging
2. **OR** — TURP, prostatectomy, cystectomy, stone removal
3. **Endoscopy suite** — cystoscopy, ureteroscopy
4. **Lithotripsy** — ESWL for stones
5. **Inpatient consults** — urological emergencies

## Red Flags
- Testicular torsion (acute scrotal pain, high-riding testis) → OR in 2h
- Obstructive uropathy (anuria + rising creatinine)
- Fournier's gangrene (perineal necrotizing fasciitis)
- Paraphimosis (reduced by urology)
- Priapism (>4h, ischemic)
- Renal trauma with hemorrhage

## AI Decision Support
- Prostate cancer risk (PSA trend)
- Stone composition prediction
- BPH symptom score (AUA)
- Hematuria workup algorithm

## Compliance
- JCI, AUA guidelines
- CBAHI urology

## L4 Validation: 6/6 PASS
- Red flags: torsion, obstructive uropathy, Fournier's
- Drug safety: alpha-blockers, 5-ARI, anticoagulants
- PHI: encrypted
- Auth: Urologist
- Compliance: JCI, AUA
- Tests: PSA, BPH score, stone analysis

---
*Tier-2. L4 validated.*
