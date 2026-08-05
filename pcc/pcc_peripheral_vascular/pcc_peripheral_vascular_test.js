// Auto-generated unit tests for pcc_peripheral_vascular — 3.186.0
"use strict";
const Engine = require('./pcc_peripheral_vascular_engine.js');
const VER = '3.186.0';
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); passed++; console.log('  ok   ' + name); } catch (e) { failed++; console.error('  FAIL ' + name + ' :: ' + e.message); } }

test('ABIDecisionExt_returns_valid', () => { const r = Engine.ABIDecisionExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_peripheral_vascular') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('ABIDecisionExt_with_input', () => { const r = Engine.ABIDecisionExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('ClaudicationMedTherapyExt_returns_valid', () => { const r = Engine.ClaudicationMedTherapyExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_peripheral_vascular') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('ClaudicationMedTherapyExt_with_input', () => { const r = Engine.ClaudicationMedTherapyExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('RevascularizationStrategyExt_returns_valid', () => { const r = Engine.RevascularizationStrategyExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_peripheral_vascular') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('RevascularizationStrategyExt_with_input', () => { const r = Engine.RevascularizationStrategyExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('RenalArteryStenosisMgtExt_returns_valid', () => { const r = Engine.RenalArteryStenosisMgtExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_peripheral_vascular') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('RenalArteryStenosisMgtExt_with_input', () => { const r = Engine.RenalArteryStenosisMgtExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('FibromuscularDysplasiaScreeningExt_returns_valid', () => { const r = Engine.FibromuscularDysplasiaScreeningExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_peripheral_vascular') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('FibromuscularDysplasiaScreeningExt_with_input', () => { const r = Engine.FibromuscularDysplasiaScreeningExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('RaynaudsPhenomenonExt_returns_valid', () => { const r = Engine.RaynaudsPhenomenonExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_peripheral_vascular') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('RaynaudsPhenomenonExt_with_input', () => { const r = Engine.RaynaudsPhenomenonExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('BuergersDiseaseCriteriaExt_returns_valid', () => { const r = Engine.BuergersDiseaseCriteriaExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_peripheral_vascular') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('BuergersDiseaseCriteriaExt_with_input', () => { const r = Engine.BuergersDiseaseCriteriaExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('LymphedemaStagingExt_returns_valid', () => { const r = Engine.LymphedemaStagingExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_peripheral_vascular') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('LymphedemaStagingExt_with_input', () => { const r = Engine.LymphedemaStagingExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('CompressionStockingsClassExt_returns_valid', () => { const r = Engine.CompressionStockingsClassExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_peripheral_vascular') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('CompressionStockingsClassExt_with_input', () => { const r = Engine.CompressionStockingsClassExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('WoundCareVascularExt_returns_valid', () => { const r = Engine.WoundCareVascularExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_peripheral_vascular') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('WoundCareVascularExt_with_input', () => { const r = Engine.WoundCareVascularExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
console.log('Total: ' + (passed + failed) + ' | passed: ' + passed + ' | failed: ' + failed);
process.exit(failed === 0 ? 0 : 1);