// P3-CN pcc_pulm_ext3 unit tests
const Engine = require('./pcc_pulm_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_pulm_ext3 engine tests:');
it('As', () => assertEq(Engine.Asthma({ t: 'exacerbation' }).plan, 'asthma-exacerbation'));
it('Co', () => assertEq(Engine.Copd({ g: 'D' }).plan, 'GOLD-D-severe'));
it('Pn', () => assertEq(Engine.Pna({ t: 'CAP' }).plan, 'community-pneumonia'));
it('Tb', () => assertEq(Engine.Tb({ t: 'active' }).plan, 'active-pulm-TB'));
it('Pe', () => assertEq(Engine.Pe({ t: 'confirmed' }).plan, 'PE-anticoagulation'));
it('Ca', () => assertEq(Engine.Ca({ t: 'NSCLC' }).plan, 'NSCLC-treatment'));
it('Me', () => assertEq(Engine.Mesothelioma({ t: 'confirmed' }).plan, 'mesothelioma-workup'));
it('Sa', () => assertEq(Engine.Sarcoid({ t: 'stage-1' }).plan, 'sarcoid-stage-1'));
it('Ip', () => assertEq(Engine.Ipf({ t: 'confirmed' }).plan, 'IPF-antifibrotic'));
it('Sl', () => assertEq(Engine.Sleep({ t: 'severe' }).plan, 'severe-OSA-CPAP'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
