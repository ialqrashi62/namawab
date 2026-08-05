// Auto-generated unit tests for pcc_lipidology — 3.185.0
"use strict";
const Engine = require('./pcc_lipidology_engine.js');
const VER = '3.185.0';
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); passed++; console.log('  ok   ' + name); } catch (e) { failed++; console.error('  FAIL ' + name + ' :: ' + e.message); } }

test('LDLTargetExt_returns_valid', () => { const r = Engine.LDLTargetExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_lipidology') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('LDLTargetExt_with_input', () => { const r = Engine.LDLTargetExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('StatinIntensityExt_returns_valid', () => { const r = Engine.StatinIntensityExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_lipidology') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('StatinIntensityExt_with_input', () => { const r = Engine.StatinIntensityExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('FamilialHypercholesterolemiaExt_returns_valid', () => { const r = Engine.FamilialHypercholesterolemiaExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_lipidology') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('FamilialHypercholesterolemiaExt_with_input', () => { const r = Engine.FamilialHypercholesterolemiaExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('StatinIntoleranceExt_returns_valid', () => { const r = Engine.StatinIntoleranceExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_lipidology') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('StatinIntoleranceExt_with_input', () => { const r = Engine.StatinIntoleranceExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('PCSK9InhibitorCandidateExt_returns_valid', () => { const r = Engine.PCSK9InhibitorCandidateExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_lipidology') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('PCSK9InhibitorCandidateExt_with_input', () => { const r = Engine.PCSK9InhibitorCandidateExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('LipoproteinACalcExt_returns_valid', () => { const r = Engine.LipoproteinACalcExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_lipidology') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('LipoproteinACalcExt_with_input', () => { const r = Engine.LipoproteinACalcExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('TriglycerideManagementExt_returns_valid', () => { const r = Engine.TriglycerideManagementExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_lipidology') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('TriglycerideManagementExt_with_input', () => { const r = Engine.TriglycerideManagementExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('StatinHepatotoxicityExt_returns_valid', () => { const r = Engine.StatinHepatotoxicityExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_lipidology') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('StatinHepatotoxicityExt_with_input', () => { const r = Engine.StatinHepatotoxicityExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('BempedoicAcidCandidateExt_returns_valid', () => { const r = Engine.BempedoicAcidCandidateExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_lipidology') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('BempedoicAcidCandidateExt_with_input', () => { const r = Engine.BempedoicAcidCandidateExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('ASCVD10YearRiskExt_returns_valid', () => { const r = Engine.ASCVD10YearRiskExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_lipidology') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('ASCVD10YearRiskExt_with_input', () => { const r = Engine.ASCVD10YearRiskExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
console.log('Total: ' + (passed + failed) + ' | passed: ' + passed + ' | failed: ' + failed);
process.exit(failed === 0 ? 0 : 1);