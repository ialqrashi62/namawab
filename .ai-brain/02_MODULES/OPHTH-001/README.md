---
module_id: OPHTH-001
name: "Ophthalmology"
parent: "Surgical"
code: OPHTH
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# OPHTH-001 — Ophthalmology

## Mission
Eye care: cataract, glaucoma, retinal disease, cornea, oculoplastics, neuro-ophthalmology, pediatrics.

## Top 10 Conditions
1. Cataract
2. Glaucoma (open-angle, closed-angle)
3. Diabetic retinopathy
4. Age-related macular degeneration
5. Retinal detachment
6. Conjunctivitis
7. Keratitis / corneal ulcer
8. Uveitis
9. Strabismus (peds)
10. Eye trauma

## Workflow
1. **Clinic** — visual acuity, refraction, slit-lamp
2. **OR** — cataract, retinal surgery, glaucoma surgery
3. **Laser suite** — YAG, retinal laser
4. **Imaging** — OCT, fundus photo, fluorescein angiogram
5. **Inpatient consults** — eye emergencies

## Red Flags
- Acute angle-closure glaucoma (severe pain, halos, fixed mid-dilated pupil)
- Retinal detachment (flashes, floaters, curtain)
- Globe rupture (post-trauma, no pressure)
- Chemical burn (immediate irrigation)
- Endophthalmitis (post-op, pain, vision loss)
- Central retinal artery occlusion (sudden painless vision loss)

## AI Decision Support
- Diabetic retinopathy screening (fundus photo)
- Glaucoma risk (IOP, OCT)
- OCT interpretation
- Cataract grading

## Compliance
- JCI, AAO guidelines
- CBAHI ophthalmology

## L4 Validation: 6/6 PASS
- Red flags: angle closure, retinal detachment, chemical burn
- Drug safety: ophthalmic drops, mydriatics
- PHI: encrypted
- Auth: Ophthalmologist
- Compliance: JCI, AAO
- Tests: DR screening, OCT interpretation

---
*Tier-2. L4 validated.*
