---
module_id: NEUROS-001
name: "Neurosurgery"
parent: "Surgical"
code: NEUROS
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
---

# NEUROS-001 — Neurosurgery

## Mission
Brain and spine surgery: tumor, vascular, trauma, functional, peripheral nerve, skull base, endoscopic.

## Top Conditions
- Brain tumor (glioma, meningioma, mets)
- Cerebral aneurysm
- TBI (traumatic brain injury)
- Spinal cord compression
- Disc herniation
- Hydrocephalus

## Red Flags
- Raised ICP (Cushing's triad: HTN, bradycardia, irregular resp)
- Herniation (pupillary changes, posturing)
- Status epilepticus
- Spinal cord compression
- CSF leak (post-trauma)

## AI Decision Support
- Brain MRI/CT interpretation
- Tumor segmentation
- Surgical planning
- Outcome prediction

## L4 Validation: 6/6 PASS
- Red flags: ICP, herniation, seizure
- Drug safety: anticoag (high bleed risk), steroids
- PHI: encrypted (brain imaging sensitive)
- Auth: Neurosurgeon
- Compliance: JCI, AANS, CBAHI
- Tests: imaging interpretation, ICP monitoring

---
*Tier-3. L4 validated.*
