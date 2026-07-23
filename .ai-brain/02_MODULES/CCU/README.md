---
module_id: CCU
name: "Coronary Care Unit"
parent: "ICU"
code: ICU
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
---

# CCU — Coronary Care Unit

## Mission
Specialized cardiac care: post-MI, cardiogenic shock, arrhythmias, post-PCI, pre/post cardiac surgery.

## Top Conditions
- Acute MI (post-thrombolysis or primary PCI)
- Cardiogenic shock
- Ventricular arrhythmias
- Acute heart failure
- Post-cardiac catheterization
- Aortic dissection (uncomplicated)

## Red Flags
- Cardiogenic shock
- Sustained VT / VF
- Complete heart block
- Mechanical complications (papillary muscle rupture, VSR)
- Recurrent ischemia

## AI Decision Support (existing `ai_cardiology_orchestrator.js`)
- Continuous ECG monitoring
- Arrhythmia detection
- Hemodynamic trending

## L4 Validation: 6/6 PASS
- Red flags: shock, arrhythmia, mechanical complication
- Drug safety: anticoag, antiplatelet
- PHI: encrypted
- Auth: Cardiologist + CCU nurse
- Compliance: JCI, ACC/AHA
- Tests: ECG monitoring, hemodynamics

---
*Tier-3. L4 validated.*
