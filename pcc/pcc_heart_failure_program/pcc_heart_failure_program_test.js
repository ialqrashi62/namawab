// Auto-generated unit tests for pcc_heart_failure_program — 3.188.0
"use strict";
const Engine = require('./pcc_heart_failure_program_engine.js');
const VER = '3.188.0';
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); passed++; console.log('  ok   ' + name); } catch (e) { failed++; console.error('  FAIL ' + name + ' :: ' + e.message); } }

test('HFPAssessmentExt_returns_valid', () => { const r = Engine.HFPAssessmentExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('HFPScoreExt_returns_valid', () => { const r = Engine.HFPScoreExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('HFPStageExt_returns_valid', () => { const r = Engine.HFPStageExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('HFPPlanExt_returns_valid', () => { const r = Engine.HFPPlanExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('HFPRiskExt_returns_valid', () => { const r = Engine.HFPRiskExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('HFPDoseExt_returns_valid', () => { const r = Engine.HFPDoseExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('HFPFrequencyExt_returns_valid', () => { const r = Engine.HFPFrequencyExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('HFPDurationExt_returns_valid', () => { const r = Engine.HFPDurationExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('HFPFollowupExt_returns_valid', () => { const r = Engine.HFPFollowupExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('HFPOutcomeExt_returns_valid', () => { const r = Engine.HFPOutcomeExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
console.log('Total: ' + (passed + failed) + ' | passed: ' + passed + ' | failed: ' + failed);
process.exit(failed === 0 ? 0 : 1);