// Auto-generated unit tests for pcc_auto_ext_265 — 3.281.0
"use strict";
const Engine = require('./pcc_auto_ext_265_engine.js');
const VER = '3.281.0';
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); passed++; console.log('  ok   ' + name); } catch (e) { failed++; console.error('  FAIL ' + name + ' :: ' + e.message); } }

test('X265AssessmentExt_returns_valid', () => { const r = Engine.X265AssessmentExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X265ScoreExt_returns_valid', () => { const r = Engine.X265ScoreExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X265StageExt_returns_valid', () => { const r = Engine.X265StageExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X265PlanExt_returns_valid', () => { const r = Engine.X265PlanExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X265RiskExt_returns_valid', () => { const r = Engine.X265RiskExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X265DoseExt_returns_valid', () => { const r = Engine.X265DoseExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X265FrequencyExt_returns_valid', () => { const r = Engine.X265FrequencyExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X265DurationExt_returns_valid', () => { const r = Engine.X265DurationExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X265FollowupExt_returns_valid', () => { const r = Engine.X265FollowupExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X265OutcomeExt_returns_valid', () => { const r = Engine.X265OutcomeExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
console.log('Total: ' + (passed + failed) + ' | passed: ' + passed + ' | failed: ' + failed);
process.exit(failed === 0 ? 0 : 1);