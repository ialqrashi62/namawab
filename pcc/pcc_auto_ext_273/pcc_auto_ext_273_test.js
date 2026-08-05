// Auto-generated unit tests for pcc_auto_ext_273 — 3.283.0
"use strict";
const Engine = require('./pcc_auto_ext_273_engine.js');
const VER = '3.283.0';
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); passed++; console.log('  ok   ' + name); } catch (e) { failed++; console.error('  FAIL ' + name + ' :: ' + e.message); } }

test('X273AssessmentExt_returns_valid', () => { const r = Engine.X273AssessmentExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X273ScoreExt_returns_valid', () => { const r = Engine.X273ScoreExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X273StageExt_returns_valid', () => { const r = Engine.X273StageExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X273PlanExt_returns_valid', () => { const r = Engine.X273PlanExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X273RiskExt_returns_valid', () => { const r = Engine.X273RiskExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X273DoseExt_returns_valid', () => { const r = Engine.X273DoseExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X273FrequencyExt_returns_valid', () => { const r = Engine.X273FrequencyExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X273DurationExt_returns_valid', () => { const r = Engine.X273DurationExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X273FollowupExt_returns_valid', () => { const r = Engine.X273FollowupExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X273OutcomeExt_returns_valid', () => { const r = Engine.X273OutcomeExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
console.log('Total: ' + (passed + failed) + ' | passed: ' + passed + ' | failed: ' + failed);
process.exit(failed === 0 ? 0 : 1);