// Auto-generated unit tests for pcc_cabg_ext — 3.189.0
"use strict";
const Engine = require('./pcc_cabg_ext_engine.js');
const VER = '3.189.0';
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); passed++; console.log('  ok   ' + name); } catch (e) { failed++; console.error('  FAIL ' + name + ' :: ' + e.message); } }

test('CABGAssessmentExt_returns_valid', () => { const r = Engine.CABGAssessmentExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('CABGScoreExt_returns_valid', () => { const r = Engine.CABGScoreExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('CABGStageExt_returns_valid', () => { const r = Engine.CABGStageExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('CABGPlanExt_returns_valid', () => { const r = Engine.CABGPlanExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('CABGRiskExt_returns_valid', () => { const r = Engine.CABGRiskExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('CABGDoseExt_returns_valid', () => { const r = Engine.CABGDoseExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('CABGFrequencyExt_returns_valid', () => { const r = Engine.CABGFrequencyExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('CABGDurationExt_returns_valid', () => { const r = Engine.CABGDurationExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('CABGFollowupExt_returns_valid', () => { const r = Engine.CABGFollowupExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('CABGOutcomeExt_returns_valid', () => { const r = Engine.CABGOutcomeExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
console.log('Total: ' + (passed + failed) + ' | passed: ' + passed + ' | failed: ' + failed);
process.exit(failed === 0 ? 0 : 1);