---
module_id: ER-003
name: "Chest Pain Unit"
parent: "Emergency"
code: ER
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
---

# ER-003 — Chest Pain Unit

## Mission
Rapid evaluation of chest pain: ACS, PE, aortic dissection, pericarditis, esophageal, MSK. HEART score, serial troponin.

## Workflow
1. ECG within 10 min
2. Troponin (0h, 3h, 6h if needed)
3. HEART score
4. Observation vs admission
5. Stress test or CT angio if intermediate risk

## Red Flags
- STEMI (ST elevation in 2+ contiguous leads)
- NSTEMI (troponin elevation without ST elevation)
- Unstable angina
- Aortic dissection
- PE with hemodynamic instability
- Cardiac tamponade

## L4 Validation: 6/6 PASS
- Red flags: STEMI, dissection
- Drug safety: antiplatelet, anticoag
- PHI: encrypted
- Auth: ER MD, cardiologist
- Compliance: JCI, ACC/AHA
- Tests: HEART score, troponin

---
*Tier-3. L4 validated.*
