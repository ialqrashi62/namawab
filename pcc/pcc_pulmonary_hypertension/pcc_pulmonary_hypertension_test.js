// Auto-generated unit tests for pcc_pulmonary_hypertension — 3.184.0
"use strict";
const Engine = require('./pcc_pulmonary_hypertension_engine.js');
const VER = '3.184.0';
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); passed++; console.log('  ok   ' + name); } catch (e) { failed++; console.error('  FAIL ' + name + ' :: ' + e.message); } }

test('PHRiskAssessmentExt_returns_valid', () => { const r = Engine.PHRiskAssessmentExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_pulmonary_hypertension') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('PHRiskAssessmentExt_with_input', () => { const r = Engine.PHRiskAssessmentExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('REVEALScoreCalculatorExt_returns_valid', () => { const r = Engine.REVEALScoreCalculatorExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_pulmonary_hypertension') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('REVEALScoreCalculatorExt_with_input', () => { const r = Engine.REVEALScoreCalculatorExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('PAHInitialTherapyExt_returns_valid', () => { const r = Engine.PAHInitialTherapyExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_pulmonary_hypertension') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('PAHInitialTherapyExt_with_input', () => { const r = Engine.PAHInitialTherapyExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('BalloonPulmonaryAngioplastyCandidateExt_returns_valid', () => { const r = Engine.BalloonPulmonaryAngioplastyCandidateExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_pulmonary_hypertension') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('BalloonPulmonaryAngioplastyCandidateExt_with_input', () => { const r = Engine.BalloonPulmonaryAngioplastyCandidateExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('CTEPHSurgeryRiskExt_returns_valid', () => { const r = Engine.CTEPHSurgeryRiskExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_pulmonary_hypertension') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('CTEPHSurgeryRiskExt_with_input', () => { const r = Engine.CTEPHSurgeryRiskExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('RiociguatInitiationExt_returns_valid', () => { const r = Engine.RiociguatInitiationExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_pulmonary_hypertension') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('RiociguatInitiationExt_with_input', () => { const r = Engine.RiociguatInitiationExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('PHFollowupIntervalExt_returns_valid', () => { const r = Engine.PHFollowupIntervalExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_pulmonary_hypertension') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('PHFollowupIntervalExt_with_input', () => { const r = Engine.PHFollowupIntervalExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('EisenmengerSyndromeRiskExt_returns_valid', () => { const r = Engine.EisenmengerSyndromeRiskExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_pulmonary_hypertension') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('EisenmengerSyndromeRiskExt_with_input', () => { const r = Engine.EisenmengerSyndromeRiskExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('PHMedicationAdherenceExt_returns_valid', () => { const r = Engine.PHMedicationAdherenceExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_pulmonary_hypertension') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('PHMedicationAdherenceExt_with_input', () => { const r = Engine.PHMedicationAdherenceExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('PregnancyContraPHMedicationExt_returns_valid', () => { const r = Engine.PregnancyContraPHMedicationExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_pulmonary_hypertension') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('PregnancyContraPHMedicationExt_with_input', () => { const r = Engine.PregnancyContraPHMedicationExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
console.log('Total: ' + (passed + failed) + ' | passed: ' + passed + ' | failed: ' + failed);
process.exit(failed === 0 ? 0 : 1);