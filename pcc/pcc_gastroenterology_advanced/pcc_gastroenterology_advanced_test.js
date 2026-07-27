// P3-DO pcc_gastroenterology_advanced unit tests
const Engine = require('./pcc_gastroenterology_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_gastroenterology_advanced engine tests:');
it('ChronicDiarrheaWorkup', () => assertEq(Engine.ChronicDiarrheaWorkup({ t: 'yes' }).plan, 'chronicdiarrheaworkup-protocol'));
it('ConstipationRefractory', () => assertEq(Engine.ConstipationRefractory({ t: 'yes' }).plan, 'constipationrefractory-protocol'));
it('IBDFlareManagement', () => assertEq(Engine.IBDFlareManagement({ t: 'yes' }).plan, 'ibdflaremanagement-protocol'));
it('IBSRefractory', () => assertEq(Engine.IBSRefractory({ t: 'yes' }).plan, 'ibsrefractory-protocol'));
it('CeliacDisease', () => assertEq(Engine.CeliacDisease({ t: 'yes' }).plan, 'celiacdisease-protocol'));
it('Gastroparesis', () => assertEq(Engine.Gastroparesis({ t: 'yes' }).plan, 'gastroparesis-protocol'));
it('EosinophilicEsophagitis', () => assertEq(Engine.EosinophilicEsophagitis({ t: 'yes' }).plan, 'eosinophilicesophagitis-protocol'));
it('GIBleedAdvanced', () => assertEq(Engine.GIBleedAdvanced({ t: 'yes' }).plan, 'gibleedadvanced-protocol'));
it('PancreatitisChronic', () => assertEq(Engine.PancreatitisChronic({ t: 'yes' }).plan, 'pancreatitischronic-protocol'));
it('SmallIntestinalBacterialOvergrowth', () => assertEq(Engine.SmallIntestinalBacterialOvergrowth({ t: 'yes' }).plan, 'smallintestinalbacterialovergrowth-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
