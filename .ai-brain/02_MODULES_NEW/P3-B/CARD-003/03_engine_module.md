<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-003 Engine (ep_lab_engine.js, 10 functions)


`js
function EPSInterpretation(cycleLength, ah, hv) { /* AVNRT/AVRT/AFL */ }
function AVNRTvsAVRT(ahJump, vaConduction) { /* differential */ }
function AFPVICircumference(laDiameter) { /* 1 PV pair: 2-3cm, 2: 4-5cm */ }
function VTLVMap(morphology) { /* exit site */ }
function ICDShockAppropriateness(egm) { /* true/false */ }
function GeneratorBatteryERI(voltage) { /* BOL/ERI/EOL */ }
// + 4 more
module.exports = { EPSInterpretation, AVNRTvsAVRT, ... };
`

---
*Section 20. L1 DRAFT.*