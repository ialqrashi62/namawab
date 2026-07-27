// P3-DT pcc_chest_pain_unit unit tests
const Engine = require('./pcc_chest_pain_unit_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_chest_pain_unit engine tests:');
it('HEARTPathway', () => assertEq(Engine.HEARTPathway({ t: 'yes' }).plan, 'hEARTPathway-protocol'));
it('GRACEACS', () => assertEq(Engine.GRACEACS({ t: 'yes' }).plan, 'gRACEACS-protocol'));
it('TIMIScore', () => assertEq(Engine.TIMIScore({ t: 'yes' }).plan, 'tIMIScore-protocol'));
it('WellensCriteria', () => assertEq(Engine.WellensCriteria({ t: 'yes' }).plan, 'wellensCriteria-protocol'));
it('DukeTreadmillScore', () => assertEq(Engine.DukeTreadmillScore({ t: 'yes' }).plan, 'dukeTreadmillScore-protocol'));
it('ChestPainRiskStrat', () => assertEq(Engine.ChestPainRiskStrat({ t: 'yes' }).plan, 'chestPainRiskStrat-protocol'));
it('HsTroponinRuleOut', () => assertEq(Engine.HsTroponinRuleOut({ t: 'yes' }).plan, 'hsTroponinRuleOut-protocol'));
it('CoronaryCalciumScore', () => assertEq(Engine.CoronaryCalciumScore({ t: 'yes' }).plan, 'coronaryCalciumScore-protocol'));
it('PrinzmetalAngina', () => assertEq(Engine.PrinzmetalAngina({ t: 'yes' }).plan, 'prinzmetalAngina-protocol'));
it('AorticDissectionRisk', () => assertEq(Engine.AorticDissectionRisk({ t: 'yes' }).plan, 'aorticDissectionRisk-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
