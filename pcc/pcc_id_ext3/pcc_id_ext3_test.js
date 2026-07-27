// P3-CN pcc_id_ext3 unit tests
const Engine = require('./pcc_id_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_id_ext3 engine tests:');
it('Cd', () => assertEq(Engine.Cdiff({ t: 'fulminant' }).plan, 'fulminant-CDI-OR'));
it('Mr', () => assertEq(Engine.Mrsa({ t: 'active' }).plan, 'MRSA-active-infection'));
it('Vr', () => assertEq(Engine.Vre({ t: 'colonized' }).plan, 'VRE-colonization'));
it('Es', () => assertEq(Engine.Esbl({ t: 'UTI' }).plan, 'ESBL-UTI'));
it('Tf', () => assertEq(Engine.Tbflu({ t: 'confirmed' }).plan, 'TB-or-flu-treatment'));
it('Ma', () => assertEq(Engine.Malaria({ t: 'P-falciparum' }).plan, 'P-falciparum-malaria'));
it('Tb', () => assertEq(Engine.Tb({ t: 'active' }).plan, 'active-TB-RIPE'));
it('Hv', () => assertEq(Engine.Hiv({ t: 'new-dx' }).plan, 'new-HIV-dx-ART'));
it('Hp', () => assertEq(Engine.Hep({ t: 'C-active' }).plan, 'active-hepC'));
it('Tv', () => assertEq(Engine.Travel({ t: 'typhoid' }).plan, 'typhoid-treatment'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
