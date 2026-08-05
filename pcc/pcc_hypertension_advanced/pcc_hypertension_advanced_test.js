// Auto-generated unit tests for pcc_hypertension_advanced — 3.187.0
"use strict";
const Engine = require('./pcc_hypertension_advanced_engine.js');
const VER = '3.187.0';
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); passed++; console.log('  ok   ' + name); } catch (e) { failed++; console.error('  FAIL ' + name + ' :: ' + e.message); } }

test('HTAAssessmentExt_returns_valid', () => { const r = Engine.HTAAssessmentExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('HTAScoreExt_returns_valid', () => { const r = Engine.HTAScoreExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('HTAStageExt_returns_valid', () => { const r = Engine.HTAStageExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('HTAPlanExt_returns_valid', () => { const r = Engine.HTAPlanExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('HTARiskExt_returns_valid', () => { const r = Engine.HTARiskExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('HTADoseExt_returns_valid', () => { const r = Engine.HTADoseExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('HTAFrequencyExt_returns_valid', () => { const r = Engine.HTAFrequencyExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('HTADurationExt_returns_valid', () => { const r = Engine.HTADurationExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('HTAFollowupExt_returns_valid', () => { const r = Engine.HTAFollowupExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('HTAOutcomeExt_returns_valid', () => { const r = Engine.HTAOutcomeExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
console.log('Total: ' + (passed + failed) + ' | passed: ' + passed + ' | failed: ' + failed);
process.exit(failed === 0 ? 0 : 1);