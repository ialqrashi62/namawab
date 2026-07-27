// P3-DN pcc_dialysis_advanced unit tests
const Engine = require('./pcc_dialysis_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_dialysis_advanced engine tests:');
it('HemodialysisAccess', () => assertEq(Engine.HemodialysisAccess({ t: 'yes' }).plan, 'hemodialysisaccess-protocol'));
it('DialysisAdequacy', () => assertEq(Engine.DialysisAdequacy({ t: 'yes' }).plan, 'dialysisadequacy-protocol'));
it('IntradialyticHypotension', () => assertEq(Engine.IntradialyticHypotension({ t: 'yes' }).plan, 'intradialytichypotension-protocol'));
it('DialysisDisequilibrium', () => assertEq(Engine.DialysisDisequilibrium({ t: 'yes' }).plan, 'dialysisdisequilibrium-protocol'));
it('PeritonealDialysisPrescription', () => assertEq(Engine.PeritonealDialysisPrescription({ t: 'yes' }).plan, 'peritonealdialysisprescription-protocol'));
it('PDPeritonitis', () => assertEq(Engine.PDPeritonitis({ t: 'yes' }).plan, 'pdperitonitis-protocol'));
it('HomeHemodialysis', () => assertEq(Engine.HomeHemodialysis({ t: 'yes' }).plan, 'homehemodialysis-protocol'));
it('NocturnalDialysis', () => assertEq(Engine.NocturnalDialysis({ t: 'yes' }).plan, 'nocturnaldialysis-protocol'));
it('DialysisNutrition', () => assertEq(Engine.DialysisNutrition({ t: 'yes' }).plan, 'dialysisnutrition-protocol'));
it('TransplantReadiness', () => assertEq(Engine.TransplantReadiness({ t: 'yes' }).plan, 'transplantreadiness-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
