---
module_id: CTS-001
name: "Cardiothoracic Surgery"
parent: "Surgical"
code: CTS
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
---

# CTS-001 — Cardiothoracic Surgery

## Mission
Heart and chest surgery: CABG, valve replacement, aortic surgery, lung resection, esophagectomy, heart/lung transplant.

## Top Conditions
- Coronary artery disease (CABG)
- Valvular disease (AVR, MVR)
- Aortic aneurysm / dissection
- Lung cancer (lobectomy, pneumonectomy)
- Esophageal cancer
- Mediastinal mass

## Workflow
- Pre-op workup (cardiac cath, PFT, echo)
- OR (CPB, off-pump, minimally invasive)
- Post-op ICU (24-48h)
- Step-down unit
- Outpatient follow-up

## Red Flags (Post-Op)
- Post-op bleeding (mediastinal drain >200mL/h)
- Cardiac tamponade
- Low cardiac output
- Arrhythmias
- Stroke (post-CABG)
- Mediastinitis
- Respiratory failure

## AI Decision Support
- Risk stratification (STS, EuroSCORE)
- Intraoperative monitoring
- Post-op complication prediction

## L4 Validation: 6/6 PASS
- Red flags: tamponade, hemorrhage, stroke
- Drug safety: anticoag, inotropes
- PHI: encrypted
- Auth: CT surgeon
- Compliance: JCI, STS, CBAHI
- Tests: STS score, post-op monitoring

---
*Tier-3. L4 validated.*
