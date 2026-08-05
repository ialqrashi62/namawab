// Auto-generated unit tests for pcc_auto_ext_264 — 3.280.0
"use strict";
const Engine = require('./pcc_auto_ext_264_engine.js');
const VER = '3.280.0';
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); passed++; console.log('  ok   ' + name); } catch (e) { failed++; console.error('  FAIL ' + name + ' :: ' + e.message); } }

test('X264AssessmentExt_returns_valid', () => { const r = Engine.X264AssessmentExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X264ScoreExt_returns_valid', () => { const r = Engine.X264ScoreExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X264StageExt_returns_valid', () => { const r = Engine.X264StageExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X264PlanExt_returns_valid', () => { const r = Engine.X264PlanExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X264RiskExt_returns_valid', () => { const r = Engine.X264RiskExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X264DoseExt_returns_valid', () => { const r = Engine.X264DoseExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X264FrequencyExt_returns_valid', () => { const r = Engine.X264FrequencyExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X264DurationExt_returns_valid', () => { const r = Engine.X264DurationExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X264FollowupExt_returns_valid', () => { const r = Engine.X264FollowupExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('X264OutcomeExt_returns_valid', () => { const r = Engine.X264OutcomeExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
console.log('Total: ' + (passed + failed) + ' | passed: ' + passed + ' | failed: ' + failed);
process.exit(failed === 0 ? 0 : 1);