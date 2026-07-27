// P3-CM pcc_gi_ext3 unit tests
const Engine = require('./pcc_gi_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_gi_ext3 engine tests:');
it('Dys', () => assertEq(Engine.Dysphagia({ t: 'esophageal' }).plan, 'esophageal-eval'));
it('GERD', () => assertEq(Engine.GERD({ s: 'refractory' }).plan, 'refractory-GERD-endoscopy'));
it('IBS', () => assertEq(Engine.IBS({ t: 'IBS-D' }).plan, 'IBS-D-treatment'));
it('IBD', () => assertEq(Engine.IBD({ t: 'CD' }).plan, 'crohns-disease'));
it('Cel', () => assertEq(Engine.Celiac({ t: 'biopsy' }).plan, 'celiac-biopsy'));
it('HBV', () => assertEq(Engine.HepB({ t: 'chronic' }).plan, 'chronic-HBV'));
it('HCV', () => assertEq(Engine.HepC({ t: 'detected' }).plan, 'HCV-treatment'));
it('Cirr', () => assertEq(Engine.Cirr({ meld: 32 }).plan, 'decompensated-cirrhosis'));
it('PPI', () => assertEq(Engine.Ppi({ t: 'long-term' }).plan, 'long-term-PPI-caution'));
it('Sco', () => assertEq(Engine.Scope({ t: 'EGD' }).plan, 'EGD-upper-endoscopy'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
