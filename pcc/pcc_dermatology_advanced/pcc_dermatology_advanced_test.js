// P3-DQ pcc_dermatology_advanced unit tests
const Engine = require('./pcc_dermatology_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_dermatology_advanced engine tests:');
it('PsoriasisAdvanced', () => assertEq(Engine.PsoriasisAdvanced({ t: 'yes' }).plan, 'psoriasisadvanced-protocol'));
it('AtopicDermatitisSevere', () => assertEq(Engine.AtopicDermatitisSevere({ t: 'yes' }).plan, 'atopicdermatitissevere-protocol'));
it('AcneRefractory', () => assertEq(Engine.AcneRefractory({ t: 'yes' }).plan, 'acnerefractory-protocol'));
it('RosaceaAdvanced', () => assertEq(Engine.RosaceaAdvanced({ t: 'yes' }).plan, 'rosaceaadvanced-protocol'));
it('HidradenitisSuppurativa', () => assertEq(Engine.HidradenitisSuppurativa({ t: 'yes' }).plan, 'hidradenitissuppurativa-protocol'));
it('CutaneousLymphoma', () => assertEq(Engine.CutaneousLymphoma({ t: 'yes' }).plan, 'cutaneouslymphoma-protocol'));
it('AutoimmuneBlistering', () => assertEq(Engine.AutoimmuneBlistering({ t: 'yes' }).plan, 'autoimmuneblistering-protocol'));
it('MelanomaAdvanced', () => assertEq(Engine.MelanomaAdvanced({ t: 'yes' }).plan, 'melanomaadvanced-protocol'));
it('DermatomyositisSkin', () => assertEq(Engine.DermatomyositisSkin({ t: 'yes' }).plan, 'dermatomyositisskin-protocol'));
it('VascularAnomalies', () => assertEq(Engine.VascularAnomalies({ t: 'yes' }).plan, 'vascularanomalies-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
