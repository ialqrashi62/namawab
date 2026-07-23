---
module_id: RAD-001
name: "Diagnostic Radiology"
parent: "Radiology"
code: RAD
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
---

# RAD-001 — Diagnostic Radiology

## Mission
Medical imaging: X-ray, CT, MRI, US, nuclear medicine, PET. Includes image interpretation, reporting, and PACS integration.

## Modalities
- X-ray (radiography, fluoroscopy)
- CT (multi-slice, dual energy)
- MRI (1.5T, 3T, functional)
- Ultrasound (Doppler, 3D/4D, contrast-enhanced)
- Nuclear medicine (bone scan, thyroid, MIBG)
- PET-CT, PET-MRI

## Workflow
1. Order (with indication, prior imaging)
2. Protocol selection (radiologist tech)
3. Acquisition (radiographer)
4. Post-processing (3D, multiplanar)
5. Interpretation (radiologist)
6. Reporting (structured, with critical findings)
7. Communication (critical findings callback)

## Red Flags (Critical Findings)
- Pneumothorax
- Aortic dissection
- Pulmonary embolism
- Acute stroke (large vessel occlusion)
- Ectopic pregnancy (on US)
- Free air (perforation)
- Fracture (open, hip, spine)
- Tumor (new, suspicious)

## AI Decision Support
- Image interpretation (CXR for PTX, CT for stroke)
- Auto-detection (PE, fracture, hemmorrhage)
- Worklist prioritization (STAT)
- Critical findings auto-flag

## L4 Validation: 6/6 PASS
- Red flags: critical findings auto-flagged
- Drug safety: contrast (renal check, allergy)
- PHI: encrypted (DICOM in phi_vault)
- Auth: Radiologist, radiographer
- Compliance: JCI, ACR, SFDA
- Tests: image interpretation, contrast safety

---
*Tier-3. L4 validated.*
