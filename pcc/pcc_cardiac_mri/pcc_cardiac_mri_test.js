// Auto-generated unit tests for pcc_cardiac_mri — 3.190.0
"use strict";
const Engine = require('./pcc_cardiac_mri_engine.js');
const VER = '3.190.0';
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); passed++; console.log('  ok   ' + name); } catch (e) { failed++; console.error('  FAIL ' + name + ' :: ' + e.message); } }

test('CMRIAssessmentExt_returns_valid', () => { const r = Engine.CMRIAssessmentExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('CMRIScoreExt_returns_valid', () => { const r = Engine.CMRIScoreExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('CMRIStageExt_returns_valid', () => { const r = Engine.CMRIStageExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('CMRIPlanExt_returns_valid', () => { const r = Engine.CMRIPlanExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('CMRIRiskExt_returns_valid', () => { const r = Engine.CMRIRiskExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('CMRIDoseExt_returns_valid', () => { const r = Engine.CMRIDoseExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('CMRIFrequencyExt_returns_valid', () => { const r = Engine.CMRIFrequencyExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('CMRIDurationExt_returns_valid', () => { const r = Engine.CMRIDurationExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('CMRIFollowupExt_returns_valid', () => { const r = Engine.CMRIFollowupExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
test('CMRIOutcomeExt_returns_valid', () => { const r = Engine.CMRIOutcomeExt({}); if (r.version !== VER) throw new Error('bad ver'); if (typeof r.score !== 'number') throw new Error('no score'); });
console.log('Total: ' + (passed + failed) + ' | passed: ' + passed + ' | failed: ' + failed);
process.exit(failed === 0 ? 0 : 1);