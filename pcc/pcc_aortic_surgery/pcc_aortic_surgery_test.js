// Auto-generated unit tests for pcc_aortic_surgery — 3.189.0
"use strict";
const Engine = require('./pcc_aortic_surgery_engine.js');
const VER = '3.189.0';
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); passed++; console.log('  ok   ' + name); } catch (e) { failed++; console.error('  FAIL ' + name + ' :: ' + e.message); } }

test('ASAssessmentExt_returns_valid', () => { const r = Engine.ASAssessmentExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('ASScoreExt_returns_valid', () => { const r = Engine.ASScoreExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('ASStageExt_returns_valid', () => { const r = Engine.ASStageExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('ASPlanExt_returns_valid', () => { const r = Engine.ASPlanExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('ASRiskExt_returns_valid', () => { const r = Engine.ASRiskExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('ASDoseExt_returns_valid', () => { const r = Engine.ASDoseExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('ASFrequencyExt_returns_valid', () => { const r = Engine.ASFrequencyExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('ASDurationExt_returns_valid', () => { const r = Engine.ASDurationExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('ASFollowupExt_returns_valid', () => { const r = Engine.ASFollowupExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('ASOutcomeExt_returns_valid', () => { const r = Engine.ASOutcomeExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
console.log('Total: ' + (passed + failed) + ' | passed: ' + passed + ' | failed: ' + failed);
process.exit(failed === 0 ? 0 : 1);