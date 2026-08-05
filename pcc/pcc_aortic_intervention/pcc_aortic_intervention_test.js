// Auto-generated unit tests for pcc_aortic_intervention — 3.186.0
"use strict";
const Engine = require('./pcc_aortic_intervention_engine.js');
const VER = '3.186.0';
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); passed++; console.log('  ok   ' + name); } catch (e) { failed++; console.error('  FAIL ' + name + ' :: ' + e.message); } }

test('AorticAneurysmSizingExt_returns_valid', () => { const r = Engine.AorticAneurysmSizingExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_aortic_intervention') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('AorticAneurysmSizingExt_with_input', () => { const r = Engine.AorticAneurysmSizingExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('EVARvsOpenRepairExt_returns_valid', () => { const r = Engine.EVARvsOpenRepairExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_aortic_intervention') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('EVARvsOpenRepairExt_with_input', () => { const r = Engine.EVARvsOpenRepairExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('AorticDissectionStanfordExt_returns_valid', () => { const r = Engine.AorticDissectionStanfordExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_aortic_intervention') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('AorticDissectionStanfordExt_with_input', () => { const r = Engine.AorticDissectionStanfordExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('TypeBAorticDissectionMgtExt_returns_valid', () => { const r = Engine.TypeBAorticDissectionMgtExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_aortic_intervention') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('TypeBAorticDissectionMgtExt_with_input', () => { const r = Engine.TypeBAorticDissectionMgtExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('MarfanSurveillanceExt_returns_valid', () => { const r = Engine.MarfanSurveillanceExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_aortic_intervention') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('MarfanSurveillanceExt_with_input', () => { const r = Engine.MarfanSurveillanceExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('AorticCoarctationRepairExt_returns_valid', () => { const r = Engine.AorticCoarctationRepairExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_aortic_intervention') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('AorticCoarctationRepairExt_with_input', () => { const r = Engine.AorticCoarctationRepairExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('PADIClassificationExt_returns_valid', () => { const r = Engine.PADIClassificationExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_aortic_intervention') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('PADIClassificationExt_with_input', () => { const r = Engine.PADIClassificationExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('ABIScreeningExt_returns_valid', () => { const r = Engine.ABIScreeningExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_aortic_intervention') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('ABIScreeningExt_with_input', () => { const r = Engine.ABIScreeningExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('CLITreatmentExt_returns_valid', () => { const r = Engine.CLITreatmentExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_aortic_intervention') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('CLITreatmentExt_with_input', () => { const r = Engine.CLITreatmentExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
test('CarotidStenosisMgtExt_returns_valid', () => { const r = Engine.CarotidStenosisMgtExt({}); if (r.version !== VER) throw new Error('bad ver'); if (r.module !== 'pcc_aortic_intervention') throw new Error('bad module'); if (!r.ts) throw new Error('no ts'); });
test('CarotidStenosisMgtExt_with_input', () => { const r = Engine.CarotidStenosisMgtExt({x:5, y:1, ef:30, age:60}); if (r.version !== VER) throw new Error('bad ver'); });
console.log('Total: ' + (passed + failed) + ' | passed: ' + passed + ' | failed: ' + failed);
process.exit(failed === 0 ? 0 : 1);