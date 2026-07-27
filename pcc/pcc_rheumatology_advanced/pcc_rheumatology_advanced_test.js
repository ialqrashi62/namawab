// P3-DP pcc_rheumatology_advanced unit tests
const Engine = require('./pcc_rheumatology_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_rheumatology_advanced engine tests:');
it('RheumatoidArthritisAdvanced', () => assertEq(Engine.RheumatoidArthritisAdvanced({ t: 'yes' }).plan, 'rheumatoidarthritisadvanced-protocol'));
it('SLEFlareManagement', () => assertEq(Engine.SLEFlareManagement({ t: 'yes' }).plan, 'sleflaremanagement-protocol'));
it('SpondyloarthritisAdvanced', () => assertEq(Engine.SpondyloarthritisAdvanced({ t: 'yes' }).plan, 'spondyloarthritisadvanced-protocol'));
it('GoutRefractory', () => assertEq(Engine.GoutRefractory({ t: 'yes' }).plan, 'goutrefractory-protocol'));
it('VasculitisWorkup', () => assertEq(Engine.VasculitisWorkup({ t: 'yes' }).plan, 'vasculitisworkup-protocol'));
it('OsteoporosisAdvanced', () => assertEq(Engine.OsteoporosisAdvanced({ t: 'yes' }).plan, 'osteoporosisadvanced-protocol'));
it('MyositisEvaluation', () => assertEq(Engine.MyositisEvaluation({ t: 'yes' }).plan, 'myositisevaluation-protocol'));
it('SjogrenAdvanced', () => assertEq(Engine.SjogrenAdvanced({ t: 'yes' }).plan, 'sjogrenadvanced-protocol'));
it('SystemicSclerosis', () => assertEq(Engine.SystemicSclerosis({ t: 'yes' }).plan, 'systemicsclerosis-protocol'));
it('AutoinflammatoryDisease', () => assertEq(Engine.AutoinflammatoryDisease({ t: 'yes' }).plan, 'autoinflammatorydisease-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
