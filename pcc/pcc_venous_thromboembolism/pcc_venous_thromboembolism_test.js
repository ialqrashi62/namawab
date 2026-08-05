// Auto-generated unit tests for pcc_venous_thromboembolism — 3.186.0
"use strict";
const Engine = require('./pcc_venous_thromboembolism_engine.js');
const VER = '3.186.0';
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); passed++; console.log('  ok   ' + name); } catch (e) { failed++; console.error('  FAIL ' + name + ' :: ' + e.message); } }

test('VTERiskAssessmentExt_returns_valid', () => { const r = Engine.VTERiskAssessmentExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_venous_thromboembolism') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('VTERiskAssessmentExt_with_input', () => { const r = Engine.VTERiskAssessmentExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('WellsScoreDVT_returns_valid', () => { const r = Engine.WellsScoreDVT({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_venous_thromboembolism') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('WellsScoreDVT_with_input', () => { const r = Engine.WellsScoreDVT({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('DVTProvokedVsUnprovokedExt_returns_valid', () => { const r = Engine.DVTProvokedVsUnprovokedExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_venous_thromboembolism') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('DVTProvokedVsUnprovokedExt_with_input', () => { const r = Engine.DVTProvokedVsUnprovokedExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('DVTAnticoagDurationExt_returns_valid', () => { const r = Engine.DVTAnticoagDurationExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_venous_thromboembolism') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('DVTAnticoagDurationExt_with_input', () => { const r = Engine.DVTAnticoagDurationExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('PERCRuleOutExt_returns_valid', () => { const r = Engine.PERCRuleOutExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_venous_thromboembolism') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('PERCRuleOutExt_with_input', () => { const r = Engine.PERCRuleOutExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('PESEverityIndexExt_returns_valid', () => { const r = Engine.PESEverityIndexExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_venous_thromboembolism') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('PESEverityIndexExt_with_input', () => { const r = Engine.PESEverityIndexExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('PEOutpatientCriteriaExt_returns_valid', () => { const r = Engine.PEOutpatientCriteriaExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_venous_thromboembolism') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('PEOutpatientCriteriaExt_with_input', () => { const r = Engine.PEOutpatientCriteriaExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('PostthromboticSyndromeRiskExt_returns_valid', () => { const r = Engine.PostthromboticSyndromeRiskExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_venous_thromboembolism') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('PostthromboticSyndromeRiskExt_with_input', () => { const r = Engine.PostthromboticSyndromeRiskExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('IVCFilterIndicationsExt_returns_valid', () => { const r = Engine.IVCFilterIndicationsExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_venous_thromboembolism') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('IVCFilterIndicationsExt_with_input', () => { const r = Engine.IVCFilterIndicationsExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('ThrombophiliaScreeningExt_returns_valid', () => { const r = Engine.ThrombophiliaScreeningExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_venous_thromboembolism') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('ThrombophiliaScreeningExt_with_input', () => { const r = Engine.ThrombophiliaScreeningExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
console.log('Total: ' + (passed + failed) + ' | passed: ' + passed + ' | failed: ' + failed);
process.exit(failed === 0 ? 0 : 1);