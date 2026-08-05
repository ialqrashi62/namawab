// Auto-generated unit tests for pcc_pediatric_neuro_ext6 — 3.226.0
"use strict";
const Engine = require('./pcc_pediatric_neuro_ext6_engine.js');
const VER = '3.226.0';
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); passed++; console.log('  ok   ' + name); } catch (e) { failed++; console.error('  FAIL ' + name + ' :: ' + e.message); } }

test('EXT6AssessmentExt_returns_valid', () => { const r = Engine.EXT6AssessmentExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('EXT6ScoreExt_returns_valid', () => { const r = Engine.EXT6ScoreExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('EXT6StageExt_returns_valid', () => { const r = Engine.EXT6StageExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('EXT6PlanExt_returns_valid', () => { const r = Engine.EXT6PlanExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('EXT6RiskExt_returns_valid', () => { const r = Engine.EXT6RiskExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('EXT6DoseExt_returns_valid', () => { const r = Engine.EXT6DoseExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('EXT6FrequencyExt_returns_valid', () => { const r = Engine.EXT6FrequencyExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('EXT6DurationExt_returns_valid', () => { const r = Engine.EXT6DurationExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('EXT6FollowupExt_returns_valid', () => { const r = Engine.EXT6FollowupExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('EXT6OutcomeExt_returns_valid', () => { const r = Engine.EXT6OutcomeExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
console.log('Total: ' + (passed + failed) + ' | passed: ' + passed + ' | failed: ' + failed);
process.exit(failed === 0 ? 0 : 1);